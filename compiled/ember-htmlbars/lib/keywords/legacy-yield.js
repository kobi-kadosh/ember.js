'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = legacyYield;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

function legacyYield(morph, env, _scope, params, hash, template, inverse, visitor) {
  var scope = _scope;

  if (scope.blocks['default'].arity === 0) {
    // Typically, the `controller` local is persists through lexical scope.
    // However, in this case, the `{{legacy-yield}}` in the legacy each view
    // needs to override the controller local for the template it is yielding.
    // This megahaxx allows us to override the controller, and most importantly,
    // prevents the downstream scope from attempting to bind the `controller` local.
    if (hash.controller) {
      scope = env.hooks.createChildScope(scope);
      scope.locals.controller = new _emberMetalStreamsProxyStream2['default'](hash.controller, 'controller');
      scope.overrideController = true;
    }
    scope.blocks['default'](env, [], params[0], morph, scope, visitor);
  } else {
    scope.blocks['default'](env, params, undefined, morph, scope, visitor);
  }

  return true;
}

module.exports = exports['default'];