/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.registerKeyword = registerKeyword;

var _htmlbarsRuntime = require('htmlbars-runtime');

/**
 @private
 @property helpers
*/
var keywords = Object.create(_htmlbarsRuntime.hooks.keywords);

/**
@module ember
@submodule ember-htmlbars
*/

/**
  @private
  @method _registerHelper
  @for Ember.HTMLBars
  @param {String} name
  @param {Object|Function} keyword the keyword to add
*/

function registerKeyword(name, keyword) {
  keywords[name] = keyword;
}

exports['default'] = keywords;