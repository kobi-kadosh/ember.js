/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsStreamsUtils = require('ember-views/streams/utils');

var _emberViewsViewsCollection_view = require('ember-views/views/collection_view');

var _emberViewsViewsCollection_view2 = _interopRequireDefault(_emberViewsViewsCollection_view);

var _emberHtmlbarsNodeManagersViewNodeManager = require('ember-htmlbars/node-managers/view-node-manager');

var _emberHtmlbarsNodeManagersViewNodeManager2 = _interopRequireDefault(_emberHtmlbarsNodeManagersViewNodeManager);

var _emberMetalMerge = require('ember-metal/merge');

exports['default'] = {
  setupState: function setupState(state, env, scope, params, hash) {
    var read = env.hooks.getValue;

    return (0, _emberMetalMerge.assign)({}, state, {
      parentView: read(scope.locals.view),
      viewClassOrInstance: getView(read(params[0]), env.container)
    });
  },

  rerender: function rerender(morph, env, scope, params, hash, template, inverse, visitor) {
    // If the hash is empty, the component cannot have extracted a part
    // of a mutable param and used it in its layout, because there are
    // no params at all.
    if (Object.keys(hash).length) {
      return morph.state.manager.rerender(env, hash, visitor, true);
    }
  },

  render: function render(node, env, scope, params, hash, template, inverse, visitor) {
    var state = node.state;
    var parentView = state.parentView;

    var options = { component: node.state.viewClassOrInstance, layout: null };
    if (template) {
      options.createOptions = {
        _itemViewTemplate: template && { raw: template },
        _itemViewInverse: inverse && { raw: inverse }
      };
    }

    if (hash.itemView) {
      hash.itemViewClass = hash.itemView;
    }

    if (hash.emptyView) {
      hash.emptyViewClass = hash.emptyView;
    }

    var nodeManager = _emberHtmlbarsNodeManagersViewNodeManager2['default'].create(node, env, hash, options, parentView, null, scope, template);
    state.manager = nodeManager;

    nodeManager.render(env, hash, visitor);
  }
};

function getView(viewPath, container) {
  var viewClassOrInstance;

  if (!viewPath) {
    viewClassOrInstance = _emberViewsViewsCollection_view2['default'];
  } else {
    viewClassOrInstance = (0, _emberViewsStreamsUtils.readViewFactory)(viewPath, container);
  }

  return viewClassOrInstance;
}
module.exports = exports['default'];