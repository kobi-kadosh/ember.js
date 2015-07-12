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

var _emberTemplateCompilerSystemTemplate = require('ember-template-compiler/system/template');

var _emberTemplateCompilerSystemTemplate2 = _interopRequireDefault(_emberTemplateCompilerSystemTemplate);

var compile;

/**
  Uses HTMLBars `compile` function to process a string into a compiled template.

  This is not present in production builds.

  @private
  @method compile
  @param {String} templateString This is the string to be compiled by HTMLBars.
  @param {Object} options This is an options hash to augment the compiler options.
*/

exports['default'] = function (templateString, options) {
  if (!compile && _emberMetalCore2['default'].__loader.registry['htmlbars-compiler/compiler']) {
    compile = requireModule('htmlbars-compiler/compiler').compile;
  }

  if (!compile) {
    throw new Error('Cannot call `compile` without the template compiler loaded. Please load `ember-template-compiler.js` prior to calling `compile`.');
  }

  var templateSpec = compile(templateString, (0, _emberTemplateCompilerSystemCompile_options2['default'])(options));

  return (0, _emberTemplateCompilerSystemTemplate2['default'])(templateSpec);
};

module.exports = exports['default'];