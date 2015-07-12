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

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberHtmlbarsNodeManagersViewNodeManager = require('ember-htmlbars/node-managers/view-node-manager');

var _emberHtmlbarsNodeManagersViewNodeManager2 = _interopRequireDefault(_emberHtmlbarsNodeManagersViewNodeManager);

var _emberHtmlbarsTemplatesTopLevelView = require('ember-htmlbars/templates/top-level-view');

var _emberHtmlbarsTemplatesTopLevelView2 = _interopRequireDefault(_emberHtmlbarsTemplatesTopLevelView);

_emberHtmlbarsTemplatesTopLevelView2['default'].meta.revision = 'Ember@VERSION_STRING_PLACEHOLDER';

exports['default'] = {
  willRender: function willRender(renderNode, env) {
    env.view.ownerView._outlets.push(renderNode);
  },

  setupState: function setupState(state, env, scope, params, hash) {
    var outletState = env.outletState;
    var read = env.hooks.getValue;
    var outletName = read(params[0]) || 'main';
    var selectedOutletState = outletState[outletName];

    var toRender = selectedOutletState && selectedOutletState.render;
    if (toRender && !toRender.template && !toRender.ViewClass) {
      toRender.template = _emberHtmlbarsTemplatesTopLevelView2['default'];
    }

    return {
      outletState: selectedOutletState,
      hasParentOutlet: env.hasParentOutlet,
      manager: state.manager
    };
  },

  childEnv: function childEnv(state, env) {
    return env.childWithOutletState(state.outletState && state.outletState.outlets, true);
  },

  isStable: (function (_isStable) {
    function isStable(_x, _x2) {
      return _isStable.apply(this, arguments);
    }

    isStable.toString = function () {
      return _isStable.toString();
    };

    return isStable;
  })(function (lastState, nextState) {
    return isStable(lastState.outletState, nextState.outletState);
  }),

  isEmpty: (function (_isEmpty) {
    function isEmpty(_x3) {
      return _isEmpty.apply(this, arguments);
    }

    isEmpty.toString = function () {
      return _isEmpty.toString();
    };

    return isEmpty;
  })(function (state) {
    return isEmpty(state.outletState);
  }),

  render: function render(renderNode, env, scope, params, hash, template, inverse, visitor) {
    var state = renderNode.state;
    var parentView = env.view;
    var outletState = state.outletState;
    var toRender = outletState.render;
    var namespace = env.container.lookup('application:main');
    var LOG_VIEW_LOOKUPS = (0, _emberMetalProperty_get.get)(namespace, 'LOG_VIEW_LOOKUPS');

    var ViewClass = outletState.render.ViewClass;

    if (!state.hasParentOutlet && !ViewClass) {
      ViewClass = env.container.lookupFactory('view:toplevel');
    }

    var options = {
      component: ViewClass,
      self: toRender.controller,
      createOptions: {
        controller: toRender.controller
      }
    };

    template = template || toRender.template && toRender.template.raw;

    if (LOG_VIEW_LOOKUPS && ViewClass) {
      _emberMetalCore2['default'].Logger.info('Rendering ' + toRender.name + ' with ' + ViewClass, { fullName: 'view:' + toRender.name });
    }

    if (state.manager) {
      state.manager.destroy();
      state.manager = null;
    }

    var nodeManager = _emberHtmlbarsNodeManagersViewNodeManager2['default'].create(renderNode, env, {}, options, parentView, null, null, template);
    state.manager = nodeManager;

    nodeManager.render(env, hash, visitor);
  }
};

function isEmpty(outletState) {
  return !outletState || !outletState.render.ViewClass && !outletState.render.template;
}

function isStable(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  a = a.render;
  b = b.render;
  for (var key in a) {
    if (a.hasOwnProperty(key)) {
      // name is only here for logging & debugging. If two different
      // names result in otherwise identical states, they're still
      // identical.
      if (a[key] !== b[key] && key !== 'name') {
        return false;
      }
    }
  }
  return true;
}
module.exports = exports['default'];