'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsMixinsView_target_action_support = require('ember-views/mixins/view_target_action_support');

var _emberViewsMixinsView_target_action_support2 = _interopRequireDefault(_emberViewsMixinsView_target_action_support);

QUnit.module('ViewTargetActionSupport');

QUnit.test('it should return false if no action is specified', function () {
  expect(1);

  var view = _emberViewsViewsView2['default'].extend(_emberViewsMixinsView_target_action_support2['default']).create({
    controller: _emberRuntimeSystemObject2['default'].create()
  });

  ok(false === view.triggerAction(), 'a valid target and action were specified');
});

QUnit.test('it should support actions specified as strings', function () {
  expect(2);

  var view = _emberViewsViewsView2['default'].extend(_emberViewsMixinsView_target_action_support2['default']).create({
    controller: _emberRuntimeSystemObject2['default'].create({
      anEvent: function anEvent() {
        ok(true, 'anEvent method was called');
      }
    }),
    action: 'anEvent'
  });

  ok(true === view.triggerAction(), 'a valid target and action were specified');
});

QUnit.test('it should invoke the send() method on the controller with the view\'s context', function () {
  expect(3);

  var view = _emberViewsViewsView2['default'].extend(_emberViewsMixinsView_target_action_support2['default'], {
    controller: _emberRuntimeSystemObject2['default'].create({
      send: function send(evt, context) {
        equal(evt, 'anEvent', 'send() method was invoked with correct event name');
        equal(context, view.get('context'), 'send() method was invoked with correct context');
      }
    })
  }).create({
    context: {},
    action: 'anEvent'
  });

  ok(true === view.triggerAction(), 'a valid target and action were specified');
});