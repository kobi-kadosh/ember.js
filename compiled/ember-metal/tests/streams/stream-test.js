'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

var _emberMetalProperty_get = require('ember-metal/property_get');

var stream, value, count;

function incrementCount() {
  count++;
}

QUnit.module('Stream - Proxy compatibility', {
  setup: function setup() {
    count = 0;
    value = 'zlurp';

    stream = new _emberMetalStreamsStream2['default'](function () {
      return value;
    });
  },
  teardown: function teardown() {
    value = undefined;
    stream = undefined;
  }
});

QUnit.test('is notified when a proxy\'s content changes', function () {
  stream.subscribe(incrementCount);
  stream.value();

  value = _emberRuntimeSystemObject_proxy2['default'].create({
    content: { message: 'foo' }
  });

  equal(count, 0);

  stream.notify();

  equal(count, 1);
  equal((0, _emberMetalProperty_get.get)(stream.value(), 'message'), 'foo');

  value.set('content', { message: 'bar' });

  equal(count, 2);
  equal((0, _emberMetalProperty_get.get)(stream.value(), 'message'), 'bar');
});