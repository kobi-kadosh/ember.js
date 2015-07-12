'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeExtRsvp = require('ember-runtime/ext/rsvp');

var _emberRuntimeExtRsvp2 = _interopRequireDefault(_emberRuntimeExtRsvp);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTestingTest = require('ember-testing/test');

var _emberTestingTest2 = _interopRequireDefault(_emberTestingTest);

require('ember-testing/helpers');

// ensure that the helpers are loaded

require('ember-testing/initializers');

// ensure the initializer is setup

var _emberTestingSetup_for_testing = require('ember-testing/setup_for_testing');

var _emberTestingSetup_for_testing2 = _interopRequireDefault(_emberTestingSetup_for_testing);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var App;
var originalAdapter = _emberTestingTest2['default'].adapter;

function cleanup() {
  // Teardown setupForTesting

  _emberTestingTest2['default'].adapter = originalAdapter;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberViewsSystemJquery2['default'])(document).off('ajaxSend');
    (0, _emberViewsSystemJquery2['default'])(document).off('ajaxComplete');
  });
  _emberTestingTest2['default'].pendingAjaxRequests = null;
  _emberTestingTest2['default'].waiters = null;

  // Other cleanup

  if (App) {
    (0, _emberMetalRun_loop2['default'])(App, App.destroy);
    App.removeTestHelpers();
    App = null;
  }

  _emberMetalCore2['default'].TEMPLATES = {};
}

function assertHelpers(application, helperContainer, expected) {
  if (!helperContainer) {
    helperContainer = window;
  }
  if (expected === undefined) {
    expected = true;
  }

  function checkHelperPresent(helper, expected) {
    var presentInHelperContainer = !!helperContainer[helper];
    var presentInTestHelpers = !!application.testHelpers[helper];

    ok(presentInHelperContainer === expected, 'Expected \'' + helper + '\' to be present in the helper container (defaults to window).');
    ok(presentInTestHelpers === expected, 'Expected \'' + helper + '\' to be present in App.testHelpers.');
  }

  checkHelperPresent('visit', expected);
  checkHelperPresent('click', expected);
  checkHelperPresent('keyEvent', expected);
  checkHelperPresent('fillIn', expected);
  checkHelperPresent('wait', expected);
  checkHelperPresent('triggerEvent', expected);

  if ((0, _emberMetalFeatures2['default'])('ember-testing-checkbox-helpers')) {
    checkHelperPresent('check', expected);
    checkHelperPresent('uncheck', expected);
  }
}

function assertNoHelpers(application, helperContainer) {
  assertHelpers(application, helperContainer, false);
}

function currentRouteName(app) {
  return app.testHelpers.currentRouteName();
}

function currentPath(app) {
  return app.testHelpers.currentPath();
}

function currentURL(app) {
  return app.testHelpers.currentURL();
}

function setupApp() {
  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();

    App.injectTestHelpers();
  });
}

QUnit.module('ember-testing: Helper setup', {
  setup: function setup() {
    cleanup();
  },
  teardown: function teardown() {
    cleanup();
  }
});

QUnit.test('Ember.Application#injectTestHelpers/#removeTestHelpers', function () {
  App = (0, _emberMetalRun_loop2['default'])(_emberApplicationSystemApplication2['default'], _emberApplicationSystemApplication2['default'].create);
  assertNoHelpers(App);

  App.injectTestHelpers();
  assertHelpers(App);

  App.removeTestHelpers();
  assertNoHelpers(App);
});

QUnit.test('Ember.Application#setupForTesting', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  equal(App.__container__.lookup('router:main').location, 'none');
});

QUnit.test('Ember.Application.setupForTesting sets the application to `testing`.', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  equal(App.testing, true, 'Application instance is set to testing.');
});

QUnit.test('Ember.Application.setupForTesting leaves the system in a deferred state.', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  equal(App._readinessDeferrals, 1, 'App is in deferred state after setupForTesting.');
});

