'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsKeyStream = require('ember-metal/streams/key-stream');

var _emberMetalStreamsKeyStream2 = _interopRequireDefault(_emberMetalStreamsKeyStream);

var _emberMetalProperty_set = require('ember-metal/property_set');

var source, object, count;

function incrementCount() {
  count++;
}

QUnit.module('KeyStream', {
  setup: function setup() {
    count = 0;
    object = { name: 'mmun' };

    source = new _emberMetalStreamsStream2['default'](function () {
      return object;
    });
  },
  teardown: function teardown() {
    count = undefined;
    object = undefined;
    source = undefined;
  }
});

QUnit.test('can be instantiated manually', function () {
  var nameStream = new _emberMetalStreamsKeyStream2['default'](source, 'name');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');
});

QUnit.test('can be instantiated via `Stream.prototype.get`', function () {
  var nameStream = source.get('name');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');
});

QUnit.test('is notified when the observed object\'s property is mutated', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(incrementCount);

  equal(count, 0, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  (0, _emberMetalProperty_set.set)(object, 'name', 'wycats');

  equal(count, 1, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'wycats', 'Stream value is correct');
});

QUnit.test('is notified when the source stream\'s value changes to a new object', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(incrementCount);

  equal(count, 0, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  object = { name: 'wycats' };
  source.notify();

  equal(count, 1, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'wycats', 'Stream value is correct');

  (0, _emberMetalProperty_set.set)(object, 'name', 'kris');

  equal(count, 2, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'kris', 'Stream value is correct');
});

QUnit.test('is notified when the source stream\'s value changes to the same object', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(incrementCount);

  equal(count, 0, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  source.notify();

  equal(count, 1, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  (0, _emberMetalProperty_set.set)(object, 'name', 'kris');

  equal(count, 2, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'kris', 'Stream value is correct');
});

QUnit.test('is notified when setSource is called with a new stream whose value is a new object', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(incrementCount);

  equal(count, 0, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  object = { name: 'wycats' };
  nameStream.setSource(new _emberMetalStreamsStream2['default'](function () {
    return object;
  }));

  equal(count, 1, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'wycats', 'Stream value is correct');

  (0, _emberMetalProperty_set.set)(object, 'name', 'kris');

  equal(count, 2, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'kris', 'Stream value is correct');
});

QUnit.test('is notified when setSource is called with a new stream whose value is the same object', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(incrementCount);

  equal(count, 0, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  nameStream.setSource(new _emberMetalStreamsStream2['default'](function () {
    return object;
  }));

  equal(count, 1, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'mmun', 'Stream value is correct');

  (0, _emberMetalProperty_set.set)(object, 'name', 'kris');

  equal(count, 2, 'Subscribers called correct number of times');
  equal(nameStream.value(), 'kris', 'Stream value is correct');
});

QUnit.test('adds and removes key observers on activation and deactivation', function () {
  var nameStream = source.get('name');

  ok(!(0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is not observered immediately after creation');

  nameStream.value();

  ok(!(0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is not observered after calling value with no subscribers');

  var firstCallback = function firstCallback() {};
  nameStream.subscribe(firstCallback);

  ok(!(0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is not observered immediately after first subscription');

  nameStream.value();

  ok((0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is observered after activation');

  var secondCallback = function secondCallback() {};
  nameStream.subscribe(secondCallback);

  ok((0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is still observered after second subscription is added');

  nameStream.unsubscribe(secondCallback);

  ok((0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is still observered after second subscription is removed');

  nameStream.unsubscribe(firstCallback);

  ok(!(0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is not observered after deactivation');
});

QUnit.test('removes key observers on destruction', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(function () {});
  nameStream.value();

  ok((0, _emberMetalWatching.isWatching)(object, 'name'), '(Precondition) Key is observered after activation');

  nameStream.destroy();

  ok(!(0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is not observered after destruction');
});

QUnit.test('manages key observers correctly when the object changes', function () {
  var nameStream = source.get('name');
  nameStream.subscribe(function () {});
  nameStream.value();

  ok((0, _emberMetalWatching.isWatching)(object, 'name'), '(Precondition) Key is observered after activation');

  var prevObject = object;
  object = { name: 'wycats' };
  source.notify();

  ok((0, _emberMetalWatching.isWatching)(prevObject, 'name'), 'Key is still observered on the previous object before recomputing');
  ok(!(0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is still not observered on the new object before recomputing');

  nameStream.value();

  ok(!(0, _emberMetalWatching.isWatching)(prevObject, 'name'), 'Key is not observered on the previous object after recomputing');
  ok((0, _emberMetalWatching.isWatching)(object, 'name'), 'Key is observered on the new object after recomputing');
});