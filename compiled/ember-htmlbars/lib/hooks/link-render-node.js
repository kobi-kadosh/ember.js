/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = linkRenderNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsUtilsSubscribe = require('ember-htmlbars/utils/subscribe');

var _emberHtmlbarsUtilsSubscribe2 = _interopRequireDefault(_emberHtmlbarsUtilsSubscribe);

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

function linkRenderNode(renderNode, env, scope, path, params, hash) {
  if (renderNode.streamUnsubscribers) {
    return true;
  }

  var keyword = env.hooks.keywords[path];
  var helper;
  if (keyword && keyword.link) {
    keyword.link(renderNode.state, params, hash);
  } else {
    switch (path) {
      case 'unbound':
        return true;
      case 'unless':
      case 'if':
        params[0] = shouldDisplay(params[0]);break;
      case 'each':
        params[0] = eachParam(params[0]);break;
      default:
        helper = (0, _emberHtmlbarsSystemLookupHelper.findHelper)(path, scope.view, env);

        if (helper && helper.isHandlebarsCompat && params[0]) {
          params[0] = processHandlebarsCompatDepKeys(params[0], helper._dependentKeys);
        }
    }
  }

  if (params && params.length) {
    for (var i = 0; i < params.length; i++) {
      (0, _emberHtmlbarsUtilsSubscribe2['default'])(renderNode, env, scope, params[i]);
    }
  }

  if (hash) {
    for (var key in hash) {
      (0, _emberHtmlbarsUtilsSubscribe2['default'])(renderNode, env, scope, hash[key]);
    }
  }

  // The params and hash can be reused; they don't need to be
  // recomputed on subsequent re-renders because they are
  // streams.
  return true;
}

function eachParam(list) {
  var listChange = getKey(list, '[]');

  var stream = (0, _emberMetalStreamsUtils.chain)(list, function () {
    (0, _emberMetalStreamsUtils.read)(listChange);
    return (0, _emberMetalStreamsUtils.read)(list);
  }, 'each');

  stream.addDependency(listChange);
  return stream;
}

function shouldDisplay(predicate) {
  var length = getKey(predicate, 'length');
  var isTruthy = getKey(predicate, 'isTruthy');

  var stream = (0, _emberMetalStreamsUtils.chain)(predicate, function () {
    var predicateVal = (0, _emberMetalStreamsUtils.read)(predicate);
    var lengthVal = (0, _emberMetalStreamsUtils.read)(length);
    var isTruthyVal = (0, _emberMetalStreamsUtils.read)(isTruthy);

    if ((0, _emberRuntimeUtils.isArray)(predicateVal)) {
      return lengthVal > 0;
    }

    if (typeof isTruthyVal === 'boolean') {
      return isTruthyVal;
    }

    return !!predicateVal;
  }, 'ShouldDisplay');

  (0, _emberMetalStreamsUtils.addDependency)(stream, length);
  (0, _emberMetalStreamsUtils.addDependency)(stream, isTruthy);

  return stream;
}

function getKey(obj, key) {
  if ((0, _emberMetalStreamsUtils.isStream)(obj)) {
    return obj.getKey(key);
  } else {
    return obj && obj[key];
  }
}

function processHandlebarsCompatDepKeys(base, additionalKeys) {
  if (!(0, _emberMetalStreamsUtils.isStream)(base) || additionalKeys.length === 0) {
    return base;
  }

  var depKeyStreams = [];

  var stream = (0, _emberMetalStreamsUtils.chain)(base, function () {
    (0, _emberMetalStreamsUtils.readArray)(depKeyStreams);

    return (0, _emberMetalStreamsUtils.read)(base);
  }, 'HandlebarsCompatHelper');

  for (var i = 0, l = additionalKeys.length; i < l; i++) {
    var depKeyStream = base.get(additionalKeys[i]);

    depKeyStreams.push(depKeyStream);
    stream.addDependency(depKeyStream);
  }

  return stream;
}
module.exports = exports['default'];