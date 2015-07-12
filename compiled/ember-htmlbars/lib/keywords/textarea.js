/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = textarea;

function textarea(morph, env, scope, originalParams, hash, template, inverse, visitor) {
  env.hooks.component(morph, env, scope, '-text-area', originalParams, hash, { 'default': template, inverse: inverse }, visitor);
  return true;
}

module.exports = exports['default'];