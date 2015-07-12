'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _htmlbarsRuntime = require('htmlbars-runtime');

exports['default'] = {
  setupState: function setupState(state, env, scope, params, hash) {
    var controller = hash.controller;

    if (controller) {
      if (!state.controller) {
        var context = params[0];
        var controllerFactory = env.container.lookupFactory('controller:' + controller);
        var parentController = scope.view ? (0, _emberMetalProperty_get.get)(scope.view, 'context') : null;

        var controllerInstance = controllerFactory.create({
          model: env.hooks.getValue(context),
          parentController: parentController,
          target: parentController
        });

        params[0] = controllerInstance;
        return { controller: controllerInstance };
      }

      return state;
    }

    return { controller: null };
  },

  isStable: function isStable() {
    return true;
  },

  isEmpty: function isEmpty(state) {
    return false;
  },

  render: function render(morph, env, scope, params, hash, template, inverse, visitor) {
    if (morph.state.controller) {
      morph.addDestruction(morph.state.controller);
      hash.controller = morph.state.controller;
    }

    _emberMetalCore2['default'].assert('{{#with foo}} must be called with a single argument or the use the ' + '{{#with foo as bar}} syntax', params.length === 1);

    _emberMetalCore2['default'].assert('The {{#with}} helper must be called with a block', !!template);

    if (template && template.arity === 0) {
      _emberMetalCore2['default'].deprecate('Using the context switching form of `{{with}}` is deprecated. ' + 'Please use the block param form (`{{#with bar as |foo|}}`) instead.', false, { url: 'http://emberjs.com/guides/deprecations/#toc_more-consistent-handlebars-scope' });
    }

    _htmlbarsRuntime.internal.continueBlock(morph, env, scope, 'with', params, hash, template, inverse, visitor);
  },

  rerender: function rerender(morph, env, scope, params, hash, template, inverse, visitor) {
    _htmlbarsRuntime.internal.continueBlock(morph, env, scope, 'with', params, hash, template, inverse, visitor);
  }
};
module.exports = exports['default'];