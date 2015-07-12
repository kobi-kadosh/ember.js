'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var originalLookup, originalLog, logCalls, lookup, view;

QUnit.module('ember-htmlbars: {{#log}} helper', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    originalLog = _emberMetalCore2['default'].Logger.log;
    logCalls = [];
    _emberMetalCore2['default'].Logger.log = function (arg) {
      logCalls.push(arg);
    };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    view = null;

    _emberMetalCore2['default'].Logger.log = originalLog;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should be able to log a property', function () {
  var context = {
    value: 'one'
  };

  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{log value}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one', 'should call log with value');
});

QUnit.test('should be able to log a view property', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{log view.value}}'),
    value: 'one'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one', 'should call log with value');
});

QUnit.test('should be able to log `this`', function () {
  view = _emberViewsViewsView2['default'].create({
    context: 'one',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{log this}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one', 'should call log with item one');
});