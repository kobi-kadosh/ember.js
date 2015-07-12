'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

function buildView(template, context) {
  return _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    context: context || {}
  });
}

var oldString;

QUnit.module('ember-htmlbars: {{#loc}} helper', {
  setup: function setup() {
    oldString = _emberMetalCore2['default'].STRINGS;
    _emberMetalCore2['default'].STRINGS = {
      '_Howdy Friend': 'Hallo Freund'
    };
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].STRINGS = oldString;
  }
});

QUnit.test('let the original value through by default', function () {
  var view = buildView('{{loc "Hiya buddy!"}}');
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Hiya buddy!');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('localize a simple string', function () {
  var view = buildView('{{loc "_Howdy Friend"}}');
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Hallo Freund');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('localize takes passed formats into an account', function () {
  var view = buildView('{{loc "%@, %@" "Hello" "Mr. Pitkin"}}');
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Hello, Mr. Pitkin', 'the value of localizationKey is correct');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});