'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/run_loop/run_bind_test');

QUnit.test('Ember.run.bind builds a run-loop wrapped callback handler', function () {
  expect(3);

  var obj = {
    value: 0,
    increment: function increment(_increment) {
      ok(_emberMetalRun_loop2['default'].currentRunLoop, 'expected a run-loop');
      return this.value += _increment;
    }
  };

  var proxiedFunction = _emberMetalRun_loop2['default'].bind(obj, obj.increment, 1);
  equal(proxiedFunction(), 1);
  equal(obj.value, 1);
});

QUnit.test('Ember.run.bind keeps the async callback arguments', function () {
  expect(4);

  var asyncCallback = function asyncCallback(increment, increment2, increment3) {
    ok(_emberMetalRun_loop2['default'].currentRunLoop, 'expected a run-loop');
    equal(increment, 1);
    equal(increment2, 2);
    equal(increment3, 3);
  };

  var asyncFunction = function asyncFunction(fn) {
    fn(2, 3);
  };

  asyncFunction(_emberMetalRun_loop2['default'].bind(asyncCallback, asyncCallback, 1));
});