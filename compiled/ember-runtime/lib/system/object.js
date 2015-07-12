/**
@module ember
@submodule ember-runtime
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemCore_object = require('ember-runtime/system/core_object');

var _emberRuntimeSystemCore_object2 = _interopRequireDefault(_emberRuntimeSystemCore_object);

var _emberRuntimeMixinsObservable = require('ember-runtime/mixins/observable');

var _emberRuntimeMixinsObservable2 = _interopRequireDefault(_emberRuntimeMixinsObservable);

/**
  `Ember.Object` is the main base class for all Ember objects. It is a subclass
  of `Ember.CoreObject` with the `Ember.Observable` mixin applied. For details,
  see the documentation for each of these.

  @class Object
  @namespace Ember
  @extends Ember.CoreObject
  @uses Ember.Observable
  @public
*/
var EmberObject = _emberRuntimeSystemCore_object2['default'].extend(_emberRuntimeMixinsObservable2['default']);
EmberObject.toString = function () {
  return 'Ember.Object';
};

exports['default'] = EmberObject;
module.exports = exports['default'];