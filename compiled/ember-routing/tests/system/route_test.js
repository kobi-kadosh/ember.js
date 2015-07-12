'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var route, routeOne, routeTwo, lookupHash;

function setup() {
  route = _emberRoutingSystemRoute2['default'].create();
}

function teardown() {
  (0, _emberRuntimeTestsUtils.runDestroy)(route);
}

QUnit.module('Ember.Route', {
  setup: setup,
  teardown: teardown
});

QUnit.test('default store utilizes the container to acquire the model factory', function () {
  expect(4);

  var Post = _emberRuntimeSystemObject2['default'].extend();
  var post = {};

  Post.reopenClass({
    find: function find(id) {
      return post;
    }
  });

  route.container = {
    has: function has() {
      return true;
    },

    lookupFactory: function lookupFactory(fullName) {
      equal(fullName, 'model:post', 'correct factory was looked up');

      return Post;
    }
  };

  route.set('_qp', null);

  equal(route.model({ post_id: 1 }), post);
  equal(route.findModel('post', 1), post, '#findModel returns the correct post');
});

QUnit.test('\'store\' can be injected by data persistence frameworks', function () {
  expect(8);
  (0, _emberRuntimeTestsUtils.runDestroy)(route);

  var registry = new _containerRegistry2['default']();
  var container = registry.container();
  var post = {
    id: 1
  };

  var Store = _emberRuntimeSystemObject2['default'].extend({
    find: function find(type, value) {
      ok(true, 'injected model was called');
      equal(type, 'post', 'correct type was called');
      equal(value, 1, 'correct value was called');
      return post;
    }
  });

  registry.register('route:index', _emberRoutingSystemRoute2['default']);
  registry.register('store:main', Store);

  registry.injection('route', 'store', 'store:main');

  route = container.lookup('route:index');

  equal(route.model({ post_id: 1 }), post, '#model returns the correct post');
  equal(route.findModel('post', 1), post, '#findModel returns the correct post');
});

QUnit.test('assert if \'store.find\' method is not found', function () {
  expect(1);
  (0, _emberRuntimeTestsUtils.runDestroy)(route);

  var registry = new _containerRegistry2['default']();
  var container = registry.container();
  var Post = _emberRuntimeSystemObject2['default'].extend();

  registry.register('route:index', _emberRoutingSystemRoute2['default']);
  registry.register('model:post', Post);

  route = container.lookup('route:index');

  expectAssertion(function () {
    route.findModel('post', 1);
  }, 'Post has no method `find`.');
});

QUnit.test('asserts if model class is not found', function () {
  expect(1);
  (0, _emberRuntimeTestsUtils.runDestroy)(route);

  var registry = new _containerRegistry2['default']();
  var container = registry.container();
  registry.register('route:index', _emberRoutingSystemRoute2['default']);

  route = container.lookup('route:index');

  expectAssertion(function () {
    route.model({ post_id: 1 });
  }, 'You used the dynamic segment post_id in your route undefined, but undefined.Post did not exist and you did not override your route\'s `model` hook.');
});

QUnit.test('\'store\' does not need to be injected', function () {
  expect(1);

  (0, _emberRuntimeTestsUtils.runDestroy)(route);

  var registry = new _containerRegistry2['default']();
  var container = registry.container();

  registry.register('route:index', _emberRoutingSystemRoute2['default']);

  route = container.lookup('route:index');

  ignoreAssertion(function () {
    route.model({ post_id: 1 });
  });

  ok(true, 'no error was raised');
});

QUnit.test('modelFor doesn\'t require the router', function () {
  var registry = new _containerRegistry2['default']();
  var container = registry.container();
  route.container = container;

  var foo = { name: 'foo' };

  var fooRoute = _emberRoutingSystemRoute2['default'].extend({
    container: container,
    currentModel: foo
  });

  registry.register('route:foo', fooRoute);

  equal(route.modelFor('foo'), foo);
});

QUnit.test('.send just calls an action if the router is absent', function () {
  expect(7);
  var route = _emberRoutingSystemRoute2['default'].extend({
    actions: {
      returnsTrue: function returnsTrue(foo, bar) {
        equal(foo, 1);
        equal(bar, 2);
        equal(this, route);
        return true;
      },

      returnsFalse: function returnsFalse() {
        ok(true, 'returnsFalse was called');
        return false;
      }
    }
  }).create();

  equal(true, route.send('returnsTrue', 1, 2));
  equal(false, route.send('returnsFalse'));
  equal(undefined, route.send('nonexistent', 1, 2, 3));
});

QUnit.module('Ember.Route serialize', {
  setup: setup,
  teardown: teardown
});

QUnit.test('returns the models properties if params does not include *_id', function () {
  var model = { id: 2, firstName: 'Ned', lastName: 'Ryerson' };

  deepEqual(route.serialize(model, ['firstName', 'lastName']), { firstName: 'Ned', lastName: 'Ryerson' }, 'serialized correctly');
});

QUnit.test('returns model.id if params include *_id', function () {
  var model = { id: 2 };

  deepEqual(route.serialize(model, ['post_id']), { post_id: 2 }, 'serialized correctly');
});

QUnit.test('returns checks for existence of model.post_id before trying model.id', function () {
  var model = { post_id: 3 };

  deepEqual(route.serialize(model, ['post_id']), { post_id: 3 }, 'serialized correctly');
});

QUnit.test('returns undefined if model is not set', function () {
  equal(route.serialize(undefined, ['post_id']), undefined, 'serialized correctly');
});

QUnit.module('Ember.Route interaction', {
  setup: function setup() {
    var container = {
      lookup: function lookup(fullName) {
        return lookupHash[fullName];
      }
    };

    routeOne = _emberRoutingSystemRoute2['default'].create({ container: container, routeName: 'one' });
    routeTwo = _emberRoutingSystemRoute2['default'].create({ container: container, routeName: 'two' });

    lookupHash = {
      'route:one': routeOne,
      'route:two': routeTwo
    };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(routeOne);
    (0, _emberRuntimeTestsUtils.runDestroy)(routeTwo);
  }
});

QUnit.test('controllerFor uses route\'s controllerName if specified', function () {
  var testController = {};
  lookupHash['controller:test'] = testController;

  routeOne.controllerName = 'test';

  equal(routeTwo.controllerFor('one'), testController);
});

QUnit.module('Route injected properties');

QUnit.test('services can be injected into routes', function () {
  var registry = new _containerRegistry2['default']();
  var container = registry.container();

  registry.register('route:application', _emberRoutingSystemRoute2['default'].extend({
    authService: _emberRuntimeInject2['default'].service('auth')
  }));

  registry.register('service:auth', _emberRuntimeSystemService2['default'].extend());

  var appRoute = container.lookup('route:application');
  var authService = container.lookup('service:auth');

  equal(authService, appRoute.get('authService'), 'service.auth is injected');
});