/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getRoot;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalPath_cache = require('ember-metal/path_cache');

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

function getRoot(scope, key) {
  if (key === 'this') {
    return [scope.self];
  } else if (key === 'hasBlock') {
    return [!!scope.blocks['default']];
  } else if (key === 'hasBlockParams') {
    return [!!(scope.blocks['default'] && scope.blocks['default'].arity)];
  } else if ((0, _emberMetalPath_cache.isGlobal)(key) && _emberMetalCore2['default'].lookup[key]) {
    return [getGlobal(key)];
  } else if (key in scope.locals) {
    return [scope.locals[key]];
  } else {
    return [getKey(scope, key)];
  }
}

function getKey(scope, key) {
  if (key === 'attrs' && scope.attrs) {
    return scope.attrs;
  }

  var self = scope.self || scope.locals.view;

  if (self) {
    return self.getKey(key);
  } else if (scope.attrs && key in scope.attrs) {
    // TODO: attrs
    // Ember.deprecate("You accessed the `" + key + "` attribute directly. Please use `attrs." + key + "` instead.");
    return scope.attrs[key];
  }
}

function getGlobal(name) {
  _emberMetalCore2['default'].deprecate('Global lookup of ' + name + ' from a Handlebars template is deprecated.');

  // This stream should be memoized, but this path is deprecated and
  // will be removed soon so it's not worth the trouble.
  return new _emberMetalStreamsProxyStream2['default'](_emberMetalCore2['default'].lookup[name], name);
}
module.exports = exports['default'];