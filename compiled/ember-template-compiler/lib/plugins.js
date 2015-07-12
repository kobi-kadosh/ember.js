/**
@module ember
@submodule ember-template-compiler
*/

/**
 @private
 @property helpers
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.registerPlugin = registerPlugin;
var plugins = {
  ast: []
};

/**
  Adds an AST plugin to be used by Ember.HTMLBars.compile.

  @private
  @method registerASTPlugin
*/

function registerPlugin(type, Plugin) {
  if (!plugins[type]) {
    throw new Error('Attempting to register "' + Plugin + '" as "' + type + '" which is not a valid HTMLBars plugin type.');
  }

  plugins[type].push(Plugin);
}

exports['default'] = plugins;