/**
@module ember
@submodule ember-metal
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.deprecateProperty = deprecateProperty;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

/**
  Used internally to allow changing properties in a backwards compatible way, and print a helpful
  deprecation warning.

  @method deprecateProperty
  @param {Object} object The object to add the deprecated property to.
  @param {String} deprecatedKey The property to add (and print deprecation warnings upon accessing).
  @param {String} newKey The property that will be aliased.
  @private
  @since 1.7.0
*/

function deprecateProperty(object, deprecatedKey, newKey) {
  function deprecate() {
    _emberMetalCore2['default'].deprecate('Usage of `' + deprecatedKey + '` is deprecated, use `' + newKey + '` instead.');
  }

  Object.defineProperty(object, deprecatedKey, {
    configurable: true,
    enumerable: false,
    set: function set(value) {
      deprecate();
      (0, _emberMetalProperty_set.set)(this, newKey, value);
    },
    get: function get() {
      deprecate();
      return (0, _emberMetalProperty_get.get)(this, newKey);
    }
  });
}