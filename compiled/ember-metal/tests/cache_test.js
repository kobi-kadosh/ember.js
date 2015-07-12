'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCache = require('ember-metal/cache');

var _emberMetalCache2 = _interopRequireDefault(_emberMetalCache);

QUnit.module('Cache');

QUnit.test('basic', function () {
  var cache = new _emberMetalCache2['default'](100, function (key) {
    return key.toUpperCase();
  });

  equal(cache.get('foo'), 'FOO');
  equal(cache.get('bar'), 'BAR');
  equal(cache.get('foo'), 'FOO');
});

QUnit.test('caches computation correctly', function () {
  var count = 0;
  var cache = new _emberMetalCache2['default'](100, function (key) {
    count++;
    return key.toUpperCase();
  });

  equal(count, 0);
  cache.get('foo');
  equal(count, 1);
  cache.get('bar');
  equal(count, 2);
  cache.get('bar');
  equal(count, 2);
  cache.get('foo');
  equal(count, 2);
});

QUnit.test('handles undefined value correctly', function () {
  var cache = new _emberMetalCache2['default'](100, function (key) {});

  equal(cache.get('foo'), undefined);
});

QUnit.test('continues working after reaching cache limit', function () {
  var cache = new _emberMetalCache2['default'](3, function (key) {
    return key.toUpperCase();
  });

  cache.get('a');
  cache.get('b');
  cache.get('c');

  equal(cache.get('d'), 'D');
  equal(cache.get('a'), 'A');
  equal(cache.get('b'), 'B');
  equal(cache.get('c'), 'C');
});