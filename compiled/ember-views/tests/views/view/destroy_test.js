'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

QUnit.module('Ember.View#destroy');

QUnit.test('should teardown viewName on parentView when childView is destroyed', function () {
  var viewName = 'someChildView';
  var parentView = _emberViewsViewsView2['default'].create();
  var childView = parentView.createChildView(_emberViewsViewsView2['default'], { viewName: viewName });

  equal((0, _emberMetalProperty_get.get)(parentView, viewName), childView, 'Precond - child view was registered on parent');

  (0, _emberMetalRun_loop2['default'])(function () {
    childView.destroy();
  });

  equal((0, _emberMetalProperty_get.get)(parentView, viewName), null, 'viewName reference was removed on parent');

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.destroy();
  });
});