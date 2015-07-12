'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberRoutingLocationAuto_location = require('ember-routing/location/auto_location');

var _emberRoutingLocationAuto_location2 = _interopRequireDefault(_emberRoutingLocationAuto_location);

var _emberRoutingLocationHistory_location = require('ember-routing/location/history_location');

var _emberRoutingLocationHistory_location2 = _interopRequireDefault(_emberRoutingLocationHistory_location);

var _emberRoutingLocationHash_location = require('ember-routing/location/hash_location');

var _emberRoutingLocationHash_location2 = _interopRequireDefault(_emberRoutingLocationHash_location);

var _emberRoutingLocationNone_location = require('ember-routing/location/none_location');

var _emberRoutingLocationNone_location2 = _interopRequireDefault(_emberRoutingLocationNone_location);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

function mockBrowserLocation(overrides) {
  return (0, _emberMetalMerge2['default'])({
    href: 'http://test.com/',
    pathname: '/',
    hash: '',
    search: '',
    replace: function replace() {
      ok(false, 'location.replace should not be called during testing');
    }
  }, overrides);
}

function mockBrowserHistory(overrides) {
  return (0, _emberMetalMerge2['default'])({
    pushState: function pushState() {
      ok(false, 'history.pushState should not be called during testing');
    },
    replaceState: function replaceState() {
      ok(false, 'history.replaceState should not be called during testing');
    }
  }, overrides);
}

function createLocation(location, history) {
  var registry = new _containerRegistry2['default']();

  registry.register('location:history', _emberRoutingLocationHistory_location2['default']);
  registry.register('location:hash', _emberRoutingLocationHash_location2['default']);
  registry.register('location:none', _emberRoutingLocationNone_location2['default']);

  return _emberRoutingLocationAuto_location2['default'].create({
    container: registry.container(),
    location: location,
    history: history,
    global: {}
  });
}

var location;

QUnit.module('Ember.AutoLocation', {
  teardown: function teardown() {
    if (location) {
      (0, _emberMetalRun_loop2['default'])(location, 'destroy');
    }
  }
});

QUnit.test('AutoLocation should return concrete implementation\'s value for `getURL`', function () {
  expect(1);

  var browserLocation = mockBrowserLocation();
  var browserHistory = mockBrowserHistory();

  location = createLocation(browserLocation, browserHistory);
  location.detect();

  var concreteImplementation = (0, _emberMetalProperty_get.get)(location, 'concreteImplementation');

  concreteImplementation.getURL = function () {
    return '/lincoln/park';
  };

  equal(location.getURL(), '/lincoln/park');
});

QUnit.test('AutoLocation should use a HistoryLocation instance when pushStates is supported', function () {
  expect(1);

  var browserLocation = mockBrowserLocation();
  var browserHistory = mockBrowserHistory();

  location = createLocation(browserLocation, browserHistory);
  location.detect();

  ok((0, _emberMetalProperty_get.get)(location, 'concreteImplementation') instanceof _emberRoutingLocationHistory_location2['default']);
});

QUnit.test('AutoLocation should use a HashLocation instance when pushStates are not supported, but hashchange events are and the URL is already in the HashLocation format', function () {
  expect(1);

  var browserLocation = mockBrowserLocation({
    hash: '#/testd'
  });

  location = createLocation(browserLocation);
  location.global = {
    onhashchange: function onhashchange() {}
  };

  location.detect();
  ok((0, _emberMetalProperty_get.get)(location, 'concreteImplementation') instanceof _emberRoutingLocationHash_location2['default']);
});

QUnit.test('AutoLocation should use a NoneLocation instance when neither history nor hashchange are supported.', function () {
  expect(1);

  location = createLocation(mockBrowserLocation());
  location.detect();

  ok((0, _emberMetalProperty_get.get)(location, 'concreteImplementation') instanceof _emberRoutingLocationNone_location2['default']);
});

QUnit.test('AutoLocation should use an index path (i.e. \'/\') without any location.hash as OK for HashLocation', function () {
  expect(1);

  var browserLocation = mockBrowserLocation({
    href: 'http://test.com/',
    pathname: '/',
    hash: '',
    search: '',
    replace: function replace(path) {
      ok(false, 'location.replace should not be called');
    }
  });

  location = createLocation(browserLocation);
  location.global = {
    onhashchange: function onhashchange() {}
  };

  location.detect();

  ok((0, _emberMetalProperty_get.get)(location, 'concreteImplementation') instanceof _emberRoutingLocationHash_location2['default'], 'uses a HashLocation');
});

QUnit.test('AutoLocation should transform the URL for hashchange-only browsers viewing a HistoryLocation-formatted path', function () {
  expect(3);

  var browserLocation = mockBrowserLocation({
    hash: '',
    hostname: 'test.com',
    href: 'http://test.com/test',
    pathname: '/test',
    protocol: 'http:',
    port: '',
    search: '',

    replace: function replace(path) {
      equal(path, 'http://test.com/#/test', 'location.replace should be called with normalized HashLocation path');
    }
  });

  var location = createLocation(browserLocation);
  location.global = {
    onhashchange: function onhashchange() {}
  };

  location.detect();

  ok((0, _emberMetalProperty_get.get)(location, 'concreteImplementation') instanceof _emberRoutingLocationNone_location2['default'], 'NoneLocation should be used while we attempt to location.replace()');
  equal((0, _emberMetalProperty_get.get)(location, 'cancelRouterSetup'), true, 'cancelRouterSetup should be set so the router knows.');
});

