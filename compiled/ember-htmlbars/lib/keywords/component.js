'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberMetalMerge = require('ember-metal/merge');

exports['default'] = {
  setupState: function setupState(lastState, env, scope, params, hash) {
    var componentPath = env.hooks.getValue(params[0]);
    return (0, _emberMetalMerge.assign)({}, lastState, { componentPath: componentPath, isComponentHelper: true });
  },

  render: (function (_render) {
    function render(_x) {
      return _render.apply(this, arguments);
    }

    render.toString = function () {
      return _render.toString();
    };

    return render;
  })(function (morph) {
    if (morph.state.manager) {
      morph.state.manager.destroy();
    }

    // Force the component hook to treat this as a first-time render,
    // because normal components (`<foo-bar>`) cannot change at runtime,
    // but the `{{component}}` helper can.
    morph.state.manager = null;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    render.apply(undefined, [morph].concat(rest));
  }),

  rerender: render
};

function render(morph, env, scope, params, hash, template, inverse, visitor) {
  var componentPath = morph.state.componentPath;

  // If the value passed to the {{component}} helper is undefined or null,
  // don't create a new ComponentNode.
  if (componentPath === undefined || componentPath === null) {
    return;
  }

  env.hooks.component(morph, env, scope, componentPath, params, hash, { 'default': template, inverse: inverse }, visitor);
}
module.exports = exports['default'];