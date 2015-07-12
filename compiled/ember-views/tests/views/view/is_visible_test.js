'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var View, view, parentBecameVisible, childBecameVisible, grandchildBecameVisible;
var parentBecameHidden, childBecameHidden, grandchildBecameHidden;
var warnings, originalWarn;

QUnit.module('EmberView#isVisible', {
  setup: function setup() {
    warnings = [];
    originalWarn = _emberMetalCore2['default'].warn;
    _emberMetalCore2['default'].warn = function (message, test) {
      if (!test) {
        warnings.push(message);
      }
    };
  },

  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
    }
  }
});

QUnit.test('should hide views when isVisible is false', function () {
  view = _emberViewsViewsView2['default'].create({
    isVisible: false
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':hidden'), 'the view is hidden');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'isVisible', true);
  });

  ok(view.$().is(':visible'), 'the view is visible');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  deepEqual(warnings, [], 'no warnings were triggered');
});

QUnit.test('should hide element if isVisible is false before element is created', function () {
  view = _emberViewsViewsView2['default'].create({
    isVisible: false
  });

  ok(!(0, _emberMetalProperty_get.get)(view, 'isVisible'), 'precond - view is not visible');

  (0, _emberMetalProperty_set.set)(view, 'template', function () {
    return 'foo';
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':hidden'), 'should be hidden');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'isVisible', true);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':visible'), 'view should be visible');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  deepEqual(warnings, [], 'no warnings were triggered');
});

QUnit.test('should hide views when isVisible is a CP returning false', function () {
  view = _emberViewsViewsView2['default'].extend({
    isVisible: (0, _emberMetalComputed.computed)(function () {
      return false;
    })
  }).create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':hidden'), 'the view is hidden');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'isVisible', true);
  });

  ok(view.$().is(':visible'), 'the view is visible');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  deepEqual(warnings, [], 'no warnings were triggered');
});

QUnit.test('doesn\'t overwrite existing style attribute bindings', function () {
  view = _emberViewsViewsView2['default'].create({
    isVisible: false,
    attributeBindings: ['style'],
    style: 'color: blue;'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(view.$().attr('style'), 'color: blue; display: none;', 'has concatenated style attribute');
});

QUnit.module('EmberView#isVisible with Container', {
  setup: function setup() {
    expectDeprecation('Setting `childViews` on a Container is deprecated.');

    parentBecameVisible = 0;
    childBecameVisible = 0;
    grandchildBecameVisible = 0;
    parentBecameHidden = 0;
    childBecameHidden = 0;
    grandchildBecameHidden = 0;

    View = _emberViewsViewsContainer_view2['default'].extend({
      childViews: ['child'],
      becameVisible: function becameVisible() {
        parentBecameVisible++;
      },
      becameHidden: function becameHidden() {
        parentBecameHidden++;
      },

      child: _emberViewsViewsContainer_view2['default'].extend({
        childViews: ['grandchild'],
        becameVisible: function becameVisible() {
          childBecameVisible++;
        },
        becameHidden: function becameHidden() {
          childBecameHidden++;
        },

        grandchild: _emberViewsViewsView2['default'].extend({
          template: function template() {
            return 'seems weird bro';
          },
          becameVisible: function becameVisible() {
            grandchildBecameVisible++;
          },
          becameHidden: function becameHidden() {
            grandchildBecameHidden++;
          }
        })
      })
    });
  },

  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
    }
  }
});

QUnit.test('view should be notified after isVisible is set to false and the element has been hidden', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = View.create({ isVisible: false });
    view.append();
  });

  ok(view.$().is(':hidden'), 'precond - view is hidden when appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isVisible', true);
  });

  ok(view.$().is(':visible'), 'precond - view is now visible');
  equal(parentBecameVisible, 1);
  equal(childBecameVisible, 1);
  equal(grandchildBecameVisible, 1);
});

QUnit.test('view should be notified after isVisible is set to false and the element has been hidden', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = View.create({ isVisible: false });
    view.append();
  });

  ok(view.$().is(':hidden'), 'precond - view is hidden when appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isVisible', true);
  });

  ok(view.$().is(':visible'), 'precond - view is now visible');
  equal(parentBecameVisible, 1);
  equal(childBecameVisible, 1);
  equal(grandchildBecameVisible, 1);
});

QUnit.test('view should be notified after isVisible is set to false and the element has been hidden', function () {
  view = View.create({ isVisible: true });
  //var childView = view.get('childViews').objectAt(0);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':visible'), 'precond - view is visible when appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isVisible', false);
  });

  ok(view.$().is(':hidden'), 'precond - view is now hidden');
});

QUnit.test('view should be notified after isVisible is set to true and the element has been shown', function () {
  view = View.create({ isVisible: false });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':hidden'), 'precond - view is hidden when appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isVisible', true);
  });

  ok(view.$().is(':visible'), 'precond - view is now visible');

  equal(parentBecameVisible, 1);
  equal(childBecameVisible, 1);
  equal(grandchildBecameVisible, 1);
});

QUnit.test('if a view descends from a hidden view, making isVisible true should not trigger becameVisible', function () {
  view = View.create({ isVisible: true });
  var childView = view.get('childViews').objectAt(0);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':visible'), 'precond - view is visible when appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    childView.set('isVisible', false);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isVisible', false);
  });

  childBecameVisible = 0;
  grandchildBecameVisible = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    childView.set('isVisible', true);
  });

  equal(childBecameVisible, 0, 'the child did not become visible');
  equal(grandchildBecameVisible, 0, 'the grandchild did not become visible');
});

QUnit.test('if a child view becomes visible while its parent is hidden, if its parent later becomes visible, it receives a becameVisible callback', function () {
  view = View.create({ isVisible: false });
  var childView = view.get('childViews').objectAt(0);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().is(':hidden'), 'precond - view is hidden when appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    childView.set('isVisible', true);
  });

  equal(childBecameVisible, 0, 'child did not become visible since parent is hidden');
  equal(grandchildBecameVisible, 0, 'grandchild did not become visible since parent is hidden');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isVisible', true);
  });

  equal(parentBecameVisible, 1);
  equal(childBecameVisible, 1);
  equal(grandchildBecameVisible, 1);
});