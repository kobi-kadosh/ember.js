'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

QUnit.module('system/run_loop/unwind_test');

QUnit.test('RunLoop unwinds despite unhandled exception', function () {
  var initialRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;

  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      _emberMetalRun_loop2['default'].schedule('actions', function () {
        throw new _emberMetalError2['default']('boom!');
      });
    });
  }, Error, 'boom!');

  // The real danger at this point is that calls to autorun will stick
  // tasks into the already-dead runloop, which will never get
  // flushed. I can't easily demonstrate this in a unit test because
  // autorun explicitly doesn't work in test mode. - ef4
  equal(_emberMetalRun_loop2['default'].currentRunLoop, initialRunLoop, 'Previous run loop should be cleaned up despite exception');

  // Prevent a failure in this test from breaking subsequent tests.
  _emberMetalRun_loop2['default'].currentRunLoop = initialRunLoop;
});

QUnit.test('run unwinds despite unhandled exception', function () {
  var initialRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;

  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      throw new _emberMetalError2['default']('boom!');
    });
  }, _emberMetalError2['default'], 'boom!');

  equal(_emberMetalRun_loop2['default'].currentRunLoop, initialRunLoop, 'Previous run loop should be cleaned up despite exception');

  // Prevent a failure in this test from breaking subsequent tests.
  _emberMetalRun_loop2['default'].currentRunLoop = initialRunLoop;
});