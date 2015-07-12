'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _htmlbarsRuntimeHooks = require('htmlbars-runtime/hooks');

/**
@module ember
@submodule ember-template-compiler
*/

/**
  Augments the default precompiled output of an HTMLBars template with
  additional information needed by Ember.

  @private
  @method template
  @param {Function} templateSpec This is the compiled HTMLBars template spec.
*/

exports['default'] = function (templateSpec) {
  if (!templateSpec.render) {
    templateSpec = (0, _htmlbarsRuntimeHooks.wrap)(templateSpec);
  }

  templateSpec.isTop = true;
  templateSpec.isMethod = false;

  return templateSpec;
};

module.exports = exports['default'];