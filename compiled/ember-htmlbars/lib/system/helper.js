/**
@module ember
@submodule ember-htmlbars
*/

/**
  @class Helper
  @namespace Ember.HTMLBars
  @private
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Helper(helper) {
  this.helperFunction = helper;

  this.isHelper = true;
  this.isHTMLBars = true;
}

exports["default"] = Helper;
module.exports = exports["default"];