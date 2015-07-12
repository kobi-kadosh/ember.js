'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalBinding = require('ember-metal/binding');

var MyApp;

QUnit.module('system/mixin/binding/oneWay_test', {
  setup: function setup() {
    MyApp = {
      foo: { value: 'FOO' },
      bar: { value: 'BAR' }
    };
  },

  teardown: function teardown() {
    MyApp = null;
  }
});

QUnit.test('oneWay(true) should only sync one way', function () {
  var binding;
  (0, _emberMetalRun_loop2['default'])(function () {
    binding = (0, _emberMetalBinding.oneWay)(MyApp, 'bar.value', 'foo.value');
  });

  equal((0, _emberMetalProperty_get.get)(MyApp, 'foo.value'), 'FOO', 'foo synced');
  equal((0, _emberMetalProperty_get.get)(MyApp, 'bar.value'), 'FOO', 'bar synced');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(MyApp, 'bar.value', 'BAZ');
  });

  equal((0, _emberMetalProperty_get.get)(MyApp, 'foo.value'), 'FOO', 'foo synced');
  equal((0, _emberMetalProperty_get.get)(MyApp, 'bar.value'), 'BAZ', 'bar not synced');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(MyApp, 'foo.value', 'BIFF');
  });

  equal((0, _emberMetalProperty_get.get)(MyApp, 'foo.value'), 'BIFF', 'foo synced');
  equal((0, _emberMetalProperty_get.get)(MyApp, 'bar.value'), 'BIFF', 'foo synced');
});