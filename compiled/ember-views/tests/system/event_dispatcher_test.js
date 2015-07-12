'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;
var dispatcher;

QUnit.module('EventDispatcher', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
      dispatcher.setup();
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
      dispatcher.destroy();
    });
  }
});

QUnit.test('should dispatch events to views', function () {
  var receivedEvent;
  var parentMouseDownCalled = 0;
  var childKeyDownCalled = 0;
  var parentKeyDownCalled = 0;

  var childView = _emberViewsViewsView2['default'].extend({
    keyDown: function keyDown(evt) {
      childKeyDownCalled++;

      return false;
    }
  }).create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<span id="wot">ewot</span>')
  });

  view = _emberViewsViewsView2['default'].extend({
    mouseDown: function mouseDown(evt) {
      parentMouseDownCalled++;
      receivedEvent = evt;
    },

    keyDown: function keyDown(evt) {
      parentKeyDownCalled++;
    }
  }).create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('some <span id="awesome">awesome</span> content {{view view.childView}}'),
    childView: childView
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  view.$().trigger('mousedown');

  ok(receivedEvent, 'passes event to associated event method');
  receivedEvent = null;
  parentMouseDownCalled = 0;

  view.$('span#awesome').trigger('mousedown');
  ok(receivedEvent, 'event bubbles up to nearest View');
  equal(parentMouseDownCalled, 1, 'does not trigger the parent handlers twice because of browser bubbling');
  receivedEvent = null;

  (0, _emberViewsSystemJquery2['default'])('#wot').trigger('mousedown');
  ok(receivedEvent, 'event bubbles up to nearest View');

  (0, _emberViewsSystemJquery2['default'])('#wot').trigger('keydown');
  equal(childKeyDownCalled, 1, 'calls keyDown on child view');
  equal(parentKeyDownCalled, 0, 'does not call keyDown on parent if child handles event');
});

QUnit.test('should not dispatch events to views not inDOM', function () {
  var receivedEvent;

  view = _emberViewsViewsView2['default'].extend({
    mouseDown: function mouseDown(evt) {
      receivedEvent = evt;
    }
  }).create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('some <span id="awesome">awesome</span> content')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  var $element = view.$();

  (0, _emberMetalRun_loop2['default'])(function () {
    // TODO change this test not to use private API
    // Force into preRender
    view.renderer.remove(view, false, true);
  });

  $element.trigger('mousedown');

  ok(!receivedEvent, 'does not pass event to associated event method');
  receivedEvent = null;

  $element.find('span#awesome').trigger('mousedown');
  ok(!receivedEvent, 'event does not bubble up to nearest View');
  receivedEvent = null;

  // Cleanup
  $element.remove();
});

