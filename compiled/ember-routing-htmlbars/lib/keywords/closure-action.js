'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = closureAction;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var INVOKE = (0, _emberMetalUtils.symbol)('INVOKE');
exports.INVOKE = INVOKE;
var ACTION = (0, _emberMetalUtils.symbol)('ACTION');

exports.ACTION = ACTION;

function closureAction(morph, env, scope, params, hash, template, inverse, visitor) {
  return new _emberMetalStreamsStream2['default'](function () {
    var _this = this;

    params.map(this.addDependency, this);
    Object.keys(hash).map(function (item) {
      return _this.addDependency(item);
    });

    var rawAction = params[0];
    var actionArguments = (0, _emberMetalStreamsUtils.readArray)(params.slice(1, params.length));

    var target, action, valuePath;
    if (rawAction[INVOKE]) {
      // on-change={{action (mut name)}}
      target = rawAction;
      action = rawAction[INVOKE];
    } else {
      // on-change={{action setName}}
      // element-space actions look to "controller" then target. Here we only
      // look to "target".
      target = (0, _emberMetalStreamsUtils.read)(scope.self);
      action = (0, _emberMetalStreamsUtils.read)(rawAction);
      if (typeof action === 'string') {
        var actionName = action;
        action = null;
        // on-change={{action 'setName'}}
        if (hash.target) {
          // on-change={{action 'setName' target=alternativeComponent}}
          target = (0, _emberMetalStreamsUtils.read)(hash.target);
        }
        if (target.actions) {
          action = target.actions[actionName];
        } else if (target._actions) {
          action = target._actions[actionName];
        }

        if (!action) {
          throw new _emberMetalError2['default']('An action named \'' + actionName + '\' was not found in ' + target + '.');
        }
      }
    }

    if (hash.value) {
      // <button on-keypress={{action (mut name) value="which"}}
      // on-keypress is not even an Ember feature yet
      valuePath = (0, _emberMetalStreamsUtils.read)(hash.value);
    }

    return createClosureAction(target, action, valuePath, actionArguments);
  });
}

function createClosureAction(target, action, valuePath, actionArguments) {
  var closureAction;

  if (actionArguments.length > 0) {
    closureAction = function () {
      var args = actionArguments;
      if (arguments.length > 0) {
        var passedArguments = Array.prototype.slice.apply(arguments);
        args = actionArguments.concat(passedArguments);
      }
      if (valuePath && args.length > 0) {
        args[0] = (0, _emberMetalProperty_get.get)(args[0], valuePath);
      }
      return action.apply(target, args);
    };
  } else {
    closureAction = function () {
      var args = arguments;
      if (valuePath && args.length > 0) {
        args = Array.prototype.slice.apply(args);
        args[0] = (0, _emberMetalProperty_get.get)(args[0], valuePath);
      }
      return action.apply(target, args);
    };
  }

  closureAction[ACTION] = true;

  return closureAction;
}