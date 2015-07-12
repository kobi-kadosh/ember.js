'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRoutingLocationApi = require('ember-routing/location/api');

var _emberRoutingLocationApi2 = _interopRequireDefault(_emberRoutingLocationApi);

/**
@module ember
@submodule ember-routing
*/

/**
  `Ember.HashLocation` implements the location API using the browser's
  hash. At present, it relies on a `hashchange` event existing in the
  browser.

  @class HashLocation
  @namespace Ember
  @extends Ember.Object
  @private
*/
exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  implementation: 'hash',

  init: function init() {
    (0, _emberMetalProperty_set.set)(this, 'location', (0, _emberMetalProperty_get.get)(this, '_location') || window.location);
  },

  /**
    @private
      Returns normalized location.hash
      @since 1.5.1
    @method getHash
  */
  getHash: _emberRoutingLocationApi2['default']._getHash,

  /**
    Returns the normalized URL, constructed from `location.hash`.
      e.g. `#/foo` => `/foo` as well as `#/foo#bar` => `/foo#bar`.
      By convention, hashed paths must begin with a forward slash, otherwise they
    are not treated as a path so we can distinguish intent.
      @private
    @method getURL
  */
  getURL: function getURL() {
    var originalPath = this.getHash().substr(1);
    var outPath = originalPath;

    if (outPath.charAt(0) !== '/') {
      outPath = '/';

      // Only add the # if the path isn't empty.
      // We do NOT want `/#` since the ampersand
      // is only included (conventionally) when
      // the location.hash has a value
      if (originalPath) {
        outPath += '#' + originalPath;
      }
    }

    return outPath;
  },

  /**
    Set the `location.hash` and remembers what was set. This prevents
    `onUpdateURL` callbacks from triggering when the hash was set by
    `HashLocation`.
      @private
    @method setURL
    @param path {String}
  */
  setURL: function setURL(path) {
    (0, _emberMetalProperty_get.get)(this, 'location').hash = path;
    (0, _emberMetalProperty_set.set)(this, 'lastSetURL', path);
  },

  /**
    Uses location.replace to update the url without a page reload
    or history modification.
      @private
    @method replaceURL
    @param path {String}
  */
  replaceURL: function replaceURL(path) {
    (0, _emberMetalProperty_get.get)(this, 'location').replace('#' + path);
    (0, _emberMetalProperty_set.set)(this, 'lastSetURL', path);
  },

  /**
    Register a callback to be invoked when the hash changes. These
    callbacks will execute when the user presses the back or forward
    button, but not after `setURL` is invoked.
      @private
    @method onUpdateURL
    @param callback {Function}
  */
  onUpdateURL: function onUpdateURL(callback) {
    var _this = this;

    var guid = (0, _emberMetalUtils.guidFor)(this);

    _emberMetalCore2['default'].$(window).on('hashchange.ember-location-' + guid, function () {
      (0, _emberMetalRun_loop2['default'])(function () {
        var path = _this.getURL();
        if ((0, _emberMetalProperty_get.get)(_this, 'lastSetURL') === path) {
          return;
        }

        (0, _emberMetalProperty_set.set)(_this, 'lastSetURL', null);

        callback(path);
      });
    });
  },

  /**
    Given a URL, formats it to be placed into the page as part
    of an element's `href` attribute.
      This is used, for example, when using the {{action}} helper
    to generate a URL based on an event.
      @private
    @method formatURL
    @param url {String}
  */
  formatURL: function formatURL(url) {
    return '#' + url;
  },

  /**
    Cleans up the HashLocation event listener.
      @private
    @method willDestroy
  */
  willDestroy: function willDestroy() {
    var guid = (0, _emberMetalUtils.guidFor)(this);

    _emberMetalCore2['default'].$(window).off('hashchange.ember-location-' + guid);
  }
});
module.exports = exports['default'];