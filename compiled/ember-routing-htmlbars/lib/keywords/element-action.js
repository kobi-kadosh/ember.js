'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// assert

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsStreamsUtils = require('ember-views/streams/utils');

var _emberViewsSystemUtils = require('ember-views/system/utils');

var _emberViewsSystemAction_manager = require('ember-views/system/action_manager');

var _emberViewsSystemAction_manager2 = _interopRequireDefault(_emberViewsSystemAction_manager);

function assert(message, test) {
  // This only exists to prevent defeatureify from error when attempting
  // to transform the same source twice (tldr; you can't nest stripped statements)
  _emberMetalCore2['default'].assert(message, test);
}

exports['default'] = {
  setupState: function setupState(state, env, scope, params, hash) {
    var getStream = env.hooks.get;
    var read = env.hooks.getValue;

    var actionName = read(params[0]);

    if ((0, _emberMetalFeatures2['default'])('ember-routing-htmlbars-improved-actions')) {
      assert('You specified a quoteless path to the {{action}} helper ' + 'which did not resolve to an action name (a string). ' + 'Perhaps you meant to use a quoted actionName? (e.g. {{action \'save\'}}).', typeof actionName === 'string' || typeof actionName === 'function');
    } else {
      assert('You specified a quoteless path to the {{action}} helper ' + 'which did not resolve to an action name (a string). ' + 'Perhaps you meant to use a quoted actionName? (e.g. {{action \'save\'}}).', typeof actionName === 'string');
    }

    var actionArgs = [];
    for (var i = 1, l = params.length; i < l; i++) {
      actionArgs.push((0, _emberViewsStreamsUtils.readUnwrappedModel)(params[i]));
    }

    var target;
    if (hash.target) {
      if (typeof hash.target === 'string') {
        target = read(getStream(env, scope, hash.target));
      } else {
        target = read(hash.target);
      }
    } else {
      target = read(scope.locals.controller) || read(scope.self);
    }

    return { actionName: actionName, actionArgs: actionArgs, target: target };
  },

  isStable: function isStable(state, env, scope, params, hash) {
    return true;
  },

  render: function render(node, env, scope, params, hash, template, inverse, visitor) {
    var actionId = env.dom.getAttribute(node.element, 'data-ember-action') || (0, _emberMetalUtils.uuid)();

    ActionHelper.registerAction({
      actionId: actionId,
      node: node,
      eventName: hash.on || 'click',
      bubbles: hash.bubbles,
      preventDefault: hash.preventDefault,
      withKeyCode: hash.withKeyCode,
      allowedKeys: hash.allowedKeys
    });

    node.cleanup = function () {
      ActionHelper.unregisterAction(actionId);
    };

    env.dom.setAttribute(node.element, 'data-ember-action', actionId);
  }
};
var ActionHelper = {};

exports.ActionHelper = ActionHelper;
// registeredActions is re-exported for compatibility with older plugins
// that were using this undocumented API.
ActionHelper.registeredActions = _emberViewsSystemAction_manager2['default'].registeredActions;

ActionHelper.registerAction = function (_ref) {
  var actionId = _ref.actionId;
  var node = _ref.node;
  var eventName = _ref.eventName;
  var preventDefault = _ref.preventDefault;
  var bubbles = _ref.bubbles;
  var allowedKeys = _ref.allowedKeys;

  var actions = _emberViewsSystemAction_manager2['default'].registeredActions[actionId];

  if (!actions) {
    actions = _emberViewsSystemAction_manager2['default'].registeredActions[actionId] = [];
  }

  actions.push({
    eventName: eventName,
    handler: function handler(event) {
      if (!isAllowedEvent(event, allowedKeys)) {
        return true;
      }

      if (preventDefault !== false) {
        event.preventDefault();
      }

      if (bubbles === false) {
        event.stopPropagation();
      }

      var _node$state = node.state;
      var target = _node$state.target;
      var actionName = _node$state.actionName;
      var actionArgs = _node$state.actionArgs;

      (0, _emberMetalRun_loop2['default'])(function runRegisteredAction() {
        if ((0, _emberMetalFeatures2['default'])('ember-routing-htmlbars-improved-actions')) {
          if (typeof actionName === 'function') {
            actionName.apply(target, actionArgs);
            return;
          }
        }
        if (target.send) {
          target.send.apply(target, [actionName].concat(_toConsumableArray(actionArgs)));
        } else {
          _emberMetalCore2['default'].assert('The action \'' + actionName + '\' did not exist on ' + target, typeof target[actionName] === 'function');

          target[actionName].apply(target, actionArgs);
        }
      });
    }
  });

  return actionId;
};

ActionHelper.unregisterAction = function (actionId) {
  delete _emberViewsSystemAction_manager2['default'].registeredActions[actionId];
};

var MODIFIERS = ['alt', 'shift', 'meta', 'ctrl'];
var POINTER_EVENT_TYPE_REGEX = /^click|mouse|touch/;

function isAllowedEvent(event, allowedKeys) {
  if (typeof allowedKeys === 'undefined') {
    if (POINTER_EVENT_TYPE_REGEX.test(event.type)) {
      return (0, _emberViewsSystemUtils.isSimpleClick)(event);
    } else {
      allowedKeys = '';
    }
  }

  if (allowedKeys.indexOf('any') >= 0) {
    return true;
  }

  for (var i = 0, l = MODIFIERS.length; i < l; i++) {
    if (event[MODIFIERS[i] + 'Key'] && allowedKeys.indexOf(MODIFIERS[i]) === -1) {
      return false;
    }
  }

  return true;
}