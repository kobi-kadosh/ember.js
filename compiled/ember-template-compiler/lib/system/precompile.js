/**
@module ember
@submodule ember-template-compiler
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerSystemCompile_options = require('ember-template-compiler/system/compile_options');

var _emberTemplateCompilerSystemCompile_options2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile_options);

var compileSpec;

/**
  Uses HTMLBars `compile` function to process a string into a compiled template string.
  The returned string must be passed through `Ember.HTMLBars.template`.

  This is not present in production builds.

  @private
  @method precompile
  @param {String} templateString This is the string to be compiled by HTMLBars.
*/

exports['default'] = function (templateString, options) {
  if (!compileSpec && _emberMetalCore2['default'].__loader.registry['htmlbars-compiler/compiler']) {
    compileSpec = requireModule('htmlbars-compiler/compiler').compileSpec;
  }

  if (!compileSpec) {
    throw new Error('Cannot call `compileSpec` without the template compiler loaded. Please load `ember-template-compiler.js` prior to calling `compileSpec`.');
  }

  return compileSpec(templateString, (0, _emberTemplateCompilerSystemCompile_options2['default'])(options));
};

module.exports = exports['default'];