QUnit.test('App.reset() after Application.setupForTesting leaves the system in a deferred state.', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  equal(App._readinessDeferrals, 1, 'App is in deferred state after setupForTesting.');

  App.reset();
  equal(App._readinessDeferrals, 1, 'App is in deferred state after setupForTesting.');
});

QUnit.test('Ember.Application#setupForTesting attaches ajax listeners', function () {
  var documentEvents;

  documentEvents = _emberViewsSystemJquery2['default']._data(document, 'events');

  if (!documentEvents) {
    documentEvents = {};
  }

  ok(documentEvents['ajaxSend'] === undefined, 'there are no ajaxSend listers setup prior to calling injectTestHelpers');
  ok(documentEvents['ajaxComplete'] === undefined, 'there are no ajaxComplete listers setup prior to calling injectTestHelpers');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberTestingSetup_for_testing2['default'])();
  });

  documentEvents = _emberViewsSystemJquery2['default']._data(document, 'events');

  equal(documentEvents['ajaxSend'].length, 1, 'calling injectTestHelpers registers an ajaxSend handler');
  equal(documentEvents['ajaxComplete'].length, 1, 'calling injectTestHelpers registers an ajaxComplete handler');
});

QUnit.test('Ember.Application#setupForTesting attaches ajax listeners only once', function () {
  var documentEvents;

  documentEvents = _emberViewsSystemJquery2['default']._data(document, 'events');

  if (!documentEvents) {
    documentEvents = {};
  }

  ok(documentEvents['ajaxSend'] === undefined, 'there are no ajaxSend listeners setup prior to calling injectTestHelpers');
  ok(documentEvents['ajaxComplete'] === undefined, 'there are no ajaxComplete listeners setup prior to calling injectTestHelpers');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberTestingSetup_for_testing2['default'])();
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberTestingSetup_for_testing2['default'])();
  });

  documentEvents = _emberViewsSystemJquery2['default']._data(document, 'events');

  equal(documentEvents['ajaxSend'].length, 1, 'calling injectTestHelpers registers an ajaxSend handler');
  equal(documentEvents['ajaxComplete'].length, 1, 'calling injectTestHelpers registers an ajaxComplete handler');
});

