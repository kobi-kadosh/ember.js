/*globals EmberDev */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var parentView, view;

QUnit.module('Ember.View#element', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (parentView) {
        parentView.destroy();
      }
      view.destroy();
    });
  }
});

QUnit.test('returns null if the view has no element and no parent view', function () {
  view = _emberViewsViewsView2['default'].create();
  equal((0, _emberMetalProperty_get.get)(view, 'parentView'), null, 'precond - has no parentView');
  equal((0, _emberMetalProperty_get.get)(view, 'element'), null, 'has no element');
});

QUnit.test('returns null if the view has no element and parent view has no element', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  parentView = _emberViewsViewsContainer_view2['default'].create({
    childViews: [_emberViewsViewsView2['default'].extend()]
  });
  view = (0, _emberMetalProperty_get.get)(parentView, 'childViews').objectAt(0);

  equal((0, _emberMetalProperty_get.get)(view, 'parentView'), parentView, 'precond - has parent view');
  equal((0, _emberMetalProperty_get.get)(parentView, 'element'), null, 'parentView has no element');
  equal((0, _emberMetalProperty_get.get)(view, 'element'), null, ' has no element');
});

QUnit.test('returns element if you set the value', function () {
  view = _emberViewsViewsView2['default'].create();
  equal((0, _emberMetalProperty_get.get)(view, 'element'), null, 'precond- has no element');

  var dom = document.createElement('div');
  (0, _emberMetalProperty_set.set)(view, 'element', dom);

  equal((0, _emberMetalProperty_get.get)(view, 'element'), dom, 'now has set element');
});

if (EmberDev && !EmberDev.runningProdBuild) {
  QUnit.test('should not allow the elementId to be changed after inserted', function () {
    view = _emberViewsViewsView2['default'].create({
      elementId: 'one'
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      view.appendTo('#qunit-fixture');
    });

    throws(function () {
      view.set('elementId', 'two');
    }, 'raises elementId changed exception');

    equal(view.get('elementId'), 'one', 'elementId is still "one"');
  });
}