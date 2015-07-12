'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isEnabled;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

/**
  The hash of enabled Canary features. Add to this, any canary features
  before creating your application.

  Alternatively (and recommended), you can also define `EmberENV.FEATURES`
  if you need to enable features flagged at runtime.

  @class FEATURES
  @namespace Ember
  @static
  @since 1.1.0
  @public
*/
var FEATURES = _emberMetalCore2['default'].ENV.FEATURES || {};

exports.FEATURES = FEATURES;
/**
  Determine whether the specified `feature` is enabled. Used by Ember's
  build tools to exclude experimental features from beta/stable builds.

  You can define the following configuration options:

  * `EmberENV.ENABLE_ALL_FEATURES` - force all features to be enabled.
  * `EmberENV.ENABLE_OPTIONAL_FEATURES` - enable any features that have not been explicitly
    enabled/disabled.

  @method isEnabled
  @param {String} feature The feature to check
  @return {Boolean}
  @for Ember.FEATURES
  @since 1.1.0
  @public
*/

function isEnabled(feature) {
  var featureValue = FEATURES[feature];

  if (_emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES) {
    return true;
  } else if (featureValue === true || featureValue === false || featureValue === undefined) {
    return featureValue;
  } else if (_emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES) {
    return true;
  } else {
    return false;
  }
}