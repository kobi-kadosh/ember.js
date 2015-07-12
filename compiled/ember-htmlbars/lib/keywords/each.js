/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = each;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

function each(morph, env, scope, params, hash, template, inverse, visitor) {
  var getValue = env.hooks.getValue;
  var firstParam = params[0] && getValue(params[0]);
  var keyword = hash['-legacy-keyword'] && getValue(hash['-legacy-keyword']);

  if (firstParam && firstParam instanceof _emberRuntimeControllersArray_controller2['default']) {
    env.hooks.block(morph, env, scope, '-legacy-each-with-controller', params, hash, template, inverse, visitor);
    return true;
  }

  if (keyword) {
    env.hooks.block(morph, env, scope, '-legacy-each-with-keyword', params, hash, template, inverse, visitor);
    return true;
  }

  return false;
}

module.exports = exports['default'];