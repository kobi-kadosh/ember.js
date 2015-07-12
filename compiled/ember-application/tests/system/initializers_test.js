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

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var app;

QUnit.module('Ember.Application initializers', {
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
      MyApplication.initializer({ name: 'initializer' });
    });
  });

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      MyApplication.initializer({ initialize: _emberMetalCore2['default'].K });
    });
  });
});

QUnit.test('initializers are passed a registry and App', function () {
  var MyApplication = _emberApplicationSystemApplication2['default'].extend();

  MyApplication.initializer({
    name: 'initializer',
    initialize: function initialize(registry, App) {
      ok(registry instanceof _containerRegistry2['default'], 'initialize is passed a registry');
      ok(App instanceof _emberApplicationSystemApplication2['default'], 'initialize is passed an Application');
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
  MyApplication.initializer({
    name: 'fourth',
    after: 'third',
    initialize: function initialize(registry) {
      order.push('fourth');
    }
  });

  MyApplication.initializer({
    name: 'second',
    after: 'first',
    before: 'third',
    initialize: function initialize(registry) {
      order.push('second');
    }
  });

  MyApplication.initializer({
    name: 'fifth',
    after: 'fourth',
    before: 'sixth',
    initialize: function initialize(registry) {
      order.push('fifth');
    }
  });

  MyApplication.initializer({
    name: 'first',
    before: 'second',
    initialize: function initialize(registry) {
      order.push('first');
    }
  });

  MyApplication.initializer({
    name: 'third',
    initialize: function initialize(registry) {
      order.push('third');
    }
  });

  MyApplication.initializer({
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

  MyApplication.initializer({
    name: 'third',
    initialize: function initialize(registry) {
      order.push('third');
    }
  });

  MyApplication.initializer({
    name: 'second',
    after: 'first',
    before: ['third', 'fourth'],
    initialize: function initialize(registry) {
      order.push('second');
    }
  });

  MyApplication.initializer({
    name: 'fourth',
    after: ['second', 'third'],
    initialize: function initialize(registry) {
      order.push('fourth');
    }
  });

  MyApplication.initializer({
    name: 'fifth',
    after: 'fourth',
    before: 'sixth',
    initialize: function initialize(registry) {
      order.push('fifth');
    }
  });

  MyApplication.initializer({
    name: 'first',
    before: ['second'],
    initialize: function initialize(registry) {
      order.push('first');
    }
  });

  MyApplication.initializer({
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

  _emberApplicationSystemApplication2['default'].initializer(b);
  _emberApplicationSystemApplication2['default'].initializer(a);
  _emberApplicationSystemApplication2['default'].initializer(afterC);
  _emberApplicationSystemApplication2['default'].initializer(afterB);
  _emberApplicationSystemApplication2['default'].initializer(c);

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
  FirstApp.initializer({
    name: 'first',
    initialize: function initialize(registry) {
      firstInitializerRunCount++;
    }
  });
  var SecondApp = _emberApplicationSystemApplication2['default'].extend();
  SecondApp.initializer({
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
  FirstApp.initializer({
    name: 'first',
    initialize: function initialize(registry) {
      firstInitializerRunCount++;
    }
  });

  var SecondApp = FirstApp.extend();
  SecondApp.initializer({
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
  FirstApp.initializer({
    name: 'shouldNotCollide',
    initialize: function initialize(registry) {}
  });

  var SecondApp = _emberApplicationSystemApplication2['default'].extend();
  SecondApp.initializer({
    name: 'shouldNotCollide',
    initialize: function initialize(registry) {}
  });
});

if ((0, _emberMetalFeatures2['default'])('ember-application-initializer-context')) {
  QUnit.test('initializers should be executed in their own context', function () {
    expect(1);
    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    MyApplication.initializer({
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

if ((0, _emberMetalFeatures2['default'])('ember-application-instance-initializers')) {
  QUnit.test('initializers should throw a deprecation warning when performing a lookup on the registry', function () {
    expect(1);

    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    MyApplication.initializer({
      name: 'initializer',
      initialize: function initialize(registry, application) {
        registry.lookup('router:main');
      }
    });

    expectDeprecation(function () {
      (0, _emberMetalRun_loop2['default'])(function () {
        app = MyApplication.create({
          router: false,
          rootElement: '#qunit-fixture'
        });
      });
    }, /`lookup` was called on a Registry\. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container\./);
  });

  QUnit.test('initializers should throw a deprecation warning when performing a factory lookup on the registry', function () {
    expect(1);

    var MyApplication = _emberApplicationSystemApplication2['default'].extend();

    MyApplication.initializer({
      name: 'initializer',
      initialize: function initialize(registry, application) {
        registry.lookupFactory('application:controller');
      }
    });

    expectDeprecation(function () {
      (0, _emberMetalRun_loop2['default'])(function () {
        app = MyApplication.create({
          router: false,
          rootElement: '#qunit-fixture'
        });
      });
    }, /`lookupFactory` was called on a Registry\. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container\./);
  });
}