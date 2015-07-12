'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = templateKeyword;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var deprecation = 'The `template` helper has been deprecated in favor of the `partial` helper.';

exports.deprecation = deprecation;

function templateKeyword(morph, env, scope, params, hash, template, inverse, visitor) {
  _emberMetalCore2['default'].deprecate(deprecation);
  env.hooks.keyword('partial', morph, env, scope, params, hash, template, inverse, visitor);
  return true;
}