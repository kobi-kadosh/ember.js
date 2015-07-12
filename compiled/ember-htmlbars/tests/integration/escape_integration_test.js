'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view;

QUnit.module('ember-htmlbars: Integration with Globals', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    view = null;
  }
});

QUnit.test('should read from a global-ish simple local path without deprecation', function () {
  view = _emberViewsViewsView2['default'].create({
    context: { NotGlobal: 'Gwar' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{NotGlobal}}')
  });

  expectNoDeprecation();
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Gwar');
});

QUnit.test('should read a number value', function () {
  var context = { aNumber: 1 };
  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{aNumber}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), '1');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(context, 'aNumber', 2);
  });

  equal(view.$().text(), '2');
});

QUnit.test('should read an escaped number value', function () {
  var context = { aNumber: 1 };
  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{{aNumber}}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), '1');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(context, 'aNumber', 2);
  });

  equal(view.$().text(), '2');
});

QUnit.test('should read from an Object.create(null)', function () {
  // Use ember's polyfill for Object.create
  var nullObject = Object.create(null);
  nullObject['foo'] = 'bar';
  view = _emberViewsViewsView2['default'].create({
    context: { nullObject: nullObject },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{nullObject.foo}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'bar');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(nullObject, 'foo', 'baz');
  });

  equal(view.$().text(), 'baz');
});

QUnit.test('should escape HTML in primitive value contexts when using normal mustaches', function () {
  view = _emberViewsViewsView2['default'].create({
    context: '<b>Max</b><b>James</b>',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{this}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 0, 'does not create an element');
  equal(view.$().text(), '<b>Max</b><b>James</b>', 'inserts entities, not elements');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context', '<i>Max</i><i>James</i>');
  });

  equal(view.$().text(), '<i>Max</i><i>James</i>', 'updates with entities, not elements');
  equal(view.$('i').length, 0, 'does not create an element when value is updated');
});

QUnit.test('should not escape HTML in primitive value contexts when using triple mustaches', function () {
  view = _emberViewsViewsView2['default'].create({
    context: '<b>Max</b><b>James</b>',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{{this}}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 2, 'creates an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context', '<i>Max</i><i>James</i>');
  });

  equal(view.$('i').length, 2, 'creates an element when value is updated');
});