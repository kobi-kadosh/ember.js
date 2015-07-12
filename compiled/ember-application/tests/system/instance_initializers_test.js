'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberApplicationSystemApplicationInstance = require('ember-application/system/application-instance');

var _emberApplicationSystemApplicationInstance2 = _interopRequireDefault(_emberApplicationSystemApplicationInstance);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var app, initializeContextFeatureEnabled;

if ((0, _emberMetalFeatures2['default'])('ember-application-initializer-context')) {
  initializeContextFeatureEnabled = true;
}

if ((0, _emberMetalFeatures2['default'])('ember-application-instance-initializers')) {
  QUnit.module('Ember.Application instance initializers', {
    setup: function setup() {},

    teardown: function teardown() {
      if (app) {
        (0, _emberMetalRun_loop2['default'])(function () {
          app.destroy();
        });
      }
    }
  });

  QUnit.test('initializers require proper \'name\' and \'initialize\' properties', function () {
    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    expectAssertion(function () {
      (0, _emberMetalRun_loop2['default'])(function () {
        MyApplication.instanceInitializer({ name: 'initializer' });
      });
    });

    expectAssertion(function () {
      (0, _emberMetalRun_loop2['default'])(function () {
        MyApplication.instanceInitializer({ initialize: _emberMetalCore2['default'].K });
      });
    });
  });

  QUnit.test('initializers are passed an app instance', function () {
    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    MyApplication.instanceInitializer({
      name: 'initializer',
      initialize: function initialize(instance) {
        ok(instance instanceof _emberApplicationSystemApplicationInstance2['default'], 'initialize is passed an application instance');
      }
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      app = MyApplication.create({
        router: false,
        rootElement: '#qunit-fixture'
      });
    });
  });

  QUnit.test('initializers can be registered in a specified order', function () {
    var order = [];
    var MyApplication = _emberApplicationSystemApplication2['default'].extend();
    MyApplication.instanceInitializer({
      name: 'fourth',
      after: 'third',
      initialize: function initialize(registry) {
        order.push('fourth');
      }
    });

    MyApplication.instanceInitializer({
      name: 'second',
      after: 'first',
      before: 'third',
      initialize: function initialize(registry) {
        order.push('second');
      }
    });

    MyApplication.instanceInitializer({
      name: 'fifth',
      after: 'fourth',
      before: 'sixth',
      initialize: function initialize(registry) {
        order.push('fifth');
      }
    });

    MyApplication.instanceInitializer({
      name: 'first',
      before: 'second',
      initialize: function initialize(registry) {
        order.push('first');
      }
    });

    MyApplication.instanceInitializer({
      name: 'third',
      initialize: function initialize(registry) {
        order.push('third');
      }
    });

    MyApplication.instanceInitializer({
      name: 'sixth',
      initialize: function initialize(registry) {
        order.push('sixth');
      }
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      app = MyApplication.create({
        router: false,
        rootElement: '#qunit-fixture'
      });
    });

    deepEqual(order, ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']);
  });

  QUnit.test('initializers can be registered in a specified order as an array', function () {
    var order = [];
    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    MyApplication.instanceInitializer({
      name: 'third',
      initialize: function initialize(registry) {
        order.push('third');
      }
    });

    MyApplication.instanceInitializer({
      name: 'second',
      after: 'first',
      before: ['third', 'fourth'],
      initialize: function initialize(registry) {
        order.push('second');
      }
    });

    MyApplication.instanceInitializer({
      name: 'fourth',
      after: ['second', 'third'],
      initialize: function initialize(registry) {
        order.push('fourth');
      }
    });

    MyApplication.instanceInitializer({
      name: 'fifth',
      after: 'fourth',
      before: 'sixth',
      initialize: function initialize(registry) {
        order.push('fifth');
      }
    });

    MyApplication.instanceInitializer({
      name: 'first',
      before: ['second'],
      initialize: function initialize(registry) {
        order.push('first');
      }
    });

    MyApplication.instanceInitializer({
      name: 'sixth',
      initialize: function initialize(registry) {
        order.push('sixth');
      }
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      app = MyApplication.create({
        router: false,
        rootElement: '#qunit-fixture'
      });
    });

    deepEqual(order, ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']);
  });

  QUnit.test('initializers can have multiple dependencies', function () {
    var order = [];
    var a = {
      name: 'a',
      before: 'b',
      initialize: function initialize(registry) {
        order.push('a');
      }
    };
    var b = {
      name: 'b',
      initialize: function initialize(registry) {
        order.push('b');
      }
    };
    var c = {
      name: 'c',
      after: 'b',
      initialize: function initialize(registry) {
        order.push('c');
      }
    };
    var afterB = {
      name: 'after b',
      after: 'b',
      initialize: function initialize(registry) {
        order.push('after b');
      }
    };
    var afterC = {
      name: 'after c',
      after: 'c',
      initialize: function initialize(registry) {
        order.push('after c');
      }
    };

    _emberApplicationSystemApplication2['default'].instanceInitializer(b);
    _emberApplicationSystemApplication2['default'].instanceInitializer(a);
    _emberApplicationSystemApplication2['default'].instanceInitializer(afterC);
    _emberApplicationSystemApplication2['default'].instanceInitializer(afterB);
    _emberApplicationSystemApplication2['default'].instanceInitializer(c);

    (0, _emberMetalRun_loop2['default'])(function () {
      app = _emberApplicationSystemApplication2['default'].create({
        router: false,
        rootElement: '#qunit-fixture'
      });
    });

    ok(order.indexOf(a.name) < order.indexOf(b.name), 'a < b');
    ok(order.indexOf(b.name) < order.indexOf(c.name), 'b < c');
    ok(order.indexOf(b.name) < order.indexOf(afterB.name), 'b < afterB');
    ok(order.indexOf(c.name) < order.indexOf(afterC.name), 'c < afterC');
  });

  QUnit.test('initializers set on Application subclasses should not be shared between apps', function () {
    var firstInitializerRunCount = 0;
    var secondInitializerRunCount = 0;
    var FirstApp = _emberApplicationSystemApplication2['default'].extend();
    var firstApp, secondApp;

    FirstApp.instanceInitializer({
      name: 'first',
      initialize: function initialize(registry) {
        firstInitializerRunCount++;
      }
    });
    var SecondApp = _emberApplicationSystemApplication2['default'].extend();
    SecondApp.instanceInitializer({
      name: 'second',
      initialize: function initialize(registry) {
        secondInitializerRunCount++;
      }
    });
    (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="first"></div><div id="second"></div>');
    (0, _emberMetalRun_loop2['default'])(function () {
      firstApp = FirstApp.create({
        router: false,
        rootElement: '#qunit-fixture #first'
      });
    });
    equal(firstInitializerRunCount, 1, 'first initializer only was run');
    equal(secondInitializerRunCount, 0, 'first initializer only was run');
    (0, _emberMetalRun_loop2['default'])(function () {
      secondApp = SecondApp.create({
        router: false,
        rootElement: '#qunit-fixture #second'
      });
    });
    equal(firstInitializerRunCount, 1, 'second initializer only was run');
    equal(secondInitializerRunCount, 1, 'second initializer only was run');
    (0, _emberMetalRun_loop2['default'])(function () {
      firstApp.destroy();
      secondApp.destroy();
    });
  });

  QUnit.test('initializers are concatenated', function () {
    var firstInitializerRunCount = 0;
    var secondInitializerRunCount = 0;
    var FirstApp = _emberApplicationSystemApplication2['default'].extend();
    var firstApp, secondApp;

    FirstApp.instanceInitializer({
      name: 'first',
      initialize: function initialize(registry) {
        firstInitializerRunCount++;
      }
    });

    var SecondApp = FirstApp.extend();
    SecondApp.instanceInitializer({
      name: 'second',
      initialize: function initialize(registry) {
        secondInitializerRunCount++;
      }
    });

    (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="first"></div><div id="second"></div>');
    (0, _emberMetalRun_loop2['default'])(function () {
      firstApp = FirstApp.create({
        router: false,
        rootElement: '#qunit-fixture #first'
      });
    });
    equal(firstInitializerRunCount, 1, 'first initializer only was run when base class created');
    equal(secondInitializerRunCount, 0, 'first initializer only was run when base class created');
    firstInitializerRunCount = 0;
    (0, _emberMetalRun_loop2['default'])(function () {
      secondApp = SecondApp.create({
        router: false,
        rootElement: '#qunit-fixture #second'
      });
    });
    equal(firstInitializerRunCount, 1, 'first initializer was run when subclass created');
    equal(secondInitializerRunCount, 1, 'second initializers was run when subclass created');
    (0, _emberMetalRun_loop2['default'])(function () {
      firstApp.destroy();
      secondApp.destroy();
    });
  });

  QUnit.test('initializers are per-app', function () {
    expect(0);
    var FirstApp = _emberApplicationSystemApplication2['default'].extend();
    FirstApp.instanceInitializer({
      name: 'shouldNotCollide',
      initialize: function initialize(registry) {}
    });

    var SecondApp = _emberApplicationSystemApplication2['default'].extend();
    SecondApp.instanceInitializer({
      name: 'shouldNotCollide',
      initialize: function initialize(registry) {}
    });
  });

  QUnit.test('initializers are run before ready hook', function () {
    expect(2);

    var readyWasCalled = false;

    var MyApplication = _emberApplicationSystemApplication2['default'].extend({
      ready: function ready() {
        ok(true, 'ready is called');
        readyWasCalled = true;
      }
    });

    MyApplication.instanceInitializer({
      name: 'initializer',
      initialize: function initialize() {
        ok(!readyWasCalled, 'ready is not yet called');
      }
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      app = MyApplication.create({
        router: false,
        rootElement: '#qunit-fixture'
      });
    });
  });

  if (initializeContextFeatureEnabled) {
    QUnit.test('initializers should be executed in their own context', function () {
      expect(1);

      var MyApplication = _emberApplicationSystemApplication2['default'].extend();

      MyApplication.instanceInitializer({
        name: 'coolBabeInitializer',
        myProperty: 'coolBabe',
        initialize: function initialize(registry, application) {
          equal(this.myProperty, 'coolBabe', 'should have access to its own context');
        }
      });

      (0, _emberMetalRun_loop2['default'])(function () {
        app = MyApplication.create({
          router: false,
          rootElement: '#qunit-fixture'
        });
      });
    });
  }

  QUnit.test('Initializers get an instance on app reset', function () {
    expect(2);

    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    MyApplication.instanceInitializer({
      name: 'giveMeAnInstance',
      initialize: function initialize(instance) {
        ok(!!instance, 'Initializer got an instance');
      }
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      app = MyApplication.create({
        router: false,
        rootElement: '#qunit-fixture'
      });
    });

    (0, _emberMetalRun_loop2['default'])(app, 'reset');
  });
}