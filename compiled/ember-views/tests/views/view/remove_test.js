'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

// .......................................................
// removeChild()
//

var parentView, child;
QUnit.module('View#removeChild', {
  setup: function setup() {
    expectDeprecation('Setting `childViews` on a Container is deprecated.');

    parentView = _emberViewsViewsContainer_view2['default'].create({ childViews: [_emberViewsViewsView2['default']] });
    child = (0, _emberMetalProperty_get.get)(parentView, 'childViews').objectAt(0);
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      parentView.destroy();
      child.destroy();
    });
  }
});

QUnit.test('returns receiver', function () {
  equal(parentView.removeChild(child), parentView, 'receiver');
});

QUnit.test('removes child from parent.childViews array', function () {
  ok((0, _emberMetalProperty_get.get)(parentView, 'childViews').indexOf(child) >= 0, 'precond - has child in childViews array before remove');
  parentView.removeChild(child);
  ok((0, _emberMetalProperty_get.get)(parentView, 'childViews').indexOf(child) < 0, 'removed child');
});

QUnit.test('sets parentView property to null', function () {
  ok((0, _emberMetalProperty_get.get)(child, 'parentView'), 'precond - has parentView');
  parentView.removeChild(child);
  ok(!(0, _emberMetalProperty_get.get)(child, 'parentView'), 'parentView is now null');
});

// .......................................................
// removeAllChildren()
//
var view, childViews;
QUnit.module('View#removeAllChildren', {
  setup: function setup() {
    expectDeprecation('Setting `childViews` on a Container is deprecated.');

    view = _emberViewsViewsContainer_view2['default'].create({
      childViews: [_emberViewsViewsView2['default'], _emberViewsViewsView2['default'], _emberViewsViewsView2['default']]
    });
    childViews = view.get('childViews');
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      childViews.forEach(function (v) {
        v.destroy();
      });
      view.destroy();
    });
  }
});

QUnit.test('removes all child views', function () {
  equal((0, _emberMetalProperty_get.get)(view, 'childViews.length'), 3, 'precond - has child views');

  view.removeAllChildren();
  equal((0, _emberMetalProperty_get.get)(view, 'childViews.length'), 0, 'removed all children');
});

QUnit.test('returns receiver', function () {
  equal(view.removeAllChildren(), view, 'receiver');
});

// .......................................................
// removeFromParent()
//
QUnit.module('View#removeFromParent', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (parentView) {
        parentView.destroy();
      }
      if (child) {
        child.destroy();
      }
      if (view) {
        view.destroy();
      }
    });
  }
});

QUnit.test('removes view from parent view', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  parentView = _emberViewsViewsContainer_view2['default'].create({ childViews: [_emberViewsViewsView2['default']] });
  child = (0, _emberMetalProperty_get.get)(parentView, 'childViews').objectAt(0);
  ok((0, _emberMetalProperty_get.get)(child, 'parentView'), 'precond - has parentView');

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.createElement();
  });

  ok(parentView.$('div').length, 'precond - has a child DOM element');

  (0, _emberMetalRun_loop2['default'])(function () {
    child.removeFromParent();
  });

  ok(!(0, _emberMetalProperty_get.get)(child, 'parentView'), 'no longer has parentView');
  ok((0, _emberMetalProperty_get.get)(parentView, 'childViews').indexOf(child) < 0, 'no longer in parent childViews');
  equal(parentView.$('div').length, 0, 'removes DOM element from parent');
});

QUnit.test('returns receiver', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  parentView = _emberViewsViewsContainer_view2['default'].create({ childViews: [_emberViewsViewsView2['default']] });
  child = (0, _emberMetalProperty_get.get)(parentView, 'childViews').objectAt(0);
  var removed = (0, _emberMetalRun_loop2['default'])(function () {
    return child.removeFromParent();
  });

  equal(removed, child, 'receiver');
});

QUnit.test('does nothing if not in parentView', function () {
  child = _emberViewsViewsView2['default'].create();

  // monkey patch for testing...
  ok(!(0, _emberMetalProperty_get.get)(child, 'parentView'), 'precond - has no parent');

  child.removeFromParent();

  (0, _emberMetalRun_loop2['default'])(function () {
    child.destroy();
  });
});

QUnit.test('the DOM element is gone after doing append and remove in two separate runloops', function () {
  view = _emberViewsViewsView2['default'].create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId'));
  ok(viewElem.length === 0, 'view\'s element doesn\'t exist in DOM');
});

QUnit.test('the DOM element is gone after doing append and remove in a single runloop', function () {
  view = _emberViewsViewsView2['default'].create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
    view.remove();
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId'));
  ok(viewElem.length === 0, 'view\'s element doesn\'t exist in DOM');
});