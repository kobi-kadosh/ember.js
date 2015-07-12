'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = discoverKnownHelpers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalDictionary = require('ember-metal/dictionary');

var _emberMetalDictionary2 = _interopRequireDefault(_emberMetalDictionary);

function discoverKnownHelpers(container) {
  var registry = container && container._registry;
  var helpers = (0, _emberMetalDictionary2['default'])(null);

  if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-dashless-helpers')) {
    if (!registry) {
      return helpers;
    }

    var known = registry.knownForType('helper');
    var knownContainerKeys = Object.keys(known);

    for (var index = 0, _length = knownContainerKeys.length; index < _length; index++) {
      var fullName = knownContainerKeys[index];
      var _name = fullName.slice(7); // remove `helper:` from fullName

      helpers[_name] = true;
    }
  }

  return helpers;
}

module.exports = exports['default'];