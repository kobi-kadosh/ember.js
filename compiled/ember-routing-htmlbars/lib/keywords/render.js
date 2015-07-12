'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRoutingSystemGenerate_controller = require('ember-routing/system/generate_controller');

var _emberRoutingSystemGenerate_controller2 = _interopRequireDefault(_emberRoutingSystemGenerate_controller);

var _emberHtmlbarsNodeManagersViewNodeManager = require('ember-htmlbars/node-managers/view-node-manager');

var _emberHtmlbarsNodeManagersViewNodeManager2 = _interopRequireDefault(_emberHtmlbarsNodeManagersViewNodeManager);

exports['default'] = {
  willRender: function willRender(renderNode, env) {
    if (env.view.ownerView._outlets) {
      // We make sure we will get dirtied when outlet state changes.
      env.view.ownerView._outlets.push(renderNode);
    }
  },

  setupState: function setupState(prevState, env, scope, params, hash) {
    var name = params[0];

    _emberMetalCore2['default'].assert('The first argument of {{render}} must be quoted, e.g. {{render "sidebar"}}.', typeof name === 'string');

    return {
      parentView: scope.view,
      manager: prevState.manager,
      controller: prevState.controller,
      childOutletState: childOutletState(name, env)
    };
  },

  childEnv: function childEnv(state, env) {
    return env.childWithOutletState(state.childOutletState);
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
    return isStable(lastState.childOutletState, nextState.childOutletState);
  }),

  isEmpty: function isEmpty(state) {
    return false;
  },

  render: function render(node, env, scope, params, hash, template, inverse, visitor) {
    var state = node.state;
    var name = params[0];
    var context = params[1];

    var container = env.container;

    // The render keyword presumes it can work without a router. This is really
    // only to satisfy the test:
    //
    //     {{view}} should not override class bindings defined on a child view"
    //
    var router = container.lookup('router:main');

    _emberMetalCore2['default'].assert('The second argument of {{render}} must be a path, e.g. {{render "post" post}}.', params.length < 2 || (0, _emberMetalStreamsUtils.isStream)(params[1]));

    if (params.length === 1) {
      // use the singleton controller
      _emberMetalCore2['default'].assert('You can only use the {{render}} helper once without a model object as ' + 'its second argument, as in {{render "post" post}}.', !router || !router._lookupActiveComponentNode(name));
    } else if (params.length !== 2) {
      throw new _emberMetalError2['default']('You must pass a templateName to render');
    }

    // # legacy namespace
    name = name.replace(/\//g, '.');
    // \ legacy slash as namespace support

    var templateName = 'template:' + name;
    _emberMetalCore2['default'].assert('You used `{{render \'' + name + '\'}}`, but \'' + name + '\' can not be ' + 'found as either a template or a view.', container._registry.has('view:' + name) || container._registry.has(templateName) || !!template);

    var view = container.lookup('view:' + name);
    if (!view) {
      view = container.lookup('view:default');
    }
    var viewHasTemplateSpecified = view && !!(0, _emberMetalProperty_get.get)(view, 'template');
    if (!template && !viewHasTemplateSpecified) {
      template = container.lookup(templateName);
    }

    if (view) {
      view.ownerView = env.view.ownerView;
    }

    // provide controller override
    var controllerName;
    var controllerFullName;

    if (hash.controller) {
      controllerName = hash.controller;
      controllerFullName = 'controller:' + controllerName;
      delete hash.controller;

      _emberMetalCore2['default'].assert('The controller name you supplied \'' + controllerName + '\' ' + 'did not resolve to a controller.', container._registry.has(controllerFullName));
    } else {
      controllerName = name;
      controllerFullName = 'controller:' + controllerName;
    }

    var parentController = (0, _emberMetalStreamsUtils.read)(scope.locals.controller);
    var controller;

    // choose name
    if (params.length > 1) {
      var factory = container.lookupFactory(controllerFullName) || (0, _emberRoutingSystemGenerate_controller.generateControllerFactory)(container, controllerName);

      controller = factory.create({
        model: (0, _emberMetalStreamsUtils.read)(context),
        parentController: parentController,
        target: parentController
      });

      node.addDestruction(controller);
    } else {
      controller = container.lookup(controllerFullName) || (0, _emberRoutingSystemGenerate_controller2['default'])(container, controllerName);

      controller.setProperties({
        target: parentController,
        parentController: parentController
      });
    }

    if (view) {
      view.set('controller', controller);
    }
    state.controller = controller;

    hash.viewName = (0, _emberRuntimeSystemString.camelize)(name);

    // var state = node.state;
    // var parentView = scope.view;
    if (template && template.raw) {
      template = template.raw;
    }

    var options = {
      layout: null,
      self: controller
    };

    if (view) {
      options.component = view;
    }

    var nodeManager = _emberHtmlbarsNodeManagersViewNodeManager2['default'].create(node, env, hash, options, state.parentView, null, null, template);
    state.manager = nodeManager;

    if (router && params.length === 1) {
      router._connectActiveComponentNode(name, nodeManager);
    }

    nodeManager.render(env, hash, visitor);
  },

  rerender: function rerender(node, env, scope, params, hash, template, inverse, visitor) {
    var model = (0, _emberMetalStreamsUtils.read)(params[1]);
    node.state.controller.set('model', model);
  }
};

function childOutletState(name, env) {
  var topLevel = env.view.ownerView;
  if (!topLevel || !topLevel.outletState) {
    return;
  }

  var outletState = topLevel.outletState;
  if (!outletState.main) {
    return;
  }

  var selectedOutletState = outletState.main.outlets['__ember_orphans__'];
  if (!selectedOutletState) {
    return;
  }
  var matched = selectedOutletState.outlets[name];
  if (matched) {
    var childState = Object.create(null);
    childState[matched.render.outlet] = matched;
    matched.wasUsed = true;
    return childState;
  }
}

function isStable(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  for (var outletName in a) {
    if (!isStableOutlet(a[outletName], b[outletName])) {
      return false;
    }
  }
  return true;
}

function isStableOutlet(a, b) {
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