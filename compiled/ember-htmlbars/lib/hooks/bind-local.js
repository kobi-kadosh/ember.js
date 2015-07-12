/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bindLocal;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

function bindLocal(env, scope, key, value) {
  var isExisting = scope.locals.hasOwnProperty(key);
  if (isExisting) {
    var existing = scope.locals[key];

    if (existing !== value) {
      existing.setSource(value);
    }
  } else {
    var newValue = _emberMetalStreamsStream2['default'].wrap(value, _emberMetalStreamsProxyStream2['default'], key);
    scope.locals[key] = newValue;
  }
}

module.exports = exports['default'];