'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var originalQueues = _emberMetalRun_loop2['default'].queues;
var queues;

QUnit.module('system/run_loop/add_queue_test', {
  setup: function setup() {
    _emberMetalRun_loop2['default'].queues = queues = ['blork', 'bleep'];
  },
  teardown: function teardown() {
    _emberMetalRun_loop2['default'].queues = originalQueues;
  }
});

QUnit.test('adds a queue after a specified one', function () {
  _emberMetalRun_loop2['default']._addQueue('testeroo', 'blork');

  equal(queues.indexOf('testeroo'), 1, 'new queue was added after specified queue');
});

QUnit.test('does not add the queue if it already exists', function () {
  _emberMetalRun_loop2['default']._addQueue('testeroo', 'blork');
  _emberMetalRun_loop2['default']._addQueue('testeroo', 'blork');

  equal(queues.length, 3, 'queue was not added twice');
});