/**
@module ember
@submodule ember-template-compiler
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalMerge = require('ember-metal/merge');

var _emberTemplateCompilerPlugins = require('ember-template-compiler/plugins');

var _emberTemplateCompilerPlugins2 = _interopRequireDefault(_emberTemplateCompilerPlugins);

/**
  @private
  @property compileOptions
*/

exports['default'] = function (_options) {
  var disableComponentGeneration = true;
  if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-component-generation')) {
    disableComponentGeneration = false;
  }

  var options = undefined;
  // When calling `Ember.Handlebars.compile()` a second argument of `true`
  // had a special meaning (long since lost), this just gaurds against
  // `options` being true, and causing an error during compilation.
  if (_options === true) {
    options = {};
  } else {
    options = (0, _emberMetalMerge.assign)({}, _options);
  }

  options.disableComponentGeneration = disableComponentGeneration;

  var plugins = {
    ast: _emberTemplateCompilerPlugins2['default'].ast.slice()
  };

  if (options.plugins && options.plugins.ast) {
    plugins.ast = plugins.ast.concat(options.plugins.ast);
  }
  options.plugins = plugins;

  options.buildMeta = function buildMeta(program) {
    return {
      revision: 'Ember@VERSION_STRING_PLACEHOLDER',
      loc: program.loc,
      moduleName: options.moduleName
    };
  };

  return options;
};

module.exports = exports['default'];