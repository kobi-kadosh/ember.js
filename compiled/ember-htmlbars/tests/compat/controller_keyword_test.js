'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var component = undefined;

QUnit.module('ember-htmlbars: compat - controller keyword (use as a path)', {
  setup: function setup() {
    component = null;
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
  }
});

QUnit.test('reading the controller keyword is deprecated [DEPRECATED]', function () {
  var text = 'a-prop';
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      prop: text,
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{controller.prop}}')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using `{{controller}}` or any path based on it .* has been deprecated./);
  equal(component.$().text(), text, 'controller keyword is read');
});

QUnit.test('reading the controller keyword for hash is deprecated [DEPRECATED]', function () {
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      prop: true,
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if true \'hiho\' option=controller.prop}}')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using `{{controller}}` or any path based on it .* has been deprecated./);
});

QUnit.test('reading the controller keyword for param is deprecated [DEPRECATED]', function () {
  var text = 'a-prop';
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      prop: true,
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if controller.prop \'' + text + '\'}}')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using `{{controller}}` or any path based on it .* has been deprecated./);
  equal(component.$().text(), text, 'controller keyword is read');
});

QUnit.test('reading the controller keyword for param with block is deprecated [DEPRECATED]', function () {
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      prop: true,
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each controller as |things|}}{{/each}}')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using `{{controller}}` or any path based on it .* has been deprecated./);
});