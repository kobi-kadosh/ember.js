'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// A

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberRoutingSystemController_for = require('ember-routing/system/controller_for');

var _emberRoutingSystemController_for2 = _interopRequireDefault(_emberRoutingSystemController_for);

var _emberRoutingSystemGenerate_controller = require('ember-routing/system/generate_controller');

var _emberRoutingSystemGenerate_controller2 = _interopRequireDefault(_emberRoutingSystemGenerate_controller);

var buildContainer = function buildContainer(namespace) {
  var registry = new _containerRegistry2['default']();
  var container = registry.container();

  registry.set = _emberMetalProperty_set.set;
  registry.resolver = resolverFor(namespace);
  registry.optionsForType('view', { singleton: false });

  registry.register('application:main', namespace, { instantiate: false });

  registry.register('controller:basic', _emberRuntimeControllersController2['default'], { instantiate: false });
  registry.register('controller:object', _emberRuntimeControllersObject_controller2['default'], { instantiate: false });
  registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'], { instantiate: false });

  return container;
};

function resolverFor(namespace) {
  return function (fullName) {
    var nameParts = fullName.split(':');
    var type = nameParts[0];
    var name = nameParts[1];

    if (name === 'basic') {
      name = '';
    }
    var className = (0, _emberRuntimeSystemString.classify)(name) + (0, _emberRuntimeSystemString.classify)(type);
    var factory = (0, _emberMetalProperty_get.get)(namespace, className);

    if (factory) {
      return factory;
    }
  };
}

var container, appController, namespace;

QUnit.module('Ember.controllerFor', {
  setup: function setup() {
    namespace = _emberRuntimeSystemNamespace2['default'].create();
    container = buildContainer(namespace);
    container._registry.register('controller:app', _emberRuntimeControllersController2['default'].extend());
    appController = container.lookup('controller:app');
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      container.destroy();
      namespace.destroy();
    });
  }
});

QUnit.test('controllerFor should lookup for registered controllers', function () {
  var controller = (0, _emberRoutingSystemController_for2['default'])(container, 'app');

  equal(appController, controller, 'should find app controller');
});

QUnit.module('Ember.generateController', {
  setup: function setup() {
    namespace = _emberRuntimeSystemNamespace2['default'].create();
    container = buildContainer(namespace);
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      container.destroy();
      namespace.destroy();
    });
  }
});

QUnit.test('generateController and generateControllerFactory are properties on the root namespace', function () {
  equal(_emberMetalCore2['default'].generateController, _emberRoutingSystemGenerate_controller2['default'], 'should export generateController');
  equal(_emberMetalCore2['default'].generateControllerFactory, _emberRoutingSystemGenerate_controller.generateControllerFactory, 'should export generateControllerFactory');
});

QUnit.test('generateController should create Ember.Controller', function () {
  var controller = (0, _emberRoutingSystemGenerate_controller2['default'])(container, 'home');

  ok(controller instanceof _emberRuntimeControllersController2['default'], 'should create controller');
});

QUnit.test('generateController should create Ember.ObjectController [DEPRECATED]', function () {
  var context = {};
  var controller = (0, _emberRoutingSystemGenerate_controller2['default'])(container, 'home', context);

  ok(controller instanceof _emberRuntimeControllersObject_controller2['default'], 'should create controller');
});

QUnit.test('generateController should create Ember.ArrayController', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var context = _emberMetalCore2['default'].A();
  var controller = (0, _emberRoutingSystemGenerate_controller2['default'])(container, 'home', context);

  ok(controller instanceof _emberRuntimeControllersArray_controller2['default'], 'should create controller');
});

QUnit.test('generateController should create App.Controller if provided', function () {
  var controller;
  namespace.Controller = _emberRuntimeControllersController2['default'].extend();

  controller = (0, _emberRoutingSystemGenerate_controller2['default'])(container, 'home');

  ok(controller instanceof namespace.Controller, 'should create controller');
});

QUnit.test('generateController should create App.ObjectController if provided', function () {
  var context = {};
  var controller;
  namespace.ObjectController = _emberRuntimeControllersObject_controller2['default'].extend();

  controller = (0, _emberRoutingSystemGenerate_controller2['default'])(container, 'home', context);

  ok(controller instanceof namespace.ObjectController, 'should create controller');
});

QUnit.test('generateController should create App.ArrayController if provided', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var context = _emberMetalCore2['default'].A();
  var controller;
  namespace.ArrayController = _emberRuntimeControllersArray_controller2['default'].extend();

  controller = (0, _emberRoutingSystemGenerate_controller2['default'])(container, 'home', context);

  ok(controller instanceof namespace.ArrayController, 'should create controller');
});