QUnit.test('Ember.Application#injectTestHelpers calls callbacks registered with onInjectHelpers', function () {
  var injected = 0;

  _emberTestingTest2['default'].onInjectHelpers(function () {
    injected++;
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  equal(injected, 0, 'onInjectHelpers are not called before injectTestHelpers');

  App.injectTestHelpers();

  equal(injected, 1, 'onInjectHelpers are called after injectTestHelpers');
});

QUnit.test('Ember.Application#injectTestHelpers adds helpers to provided object.', function () {
  var helpers = {};

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  App.injectTestHelpers(helpers);
  assertHelpers(App, helpers);

  App.removeTestHelpers();
  assertNoHelpers(App, helpers);
});

QUnit.test('Ember.Application#removeTestHelpers resets the helperContainer\'s original values', function () {
  var helpers = { visit: 'snazzleflabber' };

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  App.injectTestHelpers(helpers);

  ok(helpers.visit !== 'snazzleflabber', 'helper added to container');
  App.removeTestHelpers();

  ok(helpers.visit === 'snazzleflabber', 'original value added back to container');
});

QUnit.module('ember-testing: Helper methods', {
  setup: function setup() {
    setupApp();
  },
  teardown: function teardown() {
    cleanup();
  }
});

QUnit.test('`wait` respects registerWaiters', function () {
  expect(3);

  var counter = 0;
  function waiter() {
    return ++counter > 2;
  }

  var other = 0;
  function otherWaiter() {
    return ++other > 2;
  }

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);
  _emberTestingTest2['default'].registerWaiter(waiter);
  _emberTestingTest2['default'].registerWaiter(otherWaiter);

  App.testHelpers.wait().then(function () {
    equal(waiter(), true, 'should not resolve until our waiter is ready');
    _emberTestingTest2['default'].unregisterWaiter(waiter);
    equal(_emberTestingTest2['default'].waiters.length, 1, 'should not leave the waiter registered');
    other = 0;
    return App.testHelpers.wait();
  }).then(function () {
    equal(otherWaiter(), true, 'other waiter is still registered');
  });
});

QUnit.test('`visit` advances readiness.', function () {
  expect(2);

  equal(App._readinessDeferrals, 1, 'App is in deferred state after setupForTesting.');

  App.testHelpers.visit('/').then(function () {
    equal(App._readinessDeferrals, 0, 'App\'s readiness was advanced by visit.');
  });
});

QUnit.test('`wait` helper can be passed a resolution value', function () {
  expect(4);

  var promise, wait;

  promise = new _emberRuntimeExtRsvp2['default'].Promise(function (resolve) {
    (0, _emberMetalRun_loop2['default'])(null, resolve, 'promise');
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  wait = App.testHelpers.wait;

  wait('text').then(function (val) {
    equal(val, 'text', 'can resolve to a string');
    return wait(1);
  }).then(function (val) {
    equal(val, 1, 'can resolve to an integer');
    return wait({ age: 10 });
  }).then(function (val) {
    deepEqual(val, { age: 10 }, 'can resolve to an object');
    return wait(promise);
  }).then(function (val) {
    equal(val, 'promise', 'can resolve to a promise resolution value');
  });
});

QUnit.test('`click` triggers appropriate events in order', function () {
  expect(5);

  var click, wait, events;

  App.IndexView = _emberViewsViewsView2['default'].extend({
    classNames: 'index-view',

    didInsertElement: function didInsertElement() {
      this.$().on('mousedown focusin mouseup click', function (e) {
        events.push(e.type);
      });
    },

    Checkbox: _emberMetalCore2['default'].Checkbox.extend({
      click: function click() {
        events.push('click:' + this.get('checked'));
      },

      change: function change() {
        events.push('change:' + this.get('checked'));
      }
    })
  });

  _emberMetalCore2['default'].TEMPLATES.index = (0, _emberTemplateCompilerSystemCompile2['default'])('{{input type="text"}} {{view view.Checkbox}} {{textarea}} <div contenteditable="true"> </div>');

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  click = App.testHelpers.click;
  wait = App.testHelpers.wait;

  wait().then(function () {
    events = [];
    return click('.index-view');
  }).then(function () {
    deepEqual(events, ['mousedown', 'mouseup', 'click'], 'fires events in order');
  }).then(function () {
    events = [];
    return click('.index-view input[type=text]');
  }).then(function () {
    deepEqual(events, ['mousedown', 'focusin', 'mouseup', 'click'], 'fires focus events on inputs');
  }).then(function () {
    events = [];
    return click('.index-view textarea');
  }).then(function () {
    deepEqual(events, ['mousedown', 'focusin', 'mouseup', 'click'], 'fires focus events on textareas');
  }).then(function () {
    events = [];
    return click('.index-view div');
  }).then(function () {
    deepEqual(events, ['mousedown', 'focusin', 'mouseup', 'click'], 'fires focus events on contenteditable');
  }).then(function () {
    // In IE (< 8), the change event only fires when the value changes before element focused.
    (0, _emberViewsSystemJquery2['default'])('.index-view input[type=checkbox]').focus();
    events = [];
    return click('.index-view input[type=checkbox]');
  }).then(function () {
    // i.e. mousedown, mouseup, change:true, click, click:true
    // Firefox differs so we can't assert the exact ordering here.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=843554.
    equal(events.length, 5, 'fires click and change on checkboxes');
  });
});

QUnit.test('`wait` waits for outstanding timers', function () {
  expect(1);

  var wait_done = false;

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  _emberMetalRun_loop2['default'].later(this, function () {
    wait_done = true;
  }, 500);

  App.testHelpers.wait().then(function () {
    equal(wait_done, true, 'should wait for the timer to be fired.');
  });
});

QUnit.test('`wait` respects registerWaiters with optional context', function () {
  expect(3);

  var obj = {
    counter: 0,
    ready: function ready() {
      return ++this.counter > 2;
    }
  };

  var other = 0;
  function otherWaiter() {
    return ++other > 2;
  }

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);
  _emberTestingTest2['default'].registerWaiter(obj, obj.ready);
  _emberTestingTest2['default'].registerWaiter(otherWaiter);

  App.testHelpers.wait().then(function () {
    equal(obj.ready(), true, 'should not resolve until our waiter is ready');
    _emberTestingTest2['default'].unregisterWaiter(obj, obj.ready);
    equal(_emberTestingTest2['default'].waiters.length, 1, 'should not leave the waiter registered');
    return App.testHelpers.wait();
  }).then(function () {
    equal(otherWaiter(), true, 'other waiter should still be registered');
  });
});

QUnit.test('`wait` does not error if routing has not begun', function () {
  expect(1);

  App.testHelpers.wait().then(function () {
    ok(true, 'should not error without `visit`');
  });
});

QUnit.test('`triggerEvent accepts an optional options hash without context', function () {
  expect(3);

  var triggerEvent, wait, event;

  App.IndexView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{input type="text" id="scope" class="input"}}'),

    didInsertElement: function didInsertElement() {
      this.$('.input').on('blur change', function (e) {
        event = e;
      });
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  triggerEvent = App.testHelpers.triggerEvent;
  wait = App.testHelpers.wait;

  wait().then(function () {
    return triggerEvent('.input', 'blur', { keyCode: 13 });
  }).then(function () {
    equal(event.keyCode, 13, 'options were passed');
    equal(event.type, 'blur', 'correct event was triggered');
    equal(event.target.getAttribute('id'), 'scope', 'triggered on the correct element');
  });
});

QUnit.test('`triggerEvent can limit searching for a selector to a scope', function () {
  expect(2);

  var triggerEvent, wait, event;

  App.IndexView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{input type="text" id="outside-scope" class="input"}}<div id="limited">{{input type="text" id="inside-scope" class="input"}}</div>'),

    didInsertElement: function didInsertElement() {
      this.$('.input').on('blur change', function (e) {
        event = e;
      });
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  triggerEvent = App.testHelpers.triggerEvent;
  wait = App.testHelpers.wait;

  wait().then(function () {
    return triggerEvent('.input', '#limited', 'blur');
  }).then(function () {
    equal(event.type, 'blur', 'correct event was triggered');
    equal(event.target.getAttribute('id'), 'inside-scope', 'triggered on the correct element');
  });
});

QUnit.test('`triggerEvent` can be used to trigger arbitrary events', function () {
  expect(2);

  var triggerEvent, wait, event;

  App.IndexView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{input type="text" id="foo"}}'),

    didInsertElement: function didInsertElement() {
      this.$('#foo').on('blur change', function (e) {
        event = e;
      });
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  triggerEvent = App.testHelpers.triggerEvent;
  wait = App.testHelpers.wait;

  wait().then(function () {
    return triggerEvent('#foo', 'blur');
  }).then(function () {
    equal(event.type, 'blur', 'correct event was triggered');
    equal(event.target.getAttribute('id'), 'foo', 'triggered on the correct element');
  });
});

QUnit.test('`fillIn` takes context into consideration', function () {
  expect(2);
  var fillIn, find, visit, andThen;

  App.IndexView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="parent">{{input type="text" id="first" class="current"}}</div>{{input type="text" id="second" class="current"}}')
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  fillIn = App.testHelpers.fillIn;
  find = App.testHelpers.find;
  visit = App.testHelpers.visit;
  andThen = App.testHelpers.andThen;

  visit('/');
  fillIn('.current', '#parent', 'current value');
  andThen(function () {
    equal(find('#first').val(), 'current value');
    equal(find('#second').val(), '');
  });
});

QUnit.test('`fillIn` focuses on the element', function () {
  expect(2);
  var fillIn, find, visit, andThen;

  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    actions: {
      wasFocused: function wasFocused() {
        ok(true, 'focusIn event was triggered');
      }
    }
  });

  App.IndexView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="parent">{{input type="text" id="first" focus-in="wasFocused"}}</div>')
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  fillIn = App.testHelpers.fillIn;
  find = App.testHelpers.find;
  visit = App.testHelpers.visit;
  andThen = App.testHelpers.andThen;

  visit('/');
  fillIn('#first', 'current value');
  andThen(function () {
    equal(find('#first').val(), 'current value');
  });
});

