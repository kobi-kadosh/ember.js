'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

var source, value;

QUnit.module('ProxyStream', {
  setup: function setup() {
    value = 'zlurp';

    source = new _emberMetalStreamsStream2['default'](function () {
      return value;
    });

    source.setValue = function (_value) {
      value = _value;
      this.notify();
    };
  },
  teardown: function teardown() {
    value = undefined;
    source = undefined;
  }
});

QUnit.test('supports a stream argument', function () {
  var stream = new _emberMetalStreamsProxyStream2['default'](source);
  equal(stream.value(), 'zlurp');

  stream.setValue('blorg');
  equal(stream.value(), 'blorg');
});

QUnit.test('supports a non-stream argument', function () {
  var stream = new _emberMetalStreamsProxyStream2['default'](value);
  equal(stream.value(), 'zlurp');

  stream.setValue('blorg');
  equal(stream.value(), 'zlurp');
});