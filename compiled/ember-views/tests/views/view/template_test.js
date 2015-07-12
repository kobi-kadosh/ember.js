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

var registry, container, view;

QUnit.module('EmberView - Template Functionality', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
      container.destroy();
      registry = container = view = null;
    });
  }
});

QUnit.test('Template views return throw if their template cannot be found', function () {
  view = _emberViewsViewsView2['default'].create({
    templateName: 'cantBeFound',
    container: { lookup: function lookup() {} }
  });

  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(view, 'template');
  }, /cantBeFound/);
});

QUnit.test('should call the function of the associated template', function () {
  registry.register('template:testTemplate', (0, _emberTemplateCompiler.compile)('<h1 id=\'twas-called\'>template was called</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'testTemplate'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$('#twas-called').length, 'the named template was called');
});

QUnit.test('should call the function of the associated template with itself as the context', function () {
  registry.register('template:testTemplate', (0, _emberTemplateCompiler.compile)('<h1 id=\'twas-called\'>template was called for {{personName}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'testTemplate',

    context: {
      personName: 'Tom DAAAALE'
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('template was called for Tom DAAAALE', view.$('#twas-called').text(), 'the named template was called with the view as the data source');
});

QUnit.test('should fall back to defaultTemplate if neither template nor templateName are provided', function () {
  var View;

  View = _emberViewsViewsView2['default'].extend({
    defaultTemplate: (0, _emberTemplateCompiler.compile)('<h1 id=\'twas-called\'>template was called for {{personName}}</h1>')
  });

  view = View.create({
    context: {
      personName: 'Tom DAAAALE'
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('template was called for Tom DAAAALE', view.$('#twas-called').text(), 'the named template was called with the view as the data source');
});

QUnit.test('should not use defaultTemplate if template is provided', function () {
  var View = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompiler.compile)('foo'),
    defaultTemplate: (0, _emberTemplateCompiler.compile)('<h1 id=\'twas-called\'>template was called for {{personName}}</h1>')
  });

  view = View.create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('foo', view.$().text(), 'default template was not printed');
});

QUnit.test('should not use defaultTemplate if template is provided', function () {
  registry.register('template:foobar', (0, _emberTemplateCompiler.compile)('foo'));

  var View = _emberViewsViewsView2['default'].extend({
    container: container,
    templateName: 'foobar',
    defaultTemplate: (0, _emberTemplateCompiler.compile)('<h1 id=\'twas-called\'>template was called for {{personName}}</h1>')
  });

  view = View.create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal('foo', view.$().text(), 'default template was not printed');
});

QUnit.test('should render an empty element if no template is specified', function () {
  view = _emberViewsViewsView2['default'].create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().text(), '', 'view div should be empty');
});

QUnit.test('should throw an assertion if no container has been set', function () {
  expect(1);
  var View;

  View = _emberViewsViewsView2['default'].extend({
    templateName: 'foobar'
  });

  throws(function () {
    view = View.create();
    (0, _emberMetalRun_loop2['default'])(function () {
      view.createElement();
    });
  }, /Container was not found when looking up a views template./);

  view._renderNode = null;
});