'use strict';

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalWatching = require('ember-metal/watching');

QUnit.module('isWatching');

function testObserver(setup, teardown, key) {
  var obj = {};
  var fn = function fn() {};
  key = key || 'foo';

  equal((0, _emberMetalWatching.isWatching)(obj, key), false, 'precond - isWatching is false by default');
  setup(obj, key, fn);
  equal((0, _emberMetalWatching.isWatching)(obj, key), true, 'isWatching is true when observers are added');
  teardown(obj, key, fn);
  equal((0, _emberMetalWatching.isWatching)(obj, key), false, 'isWatching is false after observers are removed');
}

QUnit.test('isWatching is true for regular local observers', function () {
  testObserver(function (obj, key, fn) {
    _emberMetalMixin.Mixin.create({
      didChange: (0, _emberMetalMixin.observer)(key, fn)
    }).apply(obj);
  }, function (obj, key, fn) {
    (0, _emberMetalObserver.removeObserver)(obj, key, obj, fn);
  });
});

QUnit.test('isWatching is true for nonlocal observers', function () {
  testObserver(function (obj, key, fn) {
    (0, _emberMetalObserver.addObserver)(obj, key, obj, fn);
  }, function (obj, key, fn) {
    (0, _emberMetalObserver.removeObserver)(obj, key, obj, fn);
  });
});

QUnit.test('isWatching is true for chained observers', function () {
  testObserver(function (obj, key, fn) {
    (0, _emberMetalObserver.addObserver)(obj, key + '.bar', obj, fn);
  }, function (obj, key, fn) {
    (0, _emberMetalObserver.removeObserver)(obj, key + '.bar', obj, fn);
  });
});

QUnit.test('isWatching is true for computed properties', function () {
  testObserver(function (obj, key, fn) {
    (0, _emberMetalProperties.defineProperty)(obj, 'computed', (0, _emberMetalComputed.computed)(fn).property(key));
    (0, _emberMetalProperty_get.get)(obj, 'computed');
  }, function (obj, key, fn) {
    (0, _emberMetalProperties.defineProperty)(obj, 'computed', null);
  });
});

QUnit.test('isWatching is true for chained computed properties', function () {
  testObserver(function (obj, key, fn) {
    (0, _emberMetalProperties.defineProperty)(obj, 'computed', (0, _emberMetalComputed.computed)(fn).property(key + '.bar'));
    (0, _emberMetalProperty_get.get)(obj, 'computed');
  }, function (obj, key, fn) {
    (0, _emberMetalProperties.defineProperty)(obj, 'computed', null);
  });
});

// can't watch length on Array - it is special...
// But you should be able to watch a length property of an object
QUnit.test('isWatching is true for \'length\' property on object', function () {
  testObserver(function (obj, key, fn) {
    (0, _emberMetalProperties.defineProperty)(obj, 'length', null, '26.2 miles');
    (0, _emberMetalObserver.addObserver)(obj, 'length', obj, fn);
  }, function (obj, key, fn) {
    (0, _emberMetalObserver.removeObserver)(obj, 'length', obj, fn);
  }, 'length');
});