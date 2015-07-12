'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getHistoryPath = getHistoryPath;
exports.getHashPath = getHashPath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// FEATURES

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

var _emberRoutingLocationUtil = require('ember-routing/location/util');

/**
@module ember
@submodule ember-routing
*/

/**
  Ember.AutoLocation will select the best location option based off browser
  support with the priority order: history, hash, none.

  Clean pushState paths accessed by hashchange-only browsers will be redirected
  to the hash-equivalent and vice versa so future transitions are consistent.

  Keep in mind that since some of your users will use `HistoryLocation`, your
  server must serve the Ember app at all the routes you define.

  @class AutoLocation
  @namespace Ember
  @static
  @private
*/
exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  /**
    @private
      The browser's `location` object. This is typically equivalent to
    `window.location`, but may be overridden for testing.
      @property location
    @default environment.location
  */
  location: _emberMetalEnvironment2['default'].location,

  /**
    @private
      The browser's `history` object. This is typically equivalent to
    `window.history`, but may be overridden for testing.
      @since 1.5.1
    @property history
    @default environment.history
  */
  history: _emberMetalEnvironment2['default'].history,

  /**
   @private
     The user agent's global variable. In browsers, this will be `window`.
     @since 1.11
   @property global
   @default environment.global
  */
  global: _emberMetalEnvironment2['default'].global,

  /**
    @private
      The browser's `userAgent`. This is typically equivalent to
    `navigator.userAgent`, but may be overridden for testing.
      @since 1.5.1
    @property userAgent
    @default environment.history
  */
  userAgent: _emberMetalEnvironment2['default'].userAgent,

  /**
    @private
      This property is used by the router to know whether to cancel the routing
    setup process, which is needed while we redirect the browser.
      @since 1.5.1
    @property cancelRouterSetup
    @default false
  */
  cancelRouterSetup: false,

  /**
    @private
      Will be pre-pended to path upon state change.
      @since 1.5.1
    @property rootURL
    @default '/'
  */
  rootURL: '/',

  /**
   Called by the router to instruct the location to do any feature detection
   necessary. In the case of AutoLocation, we detect whether to use history
   or hash concrete implementations.
     @private
  */
  detect: function detect() {
    var rootURL = this.rootURL;

    _emberMetalCore2['default'].assert('rootURL must end with a trailing forward slash e.g. "/app/"', rootURL.charAt(rootURL.length - 1) === '/');

    var implementation = detectImplementation({
      location: this.location,
      history: this.history,
      userAgent: this.userAgent,
      rootURL: rootURL,
      documentMode: this.documentMode,
      global: this.global
    });

    if (implementation === false) {
      (0, _emberMetalProperty_set.set)(this, 'cancelRouterSetup', true);
      implementation = 'none';
    }

    var concrete = this.container.lookup('location:' + implementation);
    (0, _emberMetalProperty_set.set)(concrete, 'rootURL', rootURL);

    _emberMetalCore2['default'].assert('Could not find location \'' + implementation + '\'.', !!concrete);

    (0, _emberMetalProperty_set.set)(this, 'concreteImplementation', concrete);
  },

  initState: delegateToConcreteImplementation('initState'),
  getURL: delegateToConcreteImplementation('getURL'),
  setURL: delegateToConcreteImplementation('setURL'),
  replaceURL: delegateToConcreteImplementation('replaceURL'),
  onUpdateURL: delegateToConcreteImplementation('onUpdateURL'),
  formatURL: delegateToConcreteImplementation('formatURL'),

  willDestroy: function willDestroy() {
    var concreteImplementation = (0, _emberMetalProperty_get.get)(this, 'concreteImplementation');

    if (concreteImplementation) {
      concreteImplementation.destroy();
    }
  }
});

function delegateToConcreteImplementation(methodName) {
  return function () {
    var concreteImplementation = (0, _emberMetalProperty_get.get)(this, 'concreteImplementation');
    _emberMetalCore2['default'].assert('AutoLocation\'s detect() method should be called before calling any other hooks.', !!concreteImplementation);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _emberMetalUtils.tryInvoke)(concreteImplementation, methodName, args);
  };
}

