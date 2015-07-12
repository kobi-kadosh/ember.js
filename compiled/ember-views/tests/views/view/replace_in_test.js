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

var View, view;

QUnit.module('EmberView - replaceIn()', {
  setup: function setup() {
    View = _emberViewsViewsView2['default'].extend({});
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('should be added to the specified element when calling replaceIn()', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div>');

  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.replaceIn('#menu');
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#menu').children();
  ok(viewElem.length > 0, 'creates and replaces the view\'s element');
});

QUnit.test('raises an assert when a target does not exist in the DOM', function () {
  view = View.create();

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.replaceIn('made-up-target');
    });
  });
});

QUnit.test('should remove previous elements when calling replaceIn()', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('\n    <div id="menu">\n      <p id="child"></p>\n    </div>\n  ');

  view = View.create();

  var originalChild = (0, _emberViewsSystemJquery2['default'])('#child');
  ok(originalChild.length === 1, 'precond - target starts with child element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.replaceIn('#menu');
  });

  originalChild = (0, _emberViewsSystemJquery2['default'])('#child');
  ok(originalChild.length === 0, 'target\'s original child was removed');

  var newChild = (0, _emberViewsSystemJquery2['default'])('#menu').children();
  ok(newChild.length === 1, 'target has new child element');
});

QUnit.test('should move the view to the inDOM state after replacing', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div>');
  view = View.create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.replaceIn('#menu');
  });

  equal(view.currentState, view._states.inDOM, 'the view is in the inDOM state');
});

QUnit.module('EmberView - replaceIn() in a view hierarchy', {
  setup: function setup() {
    expectDeprecation('Setting `childViews` on a Container is deprecated.');

    View = _emberViewsViewsContainer_view2['default'].extend({
      childViews: ['child'],
      child: _emberViewsViewsView2['default'].extend({
        elementId: 'child'
      })
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('should be added to the specified element when calling replaceIn()', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div>');

  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.replaceIn('#menu');
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#menu #child');
  ok(viewElem.length > 0, 'creates and replaces the view\'s element');
});