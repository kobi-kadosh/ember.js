/**
@module ember
@submodule ember-htmlbars
*/

/**
 @private
 @property helpers
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHelper = registerHelper;
var helpers = Object.create(null);

/**
@module ember
@submodule ember-htmlbars
*/

/**
  @private
  @method _registerHelper
  @for Ember.HTMLBars
  @param {String} name
  @param {Object|Function} helperFunc the helper function to add
*/

function registerHelper(name, helperFunc) {
  helpers[name] = helperFunc;
}

exports["default"] = helpers;