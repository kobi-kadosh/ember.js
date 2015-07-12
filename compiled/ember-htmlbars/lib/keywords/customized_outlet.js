/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsNodeManagersViewNodeManager = require('ember-htmlbars/node-managers/view-node-manager');

var _emberHtmlbarsNodeManagersViewNodeManager2 = _interopRequireDefault(_emberHtmlbarsNodeManagersViewNodeManager);

var _emberViewsStreamsUtils = require('ember-views/streams/utils');

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

exports['default'] = {
  setupState: function setupState(state, env, scope, params, hash) {
    _emberMetalCore2['default'].assert('Using a quoteless view parameter with {{outlet}} is not supported', !hash.view || !(0, _emberMetalStreamsUtils.isStream)(hash.view));
    var read = env.hooks.getValue;
    var viewClass = read(hash.viewClass) || (0, _emberViewsStreamsUtils.readViewFactory)(read(hash.view), env.container);
    return { viewClass: viewClass };
  },
  render: function render(renderNode, env, scope, params, hash, template, inverse, visitor) {
    var state = renderNode.state;
    var parentView = env.view;

    var options = {
      component: state.viewClass
    };
    var nodeManager = _emberHtmlbarsNodeManagersViewNodeManager2['default'].create(renderNode, env, hash, options, parentView, null, null, null);
    state.manager = nodeManager;
    nodeManager.render(env, hash, visitor);
  }
};
module.exports = exports['default'];