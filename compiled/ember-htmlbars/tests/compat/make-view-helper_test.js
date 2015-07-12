'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var registry, container, view;

QUnit.module('ember-htmlbars: compat - makeViewHelper compat', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;
  }
});

QUnit.test('makeViewHelper', function () {
  expect(1);

  var ViewHelperComponent = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('woot!')
  });
  var helper = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(ViewHelperComponent);
  registry.register('helper:view-helper', helper);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view-helper}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'woot!');
});