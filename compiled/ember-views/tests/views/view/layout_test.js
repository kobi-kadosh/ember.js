'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var registry, container, view;

QUnit.module('EmberView - Layout Functionality', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
      container.destroy();
    });
    registry = container = view = null;
  }
});

QUnit.test('Layout views return throw if their layout cannot be found', function () {
  view = _emberViewsViewsView2['default'].create({
    layoutName: 'cantBeFound',
    container: { lookup: function lookup() {} }
  });

  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(view, 'layout');
  }, /cantBeFound/);
});

QUnit.test('should use the template of the associated layout', function () {
  var templateCalled = 0;
  var layoutCalled = 0;

  (0, _emberHtmlbarsHelpers.registerHelper)('call-template', function () {
    templateCalled++;
  });

  (0, _emberHtmlbarsHelpers.registerHelper)('call-layout', function () {
    layoutCalled++;
  });

  registry.register('template:template', (0, _emberTemplateCompiler.compile)('{{call-template}}'));
  registry.register('template:layout', (0, _emberTemplateCompiler.compile)('{{call-layout}}'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    layoutName: 'layout',
    templateName: 'template'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(templateCalled, 0, 'template is not called when layout is present');
  equal(layoutCalled, 1, 'layout is called when layout is present');
});

QUnit.test('should use the associated template with itself as the context', function () {
  registry.register('template:testTemplate', (0, _emberTemplateCompiler.compile)('<h1 id=\'twas-called\'>template was called for {{personName}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    layoutName: 'testTemplate',

    context: {
      personName: 'Tom DAAAALE'
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('template was called for Tom DAAAALE', view.$('#twas-called').text(), 'the named template was called with the view as the data source');
});

QUnit.test('should fall back to defaultLayout if neither template nor templateName are provided', function () {
  var View = _emberViewsViewsView2['default'].extend({
    defaultLayout: (0, _emberTemplateCompiler.compile)('used default layout')
  });

  view = View.create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('used default layout', view.$().text(), 'the named template was called with the view as the data source');
});

QUnit.test('should not use defaultLayout if layout is provided', function () {
  var View = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompiler.compile)('used layout'),
    defaultLayout: (0, _emberTemplateCompiler.compile)('used default layout')
  });

  view = View.create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('used layout', view.$().text(), 'default layout was not printed');
});