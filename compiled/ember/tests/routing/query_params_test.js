'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalComputed = require('ember-metal/computed');

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var compile = _emberHtmlbarsCompat2['default'].compile;

var Router, App, router, registry, container;
var get = _emberMetalCore2['default'].get;

function bootApplication() {
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

function handleURL(path) {
  return _emberMetalCore2['default'].run(function () {
    return router.handleURL(path).then(function (value) {
      ok(true, 'url: `' + path + '` was handled');
      return value;
    }, function (reason) {
      ok(false, 'failed to visit:`' + path + '` reason: `' + QUnit.jsDump.parse(reason));
      throw reason;
    });
  });
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

QUnit.module('Routing with Query Params', {
  setup: function setup() {
    sharedSetup();
  },

  teardown: function teardown() {
    sharedTeardown();
  }
});

if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {

  QUnit.test('Single query params can be set on the route', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', '456');

    equal(router.get('location.path'), '/?foo=456');

    setAndFlush(controller, 'foo', '987');
    equal(router.get('location.path'), '/?foo=987');
  });

  QUnit.test('a query param can have define a `type` for type casting', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        page: {
          defaultValue: null,
          type: 'number'
        }
      }
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    _emberMetalCore2['default'].run(router, 'transitionTo', 'home', { queryParams: { page: '4' } });
    equal(controller.get('page'), 4);
  });

  QUnit.test('Query params can map to different url keys configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: { as: 'other_foo', defaultValue: 'FOO' },
        bar: { as: 'other_bar', defaultValue: 'BAR' }
      }
    });

    bootApplication();
    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:index');

    setAndFlush(controller, 'foo', 'LEX');

    equal(router.get('location.path'), '/?other_foo=LEX');
    setAndFlush(controller, 'foo', 'WOO');
    equal(router.get('location.path'), '/?other_foo=WOO');

    _emberMetalCore2['default'].run(router, 'transitionTo', '/?other_foo=NAW');
    equal(controller.get('foo'), 'NAW');

    setAndFlush(controller, 'bar', 'NERK');
    _emberMetalCore2['default'].run(router, 'transitionTo', '/?other_bar=NERK&other_foo=NAW');
  });

  QUnit.test('Routes have overridable serializeQueryParamKey hook and it works with route-configured query params', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        funTimes: {
          defaultValue: ''
        }
      },
      serializeQueryParamKey: _emberMetalCore2['default'].String.dasherize
    });

    bootApplication();
    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:index');
    setAndFlush(controller, 'funTimes', 'woot');

    equal(router.get('location.path'), '/?fun-times=woot');
  });

  QUnit.test('No replaceURL occurs on startup when configured via Route because default values don\'t show up in URL', function () {
    expect(0);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });

    expectedReplaceURL = '/?foo=123';

    bootApplication();
  });

  QUnit.test('model hooks receives query params when configred on Route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'lol' });
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');
  });

  QUnit.test('model hooks receives query params (overridden by incoming url value) when configured on route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'yes' });
      }
    });

    startingURL = '/?omg=yes';
    bootApplication();

    equal(router.get('location.path'), '/?omg=yes');
  });

  QUnit.test('Route#paramsFor fetches query params when configured on the route', function () {
    expect(1);

    Router.map(function () {
      this.route('index', { path: '/:something' });
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'fooapp'
        }
      },
      model: function model(params, transition) {
        deepEqual(this.paramsFor('index'), { something: 'omg', foo: 'fooapp' }, 'could retrieve params for index');
      }
    });

    startingURL = '/omg';
    bootApplication();
  });

  QUnit.test('Route#paramsFor fetches falsy query params when they\'re configured on the route', function () {
    expect(1);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: true
        }
      },
      model: function model(params, transition) {
        equal(params.foo, false);
      }
    });

    startingURL = '/?foo=false';
    bootApplication();
  });

  QUnit.test('model hook can query prefix-less application params when they\'re configured on the route', function () {
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        appomg: {
          defaultValue: 'applol'
        }
      },
      model: function model(params) {
        deepEqual(params, { appomg: 'applol' });
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'lol' });
        deepEqual(this.paramsFor('application'), { appomg: 'applol' });
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');
  });

  QUnit.test('can opt into full transition by setting refreshModel in route queryParams when all configuration is in route', function () {
    expect(6);

    var appModelCount = 0;
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        'appomg': {
          defaultValue: 'applol'
        }
      },
      model: function model(params) {
        appModelCount++;
      }
    });

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          refreshModel: true,
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        indexModelCount++;

        if (indexModelCount === 1) {
          deepEqual(params, { omg: 'lol' });
        } else if (indexModelCount === 2) {
          deepEqual(params, { omg: 'lex' });
        }
      }
    });

    bootApplication();

    equal(appModelCount, 1);
    equal(indexModelCount, 1);

    var indexController = container.lookup('controller:index');
    setAndFlush(indexController, 'omg', 'lex');

    equal(appModelCount, 1);
    equal(indexModelCount, 2);
  });

  QUnit.test('can use refreshModel even w URL changes that remove QPs from address bar when QP configured on route', function () {
    expect(4);

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol',
          refreshModel: true
        }
      },
      model: function model(params) {
        indexModelCount++;

        var data;
        if (indexModelCount === 1) {
          data = 'foo';
        } else if (indexModelCount === 2) {
          data = 'lol';
        }

        deepEqual(params, { omg: data }, 'index#model receives right data');
      }
    });

    startingURL = '/?omg=foo';
    bootApplication();
    handleURL('/');

    var indexController = container.lookup('controller:index');
    equal(indexController.get('omg'), 'lol');
  });

  QUnit.test('can opt into a replace query by specifying replace:true in the Router config hash when all configuration lives on route', function () {
    expect(2);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        alex: {
          defaultValue: 'matchneer',
          replace: true
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?alex=wallace';
    setAndFlush(appController, 'alex', 'wallace');
  });

  QUnit.test('Route query params config can be configured using property name instead of URL key when configured on the route', function () {
    expect(2);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        commitBy: {
          as: 'commit_by',
          replace: true
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?commit_by=igor_seb';
    setAndFlush(appController, 'commitBy', 'igor_seb');
  });

  QUnit.test('An explicit replace:false on a changed QP always wins and causes a pushState even when configuration is all on the route', function () {
    expect(3);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        alex: {
          replace: true,
          defaultValue: 'matchneer'
        },
        steely: {
          replace: false,
          defaultValue: 'dan'
        }
      }
    });

    bootApplication();

    var appController = container.lookup('controller:application');
    expectedPushURL = '/?alex=wallace&steely=jan';
    _emberMetalCore2['default'].run(appController, 'setProperties', { alex: 'wallace', steely: 'jan' });

    expectedPushURL = '/?alex=wallace&steely=fran';
    _emberMetalCore2['default'].run(appController, 'setProperties', { steely: 'fran' });

    expectedReplaceURL = '/?alex=sriracha&steely=fran';
    _emberMetalCore2['default'].run(appController, 'setProperties', { alex: 'sriracha' });
  });

  QUnit.test('can opt into full transition by setting refreshModel in route queryParams when transitioning from child to parent when all configuration is on route', function () {
    _emberMetalCore2['default'].TEMPLATES.parent = compile('{{outlet}}');
    _emberMetalCore2['default'].TEMPLATES['parent/child'] = compile('{{link-to \'Parent\' \'parent\' (query-params foo=\'change\') id=\'parent-link\'}}');

    App.Router.map(function () {
      this.route('parent', function () {
        this.route('child');
      });
    });

    var parentModelCount = 0;
    App.ParentRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        parentModelCount++;
      },
      queryParams: {
        foo: {
          refreshModel: true,
          defaultValue: 'abc'
        }
      }
    });

    startingURL = '/parent/child?foo=lol';
    bootApplication();

    equal(parentModelCount, 1);

    container.lookup('controller:parent');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#parent-link'), 'click');

    equal(parentModelCount, 2);
  });

  QUnit.test('URL transitions that remove QPs still register as QP changes when configuration lives on the route', function () {
    expect(2);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      }
    });

    startingURL = '/?omg=borf';
    bootApplication();

    var indexController = container.lookup('controller:index');
    equal(indexController.get('omg'), 'borf');
    _emberMetalCore2['default'].run(router, 'transitionTo', '/');
    equal(indexController.get('omg'), 'lol');
  });

  QUnit.test('Subresource naming style is supported when configuration is all on the route', function () {

    Router.map(function () {
      this.route('abc.def', { path: '/abcdef' }, function () {
        this.route('zoo');
      });
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'A\' \'abc.def\' (query-params foo=\'123\') id=\'one\'}}{{link-to \'B\' \'abc.def.zoo\' (query-params foo=\'123\' bar=\'456\') id=\'two\'}}{{outlet}}');

    App.AbcDefRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: 'lol'
      }
    });

    App.AbcDefZooRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        bar: {
          defaultValue: 'haha'
        }
      }
    });

    bootApplication();
    equal(router.get('location.path'), '');
    equal(_emberMetalCore2['default'].$('#one').attr('href'), '/abcdef?foo=123');
    equal(_emberMetalCore2['default'].$('#two').attr('href'), '/abcdef/zoo?bar=456&foo=123');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#one'), 'click');
    equal(router.get('location.path'), '/abcdef?foo=123');
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#two'), 'click');
    equal(router.get('location.path'), '/abcdef/zoo?bar=456&foo=123');
  });

  QUnit.test('transitionTo supports query params when configuration occurs on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'lol'
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: 'borf' } });
    equal(router.get('location.path'), '/?foo=borf', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': 'blaf' } });
    equal(router.get('location.path'), '/?foo=blaf', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
    equal(router.get('location.path'), '/?foo=false', 'longform supported (bool)');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: false } });
    equal(router.get('location.path'), '/?foo=false', 'shorhand supported (bool)');
  });

  QUnit.test('transitionTo supports query params (multiple) when configuration occurs on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'lol'
        },
        bar: {
          defaultValue: 'wat'
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: 'borf' } });
    equal(router.get('location.path'), '/?foo=borf', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': 'blaf' } });
    equal(router.get('location.path'), '/?foo=blaf', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
    equal(router.get('location.path'), '/?foo=false', 'longform supported (bool)');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: false } });
    equal(router.get('location.path'), '/?foo=false', 'shorhand supported (bool)');
  });

  QUnit.test('A default boolean value deserializes QPs as booleans rather than strings when configuration occurs on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: false
        }
      },
      model: function model(params) {
        equal(params.foo, true, 'model hook received foo as boolean true');
      }
    });

    startingURL = '/?foo=true';
    bootApplication();

    var controller = container.lookup('controller:index');
    equal(controller.get('foo'), true);

    handleURL('/?foo=false');
    equal(controller.get('foo'), false);
  });

  QUnit.test('Query param without value are empty string when configuration occurs on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: ''
        }
      }
    });

    startingURL = '/?foo=';
    bootApplication();

    var controller = container.lookup('controller:index');
    equal(controller.get('foo'), '');
  });

  QUnit.test('Array query params can be set when configured on the route', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: []
        }
      }
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', [1, 2]);

    equal(router.get('location.path'), '/?foo=%5B1%2C2%5D');

    setAndFlush(controller, 'foo', [3, 4]);
    equal(router.get('location.path'), '/?foo=%5B3%2C4%5D');
  });

  QUnit.test('(de)serialization: arrays when configuration occurs on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: [1]
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: [2, 3] } });
    equal(router.get('location.path'), '/?foo=%5B2%2C3%5D', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': [4, 5] } });
    equal(router.get('location.path'), '/?foo=%5B4%2C5%5D', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: [] } });
    equal(router.get('location.path'), '/?foo=%5B%5D', 'longform supported');
  });

  QUnit.test('Url with array query param sets controller property to array when configuration occurs on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: ''
        }
      }
    });

    startingURL = '/?foo[]=1&foo[]=2&foo[]=3';
    bootApplication();

    var controller = container.lookup('controller:index');
    deepEqual(controller.get('foo'), ['1', '2', '3']);
  });

  QUnit.test('Url with array query param sets controller property to array when configuration occurs on the route and there is still a controller', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend();

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: ''
        }
      }
    });

    startingURL = '/?foo[]=1&foo[]=2&foo[]=3';
    bootApplication();

    var controller = container.lookup('controller:index');
    deepEqual(controller.get('foo'), ['1', '2', '3']);
  });

  QUnit.test('Array query params can be pushed/popped when configuration occurs on the route but there is still a controller', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      foo: _emberMetalCore2['default'].A([])
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {}
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:home');

    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/');
    deepEqual(controller.foo, []);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/');
    deepEqual(controller.foo, []);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 2);
    equal(router.get('location.path'), '/?foo=%5B1%2C2%5D');
    deepEqual(controller.foo, [1, 2]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'unshiftObject', 'lol');
    equal(router.get('location.path'), '/?foo=%5B%22lol%22%2C1%5D');
    deepEqual(controller.foo, ['lol', 1]);
  });

  QUnit.test('Overwriting with array with same content shouldn\'t refire update when configuration occurs on router but there is still a controller', function () {
    expect(3);
    var modelCount = 0;

    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {}
      },
      model: function model() {
        modelCount++;
      }
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      foo: _emberMetalCore2['default'].A([1])
    });

    bootApplication();

    equal(modelCount, 1);
    var controller = container.lookup('controller:home');
    setAndFlush(controller, 'model', _emberMetalCore2['default'].A([1]));
    equal(modelCount, 1);
    equal(router.get('location.path'), '');
  });

  QUnit.test('A child of a resource route still defaults to parent route\'s model even if the child route has a query param when configuration occurs on the router', function () {
    expect(1);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        woot: {}
      }
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(p, trans) {
        return { woot: true };
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController(controller, model) {
        deepEqual(model, { woot: true }, 'index route inherited model route from parent route');
      }
    });

    bootApplication();
  });

  QUnit.test('opting into replace does not affect transitions between routes when configuration occurs on the route', function () {
    expect(5);
    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Foo\' \'foo\' id=\'foo-link\'}}' + '{{link-to \'Bar\' \'bar\' id=\'bar-no-qp-link\'}}' + '{{link-to \'Bar\' \'bar\' (query-params raytiley=\'isthebest\') id=\'bar-link\'}}' + '{{outlet}}');
    App.Router.map(function () {
      this.route('foo');
      this.route('bar');
    });

    App.BarRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        raytiley: {
          replace: true,
          defaultValue: 'israd'
        }
      }
    });

    bootApplication();
    var controller = container.lookup('controller:bar');

    expectedPushURL = '/foo';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#foo-link'), 'click');

    expectedPushURL = '/bar';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#bar-no-qp-link'), 'click');

    expectedReplaceURL = '/bar?raytiley=woot';
    setAndFlush(controller, 'raytiley', 'woot');

    expectedPushURL = '/foo';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#foo-link'), 'click');

    expectedPushURL = '/bar?raytiley=isthebest';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#bar-link'), 'click');
  });

  QUnit.test('Undefined isn\'t deserialized into a string when configuration occurs on the route', function () {
    expect(3);
    Router.map(function () {
      this.route('example');
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Example\' \'example\' id=\'the-link\'}}');

    App.ExampleRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        // uncommon to not support default value, but should assume undefined.
        foo: {
          defaultValue: undefined
        }
      },
      model: function model(params) {
        deepEqual(params, { foo: undefined });
      }
    });

    bootApplication();

    var $link = _emberMetalCore2['default'].$('#the-link');
    equal($link.attr('href'), '/example');
    _emberMetalCore2['default'].run($link, 'click');

    var controller = container.lookup('controller:example');
    equal(get(controller, 'foo'), undefined);
  });

  QUnit.test('query params have been set by the time setupController is called when configuration occurs on the router', function () {
    expect(1);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'wat'
        }
      },
      setupController: function setupController(controller) {
        equal(controller.get('foo'), 'YEAH', 'controller\'s foo QP property set before setupController called');
      }
    });

    startingURL = '/?foo=YEAH';
    bootApplication();
  });

  QUnit.test('query params have been set by the time setupController is called when configuration occurs on the router and there is still a controller', function () {
    expect(1);

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'wat'
        }
      },
      setupController: function setupController(controller) {
        equal(controller.get('foo'), 'YEAH', 'controller\'s foo QP property set before setupController called');
      }
    });

    startingURL = '/?foo=YEAH';
    bootApplication();
  });

  QUnit.test('model hooks receives query params when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'lol' });
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');
  });

  QUnit.test('Routes have overridable serializeQueryParamKey hook when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        funTimes: {
          defaultValue: ''
        }
      },
      serializeQueryParamKey: _emberMetalCore2['default'].String.dasherize
    });

    bootApplication();
    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:index');
    setAndFlush(controller, 'funTimes', 'woot');

    equal(router.get('location.path'), '/?fun-times=woot');
  });

  QUnit.test('No replaceURL occurs on startup because default values don\'t show up in URL when configured on the route', function () {
    expect(0);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });

    expectedReplaceURL = '/?foo=123';

    bootApplication();
  });

  QUnit.test('controllers won\'t be eagerly instantiated by internal query params logic when configured on the route', function () {
    expect(10);
    Router.map(function () {
      this.route('cats', function () {
        this.route('index', { path: '/' });
      });
      this.route('home', { path: '/' });
      this.route('about');
    });

    _emberMetalCore2['default'].TEMPLATES.home = compile('<h3>{{link-to \'About\' \'about\' (query-params lol=\'wat\') id=\'link-to-about\'}}</h3>');
    _emberMetalCore2['default'].TEMPLATES.about = compile('<h3>{{link-to \'Home\' \'home\'  (query-params foo=\'naw\')}}</h3>');
    _emberMetalCore2['default'].TEMPLATES['cats/index'] = compile('<h3>{{link-to \'Cats\' \'cats\'  (query-params name=\'domino\') id=\'cats-link\'}}</h3>');

    var homeShouldBeCreated = false;
    var aboutShouldBeCreated = false;
    var catsIndexShouldBeCreated = false;

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      },
      setup: function setup() {
        homeShouldBeCreated = true;
        this._super.apply(this, arguments);
      }
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      init: function init() {
        this._super.apply(this, arguments);
        ok(homeShouldBeCreated, 'HomeController should be created at this time');
      }
    });

    App.AboutRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        lol: {
          defaultValue: 'haha'
        }
      },
      setup: function setup() {
        aboutShouldBeCreated = true;
        this._super.apply(this, arguments);
      }
    });

    App.AboutController = _emberMetalCore2['default'].Controller.extend({
      init: function init() {
        this._super.apply(this, arguments);
        ok(aboutShouldBeCreated, 'AboutController should be created at this time');
      }
    });

    App.CatsIndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        breed: {
          defaultValue: 'Golden'
        },
        name: {
          defaultValue: null
        }
      },
      model: function model() {
        return [];
      },
      setup: function setup() {
        catsIndexShouldBeCreated = true;
        this._super.apply(this, arguments);
      },
      setupController: function setupController(controller, context) {
        controller.set('model', context);
      }
    });

    App.CatsIndexController = _emberMetalCore2['default'].Controller.extend({
      init: function init() {
        this._super.apply(this, arguments);
        ok(catsIndexShouldBeCreated, 'CatsIndexController should be created at this time');
      }
    });

    bootApplication();

    equal(router.get('location.path'), '', 'url is correct');
    var controller = container.lookup('controller:home');
    setAndFlush(controller, 'foo', '456');
    equal(router.get('location.path'), '/?foo=456', 'url is correct');
    equal(_emberMetalCore2['default'].$('#link-to-about').attr('href'), '/about?lol=wat', 'link to about is correct');

    _emberMetalCore2['default'].run(router, 'transitionTo', 'about');
    equal(router.get('location.path'), '/about', 'url is correct');

    _emberMetalCore2['default'].run(router, 'transitionTo', 'cats');

    equal(router.get('location.path'), '/cats', 'url is correct');
    equal(_emberMetalCore2['default'].$('#cats-link').attr('href'), '/cats?name=domino', 'link to cats is correct');
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#cats-link'), 'click');
    equal(router.get('location.path'), '/cats?name=domino', 'url is correct');
  });

  QUnit.test('query params have been set by the time setupController is called when configured on the route', function () {
    expect(1);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'wat'
        }
      },
      setupController: function setupController(controller) {
        equal(controller.get('foo'), 'YEAH', 'controller\'s foo QP property set before setupController called');
      }
    });

    startingURL = '/?foo=YEAH';
    bootApplication();
  });

  QUnit.test('model hooks receives query params (overridden by incoming url value) when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'yes' });
      }
    });

    startingURL = '/?omg=yes';
    bootApplication();

    equal(router.get('location.path'), '/?omg=yes');
  });

  QUnit.test('Route#paramsFor fetches query params when configured on the route', function () {
    expect(1);

    Router.map(function () {
      this.route('index', { path: '/:something' });
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'fooapp'
        }
      },
      model: function model(params, transition) {
        deepEqual(this.paramsFor('index'), { something: 'omg', foo: 'fooapp' }, 'could retrieve params for index');
      }
    });

    startingURL = '/omg';
    bootApplication();
  });

  QUnit.test('model hook can query prefix-less application params (overridden by incoming url value) when they\'re configured on the route', function () {
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        appomg: {
          defaultValue: 'applol'
        }
      },
      model: function model(params) {
        deepEqual(params, { appomg: 'appyes' });
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'yes' });
        deepEqual(this.paramsFor('application'), { appomg: 'appyes' });
      }
    });

    startingURL = '/?appomg=appyes&omg=yes';
    bootApplication();

    equal(router.get('location.path'), '/?appomg=appyes&omg=yes');
  });

  QUnit.test('Route#paramsFor fetches falsy query params when configured on the route', function () {
    expect(1);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: true
        }
      },
      model: function model(params, transition) {
        equal(params.foo, false);
      }
    });

    startingURL = '/?foo=false';
    bootApplication();
  });

  QUnit.test('model hook can query prefix-less application params when configured on the route', function () {
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        appomg: {
          defaultValue: 'applol'
        }
      },
      model: function model(params) {
        deepEqual(params, { appomg: 'applol' });
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        deepEqual(params, { omg: 'lol' });
        deepEqual(this.paramsFor('application'), { appomg: 'applol' });
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');
  });

  QUnit.test('can opt into full transition by setting refreshModel in route queryParams when configured on the route', function () {
    expect(6);

    var appModelCount = 0;
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        'appomg': {
          defaultValue: 'applol'
        }
      },
      model: function model(params) {
        appModelCount++;
      }
    });

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol',
          refreshModel: true
        }
      },
      model: function model(params) {
        indexModelCount++;

        if (indexModelCount === 1) {
          deepEqual(params, { omg: 'lol' });
        } else if (indexModelCount === 2) {
          deepEqual(params, { omg: 'lex' });
        }
      }
    });

    bootApplication();

    equal(appModelCount, 1);
    equal(indexModelCount, 1);

    var indexController = container.lookup('controller:index');
    setAndFlush(indexController, 'omg', 'lex');

    equal(appModelCount, 1);
    equal(indexModelCount, 2);
  });

  QUnit.test('can use refreshModel even w URL changes that remove QPs from address bar when configured on the route', function () {
    expect(4);

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          refreshModel: true,
          defaultValue: 'lol'
        }
      },
      model: function model(params) {
        indexModelCount++;

        var data;
        if (indexModelCount === 1) {
          data = 'foo';
        } else if (indexModelCount === 2) {
          data = 'lol';
        }

        deepEqual(params, { omg: data }, 'index#model receives right data');
      }
    });

    startingURL = '/?omg=foo';
    bootApplication();
    handleURL('/');

    var indexController = container.lookup('controller:index');
    equal(indexController.get('omg'), 'lol');
  });

  QUnit.test('can opt into a replace query by specifying replace:true in the Router config hash when configured on the route', function () {
    expect(2);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        alex: {
          defaultValue: 'matchneer',
          replace: true
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?alex=wallace';
    setAndFlush(appController, 'alex', 'wallace');
  });

  QUnit.test('Route query params config can be configured using property name instead of URL key when configured on the route', function () {
    expect(2);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        commitBy: {
          as: 'commit_by',
          replace: true
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?commit_by=igor_seb';
    setAndFlush(appController, 'commitBy', 'igor_seb');
  });

  QUnit.test('An explicit replace:false on a changed QP always wins and causes a pushState when configured on the route', function () {
    expect(3);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        alex: {
          replace: true,
          defaultValue: 'matchneer'
        },
        steely: {
          defaultValue: 'dan',
          replace: false
        }
      }
    });

    bootApplication();

    var appController = container.lookup('controller:application');
    expectedPushURL = '/?alex=wallace&steely=jan';
    _emberMetalCore2['default'].run(appController, 'setProperties', { alex: 'wallace', steely: 'jan' });

    expectedPushURL = '/?alex=wallace&steely=fran';
    _emberMetalCore2['default'].run(appController, 'setProperties', { steely: 'fran' });

    expectedReplaceURL = '/?alex=sriracha&steely=fran';
    _emberMetalCore2['default'].run(appController, 'setProperties', { alex: 'sriracha' });
  });

  QUnit.test('can opt into full transition by setting refreshModel in route queryParams when transitioning from child to parent when configured on the route', function () {
    _emberMetalCore2['default'].TEMPLATES.parent = compile('{{outlet}}');
    _emberMetalCore2['default'].TEMPLATES['parent/child'] = compile('{{link-to \'Parent\' \'parent\' (query-params foo=\'change\') id=\'parent-link\'}}');

    App.Router.map(function () {
      this.route('parent', function () {
        this.route('child');
      });
    });

    var parentModelCount = 0;
    App.ParentRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        parentModelCount++;
      },
      queryParams: {
        foo: {
          refreshModel: true,
          defaultValue: 'abc'
        }
      }
    });

    startingURL = '/parent/child?foo=lol';
    bootApplication();

    equal(parentModelCount, 1);

    container.lookup('controller:parent');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#parent-link'), 'click');

    equal(parentModelCount, 2);
  });

  QUnit.test('can override incoming QP values in setupController when configured on the route', function () {
    expect(3);

    App.Router.map(function () {
      this.route('about');
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      },
      setupController: function setupController(controller) {
        ok(true, 'setupController called');
        controller.set('omg', 'OVERRIDE');
      },
      actions: {
        queryParamsDidChange: function queryParamsDidChange() {
          ok(false, 'queryParamsDidChange shouldn\'t fire');
        }
      }
    });

    startingURL = '/about';
    bootApplication();
    equal(router.get('location.path'), '/about');
    _emberMetalCore2['default'].run(router, 'transitionTo', 'index');
    equal(router.get('location.path'), '/?omg=OVERRIDE');
  });

  QUnit.test('can override incoming QP array values in setupController when configured on the route', function () {
    expect(3);

    App.Router.map(function () {
      this.route('about');
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: ['lol']
        }
      },
      setupController: function setupController(controller) {
        ok(true, 'setupController called');
        controller.set('omg', ['OVERRIDE']);
      },
      actions: {
        queryParamsDidChange: function queryParamsDidChange() {
          ok(false, 'queryParamsDidChange shouldn\'t fire');
        }
      }
    });

    startingURL = '/about';
    bootApplication();
    equal(router.get('location.path'), '/about');
    _emberMetalCore2['default'].run(router, 'transitionTo', 'index');
    equal(router.get('location.path'), '/?omg=' + encodeURIComponent(JSON.stringify(['OVERRIDE'])));
  });

  QUnit.test('URL transitions that remove QPs still register as QP changes when configured on the route', function () {
    expect(2);

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          defaultValue: 'lol'
        }
      }
    });

    startingURL = '/?omg=borf';
    bootApplication();

    var indexController = container.lookup('controller:index');
    equal(indexController.get('omg'), 'borf');
    _emberMetalCore2['default'].run(router, 'transitionTo', '/');
    equal(indexController.get('omg'), 'lol');
  });

  QUnit.test('Subresource naming style is supported when configured on the route', function () {

    Router.map(function () {
      this.route('abc.def', { path: '/abcdef' }, function () {
        this.route('zoo');
      });
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'A\' \'abc.def\' (query-params foo=\'123\') id=\'one\'}}{{link-to \'B\' \'abc.def.zoo\' (query-params foo=\'123\' bar=\'456\') id=\'two\'}}{{outlet}}');

    App.AbcDefRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'lol'
        }
      }
    });

    App.AbcDefZooRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        bar: {
          defaultValue: 'haha'
        }
      }
    });

    bootApplication();
    equal(router.get('location.path'), '');
    equal(_emberMetalCore2['default'].$('#one').attr('href'), '/abcdef?foo=123');
    equal(_emberMetalCore2['default'].$('#two').attr('href'), '/abcdef/zoo?bar=456&foo=123');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#one'), 'click');
    equal(router.get('location.path'), '/abcdef?foo=123');
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#two'), 'click');
    equal(router.get('location.path'), '/abcdef/zoo?bar=456&foo=123');
  });

  QUnit.test('transitionTo supports query params when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'lol'
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: 'borf' } });
    equal(router.get('location.path'), '/?foo=borf', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': 'blaf' } });
    equal(router.get('location.path'), '/?foo=blaf', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
    equal(router.get('location.path'), '/?foo=false', 'longform supported (bool)');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: false } });
    equal(router.get('location.path'), '/?foo=false', 'shorhand supported (bool)');
  });

  QUnit.test('transitionTo supports query params (multiple) when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'lol'
        },
        bar: {
          defaultValue: 'wat'
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: 'borf' } });
    equal(router.get('location.path'), '/?foo=borf', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': 'blaf' } });
    equal(router.get('location.path'), '/?foo=blaf', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
    equal(router.get('location.path'), '/?foo=false', 'longform supported (bool)');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: false } });
    equal(router.get('location.path'), '/?foo=false', 'shorhand supported (bool)');
  });

  QUnit.test('setting controller QP to empty string doesn\'t generate null in URL when configured on the route', function () {
    expect(1);
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });

    bootApplication();
    var controller = container.lookup('controller:index');

    expectedPushURL = '/?foo=';
    setAndFlush(controller, 'foo', '');
  });

  QUnit.test('setting QP to empty string doesn\'t generate null in URL when configured on the route', function () {
    expect(1);
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });

    bootApplication();
    var controller = container.lookup('controller:index');

    expectedPushURL = '/?foo=';
    setAndFlush(controller, 'foo', '');
  });

  QUnit.test('A default boolean value deserializes QPs as booleans rather than strings when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: false
        }
      },
      model: function model(params) {
        equal(params.foo, true, 'model hook received foo as boolean true');
      }
    });

    startingURL = '/?foo=true';
    bootApplication();

    var controller = container.lookup('controller:index');
    equal(controller.get('foo'), true);

    handleURL('/?foo=false');
    equal(controller.get('foo'), false);
  });

  QUnit.test('Query param without value are empty string when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: ''
        }
      }
    });

    startingURL = '/?foo=';
    bootApplication();

    var controller = container.lookup('controller:index');
    equal(controller.get('foo'), '');
  });

  QUnit.test('Array query params can be set when configured on the route', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: []
        }
      }
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', [1, 2]);

    equal(router.get('location.path'), '/?foo=%5B1%2C2%5D');

    setAndFlush(controller, 'foo', [3, 4]);
    equal(router.get('location.path'), '/?foo=%5B3%2C4%5D');
  });

  QUnit.test('(de)serialization: arrays when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: [1]
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: [2, 3] } });
    equal(router.get('location.path'), '/?foo=%5B2%2C3%5D', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': [4, 5] } });
    equal(router.get('location.path'), '/?foo=%5B4%2C5%5D', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: [] } });
    equal(router.get('location.path'), '/?foo=%5B%5D', 'longform supported');
  });

  QUnit.test('Url with array query param sets controller property to array when configured on the route', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: ''
        }
      }
    });

    startingURL = '/?foo[]=1&foo[]=2&foo[]=3';
    bootApplication();

    var controller = container.lookup('controller:index');
    deepEqual(controller.get('foo'), ['1', '2', '3']);
  });

  QUnit.test('Array query params can be pushed/popped when configured on the route', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: _emberMetalCore2['default'].A([])
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:home');

    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/');
    deepEqual(controller.foo, []);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/');
    deepEqual(controller.foo, []);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 2);
    equal(router.get('location.path'), '/?foo=%5B1%2C2%5D');
    deepEqual(controller.foo, [1, 2]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'unshiftObject', 'lol');
    equal(router.get('location.path'), '/?foo=%5B%22lol%22%2C1%5D');
    deepEqual(controller.foo, ['lol', 1]);
  });

  QUnit.test('Overwriting with array with same content shouldn\'t refire update when configured on the route', function () {
    expect(3);
    var modelCount = 0;

    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: _emberMetalCore2['default'].A([1])
        }
      },
      model: function model() {
        modelCount++;
      }
    });

    bootApplication();

    equal(modelCount, 1);
    var controller = container.lookup('controller:home');
    setAndFlush(controller, 'model', _emberMetalCore2['default'].A([1]));
    equal(modelCount, 1);
    equal(router.get('location.path'), '');
  });

  QUnit.test('Defaulting to params hash as the model should not result in that params object being watched when configured on the route', function () {
    expect(1);

    Router.map(function () {
      this.route('other');
    });

    // This causes the params hash, which is returned as a route's
    // model if no other model could be resolved given the provided
    // params (and no custom model hook was defined), to be watched,
    // unless we return a copy of the params hash.
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        woot: {
          defaultValue: 'wat'
        }
      }
    });

    App.OtherRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(p, trans) {
        var m = _emberMetalCore2['default'].meta(trans.params.application);
        ok(!m.watching.woot, 'A meta object isn\'t constructed for this params POJO');
      }
    });

    bootApplication();

    _emberMetalCore2['default'].run(router, 'transitionTo', 'other');
  });

  QUnit.test('A child of a resource route still defaults to parent route\'s model even if the child route has a query param when configured on the route', function () {
    expect(1);

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(p, trans) {
        return { woot: true };
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        woot: {
          defaultValue: undefined
        }
      },
      setupController: function setupController(controller, model) {
        deepEqual(model, { woot: true }, 'index route inherited model route from parent route');
      }
    });

    bootApplication();
  });

  QUnit.test('opting into replace does not affect transitions between routes when configured on route', function () {
    expect(5);
    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Foo\' \'foo\' id=\'foo-link\'}}' + '{{link-to \'Bar\' \'bar\' id=\'bar-no-qp-link\'}}' + '{{link-to \'Bar\' \'bar\' (query-params raytiley=\'isthebest\') id=\'bar-link\'}}' + '{{outlet}}');
    App.Router.map(function () {
      this.route('foo');
      this.route('bar');
    });

    App.BarRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        raytiley: {
          defaultValue: 'israd',
          replace: true
        }
      }
    });

    bootApplication();
    var controller = container.lookup('controller:bar');

    expectedPushURL = '/foo';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#foo-link'), 'click');

    expectedPushURL = '/bar';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#bar-no-qp-link'), 'click');

    expectedReplaceURL = '/bar?raytiley=woot';
    setAndFlush(controller, 'raytiley', 'woot');

    expectedPushURL = '/foo';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#foo-link'), 'click');

    expectedPushURL = '/bar?raytiley=isthebest';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#bar-link'), 'click');
  });

  QUnit.test('Undefined isn\'t deserialized into a string when configured on the route', function () {
    expect(3);
    Router.map(function () {
      this.route('example');
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Example\' \'example\' id=\'the-link\'}}');

    App.ExampleRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        // uncommon to not support default value, but should assume undefined.
        foo: {}
      },
      model: function model(params) {
        deepEqual(params, { foo: undefined });
      }
    });

    bootApplication();

    var $link = _emberMetalCore2['default'].$('#the-link');
    equal($link.attr('href'), '/example');
    _emberMetalCore2['default'].run($link, 'click');

    var controller = container.lookup('controller:example');
    equal(get(controller, 'foo'), undefined);
  });

  QUnit.test('Changing a query param property on a controller after navigating using a {{link-to}} should preserve the unchanged query params', function () {
    expect(11);
    Router.map(function () {
      this.route('example');
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Example\' \'example\' (query-params bar=\'abc\' foo=\'def\') id=\'the-link1\'}}' + '{{link-to \'Example\' \'example\' (query-params bar=\'123\' foo=\'456\') id=\'the-link2\'}}');

    App.ExampleRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: { defaultValue: 'foo' },
        bar: { defaultValue: 'bar' }
      }
    });

    bootApplication();

    var controller = container.lookup('controller:example');

    var $link1 = _emberMetalCore2['default'].$('#the-link1');
    var $link2 = _emberMetalCore2['default'].$('#the-link2');
    equal($link1.attr('href'), '/example?bar=abc&foo=def');
    equal($link2.attr('href'), '/example?bar=123&foo=456');

    expectedPushURL = '/example?bar=abc&foo=def';
    _emberMetalCore2['default'].run($link1, 'click');
    equal(get(controller, 'bar'), 'abc');
    equal(get(controller, 'foo'), 'def');

    expectedPushURL = '/example?bar=123&foo=456';
    _emberMetalCore2['default'].run($link2, 'click');
    equal(get(controller, 'bar'), '123');
    equal(get(controller, 'foo'), '456');

    expectedPushURL = '/example?bar=rab&foo=456';
    setAndFlush(controller, 'bar', 'rab');
    equal(get(controller, 'bar'), 'rab');
    equal(get(controller, 'foo'), '456');
  });
} else {
  QUnit.test('Single query params can be set on ObjectController [DEPRECATED]', function () {
    expectDeprecation('Ember.ObjectController is deprecated, please use Ember.Controller and use `model.propertyName`.');

    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeController = _emberMetalCore2['default'].ObjectController.extend({
      queryParams: ['foo'],
      foo: '123'
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', '456');

    equal(router.get('location.path'), '/?foo=456');

    setAndFlush(controller, 'foo', '987');
    equal(router.get('location.path'), '/?foo=987');
  });

  QUnit.test('Single query params can be set on the controller [DEPRECATED]', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', '456');

    equal(router.get('location.path'), '/?foo=456');

    setAndFlush(controller, 'foo', '987');
    equal(router.get('location.path'), '/?foo=987');
  });

  QUnit.test('Single query params can be set on the controller [DEPRECATED]', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', '456');

    equal(router.get('location.path'), '/?foo=456');

    setAndFlush(controller, 'foo', '987');
    equal(router.get('location.path'), '/?foo=987');
  });

  QUnit.test('Query params can map to different url keys configured on the controller [DEPRECATED]', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: [{ foo: 'other_foo', bar: { as: 'other_bar' } }],
      foo: 'FOO',
      bar: 'BAR'
    });

    bootApplication();
    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:index');
    setAndFlush(controller, 'foo', 'LEX');

    equal(router.get('location.path'), '/?other_foo=LEX');
    setAndFlush(controller, 'foo', 'WOO');
    equal(router.get('location.path'), '/?other_foo=WOO');

    _emberMetalCore2['default'].run(router, 'transitionTo', '/?other_foo=NAW');
    equal(controller.get('foo'), 'NAW');

    setAndFlush(controller, 'bar', 'NERK');
    _emberMetalCore2['default'].run(router, 'transitionTo', '/?other_bar=NERK&other_foo=NAW');
  });

  QUnit.test('Routes have overridable serializeQueryParamKey hook', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      serializeQueryParamKey: _emberMetalCore2['default'].String.dasherize
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: 'funTimes',
      funTimes: ''
    });

    bootApplication();
    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:index');
    setAndFlush(controller, 'funTimes', 'woot');

    equal(router.get('location.path'), '/?fun-times=woot');
  });

  QUnit.test('No replaceURL occurs on startup because default values don\'t show up in URL', function () {
    expect(0);

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });

    expectedReplaceURL = '/?foo=123';

    bootApplication();
  });

  QUnit.test('Can override inherited QP behavior by specifying queryParams as a computed property', function () {
    expect(0);
    var SharedMixin = _emberMetalCore2['default'].Mixin.create({
      queryParams: ['a'],
      a: 0
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend(SharedMixin, {
      queryParams: (0, _emberMetalComputed.computed)(function () {
        return ['c'];
      }),
      c: true
    });

    bootApplication();
    var indexController = container.lookup('controller:index');

    expectedReplaceURL = 'not gonna happen';
    _emberMetalCore2['default'].run(indexController, 'set', 'a', 1);
  });

  QUnit.test('model hooks receives query params', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { omg: 'lol' });
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');
  });

  QUnit.test('controllers won\'t be eagerly instantiated by internal query params logic', function () {
    expect(10);
    Router.map(function () {
      this.route('cats', function () {
        this.route('index', { path: '/' });
      });
      this.route('home', { path: '/' });
      this.route('about');
    });

    _emberMetalCore2['default'].TEMPLATES.home = compile('<h3>{{link-to \'About\' \'about\' (query-params lol=\'wat\') id=\'link-to-about\'}}</h3>');
    _emberMetalCore2['default'].TEMPLATES.about = compile('<h3>{{link-to \'Home\' \'home\'  (query-params foo=\'naw\')}}</h3>');
    _emberMetalCore2['default'].TEMPLATES['cats/index'] = compile('<h3>{{link-to \'Cats\' \'cats\'  (query-params name=\'domino\') id=\'cats-link\'}}</h3>');

    var homeShouldBeCreated = false;
    var aboutShouldBeCreated = false;
    var catsIndexShouldBeCreated = false;

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      setup: function setup() {
        homeShouldBeCreated = true;
        this._super.apply(this, arguments);
      }
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123',
      init: function init() {
        this._super.apply(this, arguments);
        ok(homeShouldBeCreated, 'HomeController should be created at this time');
      }
    });

    App.AboutRoute = _emberMetalCore2['default'].Route.extend({
      setup: function setup() {
        aboutShouldBeCreated = true;
        this._super.apply(this, arguments);
      }
    });

    App.AboutController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['lol'],
      lol: 'haha',
      init: function init() {
        this._super.apply(this, arguments);
        ok(aboutShouldBeCreated, 'AboutController should be created at this time');
      }
    });

    App.CatsIndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return [];
      },
      setup: function setup() {
        catsIndexShouldBeCreated = true;
        this._super.apply(this, arguments);
      },
      setupController: function setupController(controller, context) {
        controller.set('model', context);
      }
    });

    App.CatsIndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['breed', 'name'],
      breed: 'Golden',
      name: null,
      init: function init() {
        this._super.apply(this, arguments);
        ok(catsIndexShouldBeCreated, 'CatsIndexController should be created at this time');
      }
    });

    bootApplication();

    equal(router.get('location.path'), '', 'url is correct');
    var controller = container.lookup('controller:home');
    setAndFlush(controller, 'foo', '456');
    equal(router.get('location.path'), '/?foo=456', 'url is correct');
    equal(_emberMetalCore2['default'].$('#link-to-about').attr('href'), '/about?lol=wat', 'link to about is correct');

    _emberMetalCore2['default'].run(router, 'transitionTo', 'about');
    equal(router.get('location.path'), '/about', 'url is correct');

    _emberMetalCore2['default'].run(router, 'transitionTo', 'cats');

    equal(router.get('location.path'), '/cats', 'url is correct');
    equal(_emberMetalCore2['default'].$('#cats-link').attr('href'), '/cats?name=domino', 'link to cats is correct');
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#cats-link'), 'click');
    equal(router.get('location.path'), '/cats?name=domino', 'url is correct');
  });

  QUnit.test('query params have been set by the time setupController is called', function () {
    expect(1);

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: 'wat'
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController(controller) {
        equal(controller.get('foo'), 'YEAH', 'controller\'s foo QP property set before setupController called');
      }
    });

    startingURL = '/?foo=YEAH';
    bootApplication();
  });

  QUnit.test('model hooks receives query params (overridden by incoming url value)', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { omg: 'yes' });
      }
    });

    startingURL = '/?omg=yes';
    bootApplication();

    equal(router.get('location.path'), '/?omg=yes');
  });

  QUnit.test('Route#paramsFor fetches query params', function () {
    expect(1);

    Router.map(function () {
      this.route('index', { path: '/:something' });
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: 'fooapp'
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params, transition) {
        deepEqual(this.paramsFor('index'), { something: 'omg', foo: 'fooapp' }, 'could retrieve params for index');
      }
    });

    startingURL = '/omg';
    bootApplication();
  });

  QUnit.test('model hook can query prefix-less application params (overridden by incoming url value)', function () {
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['appomg'],
      appomg: 'applol'
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { appomg: 'appyes' });
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { omg: 'yes' });
        deepEqual(this.paramsFor('application'), { appomg: 'appyes' });
      }
    });

    startingURL = '/?appomg=appyes&omg=yes';
    bootApplication();

    equal(router.get('location.path'), '/?appomg=appyes&omg=yes');
  });

  QUnit.test('Route#paramsFor fetches falsy query params', function () {
    expect(1);

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: true
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params, transition) {
        equal(params.foo, false);
      }
    });

    startingURL = '/?foo=false';
    bootApplication();
  });

  QUnit.test('model hook can query prefix-less application params', function () {
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['appomg'],
      appomg: 'applol'
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { appomg: 'applol' });
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { omg: 'lol' });
        deepEqual(this.paramsFor('application'), { appomg: 'applol' });
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');
  });

  QUnit.test('can opt into full transition by setting refreshModel in route queryParams', function () {
    expect(6);
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['appomg'],
      appomg: 'applol'
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    var appModelCount = 0;
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        appModelCount++;
      }
    });

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          refreshModel: true
        }
      },
      model: function model(params) {
        indexModelCount++;

        if (indexModelCount === 1) {
          deepEqual(params, { omg: 'lol' });
        } else if (indexModelCount === 2) {
          deepEqual(params, { omg: 'lex' });
        }
      }
    });

    bootApplication();

    equal(appModelCount, 1);
    equal(indexModelCount, 1);

    var indexController = container.lookup('controller:index');
    setAndFlush(indexController, 'omg', 'lex');

    equal(appModelCount, 1);
    equal(indexModelCount, 2);
  });

  QUnit.test('Use Ember.get to retrieve query params \'refreshModel\' configuration', function () {
    expect(6);
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['appomg'],
      appomg: 'applol'
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    var appModelCount = 0;
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        appModelCount++;
      }
    });

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: _emberMetalCore2['default'].Object.create({
        unknownProperty: function unknownProperty(keyName) {
          return { refreshModel: true };
        }
      }),
      model: function model(params) {
        indexModelCount++;

        if (indexModelCount === 1) {
          deepEqual(params, { omg: 'lol' });
        } else if (indexModelCount === 2) {
          deepEqual(params, { omg: 'lex' });
        }
      }
    });

    bootApplication();

    equal(appModelCount, 1);
    equal(indexModelCount, 1);

    var indexController = container.lookup('controller:index');
    setAndFlush(indexController, 'omg', 'lex');

    equal(appModelCount, 1);
    equal(indexModelCount, 2);
  });

  QUnit.test('can use refreshModel even w URL changes that remove QPs from address bar', function () {
    expect(4);

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    var indexModelCount = 0;
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        omg: {
          refreshModel: true
        }
      },
      model: function model(params) {
        indexModelCount++;

        var data;
        if (indexModelCount === 1) {
          data = 'foo';
        } else if (indexModelCount === 2) {
          data = 'lol';
        }

        deepEqual(params, { omg: data }, 'index#model receives right data');
      }
    });

    startingURL = '/?omg=foo';
    bootApplication();
    handleURL('/');

    var indexController = container.lookup('controller:index');
    equal(indexController.get('omg'), 'lol');
  });

  QUnit.test('can opt into a replace query by specifying replace:true in the Router config hash', function () {
    expect(2);
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['alex'],
      alex: 'matchneer'
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        alex: {
          replace: true
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?alex=wallace';
    setAndFlush(appController, 'alex', 'wallace');
  });

  QUnit.test('Route query params config can be configured using property name instead of URL key', function () {
    expect(2);
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: [{ commitBy: 'commit_by' }]
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        commitBy: {
          replace: true
        }
      }
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?commit_by=igor_seb';
    setAndFlush(appController, 'commitBy', 'igor_seb');
  });

  QUnit.test('An explicit replace:false on a changed QP always wins and causes a pushState', function () {
    expect(3);
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['alex', 'steely'],
      alex: 'matchneer',
      steely: 'dan'
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        alex: {
          replace: true
        },
        steely: {
          replace: false
        }
      }
    });

    bootApplication();

    var appController = container.lookup('controller:application');
    expectedPushURL = '/?alex=wallace&steely=jan';
    _emberMetalCore2['default'].run(appController, 'setProperties', { alex: 'wallace', steely: 'jan' });

    expectedPushURL = '/?alex=wallace&steely=fran';
    _emberMetalCore2['default'].run(appController, 'setProperties', { steely: 'fran' });

    expectedReplaceURL = '/?alex=sriracha&steely=fran';
    _emberMetalCore2['default'].run(appController, 'setProperties', { alex: 'sriracha' });
  });

  QUnit.test('can opt into full transition by setting refreshModel in route queryParams when transitioning from child to parent', function () {
    _emberMetalCore2['default'].TEMPLATES.parent = compile('{{outlet}}');
    _emberMetalCore2['default'].TEMPLATES['parent/child'] = compile('{{link-to \'Parent\' \'parent\' (query-params foo=\'change\') id=\'parent-link\'}}');

    App.Router.map(function () {
      this.route('parent', function () {
        this.route('child');
      });
    });

    var parentModelCount = 0;
    App.ParentRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        parentModelCount++;
      },
      queryParams: {
        foo: {
          refreshModel: true
        }
      }
    });

    App.ParentController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: 'abc'
    });

    startingURL = '/parent/child?foo=lol';
    bootApplication();

    equal(parentModelCount, 1);

    container.lookup('controller:parent');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#parent-link'), 'click');

    equal(parentModelCount, 2);
  });

  QUnit.test('Use Ember.get to retrieve query params \'replace\' configuration', function () {
    expect(2);
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['alex'],
      alex: 'matchneer'
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: _emberMetalCore2['default'].Object.create({
        unknownProperty: function unknownProperty(keyName) {
          // We are simulating all qps requiring refresh
          return { replace: true };
        }
      })
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var appController = container.lookup('controller:application');
    expectedReplaceURL = '/?alex=wallace';
    setAndFlush(appController, 'alex', 'wallace');
  });

  QUnit.test('can override incoming QP values in setupController', function () {
    expect(3);

    App.Router.map(function () {
      this.route('about');
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController(controller) {
        ok(true, 'setupController called');
        controller.set('omg', 'OVERRIDE');
      },
      actions: {
        queryParamsDidChange: function queryParamsDidChange() {
          ok(false, 'queryParamsDidChange shouldn\'t fire');
        }
      }
    });

    startingURL = '/about';
    bootApplication();
    equal(router.get('location.path'), '/about');
    _emberMetalCore2['default'].run(router, 'transitionTo', 'index');
    equal(router.get('location.path'), '/?omg=OVERRIDE');
  });

  QUnit.test('can override incoming QP array values in setupController', function () {
    expect(3);

    App.Router.map(function () {
      this.route('about');
    });

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: ['lol']
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController(controller) {
        ok(true, 'setupController called');
        controller.set('omg', ['OVERRIDE']);
      },
      actions: {
        queryParamsDidChange: function queryParamsDidChange() {
          ok(false, 'queryParamsDidChange shouldn\'t fire');
        }
      }
    });

    startingURL = '/about';
    bootApplication();
    equal(router.get('location.path'), '/about');
    _emberMetalCore2['default'].run(router, 'transitionTo', 'index');
    equal(router.get('location.path'), '/?omg=' + encodeURIComponent(JSON.stringify(['OVERRIDE'])));
  });

  QUnit.test('URL transitions that remove QPs still register as QP changes', function () {
    expect(2);

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['omg'],
      omg: 'lol'
    });

    startingURL = '/?omg=borf';
    bootApplication();

    var indexController = container.lookup('controller:index');
    equal(indexController.get('omg'), 'borf');
    _emberMetalCore2['default'].run(router, 'transitionTo', '/');
    equal(indexController.get('omg'), 'lol');
  });

  QUnit.test('Subresource naming style is supported', function () {

    Router.map(function () {
      this.route('abc.def', { path: '/abcdef' }, function () {
        this.route('zoo');
      });
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'A\' \'abc.def\' (query-params foo=\'123\') id=\'one\'}}{{link-to \'B\' \'abc.def.zoo\' (query-params foo=\'123\' bar=\'456\') id=\'two\'}}{{outlet}}');

    App.AbcDefController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: 'lol'
    });

    App.AbcDefZooController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['bar'],
      bar: 'haha'
    });

    bootApplication();
    equal(router.get('location.path'), '');
    equal(_emberMetalCore2['default'].$('#one').attr('href'), '/abcdef?foo=123');
    equal(_emberMetalCore2['default'].$('#two').attr('href'), '/abcdef/zoo?bar=456&foo=123');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#one'), 'click');
    equal(router.get('location.path'), '/abcdef?foo=123');
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#two'), 'click');
    equal(router.get('location.path'), '/abcdef/zoo?bar=456&foo=123');
  });

  QUnit.test('transitionTo supports query params', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: 'lol'
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: 'borf' } });
    equal(router.get('location.path'), '/?foo=borf', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': 'blaf' } });
    equal(router.get('location.path'), '/?foo=blaf', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
    equal(router.get('location.path'), '/?foo=false', 'longform supported (bool)');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: false } });
    equal(router.get('location.path'), '/?foo=false', 'shorhand supported (bool)');
  });

  QUnit.test('transitionTo supports query params (multiple)', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo', 'bar'],
      foo: 'lol',
      bar: 'wat'
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: 'borf' } });
    equal(router.get('location.path'), '/?foo=borf', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': 'blaf' } });
    equal(router.get('location.path'), '/?foo=blaf', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
    equal(router.get('location.path'), '/?foo=false', 'longform supported (bool)');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: false } });
    equal(router.get('location.path'), '/?foo=false', 'shorhand supported (bool)');
  });

  QUnit.test('setting controller QP to empty string doesn\'t generate null in URL', function () {
    expect(1);
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });

    bootApplication();
    var controller = container.lookup('controller:index');

    expectedPushURL = '/?foo=';
    setAndFlush(controller, 'foo', '');
  });

  QUnit.test('setting QP to empty string doesn\'t generate null in URL', function () {
    expect(1);
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });

    bootApplication();
    var controller = container.lookup('controller:index');

    expectedPushURL = '/?foo=';
    setAndFlush(controller, 'foo', '');
  });

  QUnit.test('A default boolean value deserializes QPs as booleans rather than strings', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: false
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        equal(params.foo, true, 'model hook received foo as boolean true');
      }
    });

    startingURL = '/?foo=true';
    bootApplication();

    var controller = container.lookup('controller:index');
    equal(controller.get('foo'), true);

    handleURL('/?foo=false');
    equal(controller.get('foo'), false);
  });

  QUnit.test('Query param without value are empty string', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: ''
    });

    startingURL = '/?foo=';
    bootApplication();

    var controller = container.lookup('controller:index');
    equal(controller.get('foo'), '');
  });

  QUnit.test('Array query params can be set', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: []
    });

    bootApplication();

    var controller = container.lookup('controller:home');

    setAndFlush(controller, 'foo', [1, 2]);

    equal(router.get('location.path'), '/?foo=%5B1%2C2%5D');

    setAndFlush(controller, 'foo', [3, 4]);
    equal(router.get('location.path'), '/?foo=%5B3%2C4%5D');
  });

  QUnit.test('(de)serialization: arrays', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: [1]
    });

    bootApplication();

    equal(router.get('location.path'), '');

    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: [2, 3] } });
    equal(router.get('location.path'), '/?foo=%5B2%2C3%5D', 'shorthand supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { 'index:foo': [4, 5] } });
    equal(router.get('location.path'), '/?foo=%5B4%2C5%5D', 'longform supported');
    _emberMetalCore2['default'].run(router, 'transitionTo', { queryParams: { foo: [] } });
    equal(router.get('location.path'), '/?foo=%5B%5D', 'longform supported');
  });

  QUnit.test('Url with array query param sets controller property to array', function () {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: ''
    });

    startingURL = '/?foo[]=1&foo[]=2&foo[]=3';
    bootApplication();

    var controller = container.lookup('controller:index');
    deepEqual(controller.get('foo'), ['1', '2', '3']);
  });

  QUnit.test('Array query params can be pushed/popped', function () {
    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: _emberMetalCore2['default'].A([])
    });

    bootApplication();

    equal(router.get('location.path'), '');

    var controller = container.lookup('controller:home');

    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/');
    deepEqual(controller.foo, []);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/');
    deepEqual(controller.foo, []);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 1);
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'pushObject', 2);
    equal(router.get('location.path'), '/?foo=%5B1%2C2%5D');
    deepEqual(controller.foo, [1, 2]);
    _emberMetalCore2['default'].run(controller.foo, 'popObject');
    equal(router.get('location.path'), '/?foo=%5B1%5D');
    deepEqual(controller.foo, [1]);
    _emberMetalCore2['default'].run(controller.foo, 'unshiftObject', 'lol');
    equal(router.get('location.path'), '/?foo=%5B%22lol%22%2C1%5D');
    deepEqual(controller.foo, ['lol', 1]);
  });

  QUnit.test('Overwriting with array with same content shouldn\'t refire update', function () {
    expect(3);
    var modelCount = 0;

    Router.map(function () {
      this.route('home', { path: '/' });
    });

    App.HomeRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        modelCount++;
      }
    });

    App.HomeController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: _emberMetalCore2['default'].A([1])
    });

    bootApplication();

    equal(modelCount, 1);
    var controller = container.lookup('controller:home');
    setAndFlush(controller, 'model', _emberMetalCore2['default'].A([1]));
    equal(modelCount, 1);
    equal(router.get('location.path'), '');
  });

  QUnit.test('Defaulting to params hash as the model should not result in that params object being watched', function () {
    expect(1);

    Router.map(function () {
      this.route('other');
    });

    // This causes the params hash, which is returned as a route's
    // model if no other model could be resolved given the provided
    // params (and no custom model hook was defined), to be watched,
    // unless we return a copy of the params hash.
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['woot'],
      woot: 'wat'
    });

    App.OtherRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(p, trans) {
        var m = _emberMetalCore2['default'].meta(trans.params.application);
        ok(!m.watching.woot, 'A meta object isn\'t constructed for this params POJO');
      }
    });

    bootApplication();

    _emberMetalCore2['default'].run(router, 'transitionTo', 'other');
  });

  QUnit.test('A child of a resource route still defaults to parent route\'s model even if the child route has a query param', function () {
    expect(1);

    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['woot']
    });

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(p, trans) {
        return { woot: true };
      }
    });

    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController(controller, model) {
        deepEqual(model, { woot: true }, 'index route inherited model route from parent route');
      }
    });

    bootApplication();
  });

  QUnit.test('opting into replace does not affect transitions between routes', function () {
    expect(5);
    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Foo\' \'foo\' id=\'foo-link\'}}' + '{{link-to \'Bar\' \'bar\' id=\'bar-no-qp-link\'}}' + '{{link-to \'Bar\' \'bar\' (query-params raytiley=\'isthebest\') id=\'bar-link\'}}' + '{{outlet}}');
    App.Router.map(function () {
      this.route('foo');
      this.route('bar');
    });

    App.BarController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['raytiley'],
      raytiley: 'israd'
    });

    App.BarRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        raytiley: {
          replace: true
        }
      }
    });

    bootApplication();
    var controller = container.lookup('controller:bar');

    expectedPushURL = '/foo';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#foo-link'), 'click');

    expectedPushURL = '/bar';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#bar-no-qp-link'), 'click');

    expectedReplaceURL = '/bar?raytiley=woot';
    setAndFlush(controller, 'raytiley', 'woot');

    expectedPushURL = '/foo';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#foo-link'), 'click');

    expectedPushURL = '/bar?raytiley=isthebest';
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#bar-link'), 'click');
  });

  QUnit.test('Undefined isn\'t deserialized into a string', function () {
    expect(3);
    Router.map(function () {
      this.route('example');
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'Example\' \'example\' id=\'the-link\'}}');

    App.ExampleController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo']
      // uncommon to not support default value, but should assume undefined.
    });

    App.ExampleRoute = _emberMetalCore2['default'].Route.extend({
      model: function model(params) {
        deepEqual(params, { foo: undefined });
      }
    });

    bootApplication();

    var $link = _emberMetalCore2['default'].$('#the-link');
    equal($link.attr('href'), '/example');
    _emberMetalCore2['default'].run($link, 'click');

    var controller = container.lookup('controller:example');
    equal(get(controller, 'foo'), undefined);
  });
}

QUnit.test('warn user that routes query params configuration must be an Object, not an Array', function () {
  expect(1);

  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    queryParams: [{ commitBy: { replace: true } }]
  });

  expectAssertion(function () {
    bootApplication();
  }, 'You passed in `[{"commitBy":{"replace":true}}]` as the value for `queryParams` but `queryParams` cannot be an Array');
});