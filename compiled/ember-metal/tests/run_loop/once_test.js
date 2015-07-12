'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/run_loop/once_test');

QUnit.test('calling invokeOnce more than once invokes only once', function () {

  var count = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    var F = function F() {
      count++;
    };
    _emberMetalRun_loop2['default'].once(F);
    _emberMetalRun_loop2['default'].once(F);
    _emberMetalRun_loop2['default'].once(F);
  });

  equal(count, 1, 'should have invoked once');
});

QUnit.test('should differentiate based on target', function () {

  var A = { count: 0 };
  var B = { count: 0 };
  (0, _emberMetalRun_loop2['default'])(function () {
    var F = function F() {
      this.count++;
    };
    _emberMetalRun_loop2['default'].once(A, F);
    _emberMetalRun_loop2['default'].once(B, F);
    _emberMetalRun_loop2['default'].once(A, F);
    _emberMetalRun_loop2['default'].once(B, F);
  });

  equal(A.count, 1, 'should have invoked once on A');
  equal(B.count, 1, 'should have invoked once on B');
});

QUnit.test('should ignore other arguments - replacing previous ones', function () {

  var A = { count: 0 };
  var B = { count: 0 };
  (0, _emberMetalRun_loop2['default'])(function () {
    var F = function F(amt) {
      this.count += amt;
    };
    _emberMetalRun_loop2['default'].once(A, F, 10);
    _emberMetalRun_loop2['default'].once(B, F, 20);
    _emberMetalRun_loop2['default'].once(A, F, 30);
    _emberMetalRun_loop2['default'].once(B, F, 40);
  });

  equal(A.count, 30, 'should have invoked once on A');
  equal(B.count, 40, 'should have invoked once on B');
});

QUnit.test('should be inside of a runloop when running', function () {

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].once(function () {
      ok(!!_emberMetalRun_loop2['default'].currentRunLoop, 'should have a runloop');
    });
  });
});