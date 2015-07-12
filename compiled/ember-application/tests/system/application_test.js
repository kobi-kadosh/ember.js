/*globals EmberDev */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberApplicationSystemResolver = require('ember-application/system/resolver');

var _emberApplicationSystemResolver2 = _interopRequireDefault(_emberApplicationSystemResolver);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRoutingLocationNone_location = require('ember-routing/location/none_location');

var _emberRoutingLocationNone_location2 = _interopRequireDefault(_emberRoutingLocationNone_location);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var trim = _emberViewsSystemJquery2['default'].trim;

var app, application, originalLookup, originalDebug;

QUnit.module('Ember.Application', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    originalDebug = _emberMetalCore2['default'].debug;

    (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id=\'one\'><div id=\'one-child\'>HI</div></div><div id=\'two\'>HI</div>');
    (0, _emberMetalRun_loop2['default'])(function () {
      application = _emberApplicationSystemApplication2['default'].create({ rootElement: '#one', router: null });
    });
  },

  teardown: function teardown() {
    (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').empty();
    _emberMetalCore2['default'].debug = originalDebug;

    _emberMetalCore2['default'].lookup = originalLookup;

    if (application) {
      (0, _emberMetalRun_loop2['default'])(application, 'destroy');
    }

    if (app) {
      (0, _emberMetalRun_loop2['default'])(app, 'destroy');
    }
  }
});

QUnit.test('you can make a new application in a non-overlapping element', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({ rootElement: '#two', router: null });
  });

  (0, _emberMetalRun_loop2['default'])(app, 'destroy');
  ok(true, 'should not raise');
});

QUnit.test('you cannot make a new application that is a parent of an existing application', function () {
  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      _emberApplicationSystemApplication2['default'].create({ rootElement: '#qunit-fixture' });
    });
  });
});

QUnit.test('you cannot make a new application that is a descendent of an existing application', function () {
  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      _emberApplicationSystemApplication2['default'].create({ rootElement: '#one-child' });
    });
  });
});

QUnit.test('you cannot make a new application that is a duplicate of an existing application', function () {
  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      _emberApplicationSystemApplication2['default'].create({ rootElement: '#one' });
    });
  });
});

QUnit.test('you cannot make two default applications without a rootElement error', function () {
  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      _emberApplicationSystemApplication2['default'].create({ router: false });
    });
  });
});

QUnit.test('acts like a namespace', function () {
  var lookup = _emberMetalCore2['default'].lookup = {};

  (0, _emberMetalRun_loop2['default'])(function () {
    app = lookup.TestApp = _emberApplicationSystemApplication2['default'].create({ rootElement: '#two', router: false });
  });

  _emberMetalCore2['default'].BOOTED = false;
  app.Foo = _emberRuntimeSystemObject2['default'].extend();
  equal(app.Foo.toString(), 'TestApp.Foo', 'Classes pick up their parent namespace');
});

QUnit.module('Ember.Application initialization', {
  teardown: function teardown() {
    if (app) {
      (0, _emberMetalRun_loop2['default'])(app, 'destroy');
    }
    _emberMetalCore2['default'].TEMPLATES = {};
  }
});

QUnit.test('initialized application go to initial route', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    app.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}'));

    _emberMetalCore2['default'].TEMPLATES.index = (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Hi from index</h1>');
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture h1').text(), 'Hi from index');
});

QUnit.test('ready hook is called before routing begins', function () {
  expect(2);

  (0, _emberMetalRun_loop2['default'])(function () {
    function registerRoute(application, name, callback) {
      var route = _emberRoutingSystemRoute2['default'].extend({
        activate: callback
      });

      application.register('route:' + name, route);
    }

    var MyApplication = _emberApplicationSystemApplication2['default'].extend({
      ready: function ready() {
        registerRoute(this, 'index', function () {
          ok(true, 'last-minite route is activated');
        });
      }
    });

    app = MyApplication.create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    registerRoute(app, 'application', function () {
      ok(true, 'normal route is activated');
    });
  });
});

