'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view, originalLookup, lookup;

var originalLookup = _emberMetalCore2['default'].lookup;

QUnit.module('ember-htmlbars: Integration with Globals', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    view = null;

    _emberMetalCore2['default'].lookup = lookup = originalLookup;
  }
});

QUnit.test('should read from globals (DEPRECATED)', function () {
  _emberMetalCore2['default'].lookup.Global = 'Klarg';
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{Global}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Global lookup of Global from a Handlebars template is deprecated.');

  equal(view.$().text(), _emberMetalCore2['default'].lookup.Global);
});

QUnit.test('should read from globals with a path (DEPRECATED)', function () {
  _emberMetalCore2['default'].lookup.Global = { Space: 'Klarg' };
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{Global.Space}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Global lookup of Global from a Handlebars template is deprecated.');
  equal(view.$().text(), _emberMetalCore2['default'].lookup.Global.Space);
});

QUnit.test('with context, should read from globals (DEPRECATED)', function () {
  _emberMetalCore2['default'].lookup.Global = 'Klarg';
  view = _emberViewsViewsView2['default'].create({
    context: {},
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{Global}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Global lookup of Global from a Handlebars template is deprecated.');
  equal(view.$().text(), _emberMetalCore2['default'].lookup.Global);
});

QUnit.test('with context, should read from globals with a path (DEPRECATED)', function () {
  _emberMetalCore2['default'].lookup.Global = { Space: 'Klarg' };
  view = _emberViewsViewsView2['default'].create({
    context: {},
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{Global.Space}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Global lookup of Global from a Handlebars template is deprecated.');
  equal(view.$().text(), _emberMetalCore2['default'].lookup.Global.Space);
});