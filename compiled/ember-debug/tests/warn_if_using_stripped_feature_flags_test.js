'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberDebug = require('ember-debug');

var oldWarn, oldRunInDebug, origEnvFeatures, origEnableAll, origEnableOptional;

function confirmWarns(expectedMsg) {
  var featuresWereStripped = true;
  var FEATURES = _emberMetalCore2['default'].ENV.FEATURES;

  _emberMetalCore2['default'].warn = function (msg, test) {
    if (!test) {
      equal(msg, expectedMsg);
    }
  };

  _emberMetalCore2['default'].runInDebug = function (func) {
    func();
  };

  // Should trigger our 1 warning
  (0, _emberDebug._warnIfUsingStrippedFeatureFlags)(FEATURES, featuresWereStripped);

  // Shouldn't trigger any warnings now that we're "in canary"
  featuresWereStripped = false;
  (0, _emberDebug._warnIfUsingStrippedFeatureFlags)(FEATURES, featuresWereStripped);
}

QUnit.module('ember-debug - _warnIfUsingStrippedFeatureFlags', {
  setup: function setup() {
    oldWarn = _emberMetalCore2['default'].warn;
    oldRunInDebug = _emberMetalCore2['default'].runInDebug;
    origEnvFeatures = _emberMetalCore2['default'].ENV.FEATURES;
    origEnableAll = _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES;
    origEnableOptional = _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES;
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].warn = oldWarn;
    _emberMetalCore2['default'].runInDebug = oldRunInDebug;
    _emberMetalCore2['default'].ENV.FEATURES = origEnvFeatures;
    _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = origEnableAll;
    _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = origEnableOptional;
  }
});

QUnit.test('Setting Ember.ENV.ENABLE_ALL_FEATURES truthy in non-canary, debug build causes a warning', function () {
  expect(1);

  _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = true;
  _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = false;
  _emberMetalCore2['default'].ENV.FEATURES = {};

  confirmWarns('Ember.ENV.ENABLE_ALL_FEATURES is only available in canary builds.');
});

QUnit.test('Setting Ember.ENV.ENABLE_OPTIONAL_FEATURES truthy in non-canary, debug build causes a warning', function () {
  expect(1);

  _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = false;
  _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = true;
  _emberMetalCore2['default'].ENV.FEATURES = {};

  confirmWarns('Ember.ENV.ENABLE_OPTIONAL_FEATURES is only available in canary builds.');
});

QUnit.test('Enabling a FEATURES flag in non-canary, debug build causes a warning', function () {
  expect(1);

  _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = false;
  _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = false;
  _emberMetalCore2['default'].ENV.FEATURES = {
    'fred': true,
    'barney': false,
    'wilma': null
  };

  confirmWarns('FEATURE["fred"] is set as enabled, but FEATURE flags are only available in canary builds.');
});