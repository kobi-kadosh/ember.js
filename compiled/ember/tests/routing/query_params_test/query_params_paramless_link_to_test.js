'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var compile = _emberHtmlbarsCompat2['default'].compile;

var App, Router, container, router, registry;
var expectedReplaceURL, expectedPushURL;

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

function bootApplication() {
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

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

var startingURL = '';

var testParamlessLinks = function testParamlessLinks(routeName) {
  QUnit.test('param-less links in an app booted with query params in the URL don\'t reset the query params: ' + routeName, function () {
    expect(1);

    _emberMetalCore2['default'].TEMPLATES[routeName] = compile('{{link-to \'index\' \'index\' id=\'index-link\'}}');

    App[(0, _emberRuntimeSystemString.capitalize)(routeName) + 'Controller'] = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: 'wat'
    });

    startingURL = '/?foo=YEAH';
    bootApplication();

    equal(_emberMetalCore2['default'].$('#index-link').attr('href'), '/?foo=YEAH');
  });
};

var testParamlessLinksWithRouteConfig = function testParamlessLinksWithRouteConfig(routeName) {
  QUnit.test('param-less links in an app booted with query params in the URL don\'t reset the query params: ' + routeName, function () {
    expect(1);

    _emberMetalCore2['default'].TEMPLATES[routeName] = compile('{{link-to \'index\' \'index\' id=\'index-link\'}}');

    App[(0, _emberRuntimeSystemString.capitalize)(routeName) + 'Route'] = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: 'wat'
        }
      }
    });

    startingURL = '/?foo=YEAH';
    bootApplication();

    equal(_emberMetalCore2['default'].$('#index-link').attr('href'), '/?foo=YEAH');
  });
};

if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
  testParamlessLinksWithRouteConfig('application');
  testParamlessLinksWithRouteConfig('index');
} else {
  testParamlessLinks('application');
  testParamlessLinks('index');
}