/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsSystemLookup_partial = require('ember-views/system/lookup_partial');

var _emberViewsSystemLookup_partial2 = _interopRequireDefault(_emberViewsSystemLookup_partial);

var _htmlbarsRuntime = require('htmlbars-runtime');

exports['default'] = {
  setupState: function setupState(state, env, scope, params, hash) {
    return { partialName: env.hooks.getValue(params[0]) };
  },

  render: function render(renderNode, env, scope, params, hash, template, inverse, visitor) {
    var state = renderNode.state;
    if (!state.partialName) {
      return true;
    }
    var found = (0, _emberViewsSystemLookup_partial2['default'])(env, state.partialName);
    if (!found) {
      return true;
    }

    _htmlbarsRuntime.internal.hostBlock(renderNode, env, scope, found.raw, null, null, visitor, function (options) {
      options.templates.template['yield']();
    });
  }
};
module.exports = exports['default'];