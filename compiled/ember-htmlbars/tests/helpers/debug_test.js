'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.lookup

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var originalLookup = _emberMetalCore2['default'].lookup;
var lookup;
var originalLog, logCalls;
var view;

QUnit.module('Handlebars {{log}} helper', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    originalLog = _emberMetalLogger2['default'].log;
    logCalls = [];
    _emberMetalLogger2['default'].log = function () {
      logCalls.push.apply(logCalls, arguments);
    };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    view = null;

    _emberMetalLogger2['default'].log = originalLog;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should be able to log multiple properties', function () {
  var context = {
    value: 'one',
    valueTwo: 'two'
  };

  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{log value valueTwo}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one');
  equal(logCalls[1], 'two');
});

QUnit.test('should be able to log primitives', function () {
  var context = {
    value: 'one',
    valueTwo: 'two'
  };

  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{log value "foo" 0 valueTwo true}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  strictEqual(logCalls[0], 'one');
  strictEqual(logCalls[1], 'foo');
  strictEqual(logCalls[2], 0);
  strictEqual(logCalls[3], 'two');
  strictEqual(logCalls[4], true);
});