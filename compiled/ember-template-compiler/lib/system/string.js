/**
@module ember
@submodule ember-template-compiler
*/

// This module is duplicated from ember-runtime to support bind-attr.

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.decamelize = decamelize;
exports.dasherize = dasherize;
var STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
var STRING_DASHERIZE_REGEXP = /[ _]/g;

function decamelize(str) {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

function dasherize(str) {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}