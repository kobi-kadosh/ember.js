'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/run_loop/sync_test');

QUnit.test('sync() will immediately flush the sync queue only', function () {
  var cnt = 0;

  (0, _emberMetalRun_loop2['default'])(function () {

    function cntup() {
      cnt++;
    }

    function syncfunc() {
      if (++cnt < 5) {
        _emberMetalRun_loop2['default'].schedule('sync', syncfunc);
      }
      _emberMetalRun_loop2['default'].schedule('actions', cntup);
    }

    syncfunc();

    equal(cnt, 1, 'should not run action yet');
    _emberMetalRun_loop2['default'].sync();

    equal(cnt, 5, 'should have run sync queue continuously');
  });

  equal(cnt, 10, 'should flush actions now too');
});

QUnit.test('calling sync() outside a run loop does not cause an error', function () {
  expect(0);

  _emberMetalRun_loop2['default'].sync();
});