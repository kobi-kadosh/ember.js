'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = componentHook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsNodeManagersComponentNodeManager = require('ember-htmlbars/node-managers/component-node-manager');

var _emberHtmlbarsNodeManagersComponentNodeManager2 = _interopRequireDefault(_emberHtmlbarsNodeManagersComponentNodeManager);

function componentHook(renderNode, env, scope, _tagName, params, attrs, templates, visitor) {
  var state = renderNode.state;

  // Determine if this is an initial render or a re-render
  if (state.manager) {
    state.manager.rerender(env, attrs, visitor);
    return;
  }

  var tagName = _tagName;
  var isAngleBracket = false;

  if (tagName.charAt(0) === '<') {
    tagName = tagName.slice(1, -1);
    isAngleBracket = true;
  }

  var parentView = env.view;

  var manager = _emberHtmlbarsNodeManagersComponentNodeManager2['default'].create(renderNode, env, {
    tagName: tagName,
    params: params,
    attrs: attrs,
    parentView: parentView,
    templates: templates,
    isAngleBracket: isAngleBracket,
    parentScope: scope
  });

  state.manager = manager;

  manager.render(env, visitor);
}

module.exports = exports['default'];