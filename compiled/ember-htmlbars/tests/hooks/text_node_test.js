'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _htmlbarsTestHelpers = require('htmlbars-test-helpers');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view;

QUnit.module('ember-htmlbars: hooks/text_node_test', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('property is output', function () {
  view = _emberViewsViewsView2['default'].create({
    context: { name: 'erik' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('ohai {{name}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, 'ohai erik', 'property is output');
});

QUnit.test('path is output', function () {
  view = _emberViewsViewsView2['default'].create({
    context: { name: { firstName: 'erik' } },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('ohai {{name.firstName}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, 'ohai erik', 'path is output');
});

QUnit.test('changed property updates', function () {
  var context = _emberRuntimeSystemObject2['default'].create({ name: 'erik' });
  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('ohai {{name}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, 'ohai erik', 'precond - original property is output');

  (0, _emberMetalRun_loop2['default'])(context, context.set, 'name', 'mmun');

  (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, 'ohai mmun', 'new property is output');
});