'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var compile = _emberHtmlbarsCompat2['default'].compile;

var Router, App, router, registry, container;

function bootApplication() {
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

var startingURL = '';
var expectedReplaceURL, expectedPushURL;

function setAndFlush(obj, prop, value) {
  _emberMetalCore2['default'].run(obj, 'set', prop, value);
}

var TestLocation = _emberMetalCore2['default'].NoneLocation.extend({
  initState: function initState() {
    this.set('path', startingURL);
  },

  setURL: function setURL(path) {
    if (expectedReplaceURL) {
      ok(false, 'pushState occurred but a replaceState was expected');
    }
    if (expectedPushURL) {
      equal(path, expectedPushURL, 'an expected pushState occurred');
      expectedPushURL = null;
    }
    this.set('path', path);
  },

  replaceURL: function replaceURL(path) {
    if (expectedPushURL) {
      ok(false, 'replaceState occurred but a pushState was expected');
    }
    if (expectedReplaceURL) {
      equal(path, expectedReplaceURL, 'an expected replaceState occurred');
      expectedReplaceURL = null;
    }
    this.set('path', path);
  }
});

function sharedSetup() {
  _emberMetalCore2['default'].run(function () {
    App = _emberMetalCore2['default'].Application.create({
      name: 'App',
      rootElement: '#qunit-fixture'
    });

    App.deferReadiness();

    registry = App.registry;
    container = App.__container__;

    registry.register('location:test', TestLocation);

    startingURL = expectedReplaceURL = expectedPushURL = '';

    App.Router.reopen({
      location: 'test'
    });

    Router = App.Router;

    App.LoadingRoute = _emberMetalCore2['default'].Route.extend({});

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{outlet}}');
    _emberMetalCore2['default'].TEMPLATES.home = compile('<h3>Hours</h3>');
  });
}

function sharedTeardown() {
  _emberMetalCore2['default'].run(function () {
    App.destroy();
    App = null;

    _emberMetalCore2['default'].TEMPLATES = {};
  });
}

