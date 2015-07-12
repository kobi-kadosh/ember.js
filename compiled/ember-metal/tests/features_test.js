'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var origFeatures, origEnableAll, origEnableOptional;

QUnit.module('isEnabled', {
  setup: function setup() {
    origFeatures = (0, _emberMetalMerge2['default'])({}, _emberMetalFeatures.FEATURES);
    origEnableAll = _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES;
    origEnableOptional = _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES;
  },

  teardown: function teardown() {
    for (var feature in _emberMetalFeatures.FEATURES) {
      delete _emberMetalFeatures.FEATURES[feature];
    }
    (0, _emberMetalMerge2['default'])(_emberMetalFeatures.FEATURES, origFeatures);

    _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = origEnableAll;
    _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = origEnableOptional;
  }
});

QUnit.test('ENV.ENABLE_ALL_FEATURES', function () {
  _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = true;
  _emberMetalFeatures.FEATURES['fred'] = false;
  _emberMetalFeatures.FEATURES['wilma'] = null;

  equal((0, _emberMetalFeatures2['default'])('fred'), true, 'overrides features set to false');
  equal((0, _emberMetalFeatures2['default'])('wilma'), true, 'enables optional features');
  equal((0, _emberMetalFeatures2['default'])('betty'), true, 'enables non-specified features');
});

QUnit.test('ENV.ENABLE_OPTIONAL_FEATURES', function () {
  _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = true;
  _emberMetalFeatures.FEATURES['fred'] = false;
  _emberMetalFeatures.FEATURES['barney'] = true;
  _emberMetalFeatures.FEATURES['wilma'] = null;

  equal((0, _emberMetalFeatures2['default'])('fred'), false, 'returns flag value if false');
  equal((0, _emberMetalFeatures2['default'])('barney'), true, 'returns flag value if true');
  equal((0, _emberMetalFeatures2['default'])('wilma'), true, 'returns true if flag is not true|false|undefined');
  equal((0, _emberMetalFeatures2['default'])('betty'), undefined, 'returns flag value if undefined');
});

QUnit.test('isEnabled without ENV options', function () {
  _emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES = false;
  _emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES = false;

  _emberMetalFeatures.FEATURES['fred'] = false;
  _emberMetalFeatures.FEATURES['barney'] = true;
  _emberMetalFeatures.FEATURES['wilma'] = null;

  equal((0, _emberMetalFeatures2['default'])('fred'), false, 'returns flag value if false');
  equal((0, _emberMetalFeatures2['default'])('barney'), true, 'returns flag value if true');
  equal((0, _emberMetalFeatures2['default'])('wilma'), false, 'returns false if flag is not set');
  equal((0, _emberMetalFeatures2['default'])('betty'), undefined, 'returns flag value if undefined');
});