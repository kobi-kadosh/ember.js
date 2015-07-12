'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var view;

QUnit.module('EmberView#destroyElement', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('if it has no element, does nothing', function () {
  var callCount = 0;
  view = _emberViewsViewsView2['default'].create({
    willDestroyElement: function willDestroyElement() {
      callCount++;
    }
  });

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - does NOT have element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroyElement();
  });

  equal(callCount, 0, 'did not invoke callback');
});

QUnit.test('if it has a element, calls willDestroyElement on receiver and child views then deletes the element', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  var parentCount = 0;
  var childCount = 0;

  view = _emberViewsViewsContainer_view2['default'].create({
    willDestroyElement: function willDestroyElement() {
      parentCount++;
    },
    childViews: [_emberViewsViewsContainer_view2['default'].extend({
      // no willDestroyElement here... make sure no errors are thrown
      childViews: [_emberViewsViewsView2['default'].extend({
        willDestroyElement: function willDestroyElement() {
          childCount++;
        }
      })]
    })]
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok((0, _emberMetalProperty_get.get)(view, 'element'), 'precond - view has element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroyElement();
  });

  equal(parentCount, 1, 'invoked destroy element on the parent');
  equal(childCount, 1, 'invoked destroy element on the child');
  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'view no longer has element');
  ok(!(0, _emberMetalProperty_get.get)((0, _emberMetalProperty_get.get)(view, 'childViews').objectAt(0), 'element'), 'child no longer has an element');
});

QUnit.test('returns receiver', function () {
  var ret;
  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
    ret = view.destroyElement();
  });

  equal(ret, view, 'returns receiver');
});

QUnit.test('removes element from parentNode if in DOM', function () {
  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  var parent = view.$().parent();

  ok((0, _emberMetalProperty_get.get)(view, 'element'), 'precond - has element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroyElement();
  });

  equal(view.$(), undefined, 'view has no selector');
  ok(!parent.find('#' + view.get('elementId')).length, 'element no longer in parent node');
});