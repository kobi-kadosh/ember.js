'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/**
@module ember
@submodule ember-routing
*/

/**
  Ember.NoneLocation does not interact with the browser. It is useful for
  testing, or when you need to manage state with your Router, but temporarily
  don't want it to muck with the URL (for example when you embed your
  application in a larger page).

  @class NoneLocation
  @namespace Ember
  @extends Ember.Object
  @private
*/
exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  implementation: 'none',
  path: '',

  /**
    Returns the current path.
      @private
    @method getURL
    @return {String} path
  */
  getURL: function getURL() {
    return (0, _emberMetalProperty_get.get)(this, 'path');
  },

  /**
    Set the path and remembers what was set. Using this method
    to change the path will not invoke the `updateURL` callback.
      @private
    @method setURL
    @param path {String}
  */
  setURL: function setURL(path) {
    (0, _emberMetalProperty_set.set)(this, 'path', path);
  },

  /**
    Register a callback to be invoked when the path changes. These
    callbacks will execute when the user presses the back or forward
    button, but not after `setURL` is invoked.
      @private
    @method onUpdateURL
    @param callback {Function}
  */
  onUpdateURL: function onUpdateURL(callback) {
    this.updateCallback = callback;
  },

  /**
    Sets the path and calls the `updateURL` callback.
      @private
    @method handleURL
    @param callback {Function}
  */
  handleURL: function handleURL(url) {
    (0, _emberMetalProperty_set.set)(this, 'path', url);
    this.updateCallback(url);
  },

  /**
    Given a URL, formats it to be placed into the page as part
    of an element's `href` attribute.
      This is used, for example, when using the {{action}} helper
    to generate a URL based on an event.
      @private
    @method formatURL
    @param url {String}
    @return {String} url
  */
  formatURL: function formatURL(url) {
    // The return value is not overly meaningful, but we do not want to throw
    // errors when test code renders templates containing {{action href=true}}
    // helpers.
    return url;
  }
});
module.exports = exports['default'];