if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
  QUnit.module('Query Params - overlapping query param property names when configured on the route', {
    setup: function setup() {
      sharedSetup();

      App.Router.map(function () {
        this.route('parent', function () {
          this.route('child');
        });
      });

      this.boot = function () {
        bootApplication();
        _emberMetalCore2['default'].run(router, 'transitionTo', 'parent.child');
      };
    },

    teardown: function teardown() {
      sharedTeardown();
    }
  });

  QUnit.test('can remap same-named qp props', function () {
    App.ParentRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        page: {
          as: 'parentPage',
          defaultValue: 1
        }
      }
    });

    App.ParentChildRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        page: {
          as: 'childPage',
          defaultValue: 1
        }
      }
    });

    this.boot();

    equal(router.get('location.path'), '/parent/child');

    var parentController = container.lookup('controller:parent');
    var parentChildController = container.lookup('controller:parent.child');

    setAndFlush(parentController, 'page', 2);
    equal(router.get('location.path'), '/parent/child?parentPage=2');
    setAndFlush(parentController, 'page', 1);
    equal(router.get('location.path'), '/parent/child');

    setAndFlush(parentChildController, 'page', 2);
    equal(router.get('location.path'), '/parent/child?childPage=2');
    setAndFlush(parentChildController, 'page', 1);
    equal(router.get('location.path'), '/parent/child');

    _emberMetalCore2['default'].run(function () {
      parentController.set('page', 2);
      parentChildController.set('page', 2);
    });

    equal(router.get('location.path'), '/parent/child?childPage=2&parentPage=2');

    _emberMetalCore2['default'].run(function () {
      parentController.set('page', 1);
      parentChildController.set('page', 1);
    });

    equal(router.get('location.path'), '/parent/child');
  });

  QUnit.test('query params in the same route hierarchy with the same url key get auto-scoped', function () {
    App.ParentRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          as: 'shared',
          defaultValue: 1
        }
      }
    });

    App.ParentChildRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        bar: {
          as: 'shared',
          defaultValue: 1
        }
      }
    });

    var self = this;
    expectAssertion(function () {
      self.boot();
    }, 'You\'re not allowed to have more than one controller property map to the same query param key, but both `parent:foo` and `parent.child:bar` map to `shared`. You can fix this by mapping one of the controller properties to a different query param key via the `as` config option, e.g. `foo: { as: \'other-foo\' }`');
  });
} else {
  QUnit.module('Query Params - overlapping query param property names', {
    setup: function setup() {
      sharedSetup();

      App.Router.map(function () {
        this.route('parent', function () {
          this.route('child');
        });
      });

      this.boot = function () {
        bootApplication();
        _emberMetalCore2['default'].run(router, 'transitionTo', 'parent.child');
      };
    },

    teardown: function teardown() {
      sharedTeardown();
    }
  });

  QUnit.test('can remap same-named qp props', function () {
    App.ParentController = _emberMetalCore2['default'].Controller.extend({
      queryParams: { page: 'parentPage' },
      page: 1
    });

    App.ParentChildController = _emberMetalCore2['default'].Controller.extend({
      queryParams: { page: 'childPage' },
      page: 1
    });

    this.boot();

    equal(router.get('location.path'), '/parent/child');

    var parentController = container.lookup('controller:parent');
    var parentChildController = container.lookup('controller:parent.child');

    setAndFlush(parentController, 'page', 2);
    equal(router.get('location.path'), '/parent/child?parentPage=2');
    setAndFlush(parentController, 'page', 1);
    equal(router.get('location.path'), '/parent/child');

    setAndFlush(parentChildController, 'page', 2);
    equal(router.get('location.path'), '/parent/child?childPage=2');
    setAndFlush(parentChildController, 'page', 1);
    equal(router.get('location.path'), '/parent/child');

    _emberMetalCore2['default'].run(function () {
      parentController.set('page', 2);
      parentChildController.set('page', 2);
    });

    equal(router.get('location.path'), '/parent/child?childPage=2&parentPage=2');

    _emberMetalCore2['default'].run(function () {
      parentController.set('page', 1);
      parentChildController.set('page', 1);
    });

    equal(router.get('location.path'), '/parent/child');
  });

  QUnit.test('query params in the same route hierarchy with the same url key get auto-scoped', function () {
    App.ParentController = _emberMetalCore2['default'].Controller.extend({
      queryParams: { foo: 'shared' },
      foo: 1
    });

    App.ParentChildController = _emberMetalCore2['default'].Controller.extend({
      queryParams: { bar: 'shared' },
      bar: 1
    });

    var self = this;
    expectAssertion(function () {
      self.boot();
    }, 'You\'re not allowed to have more than one controller property map to the same query param key, but both `parent:foo` and `parent.child:bar` map to `shared`. You can fix this by mapping one of the controller properties to a different query param key via the `as` config option, e.g. `foo: { as: \'other-foo\' }`');
  });

  QUnit.test('Support shared but overridable mixin pattern', function () {

    var HasPage = _emberMetalCore2['default'].Mixin.create({
      queryParams: 'page',
      page: 1
    });

    App.ParentController = _emberMetalCore2['default'].Controller.extend(HasPage, {
      queryParams: { page: 'yespage' }
    });

    App.ParentChildController = _emberMetalCore2['default'].Controller.extend(HasPage);

    this.boot();

    equal(router.get('location.path'), '/parent/child');

    var parentController = container.lookup('controller:parent');
    var parentChildController = container.lookup('controller:parent.child');

    setAndFlush(parentChildController, 'page', 2);
    equal(router.get('location.path'), '/parent/child?page=2');
    equal(parentController.get('page'), 1);
    equal(parentChildController.get('page'), 2);

    setAndFlush(parentController, 'page', 2);
    equal(router.get('location.path'), '/parent/child?page=2&yespage=2');
    equal(parentController.get('page'), 2);
    equal(parentChildController.get('page'), 2);
  });
}