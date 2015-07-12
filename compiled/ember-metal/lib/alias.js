'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = alias;
exports.AliasedProperty = AliasedProperty;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalDependent_keys = require('ember-metal/dependent_keys');

function alias(altKey) {
  return new AliasedProperty(altKey);
}

function AliasedProperty(altKey) {
  this.isDescriptor = true;
  this.altKey = altKey;
  this._dependentKeys = [altKey];
}

AliasedProperty.prototype = Object.create(_emberMetalProperties.Descriptor.prototype);

AliasedProperty.prototype.get = function AliasedProperty_get(obj, keyName) {
  return (0, _emberMetalProperty_get.get)(obj, this.altKey);
};

AliasedProperty.prototype.set = function AliasedProperty_set(obj, keyName, value) {
  return (0, _emberMetalProperty_set.set)(obj, this.altKey, value);
};

AliasedProperty.prototype.willWatch = function (obj, keyName) {
  (0, _emberMetalDependent_keys.addDependentKeys)(this, obj, keyName, (0, _emberMetalUtils.meta)(obj));
};

AliasedProperty.prototype.didUnwatch = function (obj, keyName) {
  (0, _emberMetalDependent_keys.removeDependentKeys)(this, obj, keyName, (0, _emberMetalUtils.meta)(obj));
};

AliasedProperty.prototype.setup = function (obj, keyName) {
  _emberMetalCore2['default'].assert('Setting alias \'' + keyName + '\' on self', this.altKey !== keyName);
  var m = (0, _emberMetalUtils.meta)(obj);
  if (m.watching[keyName]) {
    (0, _emberMetalDependent_keys.addDependentKeys)(this, obj, keyName, m);
  }
};

AliasedProperty.prototype.teardown = function (obj, keyName) {
  var m = (0, _emberMetalUtils.meta)(obj);
  if (m.watching[keyName]) {
    (0, _emberMetalDependent_keys.removeDependentKeys)(this, obj, keyName, m);
  }
};

AliasedProperty.prototype.readOnly = function () {
  this.set = AliasedProperty_readOnlySet;
  return this;
};

function AliasedProperty_readOnlySet(obj, keyName, value) {
  throw new _emberMetalError2['default']('Cannot set read-only property \'' + keyName + '\' on object: ' + (0, _emberMetalUtils.inspect)(obj));
}

AliasedProperty.prototype.oneWay = function () {
  this.set = AliasedProperty_oneWaySet;
  return this;
};

function AliasedProperty_oneWaySet(obj, keyName, value) {
  (0, _emberMetalProperties.defineProperty)(obj, keyName, null);
  return (0, _emberMetalProperty_set.set)(obj, keyName, value);
}

// Backwards compatibility with Ember Data
AliasedProperty.prototype._meta = undefined;
AliasedProperty.prototype.meta = _emberMetalComputed.ComputedProperty.prototype.meta;