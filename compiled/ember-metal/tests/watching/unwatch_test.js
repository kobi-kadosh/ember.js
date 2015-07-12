'use strict';

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalEvents = require('ember-metal/events');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_set = require('ember-metal/property_set');

var willCount, didCount;

QUnit.module('unwatch', {
  setup: function setup() {
    willCount = didCount = 0;
  }
});

function addListeners(obj, keyPath) {
  (0, _emberMetalEvents.addListener)(obj, keyPath + ':before', function () {
    willCount++;
  });
  (0, _emberMetalEvents.addListener)(obj, keyPath + ':change', function () {
    didCount++;
  });
}

(0, _emberMetalTestsProps_helper.testBoth)('unwatching a computed property - regular get/set', function (get, set) {

  var obj = {};
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
    get: function get() {
      return this.__foo;
    },
    set: function set(keyName, value) {
      this.__foo = value;
      return this.__foo;
    }
  }));
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');
  set(obj, 'foo', 'bar');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  (0, _emberMetalWatching.unwatch)(obj, 'foo');
  willCount = didCount = 0;
  set(obj, 'foo', 'BAZ');
  equal(willCount, 0, 'should NOT have invoked willCount');
  equal(didCount, 0, 'should NOT have invoked didCount');
});

(0, _emberMetalTestsProps_helper.testBoth)('unwatching a regular property - regular get/set', function (get, set) {

  var obj = { foo: 'BIFF' };
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');
  set(obj, 'foo', 'bar');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  (0, _emberMetalWatching.unwatch)(obj, 'foo');
  willCount = didCount = 0;
  set(obj, 'foo', 'BAZ');
  equal(willCount, 0, 'should NOT have invoked willCount');
  equal(didCount, 0, 'should NOT have invoked didCount');
});

QUnit.test('unwatching should be nested', function () {

  var obj = { foo: 'BIFF' };
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');
  (0, _emberMetalWatching.watch)(obj, 'foo');
  (0, _emberMetalProperty_set.set)(obj, 'foo', 'bar');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  (0, _emberMetalWatching.unwatch)(obj, 'foo');
  willCount = didCount = 0;
  (0, _emberMetalProperty_set.set)(obj, 'foo', 'BAZ');
  equal(willCount, 1, 'should NOT have invoked willCount');
  equal(didCount, 1, 'should NOT have invoked didCount');

  (0, _emberMetalWatching.unwatch)(obj, 'foo');
  willCount = didCount = 0;
  (0, _emberMetalProperty_set.set)(obj, 'foo', 'BAZ');
  equal(willCount, 0, 'should NOT have invoked willCount');
  equal(didCount, 0, 'should NOT have invoked didCount');
});

(0, _emberMetalTestsProps_helper.testBoth)('unwatching "length" property on an object', function (get, set) {

  var obj = { foo: 'RUN' };
  addListeners(obj, 'length');

  // Can watch length when it is undefined
  (0, _emberMetalWatching.watch)(obj, 'length');
  set(obj, 'length', '10k');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  // Should stop watching despite length now being defined (making object 'array-like')
  (0, _emberMetalWatching.unwatch)(obj, 'length');
  willCount = didCount = 0;
  set(obj, 'length', '5k');
  equal(willCount, 0, 'should NOT have invoked willCount');
  equal(didCount, 0, 'should NOT have invoked didCount');
});