QUnit.test('AutoLocation should replace the URL for pushState-supported browsers viewing a HashLocation-formatted url', function () {
  expect(2);

  var browserLocation = mockBrowserLocation({
    hash: '#/test',
    hostname: 'test.com',
    href: 'http://test.com/#/test',
    pathname: '/',
    protocol: 'http:',
    port: '',
    search: ''
  });

  var browserHistory = mockBrowserHistory({
    replaceState: function replaceState(state, title, path) {
      equal(path, '/test', 'history.replaceState should be called with normalized HistoryLocation url');
    }
  });

  var location = createLocation(browserLocation, browserHistory);
  location.detect();

  ok((0, _emberMetalProperty_get.get)(location, 'concreteImplementation'), _emberRoutingLocationHistory_location2['default']);
});

QUnit.test('AutoLocation requires any rootURL given to end in a trailing forward slash', function () {
  expect(3);
  var browserLocation = mockBrowserLocation();
  var expectedMsg = /rootURL must end with a trailing forward slash e.g. "\/app\/"/;

  location = createLocation(browserLocation);
  location.rootURL = 'app';

  expectAssertion(function () {
    location.detect();
  }, expectedMsg);

  location.rootURL = '/app';
  expectAssertion(function () {
    location.detect();
  }, expectedMsg);

  // Note the trailing whitespace
  location.rootURL = '/app/ ';
  expectAssertion(function () {
    location.detect();
  }, expectedMsg);
});

QUnit.test('AutoLocation provides its rootURL to the concreteImplementation', function () {
  expect(1);
  var browserLocation = mockBrowserLocation({
    pathname: '/some/subdir/derp'
  });
  var browserHistory = mockBrowserHistory();

  location = createLocation(browserLocation, browserHistory);
  location.rootURL = '/some/subdir/';

  location.detect();

  var concreteLocation = (0, _emberMetalProperty_get.get)(location, 'concreteImplementation');
  equal(location.rootURL, concreteLocation.rootURL);
});

QUnit.test('getHistoryPath() should return a normalized, HistoryLocation-supported path', function () {
  expect(3);

  var browserLocation = mockBrowserLocation({
    href: 'http://test.com/app/about?foo=bar#foo',
    pathname: '/app/about',
    search: '?foo=bar',
    hash: '#foo'
  });

  equal((0, _emberRoutingLocationAuto_location.getHistoryPath)('/app/', browserLocation), '/app/about?foo=bar#foo', 'URLs already in HistoryLocation form should come out the same');

  browserLocation = mockBrowserLocation({
    href: 'http://test.com/app/#/about?foo=bar#foo',
    pathname: '/app/',
    search: '',
    hash: '#/about?foo=bar#foo'
  });
  equal((0, _emberRoutingLocationAuto_location.getHistoryPath)('/app/', browserLocation), '/app/about?foo=bar#foo', 'HashLocation formed URLs should be normalized');

  browserLocation = mockBrowserLocation({
    href: 'http://test.com/app/#about?foo=bar#foo',
    pathname: '/app/',
    search: '',
    hash: '#about?foo=bar#foo'
  });
  equal((0, _emberRoutingLocationAuto_location.getHistoryPath)('/app', browserLocation), '/app/#about?foo=bar#foo', 'URLs with a hash not following #/ convention shouldn\'t be normalized as a route');
});

QUnit.test('getHashPath() should return a normalized, HashLocation-supported path', function () {
  expect(3);

  var browserLocation = mockBrowserLocation({
    href: 'http://test.com/app/#/about?foo=bar#foo',
    pathname: '/app/',
    search: '',
    hash: '#/about?foo=bar#foo'
  });
  equal((0, _emberRoutingLocationAuto_location.getHashPath)('/app/', browserLocation), '/app/#/about?foo=bar#foo', 'URLs already in HistoryLocation form should come out the same');

  browserLocation = mockBrowserLocation({
    href: 'http://test.com/app/about?foo=bar#foo',
    pathname: '/app/about',
    search: '?foo=bar',
    hash: '#foo'
  });
  equal((0, _emberRoutingLocationAuto_location.getHashPath)('/app/', browserLocation), '/app/#/about?foo=bar#foo', 'HistoryLocation formed URLs should be normalized');

  browserLocation = mockBrowserLocation({
    href: 'http://test.com/app/#about?foo=bar#foo',
    pathname: '/app/',
    search: '',
    hash: '#about?foo=bar#foo'
  });

  equal((0, _emberRoutingLocationAuto_location.getHashPath)('/app/', browserLocation), '/app/#/#about?foo=bar#foo', 'URLs with a hash not following #/ convention shouldn\'t be normalized as a route');
});