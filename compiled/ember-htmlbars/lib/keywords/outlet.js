/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _htmlbarsRuntimeHooks = require('htmlbars-runtime/hooks');

/*
 This level of delegation handles backward-compatibility with the
 `view` parameter to {{outlet}}. When we drop support for the `view`
 parameter in 2.0, this keyword should just get replaced directly
 with @real_outlet.
*/

exports['default'] = function (morph, env, scope, params, hash, template, inverse, visitor) {
  if (hash.hasOwnProperty('view') || hash.hasOwnProperty('viewClass')) {
    _emberMetalCore2['default'].deprecate('Passing `view` or `viewClass` to {{outlet}} is deprecated.');
    (0, _htmlbarsRuntimeHooks.keyword)('@customized_outlet', morph, env, scope, params, hash, template, inverse, visitor);
  } else {
    (0, _htmlbarsRuntimeHooks.keyword)('@real_outlet', morph, env, scope, params, hash, template, inverse, visitor);
  }
  return true;
};

module.exports = exports['default'];