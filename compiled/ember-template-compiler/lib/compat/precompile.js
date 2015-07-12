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

var compile, compileSpec;

exports['default'] = function (string) {
  if ((!compile || !compileSpec) && _emberMetalCore2['default'].__loader.registry['htmlbars-compiler/compiler']) {
    var Compiler = requireModule('htmlbars-compiler/compiler');

    compile = Compiler.compile;
    compileSpec = Compiler.compileSpec;
  }

  if (!compile || !compileSpec) {
    throw new Error('Cannot call `precompile` without the template compiler loaded. Please load `ember-template-compiler.js` prior to calling `precompile`.');
  }

  var asObject = arguments[1] === undefined ? true : arguments[1];
  var compileFunc = asObject ? compile : compileSpec;

  return compileFunc(string, (0, _emberTemplateCompilerSystemCompile_options2['default'])());
};

module.exports = exports['default'];