if ((0, _emberMetalFeatures2['default'])('ember-testing-checkbox-helpers')) {
  QUnit.test('`check` ensures checkboxes are `checked` state for checkboxes', function () {
    expect(2);
    var check, find, visit, andThen;

    App.IndexView = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input type="checkbox" id="unchecked"><input type="checkbox" id="checked" checked>')
    });

    (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

    check = App.testHelpers.check;
    find = App.testHelpers.find;
    visit = App.testHelpers.visit;
    andThen = App.testHelpers.andThen;

    visit('/');
    check('#unchecked');
    check('#checked');
    andThen(function () {
      equal(find('#unchecked').is(':checked'), true, 'can check an unchecked checkbox');
      equal(find('#checked').is(':checked'), true, 'can check a checked checkbox');
    });
  });

  QUnit.test('`uncheck` ensures checkboxes are not `checked`', function () {
    expect(2);
    var uncheck, find, visit, andThen;

    App.IndexView = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input type="checkbox" id="unchecked"><input type="checkbox" id="checked" checked>')
    });

    (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

    uncheck = App.testHelpers.uncheck;
    find = App.testHelpers.find;
    visit = App.testHelpers.visit;
    andThen = App.testHelpers.andThen;

    visit('/');
    uncheck('#unchecked');
    uncheck('#checked');
    andThen(function () {
      equal(find('#unchecked').is(':checked'), false, 'can uncheck an unchecked checkbox');
      equal(find('#checked').is(':checked'), false, 'can uncheck a checked checkbox');
    });
  });

  QUnit.test('`check` asserts the selected inputs are checkboxes', function () {
    var check, visit;

    App.IndexView = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input type="text" id="text">')
    });

    (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

    check = App.testHelpers.check;
    visit = App.testHelpers.visit;

    visit('/').then(function () {
      check('#text')['catch'](function (error) {
        ok(/must be a checkbox/.test(error.message));
      });
    });
  });

  QUnit.test('`uncheck` asserts the selected inputs are checkboxes', function () {
    var visit, uncheck;

    App.IndexView = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input type="text" id="text">')
    });

    (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

    visit = App.testHelpers.visit;
    uncheck = App.testHelpers.uncheck;

    visit('/').then(function () {
      uncheck('#text')['catch'](function (error) {
        ok(/must be a checkbox/.test(error.message));
      });
    });
  });
}

