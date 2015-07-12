'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.renderHTMLBarsBlock = renderHTMLBarsBlock;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsNodeManagersViewNodeManager = require('ember-htmlbars/node-managers/view-node-manager');

var _emberHtmlbarsNodeManagersViewNodeManager2 = _interopRequireDefault(_emberHtmlbarsNodeManagersViewNodeManager);

var _emberHtmlbarsSystemRenderEnv = require('ember-htmlbars/system/render-env');

var _emberHtmlbarsSystemRenderEnv2 = _interopRequireDefault(_emberHtmlbarsSystemRenderEnv);

// This function only gets called once per render of a "root view" (`appendTo`). Otherwise,
// HTMLBars propagates the existing env and renders templates for a given render node.

function renderHTMLBarsBlock(view, block, renderNode) {
  var env = _emberHtmlbarsSystemRenderEnv2['default'].build(view);

  view.env = env;
  (0, _emberHtmlbarsNodeManagersViewNodeManager.createOrUpdateComponent)(view, {}, null, renderNode, env);
  var nodeManager = new _emberHtmlbarsNodeManagersViewNodeManager2['default'](view, null, renderNode, block, view.tagName !== '');

  nodeManager.render(env, {});
}