QUnit.test('should send change events up view hierarchy if view contains form elements', function () {
  var receivedEvent;
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input id="is-done" type="checkbox">'),

    change: function change(evt) {
      receivedEvent = evt;
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  (0, _emberViewsSystemJquery2['default'])('#is-done').trigger('change');
  ok(receivedEvent, 'calls change method when a child element is changed');
  equal(receivedEvent.target, (0, _emberViewsSystemJquery2['default'])('#is-done')[0], 'target property is the element that was clicked');
});

QUnit.test('events should stop propagating if the view is destroyed', function () {
  var parentViewReceived, receivedEvent;

  var parentView = _emberViewsViewsContainer_view2['default'].create({
    change: function change(evt) {
      parentViewReceived = true;
    }
  });

  view = parentView.createChildView(_emberViewsViewsView2['default'], {
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input id="is-done" type="checkbox">'),

    change: function change(evt) {
      receivedEvent = true;
      var self = this;
      (0, _emberMetalRun_loop2['default'])(function () {
        (0, _emberMetalProperty_get.get)(self, 'parentView').destroy();
      });
    }
  });

  parentView.pushObject(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.append();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#is-done').length, 'precond - view is in the DOM');
  (0, _emberViewsSystemJquery2['default'])('#is-done').trigger('change');
  ok(!(0, _emberViewsSystemJquery2['default'])('#is-done').length, 'precond - view is not in the DOM');
  ok(receivedEvent, 'calls change method when a child element is changed');
  ok(!parentViewReceived, 'parent view does not receive the event');
});

QUnit.test('should dispatch events to nearest event manager', function () {
  var receivedEvent = 0;
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input id="is-done" type="checkbox">'),

    eventManager: _emberRuntimeSystemObject2['default'].create({
      mouseDown: function mouseDown() {
        receivedEvent++;
      }
    }),

    mouseDown: function mouseDown() {}
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  (0, _emberViewsSystemJquery2['default'])('#is-done').trigger('mousedown');
  equal(receivedEvent, 1, 'event should go to manager and not view');
});

QUnit.test('event manager should be able to re-dispatch events to view', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  var receivedEvent = 0;
  view = _emberViewsViewsContainer_view2['default'].extend({

    eventManager: _emberRuntimeSystemObject2['default'].extend({
      mouseDown: function mouseDown(evt, view) {
        // Re-dispatch event when you get it.
        //
        // The second parameter tells the dispatcher
        // that this event has been handled. This
        // API will clearly need to be reworked since
        // multiple eventManagers in a single view
        // hierarchy would break, but it shows that
        // re-dispatching works
        view.$().trigger('mousedown', this);
      }
    }).create(),

    child: _emberViewsViewsView2['default'].extend({
      elementId: 'nestedView',

      mouseDown: function mouseDown(evt) {
        receivedEvent++;
      }
    }),

    mouseDown: function mouseDown(evt) {
      receivedEvent++;
    }
  }).create({
    elementId: 'containerView',
    childViews: ['child']
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  (0, _emberViewsSystemJquery2['default'])('#nestedView').trigger('mousedown');
  equal(receivedEvent, 2, 'event should go to manager and not view');
});

QUnit.test('event handlers should be wrapped in a run loop', function () {
  expect(1);

  view = _emberViewsViewsView2['default'].extend({
    eventManager: _emberRuntimeSystemObject2['default'].extend({
      mouseDown: function mouseDown() {
        ok(_emberMetalRun_loop2['default'].currentRunLoop, 'a run loop should have started');
      }
    }).create()
  }).create({
    elementId: 'test-view'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  (0, _emberViewsSystemJquery2['default'])('#test-view').trigger('mousedown');
});

QUnit.module('EventDispatcher#setup', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create({
        rootElement: '#qunit-fixture'
      });
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
      dispatcher.destroy();
    });
  }
});

QUnit.test('additional events which should be listened on can be passed', function () {
  expect(1);

  (0, _emberMetalRun_loop2['default'])(function () {
    dispatcher.setup({ myevent: 'myEvent' });

    view = _emberViewsViewsView2['default'].create({
      elementId: 'leView',
      myEvent: function myEvent() {
        ok(true, 'custom event has been triggered');
      }
    }).appendTo(dispatcher.get('rootElement'));
  });

  (0, _emberViewsSystemJquery2['default'])('#leView').trigger('myevent');
});

QUnit.test('additional events and rootElement can be specified', function () {
  expect(3);

  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').append('<div class=\'custom-root\'></div>');

  (0, _emberMetalRun_loop2['default'])(function () {
    dispatcher.setup({ myevent: 'myEvent' }, '.custom-root');

    view = _emberViewsViewsView2['default'].create({
      elementId: 'leView',
      myEvent: function myEvent() {
        ok(true, 'custom event has been triggered');
      }
    }).appendTo(dispatcher.get('rootElement'));
  });

  ok((0, _emberViewsSystemJquery2['default'])('.custom-root').hasClass('ember-application'), 'the custom rootElement is used');
  equal(dispatcher.get('rootElement'), '.custom-root', 'the rootElement is updated');

  (0, _emberViewsSystemJquery2['default'])('#leView').trigger('myevent');
});