'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

QUnit.module('EmberView - context property');

QUnit.test('setting a controller on an inner view should change it context', function () {
  var App = {};
  var a = { name: 'a' };
  var b = { name: 'b' };

  var innerView = _emberViewsViewsView2['default'].create();
  var middleView = _emberViewsViewsContainer_view2['default'].create();
  var outerView = App.outerView = _emberViewsViewsContainer_view2['default'].create({
    controller: a
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    outerView.appendTo('#qunit-fixture');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    outerView.set('currentView', middleView);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    innerView.set('controller', b);
    middleView.set('currentView', innerView);
  });

  // assert
  equal(outerView.get('context'), a, 'outer context correct');
  equal(middleView.get('context'), a, 'middle context correct');
  equal(innerView.get('context'), b, 'inner context correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    innerView.destroy();
    middleView.destroy();
    outerView.destroy();
  });
});