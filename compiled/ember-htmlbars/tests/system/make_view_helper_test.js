'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var registry, container, view;

QUnit.module('ember-htmlbars: makeViewHelper', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('makes helpful assertion when called with invalid arguments', function () {
  var SomeRandom = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompiler.compile)('Some Random Class')
  });

  SomeRandom.toString = function () {
    return 'Some Random Class';
  };

  var helper = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(SomeRandom);
  registry.register('helper:some-random', helper);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompiler.compile)('{{some-random \'sending-params-to-view-is-invalid\'}}'),
    container: container
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'You can only pass attributes (such as name=value) not bare values to a helper for a View found in \'Some Random Class\'');
});

QUnit.test('can properly yield', function () {
  var SomeRandom = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompiler.compile)('Some Random Class - {{yield}}')
  });

  var helper = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(SomeRandom);
  registry.register('helper:some-random', helper);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompiler.compile)('{{#some-random}}Template{{/some-random}}'),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Some Random Class - Template');
});