QUnit.test('`triggerEvent accepts an optional options hash and context', function () {
  expect(3);

  var triggerEvent, wait, event;

  App.IndexView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{input type="text" id="outside-scope" class="input"}}<div id="limited">{{input type="text" id="inside-scope" class="input"}}</div>'),

    didInsertElement: function didInsertElement() {
      this.$('.input').on('blur change', function (e) {
        event = e;
      });
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, App.advanceReadiness);

  triggerEvent = App.testHelpers.triggerEvent;
  wait = App.testHelpers.wait;

  wait().then(function () {
    return triggerEvent('.input', '#limited', 'blur', { keyCode: 13 });
  }).then(function () {
    equal(event.keyCode, 13, 'options were passed');
    equal(event.type, 'blur', 'correct event was triggered');
    equal(event.target.getAttribute('id'), 'inside-scope', 'triggered on the correct element');
  });
});

QUnit.module('ember-testing debugging helpers', {
  setup: function setup() {
    setupApp();

    (0, _emberMetalRun_loop2['default'])(function () {
      App.Router = _emberRoutingSystemRouter2['default'].extend({
        location: 'none'
      });
    });

    (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  },

  teardown: function teardown() {
    cleanup();
  }
});

QUnit.test('pauseTest pauses', function () {
  expect(1);
  function fakeAdapterAsyncStart() {
    ok(true, 'Async start should be called');
  }

  _emberTestingTest2['default'].adapter.asyncStart = fakeAdapterAsyncStart;

  App.testHelpers.pauseTest();
});

QUnit.module('ember-testing routing helpers', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create();
      App.setupForTesting();

      App.injectTestHelpers();

      App.Router = _emberRoutingSystemRouter2['default'].extend({
        location: 'none'
      });

      App.Router.map(function () {
        this.route('posts', { resetNamespace: true }, function () {
          this.route('new');
        });
      });
    });

    (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  },

  teardown: function teardown() {
    cleanup();
  }
});

