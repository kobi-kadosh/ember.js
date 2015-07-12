'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberRoutingLocationHash_location = require('ember-routing/location/hash_location');

var _emberRoutingLocationHash_location2 = _interopRequireDefault(_emberRoutingLocationHash_location);

var _emberRoutingLocationHistory_location = require('ember-routing/location/history_location');

var _emberRoutingLocationHistory_location2 = _interopRequireDefault(_emberRoutingLocationHistory_location);

var _emberRoutingLocationAuto_location = require('ember-routing/location/auto_location');

var _emberRoutingLocationAuto_location2 = _interopRequireDefault(_emberRoutingLocationAuto_location);

var _emberRoutingLocationNone_location = require('ember-routing/location/none_location');

var _emberRoutingLocationNone_location2 = _interopRequireDefault(_emberRoutingLocationNone_location);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var registry, container;

function createRouter(overrides, disableSetup) {
  var opts = (0, _emberMetalMerge2['default'])({ container: container }, overrides);
  var routerWithContainer = _emberRoutingSystemRouter2['default'].extend();
  var router = routerWithContainer.create(opts);

  if (!disableSetup) {
    router.setupRouter();
  }

  return router;
}

QUnit.module('Ember Router', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();

    //register the HashLocation (the default)
    registry.register('location:hash', _emberRoutingLocationHash_location2['default']);
    registry.register('location:history', _emberRoutingLocationHistory_location2['default']);
    registry.register('location:auto', _emberRoutingLocationAuto_location2['default']);
    registry.register('location:none', _emberRoutingLocationNone_location2['default']);
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = null;
  }
});

QUnit.test('can create a router without a container', function () {
  createRouter({ container: null }, true);

  ok(true, 'no errors were thrown when creating without a container');
});

QUnit.test('should not create a router.js instance upon init', function () {
  var router = createRouter(null, true);

  ok(!router.router);
});

QUnit.test('should not reify location until setupRouter is called', function () {
  var router = createRouter(null, true);
  equal(typeof router.location, 'string', 'location is specified as a string');

  router.setupRouter();

  equal(typeof router.location, 'object', 'location is reified into an object');
});

QUnit.test('should destroy its location upon destroying the routers container.', function () {
  var router = createRouter();
  var location = router.get('location');

  (0, _emberRuntimeTestsUtils.runDestroy)(container);

  ok(location.isDestroyed, 'location should be destroyed');
});

QUnit.test('should instantiate its location with its `rootURL`', function () {
  var router = createRouter({
    rootURL: '/rootdir/'
  });
  var location = router.get('location');

  equal(location.get('rootURL'), '/rootdir/');
});

QUnit.test('replacePath should be called with the right path', function () {
  expect(1);

  var location = container.lookup('location:auto');

  var browserLocation = {
    href: 'http://test.com/rootdir/welcome',
    origin: 'http://test.com',
    pathname: '/rootdir/welcome',
    hash: '',
    search: '',
    replace: function replace(url) {
      equal(url, 'http://test.com/rootdir/#/welcome');
    }
  };

  location.location = browserLocation;
  location.global = { onhashchange: function onhashchange() {} };
  location.history = null;

  createRouter({
    location: 'auto',
    rootURL: '/rootdir/'
  });
});

QUnit.test('Ember.Router._routePath should consume identical prefixes', function () {
  createRouter();

  expect(8);

  function routePath(s1, s2, s3) {
    var handlerInfos = Array.prototype.slice.call(arguments).map(function (s) {
      return { name: s };
    });
    handlerInfos.unshift({ name: 'ignored' });

    return _emberRoutingSystemRouter2['default']._routePath(handlerInfos);
  }

  equal(routePath('foo'), 'foo');
  equal(routePath('foo', 'bar', 'baz'), 'foo.bar.baz');
  equal(routePath('foo', 'foo.bar'), 'foo.bar');
  equal(routePath('foo', 'foo.bar', 'foo.bar.baz'), 'foo.bar.baz');
  equal(routePath('foo', 'foo.bar', 'foo.bar.baz.wow'), 'foo.bar.baz.wow');
  equal(routePath('foo', 'foo.bar.baz.wow'), 'foo.bar.baz.wow');
  equal(routePath('foo.bar', 'bar.baz.wow'), 'foo.bar.baz.wow');

  // This makes no sense, not trying to handle it, just
  // making sure it doesn't go boom.
  equal(routePath('foo.bar.baz', 'foo'), 'foo.bar.baz.foo');
});

QUnit.test('Router should cancel routing setup when the Location class says so via cancelRouterSetup', function () {
  expect(0);

  var router;
  var FakeLocation = {
    cancelRouterSetup: true,
    create: function create() {
      return this;
    }
  };

  registry.register('location:fake', FakeLocation);

  router = createRouter({
    container: container,
    location: 'fake',

    _setupRouter: function _setupRouter() {
      ok(false, '_setupRouter should not be called');
    }
  });

  router.startRouting();
});

QUnit.test('AutoLocation should replace the url when it\'s not in the preferred format', function () {
  expect(1);

  var location = container.lookup('location:auto');

  location.location = {
    href: 'http://test.com/rootdir/welcome',
    origin: 'http://test.com',
    pathname: '/rootdir/welcome',
    hash: '',
    search: '',
    replace: function replace(url) {
      equal(url, 'http://test.com/rootdir/#/welcome');
    }
  };
  location.history = null;
  location.global = {
    onhashchange: function onhashchange() {}
  };

  createRouter({
    location: 'auto',
    rootURL: '/rootdir/'
  });
});

QUnit.test('Router#handleURL should remove any #hashes before doing URL transition', function () {
  expect(2);

  var router = createRouter({
    container: container,

    _doURLTransition: function _doURLTransition(routerJsMethod, url) {
      equal(routerJsMethod, 'handleURL');
      equal(url, '/foo/bar?time=morphin');
    }
  });

  router.handleURL('/foo/bar?time=morphin#pink-power-ranger');
});