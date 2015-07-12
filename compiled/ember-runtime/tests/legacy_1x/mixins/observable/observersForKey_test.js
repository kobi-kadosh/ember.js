/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * Create ObservableObject which includes Ember.Observable
*/

// ========================================================================
// Ember.Observable Tests
// ========================================================================

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsObservable = require('ember-runtime/mixins/observable');

var _emberRuntimeMixinsObservable2 = _interopRequireDefault(_emberRuntimeMixinsObservable);

var ObservableObject = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsObservable2['default']);

// ..........................................................
// GET()
//

QUnit.module('object.observesForKey()');

QUnit.test('should get observers', function () {
  var o1 = ObservableObject.create({ foo: 100 });
  var o2 = ObservableObject.create({ func: function func() {} });
  var o3 = ObservableObject.create({ func: function func() {} });
  var observers = null;

  equal((0, _emberMetalProperty_get.get)(o1.observersForKey('foo'), 'length'), 0, 'o1.observersForKey should return empty array');

  o1.addObserver('foo', o2, o2.func);
  o1.addObserver('foo', o3, o3.func);

  observers = o1.observersForKey('foo');

  equal((0, _emberMetalProperty_get.get)(observers, 'length'), 2, 'o2.observersForKey should return an array with length 2');
  equal(observers[0][0], o2, 'first item in observers array should be o2');
  equal(observers[1][0], o3, 'second item in observers array should be o3');
});