QUnit.test('currentRouteName for \'/\'', function () {
  expect(3);

  App.testHelpers.visit('/').then(function () {
    equal(App.testHelpers.currentRouteName(), 'index', 'should equal \'index\'.');
    equal(App.testHelpers.currentPath(), 'index', 'should equal \'index\'.');
    equal(App.testHelpers.currentURL(), '/', 'should equal \'/\'.');
  });
});

QUnit.test('currentRouteName for \'/posts\'', function () {
  expect(3);

  App.testHelpers.visit('/posts').then(function () {
    equal(App.testHelpers.currentRouteName(), 'posts.index', 'should equal \'posts.index\'.');
    equal(App.testHelpers.currentPath(), 'posts.index', 'should equal \'posts.index\'.');
    equal(App.testHelpers.currentURL(), '/posts', 'should equal \'/posts\'.');
  });
});

QUnit.test('currentRouteName for \'/posts/new\'', function () {
  expect(3);

  App.testHelpers.visit('/posts/new').then(function () {
    equal(App.testHelpers.currentRouteName(), 'posts.new', 'should equal \'posts.new\'.');
    equal(App.testHelpers.currentPath(), 'posts.new', 'should equal \'posts.new\'.');
    equal(App.testHelpers.currentURL(), '/posts/new', 'should equal \'/posts/new\'.');
  });
});

QUnit.module('ember-testing pendingAjaxRequests', {
  setup: function setup() {
    setupApp();
  },

  teardown: function teardown() {
    cleanup();
  }
});

QUnit.test('pendingAjaxRequests is maintained for ajaxSend and ajaxComplete events', function () {
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 0);
  var xhr = { some: 'xhr' };
  (0, _emberViewsSystemJquery2['default'])(document).trigger('ajaxSend', xhr);
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 1, 'Ember.Test.pendingAjaxRequests was incremented');
  (0, _emberViewsSystemJquery2['default'])(document).trigger('ajaxComplete', xhr);
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 0, 'Ember.Test.pendingAjaxRequests was decremented');
});

QUnit.test('pendingAjaxRequests is ignores ajaxComplete events from past setupForTesting calls', function () {
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 0);
  var xhr = { some: 'xhr' };
  (0, _emberViewsSystemJquery2['default'])(document).trigger('ajaxSend', xhr);
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 1, 'Ember.Test.pendingAjaxRequests was incremented');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberTestingSetup_for_testing2['default'])();
  });
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 0, 'Ember.Test.pendingAjaxRequests was reset');

  var altXhr = { some: 'more xhr' };
  (0, _emberViewsSystemJquery2['default'])(document).trigger('ajaxSend', altXhr);
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 1, 'Ember.Test.pendingAjaxRequests was incremented');
  (0, _emberViewsSystemJquery2['default'])(document).trigger('ajaxComplete', xhr);
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 1, 'Ember.Test.pendingAjaxRequests is not impressed with your unexpected complete');
});

QUnit.test('pendingAjaxRequests is reset by setupForTesting', function () {
  _emberTestingTest2['default'].pendingAjaxRequests = 1;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberTestingSetup_for_testing2['default'])();
  });
  equal(_emberTestingTest2['default'].pendingAjaxRequests, 0, 'pendingAjaxRequests is reset');
});

