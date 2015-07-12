/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = unbound;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function unbound(morph, env, scope, originalParams, hash, template, inverse) {
  // Since we already got the params as a set of streams, we need to extract the key from
  // the first param instead of (incorrectly) trying to read from it. If this was a call
  // to `{{unbound foo.bar}}`, then we pass along the original stream to `hooks.range`.
  var params = originalParams.slice();
  var valueStream = params.shift();

  // If `morph` is `null` the keyword is being invoked as a subexpression.
  if (morph === null) {
    if (originalParams.length > 1) {
      valueStream = env.hooks.subexpr(env, scope, valueStream.key, params, hash);
    }

    return new VolatileStream(valueStream);
  }

  if (params.length === 0) {
    env.hooks.range(morph, env, scope, null, valueStream);
  } else if (template === null) {
    env.hooks.inline(morph, env, scope, valueStream.key, params, hash);
  } else {
    env.hooks.block(morph, env, scope, valueStream.key, params, hash, template, inverse);
  }

  return true;
}

function VolatileStream(source) {
  this.init('(volatile ' + source.label + ')');
  this.source = source;

  this.addDependency(source);
}

VolatileStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(VolatileStream.prototype, {
  value: function value() {
    return (0, _emberMetalStreamsUtils.read)(this.source);
  },

  notify: function notify() {}
});
module.exports = exports['default'];