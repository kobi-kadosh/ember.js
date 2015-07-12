/* global EmberDev */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalMixin2 = _interopRequireDefault(_emberMetalMixin);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var _emberMetalProperty_get = require('ember-metal/property_get');

QUnit.module('Controller event handling');

QUnit.test('Action can be handled by a function on actions object', function () {
  expect(1);
  var TestController = _emberRuntimeControllersController2['default'].extend({
    actions: {
      poke: function poke() {
        ok(true, 'poked');
      }
    }
  });
  var controller = TestController.create({});
  controller.send('poke');
});

// TODO: Can we support this?
// QUnit.test("Actions handlers can be configured to use another name", function() {
//   expect(1);
//   var TestController = Controller.extend({
//     actionsProperty: 'actionHandlers',
//     actionHandlers: {
//       poke: function() {
//         ok(true, 'poked');
//       }
//     }
//   });
//   var controller = TestController.create({});
//   controller.send("poke");
// });

QUnit.test('When `_actions` is provided, `actions` is left alone', function () {
  expect(2);
  var TestController = _emberRuntimeControllersController2['default'].extend({
    actions: ['foo', 'bar'],
    _actions: {
      poke: function poke() {
        ok(true, 'poked');
      }
    }
  });
  var controller = TestController.create({});
  controller.send('poke');
  equal('foo', controller.get('actions')[0], 'actions property is not untouched');
});

QUnit.test('Actions object doesn\'t shadow a proxied object\'s \'actions\' property', function () {
  expectDeprecation(_emberRuntimeControllersObject_controller.objectControllerDeprecation);

  var TestController = _emberRuntimeControllersObject_controller2['default'].extend({
    model: {
      actions: 'foo'
    },
    actions: {
      poke: function poke() {
        console.log('ouch');
      }
    }
  });
  var controller = TestController.create({});
  equal(controller.get('actions'), 'foo', 'doesn\'t shadow the content\'s actions property');
});

QUnit.test('A handled action can be bubbled to the target for continued processing', function () {
  expect(2);
  var TestController = _emberRuntimeControllersController2['default'].extend({
    actions: {
      poke: function poke() {
        ok(true, 'poked 1');
        return true;
      }
    }
  });

  var controller = TestController.create({
    target: _emberRuntimeControllersController2['default'].extend({
      actions: {
        poke: function poke() {
          ok(true, 'poked 2');
        }
      }
    }).create()
  });
  controller.send('poke');
});

QUnit.test('Action can be handled by a superclass\' actions object', function () {
  expect(4);

  var SuperController = _emberRuntimeControllersController2['default'].extend({
    actions: {
      foo: function foo() {
        ok(true, 'foo');
      },
      bar: function bar(msg) {
        equal(msg, 'HELLO');
      }
    }
  });

  var BarControllerMixin = _emberMetalMixin2['default'].create({
    actions: {
      bar: function bar(msg) {
        equal(msg, 'HELLO');
        this._super(msg);
      }
    }
  });

  var IndexController = SuperController.extend(BarControllerMixin, {
    actions: {
      baz: function baz() {
        ok(true, 'baz');
      }
    }
  });

  var controller = IndexController.create({});
  controller.send('foo');
  controller.send('bar', 'HELLO');
  controller.send('baz');
});

QUnit.module('Controller deprecations');

QUnit.module('Controller Content -> Model Alias');

QUnit.test('`model` is aliased as `content`', function () {
  expect(1);
  var controller = _emberRuntimeControllersController2['default'].extend({
    model: 'foo-bar'
  }).create();

  equal(controller.get('content'), 'foo-bar', 'content is an alias of model');
});

QUnit.test('`content` is moved to `model` when `model` is unset', function () {
  expect(2);
  var controller;

  ignoreDeprecation(function () {
    controller = _emberRuntimeControllersController2['default'].extend({
      content: 'foo-bar'
    }).create();
  });

  equal(controller.get('model'), 'foo-bar', 'model is set properly');
  equal(controller.get('content'), 'foo-bar', 'content is set properly');
});

QUnit.test('specifying `content` (without `model` specified) results in deprecation', function () {
  expect(1);
  var controller;

  expectDeprecation(function () {
    controller = _emberRuntimeControllersController2['default'].extend({
      content: 'foo-bar'
    }).create();
  }, 'Do not specify `content` on a Controller, use `model` instead.');
});

QUnit.test('specifying `content` (with `model` specified) does not result in deprecation', function () {
  expect(3);
  expectNoDeprecation();

  var controller = _emberRuntimeControllersController2['default'].extend({
    content: 'foo-bar',
    model: 'blammo'
  }).create();

  equal((0, _emberMetalProperty_get.get)(controller, 'content'), 'foo-bar');
  equal((0, _emberMetalProperty_get.get)(controller, 'model'), 'blammo');
});

QUnit.module('Controller injected properties');

if (!EmberDev.runningProdBuild) {
  QUnit.test('defining a controller on a non-controller should fail assertion', function () {
    expectAssertion(function () {
      var registry = new _emberRuntimeSystemContainer.Registry();
      var container = registry.container();

      var AnObject = _emberRuntimeSystemObject2['default'].extend({
        container: container,
        foo: _emberRuntimeInject2['default'].controller('bar')
      });

      registry.register('foo:main', AnObject);

      container.lookupFactory('foo:main');
    }, /Defining an injected controller property on a non-controller is not allowed./);
  });
}

QUnit.test('controllers can be injected into controllers', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:post', _emberRuntimeControllersController2['default'].extend({
    postsController: _emberRuntimeInject2['default'].controller('posts')
  }));

  registry.register('controller:posts', _emberRuntimeControllersController2['default'].extend());

  var postController = container.lookup('controller:post');
  var postsController = container.lookup('controller:posts');

  equal(postsController, postController.get('postsController'), 'controller.posts is injected');
});

QUnit.test('controllers can be injected into ObjectControllers', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:post', _emberRuntimeControllersController2['default'].extend({
    postsController: _emberRuntimeInject2['default'].controller('posts')
  }));

  registry.register('controller:posts', _emberRuntimeControllersObject_controller2['default'].extend());

  var postController = container.lookup('controller:post');
  var postsController;
  expectDeprecation(function () {
    postsController = container.lookup('controller:posts');
  }, _emberRuntimeControllersObject_controller.objectControllerDeprecation);

  equal(postsController, postController.get('postsController'), 'controller.posts is injected');
});

QUnit.test('controllers can be injected into ArrayControllers', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:post', _emberRuntimeControllersController2['default'].extend({
    postsController: _emberRuntimeInject2['default'].controller('posts')
  }));

  registry.register('controller:posts', _emberRuntimeControllersArray_controller2['default'].extend());

  var postController = container.lookup('controller:post');
  var postsController = container.lookup('controller:posts');

  equal(postsController, postController.get('postsController'), 'controller.posts is injected');
});

QUnit.test('services can be injected into controllers', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:application', _emberRuntimeControllersController2['default'].extend({
    authService: _emberRuntimeInject2['default'].service('auth')
  }));

  registry.register('service:auth', _emberRuntimeSystemService2['default'].extend());

  var appController = container.lookup('controller:application');
  var authService = container.lookup('service:auth');

  equal(authService, appController.get('authService'), 'service.auth is injected');
});