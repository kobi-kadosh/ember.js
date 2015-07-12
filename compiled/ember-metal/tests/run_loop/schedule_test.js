'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/run_loop/schedule_test');

QUnit.test('scheduling item in queue should defer until finished', function () {
  var cnt = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].schedule('actions', function () {
      cnt++;
    });
    _emberMetalRun_loop2['default'].schedule('actions', function () {
      cnt++;
    });
    equal(cnt, 0, 'should not run action yet');
  });

  equal(cnt, 2, 'should flush actions now');
});

QUnit.test('nested runs should queue each phase independently', function () {
  var cnt = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].schedule('actions', function () {
      cnt++;
    });
    equal(cnt, 0, 'should not run action yet');

    (0, _emberMetalRun_loop2['default'])(function () {
      _emberMetalRun_loop2['default'].schedule('actions', function () {
        cnt++;
      });
    });
    equal(cnt, 1, 'should not run action yet');
  });

  equal(cnt, 2, 'should flush actions now');
});

QUnit.test('prior queues should be flushed before moving on to next queue', function () {
  var order = [];

  (0, _emberMetalRun_loop2['default'])(function () {
    var runLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    ok(runLoop, 'run loop present');

    _emberMetalRun_loop2['default'].schedule('sync', function () {
      order.push('sync');
      equal(runLoop, _emberMetalRun_loop2['default'].currentRunLoop, 'same run loop used');
    });
    _emberMetalRun_loop2['default'].schedule('actions', function () {
      order.push('actions');
      equal(runLoop, _emberMetalRun_loop2['default'].currentRunLoop, 'same run loop used');

      _emberMetalRun_loop2['default'].schedule('actions', function () {
        order.push('actions');
        equal(runLoop, _emberMetalRun_loop2['default'].currentRunLoop, 'same run loop used');
      });

      _emberMetalRun_loop2['default'].schedule('sync', function () {
        order.push('sync');
        equal(runLoop, _emberMetalRun_loop2['default'].currentRunLoop, 'same run loop used');
      });
    });
    _emberMetalRun_loop2['default'].schedule('destroy', function () {
      order.push('destroy');
      equal(runLoop, _emberMetalRun_loop2['default'].currentRunLoop, 'same run loop used');
    });
  });

  deepEqual(order, ['sync', 'actions', 'sync', 'actions', 'destroy']);
});

QUnit.test('makes sure it does not trigger an autorun during testing', function () {
  expectAssertion(function () {
    _emberMetalRun_loop2['default'].schedule('actions', function () {});
  }, /wrap any code with asynchronous side-effects in a run/);

  // make sure not just the first violation is asserted.
  expectAssertion(function () {
    _emberMetalRun_loop2['default'].schedule('actions', function () {});
  }, /wrap any code with asynchronous side-effects in a run/);
});