QUnit.test('initialize application via initialize call', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    app.ApplicationView = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Hello!</h1>')
    });
  });

  // This is not a public way to access the container; we just
  // need to make some assertions about the created router
  var router = app.__container__.lookup('router:main');
  equal(router instanceof _emberRoutingSystemRouter2['default'], true, 'Router was set from initialize call');
  equal(router.location instanceof _emberRoutingLocationNone_location2['default'], true, 'Location was set from location implementation name');
});

QUnit.test('initialize application with stateManager via initialize call from Router class', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    app.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Hello!</h1>'));
  });

  var router = app.__container__.lookup('router:main');
  equal(router instanceof _emberRoutingSystemRouter2['default'], true, 'Router was set from initialize call');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture h1').text(), 'Hello!');
});

QUnit.test('ApplicationView is inserted into the page', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });

    app.ApplicationView = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Hello!</h1>')
    });

    app.ApplicationController = _emberRuntimeControllersController2['default'].extend();

    app.Router.reopen({
      location: 'none'
    });
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture h1').text(), 'Hello!');
});

QUnit.test('Minimal Application initialized with just an application template', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars">Hello World</script>');
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });
  });

  equal(trim((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text()), 'Hello World');
});

QUnit.test('enable log of libraries with an ENV var', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  var debug = _emberMetalCore2['default'].debug;
  var messages = [];

  _emberMetalCore2['default'].LOG_VERSION = true;

  _emberMetalCore2['default'].debug = function (message) {
    messages.push(message);
  };

  _emberMetalCore2['default'].libraries.register('my-lib', '2.0.0a');

  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });
  });

  equal(messages[1], 'Ember  : ' + _emberMetalCore2['default'].VERSION);
  equal(messages[2], 'jQuery : ' + (0, _emberViewsSystemJquery2['default'])().jquery);
  equal(messages[3], 'my-lib : ' + '2.0.0a');

  _emberMetalCore2['default'].libraries.deRegister('my-lib');
  _emberMetalCore2['default'].LOG_VERSION = false;
  _emberMetalCore2['default'].debug = debug;
});

QUnit.test('disable log version of libraries with an ENV var', function () {
  var logged = false;

  _emberMetalCore2['default'].LOG_VERSION = false;

  _emberMetalCore2['default'].debug = function (message) {
    logged = true;
  };

  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').empty();

  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });
  });

  ok(!logged, 'library version logging skipped');
});

QUnit.test('can resolve custom router', function () {
  var CustomRouter = _emberRoutingSystemRouter2['default'].extend();

  var CustomResolver = _emberApplicationSystemResolver2['default'].extend({
    resolveMain: function resolveMain(parsedName) {
      if (parsedName.type === 'router') {
        return CustomRouter;
      } else {
        return this._super(parsedName);
      }
    }
  });

  app = (0, _emberMetalRun_loop2['default'])(function () {
    return _emberApplicationSystemApplication2['default'].create({
      Resolver: CustomResolver
    });
  });

  ok(app.__container__.lookup('router:main') instanceof CustomRouter, 'application resolved the correct router');
});

QUnit.test('can specify custom router', function () {
  var CustomRouter = _emberRoutingSystemRouter2['default'].extend();

  app = (0, _emberMetalRun_loop2['default'])(function () {
    return _emberApplicationSystemApplication2['default'].create({
      Router: CustomRouter
    });
  });

  ok(app.__container__.lookup('router:main') instanceof CustomRouter, 'application resolved the correct router');
});

QUnit.test('throws helpful error if `app.then` is used', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });
  });

  expectDeprecation(function () {
    (0, _emberMetalRun_loop2['default'])(app, 'then', function () {
      return this;
    });
  }, /Do not use `.then` on an instance of Ember.Application.  Please use the `.ready` hook instead./);
});

QUnit.test('registers controls onto to container', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    app = _emberApplicationSystemApplication2['default'].create({
      rootElement: '#qunit-fixture'
    });
  });

  ok(app.__container__.lookup('view:select'), 'Select control is registered into views');
});