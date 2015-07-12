'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRoutingLocationApi = require('ember-routing/location/api');

var _emberRoutingLocationApi2 = _interopRequireDefault(_emberRoutingLocationApi);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

/**
@module ember
@submodule ember-routing
*/

var popstateFired = false;

/**
  Ember.HistoryLocation implements the location API using the browser's
  history.pushState API.

  @class HistoryLocation
  @namespace Ember
  @extends Ember.Object
  @private
*/
exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  implementation: 'history',

  init: function init() {
    (0, _emberMetalProperty_set.set)(this, 'location', (0, _emberMetalProperty_get.get)(this, 'location') || window.location);
    (0, _emberMetalProperty_set.set)(this, 'baseURL', (0, _emberViewsSystemJquery2['default'])('base').attr('href') || '');
  },

  /**
    Used to set state on first call to setURL
      @private
    @method initState
  */
  initState: function initState() {
    var history = (0, _emberMetalProperty_get.get)(this, 'history') || window.history;
    (0, _emberMetalProperty_set.set)(this, 'history', history);

    if (history && 'state' in history) {
      this.supportsHistory = true;
    }

    this.replaceState(this.formatURL(this.getURL()));
  },

  /**
    Will be pre-pended to path upon state change
      @property rootURL
    @default '/'
    @private
  */
  rootURL: '/',

  /**
    Returns the current `location.pathname` without `rootURL` or `baseURL`
      @private
    @method getURL
    @return url {String}
  */
  getURL: function getURL() {
    var rootURL = (0, _emberMetalProperty_get.get)(this, 'rootURL');
    var location = (0, _emberMetalProperty_get.get)(this, 'location');
    var path = location.pathname;
    var baseURL = (0, _emberMetalProperty_get.get)(this, 'baseURL');

    rootURL = rootURL.replace(/\/$/, '');
    baseURL = baseURL.replace(/\/$/, '');

    var url = path.replace(baseURL, '').replace(rootURL, '');
    var search = location.search || '';

    url += search;
    url += this.getHash();

    return url;
  },

  /**
    Uses `history.pushState` to update the url without a page reload.
      @private
    @method setURL
    @param path {String}
  */
  setURL: function setURL(path) {
    var state = this.getState();
    path = this.formatURL(path);

    if (!state || state.path !== path) {
      this.pushState(path);
    }
  },

  /**
    Uses `history.replaceState` to update the url without a page reload
    or history modification.
      @private
    @method replaceURL
    @param path {String}
  */
  replaceURL: function replaceURL(path) {
    var state = this.getState();
    path = this.formatURL(path);

    if (!state || state.path !== path) {
      this.replaceState(path);
    }
  },

  /**
    Get the current `history.state`. Checks for if a polyfill is
    required and if so fetches this._historyState. The state returned
    from getState may be null if an iframe has changed a window's
    history.
      @private
    @method getState
    @return state {Object}
  */
  getState: function getState() {
    if (this.supportsHistory) {
      return (0, _emberMetalProperty_get.get)(this, 'history').state;
    }

    return this._historyState;
  },

  /**
   Pushes a new state.
     @private
   @method pushState
   @param path {String}
  */
  pushState: function pushState(path) {
    var state = { path: path };

    (0, _emberMetalProperty_get.get)(this, 'history').pushState(state, null, path);

    this._historyState = state;

    // used for webkit workaround
    this._previousURL = this.getURL();
  },

  /**
   Replaces the current state.
     @private
   @method replaceState
   @param path {String}
  */
  replaceState: function replaceState(path) {
    var state = { path: path };
    (0, _emberMetalProperty_get.get)(this, 'history').replaceState(state, null, path);

    this._historyState = state;

    // used for webkit workaround
    this._previousURL = this.getURL();
  },

  /**
    Register a callback to be invoked whenever the browser
    history changes, including using forward and back buttons.
      @private
    @method onUpdateURL
    @param callback {Function}
  */
  onUpdateURL: function onUpdateURL(callback) {
    var _this = this;

    var guid = (0, _emberMetalUtils.guidFor)(this);

    (0, _emberViewsSystemJquery2['default'])(window).on('popstate.ember-location-' + guid, function (e) {
      // Ignore initial page load popstate event in Chrome
      if (!popstateFired) {
        popstateFired = true;
        if (_this.getURL() === _this._previousURL) {
          return;
        }
      }
      callback(_this.getURL());
    });
  },

  /**
    Used when using `{{action}}` helper.  The url is always appended to the rootURL.
      @private
    @method formatURL
    @param url {String}
    @return formatted url {String}
  */
  formatURL: function formatURL(url) {
    var rootURL = (0, _emberMetalProperty_get.get)(this, 'rootURL');
    var baseURL = (0, _emberMetalProperty_get.get)(this, 'baseURL');

    if (url !== '') {
      rootURL = rootURL.replace(/\/$/, '');
      baseURL = baseURL.replace(/\/$/, '');
    } else if (baseURL.match(/^\//) && rootURL.match(/^\//)) {
      baseURL = baseURL.replace(/\/$/, '');
    }

    return baseURL + rootURL + url;
  },

  /**
    Cleans up the HistoryLocation event listener.
      @private
    @method willDestroy
  */
  willDestroy: function willDestroy() {
    var guid = (0, _emberMetalUtils.guidFor)(this);

    (0, _emberViewsSystemJquery2['default'])(window).off('popstate.ember-location-' + guid);
  },

  /**
    @private
      Returns normalized location.hash
      @method getHash
  */
  getHash: _emberRoutingLocationApi2['default']._getHash
});
module.exports = exports['default'];