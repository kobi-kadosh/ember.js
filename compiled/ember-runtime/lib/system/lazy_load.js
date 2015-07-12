/*globals CustomEvent */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.onLoad = onLoad;
exports.runLoadHooks = runLoadHooks;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.ENV.EMBER_LOAD_HOOKS

require('ember-runtime/system/native_array');

// make sure Ember.A is setup.

/**
  @module ember
  @submodule ember-runtime
*/

var loadHooks = _emberMetalCore2['default'].ENV.EMBER_LOAD_HOOKS || {};
var loaded = {};

/**
  Detects when a specific package of Ember (e.g. 'Ember.Handlebars')
  has fully loaded and is available for extension.

  The provided `callback` will be called with the `name` passed
  resolved from a string into the object:

  ``` javascript
  Ember.onLoad('Ember.Handlebars' function(hbars) {
    hbars.registerHelper(...);
  });
  ```

  @method onLoad
  @for Ember
  @param name {String} name of hook
  @param callback {Function} callback to be called
  @private
*/

function onLoad(name, callback) {
  var object;

  loadHooks[name] = loadHooks[name] || _emberMetalCore2['default'].A();
  loadHooks[name].pushObject(callback);

  if (object = loaded[name]) {
    callback(object);
  }
}

/**
  Called when an Ember.js package (e.g Ember.Handlebars) has finished
  loading. Triggers any callbacks registered for this event.

  @method runLoadHooks
  @for Ember
  @param name {String} name of hook
  @param object {Object} object to pass to callbacks
  @private
*/

function runLoadHooks(name, object) {
  loaded[name] = object;

  if (typeof window === 'object' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
    var event = new CustomEvent(name, { detail: object, name: name });
    window.dispatchEvent(event);
  }

  if (loadHooks[name]) {
    loadHooks[name].forEach(function (callback) {
      return callback(object);
    });
  }
}