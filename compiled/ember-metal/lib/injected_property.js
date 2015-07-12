'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalAlias = require('ember-metal/alias');

var _emberMetalProperties = require('ember-metal/properties');

/**
  Read-only property that returns the result of a container lookup.

  @class InjectedProperty
  @namespace Ember
  @constructor
  @param {String} type The container type the property will lookup
  @param {String} name (optional) The name the property will lookup, defaults
         to the property's name
  @private
*/
function InjectedProperty(type, name) {
  this.type = type;
  this.name = name;

  this._super$Constructor(injectedPropertyGet);
  AliasedPropertyPrototype.oneWay.call(this);
}

function injectedPropertyGet(keyName) {
  var possibleDesc = this[keyName];
  var desc = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor ? possibleDesc : undefined;

  _emberMetalCore2['default'].assert('Attempting to lookup an injected property on an object without a container, ensure that the object was instantiated via a container.', this.container);

  return this.container.lookup(desc.type + ':' + (desc.name || keyName));
}

InjectedProperty.prototype = Object.create(_emberMetalProperties.Descriptor.prototype);

var InjectedPropertyPrototype = InjectedProperty.prototype;
var ComputedPropertyPrototype = _emberMetalComputed.ComputedProperty.prototype;
var AliasedPropertyPrototype = _emberMetalAlias.AliasedProperty.prototype;

InjectedPropertyPrototype._super$Constructor = _emberMetalComputed.ComputedProperty;

InjectedPropertyPrototype.get = ComputedPropertyPrototype.get;
InjectedPropertyPrototype.readOnly = ComputedPropertyPrototype.readOnly;

InjectedPropertyPrototype.teardown = ComputedPropertyPrototype.teardown;

exports['default'] = InjectedProperty;
module.exports = exports['default'];