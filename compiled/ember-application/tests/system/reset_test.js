'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var application, Application;

QUnit.module('Ember.Application - resetting', {
  setup: function setup() {
    Application = _emberApplicationSystemApplication2['default'].extend({
      name: 'App',
      rootElement: '#qunit-fixture'
    });
  },
  teardown: function teardown() {
    Application = null;
    if (application) {
      (0, _emberMetalRun_loop2['default'])(application, 'destroy');
    }
  }
});

QUnit.test('Brings its own run-loop if not provided', function () {
  application = (0, _emberMetalRun_loop2['default'])(Application, 'create');
  application.ready = function () {
    QUnit.start();
    ok(true, 'app booted');
  };

  QUnit.stop();
  application.reset();
});

QUnit.test('does not bring its own run loop if one is already provided', function () {
  expect(3);

  var didBecomeReady = false;

  application = (0, _emberMetalRun_loop2['default'])(Application, 'create');

  (0, _emberMetalRun_loop2['default'])(function () {

    application.ready = function () {
      didBecomeReady = true;
    };

    application.reset();

    application.deferReadiness();
    ok(!didBecomeReady, 'app is not ready');
  });

  ok(!didBecomeReady, 'app is not ready');
  (0, _emberMetalRun_loop2['default'])(application, 'advanceReadiness');
  ok(didBecomeReady, 'app is ready');
});

QUnit.test('When an application is reset, new instances of controllers are generated', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    application = Application.create();
    application.AcademicController = _emberRuntimeControllersController2['default'].extend();
  });

  var firstController = application.__container__.lookup('controller:academic');
  var secondController = application.__container__.lookup('controller:academic');

  application.reset();

  var thirdController = application.__container__.lookup('controller:academic');

  strictEqual(firstController, secondController, 'controllers looked up in succession should be the same instance');

  ok(firstController.isDestroying, 'controllers are destroyed when their application is reset');

  notStrictEqual(firstController, thirdController, 'controllers looked up after the application is reset should not be the same instance');
});

QUnit.test('When an application is reset, the eventDispatcher is destroyed and recreated', function () {
  var eventDispatcherWasSetup, eventDispatcherWasDestroyed;

  eventDispatcherWasSetup = 0;
  eventDispatcherWasDestroyed = 0;

  var mock_event_dispatcher = {
    create: function create() {
      return {
        setup: function setup() {
          eventDispatcherWasSetup++;
        },
        destroy: function destroy() {
          eventDispatcherWasDestroyed++;
        }
      };
    }
  };

  // this is pretty awful. We should make this less Global-ly.
  var originalRegister = _containerRegistry2['default'].prototype.register;
  _containerRegistry2['default'].prototype.register = function (name, type, options) {
    if (name === 'event_dispatcher:main') {
      return mock_event_dispatcher;
    } else {
      return originalRegister.call(this, name, type, options);
    }
  };

  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      application = Application.create();

      equal(eventDispatcherWasSetup, 0);
      equal(eventDispatcherWasDestroyed, 0);
    });

    equal(eventDispatcherWasSetup, 1);
    equal(eventDispatcherWasDestroyed, 0);

    application.reset();

    equal(eventDispatcherWasDestroyed, 1);
    equal(eventDispatcherWasSetup, 2, 'setup called after reset');
  } catch (error) {
    _containerRegistry2['default'].prototype.register = originalRegister;
  }

  _containerRegistry2['default'].prototype.register = originalRegister;
});

QUnit.test('When an application is reset, the ApplicationView is torn down', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    application = Application.create();
    application.ApplicationView = _emberViewsViewsView2['default'].extend({
      elementId: 'application-view'
    });
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #application-view').length, 1, 'precond - the application view is rendered');

  var originalView = _emberViewsViewsView2['default'].views['application-view'];

  application.reset();

  var resettedView = _emberViewsViewsView2['default'].views['application-view'];

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #application-view').length, 1, 'the application view is rendered');

  notStrictEqual(originalView, resettedView, 'The view object has changed');
});

QUnit.test('When an application is reset, the router URL is reset to `/`', function () {
  var location, router;

  (0, _emberMetalRun_loop2['default'])(function () {
    application = Application.create();
    application.Router = _emberRoutingSystemRouter2['default'].extend({
      location: 'none'
    });

    application.Router.map(function () {
      this.route('one');
      this.route('two');
    });
  });

  router = application.__container__.lookup('router:main');

  location = router.get('location');

  (0, _emberMetalRun_loop2['default'])(function () {
    location.handleURL('/one');
  });

  application.reset();

  var applicationController = application.__container__.lookup('controller:application');
  router = application.__container__.lookup('router:main');
  location = router.get('location');

  equal(location.getURL(), '');

  equal((0, _emberMetalProperty_get.get)(applicationController, 'currentPath'), 'index');

  location = application.__container__.lookup('router:main').get('location');
  (0, _emberMetalRun_loop2['default'])(function () {
    location.handleURL('/one');
  });

  equal((0, _emberMetalProperty_get.get)(applicationController, 'currentPath'), 'one');
});

QUnit.test('When an application with advance/deferReadiness is reset, the app does correctly become ready after reset', function () {
  var readyCallCount;

  readyCallCount = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    application = Application.create({
      ready: function ready() {
        readyCallCount++;
      }
    });

    application.deferReadiness();
    equal(readyCallCount, 0, 'ready has not yet been called');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    application.advanceReadiness();
  });

  equal(readyCallCount, 1, 'ready was called once');

  application.reset();

  equal(readyCallCount, 2, 'ready was called twice');
});

QUnit.test('With ember-data like initializer and constant', function () {
  var readyCallCount;

  readyCallCount = 0;

  var DS = {
    Store: _emberRuntimeSystemObject2['default'].extend({
      init: function init() {
        if (!(0, _emberMetalProperty_get.get)(DS, 'defaultStore')) {
          (0, _emberMetalProperty_set.set)(DS, 'defaultStore', this);
        }

        this._super.apply(this, arguments);
      },
      willDestroy: function willDestroy() {
        if ((0, _emberMetalProperty_get.get)(DS, 'defaultStore') === this) {
          (0, _emberMetalProperty_set.set)(DS, 'defaultStore', null);
        }
      }
    })
  };

  Application.initializer({
    name: 'store',
    initialize: function initialize(registry, application) {
      registry.unregister('store:main');
      registry.register('store:main', application.Store);

      application.__container__.lookup('store:main');
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    application = Application.create();
    application.Store = DS.Store;
  });

  ok(DS.defaultStore, 'has defaultStore');

  application.reset();

  ok(DS.defaultStore, 'still has defaultStore');
  ok(application.__container__.lookup('store:main'), 'store is still present');
});

QUnit.test('Ensure that the hashchange event listener is removed', function () {
  var listeners;

  (0, _emberViewsSystemJquery2['default'])(window).off('hashchange'); // ensure that any previous listeners are cleared

  (0, _emberMetalRun_loop2['default'])(function () {
    application = Application.create();
  });

  listeners = _emberViewsSystemJquery2['default']._data((0, _emberViewsSystemJquery2['default'])(window)[0], 'events');
  equal(listeners['hashchange'].length, 1, 'hashchange event listener was setup');

  application.reset();

  listeners = _emberViewsSystemJquery2['default']._data((0, _emberViewsSystemJquery2['default'])(window)[0], 'events');
  equal(listeners['hashchange'].length, 1, 'hashchange event only exists once');
});