'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalWatching = require('ember-metal/watching');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view;

QUnit.module('EmberView - Class Name Bindings', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('should apply bound class names to the element', function () {
  view = _emberViewsViewsView2['default'].create({
    classNameBindings: ['priority', 'isUrgent', 'isClassified:classified', 'canIgnore', 'messages.count', 'messages.resent:is-resent', 'isNumber:is-number', 'isFalsy::is-falsy', 'isTruthy::is-not-truthy', 'isEnabled:enabled:disabled'],

    priority: 'high',
    isUrgent: true,
    isClassified: true,
    canIgnore: false,
    isNumber: 5,
    isFalsy: 0,
    isTruthy: 'abc',
    isEnabled: true,

    messages: {
      count: 'five-messages',
      resent: true
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$().hasClass('high'), 'adds string values as class name');
  ok(view.$().hasClass('is-urgent'), 'adds true Boolean values by dasherizing');
  ok(view.$().hasClass('classified'), 'supports customizing class name for Boolean values');
  ok(view.$().hasClass('five-messages'), 'supports paths in bindings');
  ok(view.$().hasClass('is-resent'), 'supports customing class name for paths');
  ok(view.$().hasClass('is-number'), 'supports colon syntax with truthy properties');
  ok(view.$().hasClass('is-falsy'), 'supports colon syntax with falsy properties');
  ok(!view.$().hasClass('abc'), 'does not add values as classes when falsy classes have been specified');
  ok(!view.$().hasClass('is-not-truthy'), 'does not add falsy classes when values are truthy');
  ok(!view.$().hasClass('can-ignore'), 'does not add false Boolean values as class');
  ok(view.$().hasClass('enabled'), 'supports customizing class name for Boolean values with negation');
  ok(!view.$().hasClass('disabled'), 'does not add class name for negated binding');
});

QUnit.test('should add, remove, or change class names if changed after element is created', function () {
  view = _emberViewsViewsView2['default'].create({
    classNameBindings: ['priority', 'isUrgent', 'isClassified:classified', 'canIgnore', 'messages.count', 'messages.resent:is-resent', 'isEnabled:enabled:disabled'],

    priority: 'high',
    isUrgent: true,
    isClassified: true,
    canIgnore: false,
    isEnabled: true,

    messages: _emberRuntimeSystemObject2['default'].create({
      count: 'five-messages',
      resent: false
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
    (0, _emberMetalProperty_set.set)(view, 'priority', 'orange');
    (0, _emberMetalProperty_set.set)(view, 'isUrgent', false);
    (0, _emberMetalProperty_set.set)(view, 'canIgnore', true);
    (0, _emberMetalProperty_set.set)(view, 'isEnabled', false);
    (0, _emberMetalProperty_set.set)(view, 'messages.count', 'six-messages');
    (0, _emberMetalProperty_set.set)(view, 'messages.resent', true);
  });

  ok(view.$().hasClass('orange'), 'updates string values');
  ok(!view.$().hasClass('high'), 'removes old string value');

  ok(!view.$().hasClass('is-urgent', 'removes dasherized class when changed from true to false'));
  ok(view.$().hasClass('can-ignore'), 'adds dasherized class when changed from false to true');

  ok(view.$().hasClass('six-messages'), 'adds new value when path changes');
  ok(!view.$().hasClass('five-messages'), 'removes old value when path changes');

  ok(view.$().hasClass('is-resent'), 'adds customized class name when path changes');

  ok(!view.$().hasClass('enabled'), 'updates class name for negated binding');
  ok(view.$().hasClass('disabled'), 'adds negated class name for negated binding');
});

QUnit.test(':: class name syntax works with an empty true class', function () {
  view = _emberViewsViewsView2['default'].create({
    isEnabled: false,
    classNameBindings: ['isEnabled::not-enabled']
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('class'), 'ember-view not-enabled', 'false class is rendered when property is false');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isEnabled', true);
  });

  equal(view.$().attr('class'), 'ember-view', 'no class is added when property is true and the class is empty');
});

QUnit.test('uses all provided static class names (issue #11193)', function () {
  view = _emberViewsViewsView2['default'].create({
    classNameBindings: [':class-one', ':class-two']
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('class'), 'ember-view class-one class-two', 'both classes are added');
});

QUnit.test('classNames should not be duplicated on rerender', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      classNameBindings: ['priority'],
      priority: 'high'
    });
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('class'), 'ember-view high');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal(view.$().attr('class'), 'ember-view high');
});

QUnit.test('classNameBindings should work when the binding property is updated and the view has been removed of the DOM', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      classNameBindings: ['priority'],
      priority: 'high'
    });
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('class'), 'ember-view high', 'has the high class');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('priority', 'low');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(view.$().attr('class'), 'ember-view low', 'has a low class');
});

QUnit.test('classNames removed by a classNameBindings observer should not re-appear on rerender', function () {
  view = _emberViewsViewsView2['default'].create({
    classNameBindings: ['isUrgent'],
    isUrgent: true
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('class'), 'ember-view is-urgent');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isUrgent', false);
  });

  equal(view.$().attr('class'), 'ember-view');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal(view.$().attr('class'), 'ember-view');
});

QUnit.skip('classNameBindings lifecycle test', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      classNameBindings: ['priority'],
      priority: 'high'
    });
  });

  equal((0, _emberMetalWatching.isWatching)(view, 'priority'), false);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('class'), 'ember-view high');
  equal((0, _emberMetalWatching.isWatching)(view, 'priority'), true);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
    view.set('priority', 'low');
  });

  equal((0, _emberMetalWatching.isWatching)(view, 'priority'), false);
});

QUnit.test('classNameBindings should not fail if view has been removed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      classNameBindings: ['priority'],
      priority: 'high'
    });
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  var error;
  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_events.changeProperties)(function () {
        view.set('priority', 'low');
        view.remove();
      });
    });
  } catch (e) {
    error = e;
  }
  ok(!error, error);
});

QUnit.test('classNameBindings should not fail if view has been destroyed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      classNameBindings: ['priority'],
      priority: 'high'
    });
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  var error;
  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_events.changeProperties)(function () {
        view.set('priority', 'low');
        view.destroy();
      });
    });
  } catch (e) {
    error = e;
  }
  ok(!error, error);
});

QUnit.test('Providing a binding with a space in it asserts', function () {
  view = _emberViewsViewsView2['default'].create({
    classNameBindings: 'i:think:i am:so:clever'
  });

  expectAssertion(function () {
    view.createElement();
  }, /classNameBindings must not have spaces in them/i);

  // Remove render node to avoid "Render node exists without concomitant env"
  // assertion on teardown.
  view._renderNode = null;
});