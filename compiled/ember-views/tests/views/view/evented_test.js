'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view;

QUnit.module('EmberView evented helpers', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('fire should call method sharing event name if it exists on the view', function () {
  var eventFired = false;

  view = _emberViewsViewsView2['default'].create({
    fireMyEvent: function fireMyEvent() {
      this.trigger('myEvent');
    },

    myEvent: function myEvent() {
      eventFired = true;
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.fireMyEvent();
  });

  equal(eventFired, true, 'fired the view method sharing the event name');
});

QUnit.test('fire does not require a view method with the same name', function () {
  var eventFired = false;

  view = _emberViewsViewsView2['default'].create({
    fireMyEvent: function fireMyEvent() {
      this.trigger('myEvent');
    }
  });

  var listenObject = _emberRuntimeSystemObject2['default'].create({
    onMyEvent: function onMyEvent() {
      eventFired = true;
    }
  });

  view.on('myEvent', listenObject, 'onMyEvent');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.fireMyEvent();
  });

  equal(eventFired, true, 'fired the event without a view method sharing its name');

  (0, _emberMetalRun_loop2['default'])(function () {
    listenObject.destroy();
  });
});