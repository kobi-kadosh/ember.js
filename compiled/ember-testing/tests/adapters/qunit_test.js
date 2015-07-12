'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTestingAdaptersQunit = require('ember-testing/adapters/qunit');

var _emberTestingAdaptersQunit2 = _interopRequireDefault(_emberTestingAdaptersQunit);

var adapter;

QUnit.module('ember-testing QUnitAdapter', {
  setup: function setup() {
    adapter = new _emberTestingAdaptersQunit2['default']();
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(adapter, adapter.destroy);
  }
});

QUnit.test('asyncStart calls stop', function () {
  var originalStop = QUnit.stop;
  try {
    QUnit.stop = function () {
      ok(true, 'stop called');
    };
    adapter.asyncStart();
  } finally {
    QUnit.stop = originalStop;
  }
});

QUnit.test('asyncEnd calls start', function () {
  var originalStart = QUnit.start;
  try {
    QUnit.start = function () {
      ok(true, 'start called');
    };
    adapter.asyncEnd();
  } finally {
    QUnit.start = originalStart;
  }
});

QUnit.test('exception causes a failing assertion', function () {
  var error = { err: 'hai' };
  var originalOk = window.ok;
  try {
    window.ok = function (val, msg) {
      originalOk(!val, 'ok is called with false');
      originalOk(msg, '{err: "hai"}');
    };
    adapter.exception(error);
  } finally {
    window.ok = originalOk;
  }
});