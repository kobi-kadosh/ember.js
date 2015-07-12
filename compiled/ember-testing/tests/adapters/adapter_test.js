'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTestingAdaptersAdapter = require('ember-testing/adapters/adapter');

var _emberTestingAdaptersAdapter2 = _interopRequireDefault(_emberTestingAdaptersAdapter);

var adapter;

QUnit.module('ember-testing Adapter', {
  setup: function setup() {
    adapter = new _emberTestingAdaptersAdapter2['default']();
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(adapter, adapter.destroy);
  }
});

// Can't test these this way anymore since we have nothing to compare to
// test("asyncStart is a noop", function() {
//   equal(adapter.asyncStart, K);
// });

// test("asyncEnd is a noop", function() {
//   equal(adapter.asyncEnd, K);
// });

QUnit.test('exception throws', function () {
  var error = 'Hai';
  var thrown;

  try {
    adapter.exception(error);
  } catch (e) {
    thrown = e;
  }
  equal(thrown, error);
});