QUnit.module('ember-testing async router', {
  setup: function setup() {
    cleanup();

    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create();
      App.Router = _emberRoutingSystemRouter2['default'].extend({
        location: 'none'
      });

      App.Router.map(function () {
        this.route('user', { resetNamespace: true }, function () {
          this.route('profile');
          this.route('edit');
        });
      });

      App.UserRoute = _emberRoutingSystemRoute2['default'].extend({
        model: function model() {
          return resolveLater();
        }
      });

      App.UserProfileRoute = _emberRoutingSystemRoute2['default'].extend({
        beforeModel: function beforeModel() {
          var self = this;
          return resolveLater().then(function () {
            self.transitionTo('user.edit');
          });
        }
      });

      // Emulates a long-running unscheduled async operation.
      function resolveLater() {
        var promise;

        (0, _emberMetalRun_loop2['default'])(function () {
          promise = new _emberRuntimeExtRsvp2['default'].Promise(function (resolve) {
            // The wait() helper has a 10ms tick. We should resolve() after at least one tick
            // to test whether wait() held off while the async router was still loading. 20ms
            // should be enough.
            setTimeout(function () {
              (0, _emberMetalRun_loop2['default'])(function () {
                resolve(_emberRuntimeSystemObject2['default'].create({ firstName: 'Tom' }));
              });
            }, 20);
          });
        });

        return promise;
      }

      App.setupForTesting();
    });

    App.injectTestHelpers();
    (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  },

  teardown: function teardown() {
    cleanup();
  }
});

QUnit.test('currentRouteName for \'/user\'', function () {
  expect(4);

  App.testHelpers.visit('/user').then(function () {
    equal(currentRouteName(App), 'user.index', 'should equal \'user.index\'.');
    equal(currentPath(App), 'user.index', 'should equal \'user.index\'.');
    equal(currentURL(App), '/user', 'should equal \'/user\'.');
    equal(App.__container__.lookup('route:user').get('controller.model.firstName'), 'Tom', 'should equal \'Tom\'.');
  });
});

QUnit.test('currentRouteName for \'/user/profile\'', function () {
  expect(4);

  App.testHelpers.visit('/user/profile').then(function () {
    equal(currentRouteName(App), 'user.edit', 'should equal \'user.edit\'.');
    equal(currentPath(App), 'user.edit', 'should equal \'user.edit\'.');
    equal(currentURL(App), '/user/edit', 'should equal \'/user/edit\'.');
    equal(App.__container__.lookup('route:user').get('controller.model.firstName'), 'Tom', 'should equal \'Tom\'.');
  });
});

var originalVisitHelper, originalFindHelper, originalWaitHelper;

QUnit.module('can override built-in helpers', {
  setup: function setup() {
    originalVisitHelper = _emberTestingTest2['default']._helpers.visit;
    originalFindHelper = _emberTestingTest2['default']._helpers.find;
    originalWaitHelper = _emberTestingTest2['default']._helpers.wait;

    (0, _emberViewsSystemJquery2['default'])('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
    (0, _emberViewsSystemJquery2['default'])('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberMetalCore2['default'].Application.create({
        rootElement: '#ember-testing'
      });

      App.setupForTesting();
    });
  },

  teardown: function teardown() {
    App.removeTestHelpers();
    (0, _emberViewsSystemJquery2['default'])('#ember-testing-container, #ember-testing').remove();
    (0, _emberMetalRun_loop2['default'])(App, App.destroy);
    App = null;

    _emberTestingTest2['default']._helpers.visit = originalVisitHelper;
    _emberTestingTest2['default']._helpers.find = originalFindHelper;
    _emberTestingTest2['default']._helpers.wait = originalWaitHelper;
  }
});

QUnit.test('can override visit helper', function () {
  expect(1);

  _emberTestingTest2['default'].registerHelper('visit', function () {
    ok(true, 'custom visit helper was called');
  });

  App.injectTestHelpers();
  App.testHelpers.visit();
});

QUnit.test('can override find helper', function () {
  expect(1);

  _emberTestingTest2['default'].registerHelper('find', function () {
    ok(true, 'custom find helper was called');

    return ['not empty array'];
  });

  App.injectTestHelpers();
  App.testHelpers.findWithAssert('.who-cares');
});