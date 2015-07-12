'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('run.next');

asyncTest('should invoke immediately on next timeout', function () {

  var invoked = false;

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].next(function () {
      invoked = true;
    });
  });

  equal(invoked, false, 'should not have invoked yet');

  setTimeout(function () {
    QUnit.start();
    equal(invoked, true, 'should have invoked later item');
  }, 20);
});

asyncTest('callback should be called from within separate loop', function () {
  var firstRunLoop, secondRunLoop;
  (0, _emberMetalRun_loop2['default'])(function () {
    firstRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    _emberMetalRun_loop2['default'].next(function () {
      secondRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    });
  });

  setTimeout(function () {
    QUnit.start();
    ok(secondRunLoop, 'callback was called from within run loop');
    ok(firstRunLoop && secondRunLoop !== firstRunLoop, 'two separate run loops were invoked');
  }, 20);
});

asyncTest('multiple calls to run.next share coalesce callbacks into same run loop', function () {
  var firstRunLoop, secondRunLoop, thirdRunLoop;
  (0, _emberMetalRun_loop2['default'])(function () {
    firstRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    _emberMetalRun_loop2['default'].next(function () {
      secondRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    });
    _emberMetalRun_loop2['default'].next(function () {
      thirdRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    });
  });

  setTimeout(function () {
    QUnit.start();
    ok(secondRunLoop && secondRunLoop === thirdRunLoop, 'callbacks coalesced into same run loop');
  }, 20);
});