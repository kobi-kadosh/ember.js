'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRoutingLocationHash_location = require('ember-routing/location/hash_location');

var _emberRoutingLocationHash_location2 = _interopRequireDefault(_emberRoutingLocationHash_location);

var HashTestLocation, location;

function createLocation(options) {
  if (!options) {
    options = {};
  }
  location = HashTestLocation.create(options);
}

function mockBrowserLocation(path) {
  // This is a neat trick to auto-magically extract the hostname from any
  // url by letting the browser do the work ;)
  var tmp = document.createElement('a');
  tmp.href = path;

  var protocol = !tmp.protocol || tmp.protocol === ':' ? 'http' : tmp.protocol;
  var pathname = tmp.pathname.match(/^\//) ? tmp.pathname : '/' + tmp.pathname;

  return {
    hash: tmp.hash,
    host: tmp.host || 'localhost',
    hostname: tmp.hostname || 'localhost',
    href: tmp.href,
    pathname: pathname,
    port: tmp.port || '',
    protocol: protocol,
    search: tmp.search
  };
}

QUnit.module('Ember.HashLocation', {
  setup: function setup() {
    HashTestLocation = _emberRoutingLocationHash_location2['default'].extend({
      _location: {
        href: 'http://test.com/',
        pathname: '/',
        hash: '',
        search: '',
        replace: function replace() {
          ok(false, 'location.replace should not be called during testing');
        }
      }
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (location) {
        location.destroy();
      }
    });
  }
});

QUnit.test('HashLocation.getURL() returns the current url', function () {
  expect(1);

  createLocation({
    _location: mockBrowserLocation('/#/foo/bar')
  });

  equal(location.getURL(), '/foo/bar');
});

QUnit.test('HashLocation.getURL() includes extra hashes', function () {
  expect(1);

  createLocation({
    _location: mockBrowserLocation('/#/foo#bar#car')
  });

  equal(location.getURL(), '/foo#bar#car');
});

QUnit.test('HashLocation.getURL() assumes location.hash without #/ prefix is not a route path', function () {
  expect(1);

  createLocation({
    _location: mockBrowserLocation('/#foo#bar')
  });

  equal(location.getURL(), '/#foo#bar');
});

QUnit.test('HashLocation.getURL() returns a normal forward slash when there is no location.hash', function () {
  expect(1);

  createLocation({
    _location: mockBrowserLocation('/')
  });

  equal(location.getURL(), '/');
});

QUnit.test('HashLocation.setURL() correctly sets the url', function () {
  expect(2);

  createLocation();

  location.setURL('/bar');

  equal((0, _emberMetalProperty_get.get)(location, 'location.hash'), '/bar');
  equal((0, _emberMetalProperty_get.get)(location, 'lastSetURL'), '/bar');
});

QUnit.test('HashLocation.replaceURL() correctly replaces to the path with a page reload', function () {
  expect(2);

  createLocation({
    _location: {
      replace: function replace(path) {
        equal(path, '#/foo');
      }
    }
  });

  location.replaceURL('/foo');

  equal((0, _emberMetalProperty_get.get)(location, 'lastSetURL'), '/foo');
});

QUnit.test('HashLocation.onUpdateURL() registers a hashchange callback', function () {
  expect(3);

  var oldJquery = _emberMetalCore2['default'].$;

  _emberMetalCore2['default'].$ = function (element) {
    equal(element, window);
    return {
      on: function on(eventName, callback) {
        equal(eventName, 'hashchange.ember-location-' + guid);
        equal(Object.prototype.toString.call(callback), '[object Function]');
      }
    };
  };

  createLocation({
    // Mock so test teardown doesn't fail
    willDestroy: function willDestroy() {}
  });

  var guid = (0, _emberMetalUtils.guidFor)(location);

  location.onUpdateURL(function () {});

  // clean up
  _emberMetalCore2['default'].$ = oldJquery;
});

QUnit.test('HashLocation.onUpdateURL callback executes as expected', function () {
  expect(1);

  createLocation({
    _location: mockBrowserLocation('/#/foo/bar')
  });

  var callback = function callback(param) {
    equal(param, '/foo/bar', 'path is passed as param');
  };

  location.onUpdateURL(callback);

  _emberMetalCore2['default'].$(window).trigger('hashchange');
});

QUnit.test('HashLocation.onUpdateURL doesn\'t execute callback if lastSetURL === path', function () {
  expect(0);

  createLocation({
    _location: {
      href: '/#/foo/bar'
    },
    lastSetURL: '/foo/bar'
  });

  var callback = function callback(param) {
    ok(false, 'callback should not be called');
  };

  location.onUpdateURL(callback);

  _emberMetalCore2['default'].$(window).trigger('hashchange');
});

QUnit.test('HashLocation.formatURL() prepends a # to the provided string', function () {
  expect(1);

  createLocation();

  equal(location.formatURL('/foo#bar'), '#/foo#bar');
});

QUnit.test('HashLocation.willDestroy() cleans up hashchange event listener', function () {
  expect(2);

  var oldJquery = _emberMetalCore2['default'].$;

  _emberMetalCore2['default'].$ = function (element) {
    equal(element, window);

    return {
      off: function off(eventName) {
        equal(eventName, 'hashchange.ember-location-' + guid);
      }
    };
  };

  createLocation();

  var guid = (0, _emberMetalUtils.guidFor)(location);

  location.willDestroy();

  // noop so test teardown doesn't call our mocked jQuery again
  location.willDestroy = function () {};

  // clean up
  _emberMetalCore2['default'].$ = oldJquery;
});