'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view, dispatcher;

// Adapted from https://github.com/jquery/jquery/blob/f30f7732e7775b6e417c4c22ced7adb2bf76bf89/test/data/testinit.js
var canDataTransfer, fireNativeWithDataTransfer;

if (document.createEvent) {
  canDataTransfer = !!document.createEvent('HTMLEvents').dataTransfer;
  fireNativeWithDataTransfer = function (node, type, dataTransfer) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    event.dataTransfer = dataTransfer;
    node.dispatchEvent(event);
  };
} else {
  canDataTransfer = !!document.createEventObject().dataTransfer;
  fireNativeWithDataTransfer = function (node, type, dataTransfer) {
    var event = document.createEventObject();
    event.dataTransfer = dataTransfer;
    node.fireEvent('on' + type, event);
  };
}

QUnit.module('EventDispatcher - jQuery integration', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
      dispatcher.setup();
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
      dispatcher.destroy();
    });
  }
});

if (canDataTransfer) {
  QUnit.test('jQuery.event.fix copies over the dataTransfer property', function () {
    var originalEvent;
    var receivedEvent;

    originalEvent = {
      type: 'drop',
      dataTransfer: 'success',
      target: document.body
    };

    receivedEvent = _emberViewsSystemJquery2['default'].event.fix(originalEvent);

    ok(receivedEvent !== originalEvent, 'attributes are copied to a new event object');
    equal(receivedEvent.dataTransfer, originalEvent.dataTransfer, 'copies dataTransfer property to jQuery event');
  });

  QUnit.test('drop handler should receive event with dataTransfer property', function () {
    var receivedEvent;
    var dropCalled = 0;

    view = _emberViewsViewsView2['default'].extend({
      drop: function drop(evt) {
        receivedEvent = evt;
        dropCalled++;
      }
    }).create();

    (0, _emberMetalRun_loop2['default'])(function () {
      view.append();
    });

    fireNativeWithDataTransfer(view.$().get(0), 'drop', 'success');

    equal(dropCalled, 1, 'called drop handler once');
    equal(receivedEvent.dataTransfer, 'success', 'copies dataTransfer property to jQuery event');
  });
}