/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = handlebarsGet;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

/**
  Lookup both on root and on window. If the path starts with
  a keyword, the corresponding object will be looked up in the
  template's data hash and used to resolve the path.

  @method get
  @for Ember.Handlebars
  @param {Object} root The object to look up the property on
  @param {String} path The path to be lookedup
  @param {Object} options The template's option hash
  @deprecated
  @public
*/

function handlebarsGet(root, path, options) {
  _emberMetalCore2['default'].deprecate('Usage of Ember.Handlebars.get is deprecated, use a Component or Ember.Handlebars.makeBoundHelper instead.');

  return options.legacyGetPath(path);
}

module.exports = exports['default'];