/*
  Given the browser's `location`, `history` and `userAgent`, and a configured
  root URL, this function detects whether the browser supports the [History
  API](https://developer.mozilla.org/en-US/docs/Web/API/History) and returns a
  string representing the Location object to use based on its determination.

  For example, if the page loads in an evergreen browser, this function would
  return the string "history", meaning the history API and thus HistoryLocation
  should be used. If the page is loaded in IE8, it will return the string
  "hash," indicating that the History API should be simulated by manipulating the
  hash portion of the location.

*/

function detectImplementation(options) {
  var location = options.location;
  var userAgent = options.userAgent;
  var history = options.history;
  var documentMode = options.documentMode;
  var global = options.global;
  var rootURL = options.rootURL;

  var implementation = 'none';
  var cancelRouterSetup = false;
  var currentPath = (0, _emberRoutingLocationUtil.getFullPath)(location);

  if ((0, _emberRoutingLocationUtil.supportsHistory)(userAgent, history)) {
    var historyPath = getHistoryPath(rootURL, location);

    // If the browser supports history and we have a history path, we can use
    // the history location with no redirects.
    if (currentPath === historyPath) {
      return 'history';
    } else {
      if (currentPath.substr(0, 2) === '/#') {
        history.replaceState({ path: historyPath }, null, historyPath);
        implementation = 'history';
      } else {
        cancelRouterSetup = true;
        (0, _emberRoutingLocationUtil.replacePath)(location, historyPath);
      }
    }
  } else if ((0, _emberRoutingLocationUtil.supportsHashChange)(documentMode, global)) {
    var hashPath = getHashPath(rootURL, location);

    // Be sure we're using a hashed path, otherwise let's switch over it to so
    // we start off clean and consistent. We'll count an index path with no
    // hash as "good enough" as well.
    if (currentPath === hashPath || currentPath === '/' && hashPath === '/#/') {
      implementation = 'hash';
    } else {
      // Our URL isn't in the expected hash-supported format, so we want to
      // cancel the router setup and replace the URL to start off clean
      cancelRouterSetup = true;
      (0, _emberRoutingLocationUtil.replacePath)(location, hashPath);
    }
  }

  if (cancelRouterSetup) {
    return false;
  }

  return implementation;
}

/**
  @private

  Returns the current path as it should appear for HistoryLocation supported
  browsers. This may very well differ from the real current path (e.g. if it
  starts off as a hashed URL)
*/

function getHistoryPath(rootURL, location) {
  var path = (0, _emberRoutingLocationUtil.getPath)(location);
  var hash = (0, _emberRoutingLocationUtil.getHash)(location);
  var query = (0, _emberRoutingLocationUtil.getQuery)(location);
  var rootURLIndex = path.indexOf(rootURL);
  var routeHash, hashParts;

  _emberMetalCore2['default'].assert('Path ' + path + ' does not start with the provided rootURL ' + rootURL, rootURLIndex === 0);

  // By convention, Ember.js routes using HashLocation are required to start
  // with `#/`. Anything else should NOT be considered a route and should
  // be passed straight through, without transformation.
  if (hash.substr(0, 2) === '#/') {
    // There could be extra hash segments after the route
    hashParts = hash.substr(1).split('#');
    // The first one is always the route url
    routeHash = hashParts.shift();

    // If the path already has a trailing slash, remove the one
    // from the hashed route so we don't double up.
    if (path.slice(-1) === '/') {
      routeHash = routeHash.substr(1);
    }

    // This is the "expected" final order
    path = path + routeHash + query;

    if (hashParts.length) {
      path += '#' + hashParts.join('#');
    }
  } else {
    path = path + query + hash;
  }

  return path;
}

/**
  @private

  Returns the current path as it should appear for HashLocation supported
  browsers. This may very well differ from the real current path.

  @method _getHashPath
*/

function getHashPath(rootURL, location) {
  var path = rootURL;
  var historyPath = getHistoryPath(rootURL, location);
  var routePath = historyPath.substr(rootURL.length);

  if (routePath !== '') {
    if (routePath.charAt(0) !== '/') {
      routePath = '/' + routePath;
    }

    path += '#' + routePath;
  }

  return path;
}