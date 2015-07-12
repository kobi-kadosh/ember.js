'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalInstrumentation = require('ember-metal/instrumentation');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view, beforeCalls, afterCalls;

function confirmPayload(payload, view) {
  equal(payload && payload.object, view.toString(), 'payload object equals view.toString()');
  equal(payload && payload.containerKey, view._debugContainerKey, 'payload contains the containerKey');
  equal(payload && payload.view, view, 'payload contains the view itself');
}

QUnit.module('EmberView#instrumentation', {
  setup: function setup() {
    beforeCalls = [];
    afterCalls = [];

    (0, _emberMetalInstrumentation.subscribe)('render', {
      before: function before(name, timestamp, payload) {
        beforeCalls.push(payload);
      },

      after: function after(name, timestamp, payload) {
        afterCalls.push(payload);
      }
    });

    view = _emberViewsViewsView2['default'].create({
      _debugContainerKey: 'suchryzsd',
      instrumentDisplay: 'asdfasdfmewj'
    });
  },

  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(view, 'destroy');
    }

    (0, _emberMetalInstrumentation.reset)();
  }
});

QUnit.test('generates the proper instrumentation details when called directly', function () {
  var payload = {};

  view.instrumentDetails(payload);

  confirmPayload(payload, view);
});

QUnit.test('should add ember-view to views', function () {
  (0, _emberMetalRun_loop2['default'])(view, 'createElement');

  confirmPayload(beforeCalls[0], view);
});