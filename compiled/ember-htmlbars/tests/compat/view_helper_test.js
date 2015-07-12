'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsSelect = require('ember-views/views/select');

var _emberViewsViewsSelect2 = _interopRequireDefault(_emberViewsViewsSelect);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var component = undefined,
    registry = undefined,
    container = undefined;

QUnit.module('ember-htmlbars: compat - view helper', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = component = null;
  }
});

QUnit.test('using the view helper with a string (inline form) is deprecated [DEPRECATED]', function (assert) {
  var ViewClass = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('fooView')
  });
  registry.register('view:foo', ViewClass);

  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view \'foo\'}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using the `{{view "string"}}` helper is deprecated/);

  assert.equal(component.$().text(), 'fooView', 'view helper is still rendered');
});

QUnit.test('using the view helper with a string (block form) is deprecated [DEPRECATED]', function (assert) {
  var ViewClass = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Foo says: {{yield}}')
  });
  registry.register('view:foo', ViewClass);

  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view \'foo\'}}I am foo{{/view}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using the `{{view "string"}}` helper is deprecated/);

  assert.equal(component.$().text(), 'Foo says: I am foo', 'view helper is still rendered');
});

QUnit.test('using the view helper with string "select" has its own deprecation message [DEPRECATED]', function (assert) {
  registry.register('view:select', _emberViewsViewsSelect2['default']);

  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view \'select\'}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using `{{view "select"}}` is deprecated/);

  assert.ok(!!component.$('select').length, 'still renders select');
});