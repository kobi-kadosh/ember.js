'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var component = undefined;

QUnit.module('ember-htmlbars: compat - view keyword (use as a path)', {
  setup: function setup() {
    component = null;
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
  }
});

QUnit.test('reading the view keyword is deprecated [DEPRECATED]', function () {
  var text = 'a-prop';
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      prop: text,
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.prop}}')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Using `{{view}}` or any path based on it .* has been deprecated./);

  equal(component.$().text(), text, 'view keyword is read');
});