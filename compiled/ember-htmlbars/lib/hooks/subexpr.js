/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = subexpr;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

var _emberHtmlbarsSystemLookupHelper2 = _interopRequireDefault(_emberHtmlbarsSystemLookupHelper);

var _emberHtmlbarsSystemInvokeHelper = require('ember-htmlbars/system/invoke-helper');

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function subexpr(env, scope, helperName, params, hash) {
  // TODO: Keywords and helper invocation should be integrated into
  // the subexpr hook upstream in HTMLBars.
  var keyword = env.hooks.keywords[helperName];
  if (keyword) {
    return keyword(null, env, scope, params, hash, null, null);
  }

  var label = labelForSubexpr(params, hash, helperName);
  var helper = (0, _emberHtmlbarsSystemLookupHelper2['default'])(helperName, scope.self, env);

  var helperStream = (0, _emberHtmlbarsSystemInvokeHelper.buildHelperStream)(helper, params, hash, { template: {}, inverse: {} }, env, scope, null, label);

  for (var i = 0, l = params.length; i < l; i++) {
    helperStream.addDependency(params[i]);
  }

  for (var key in hash) {
    helperStream.addDependency(hash[key]);
  }

  return helperStream;
}

function labelForSubexpr(params, hash, helperName) {
  var paramsLabels = labelsForParams(params);
  var hashLabels = labelsForHash(hash);
  var label = '(' + helperName;

  if (paramsLabels) {
    label += ' ' + paramsLabels;
  }
  if (hashLabels) {
    label += ' ' + hashLabels;
  }

  return label + ')';
}

function labelsForParams(params) {
  return (0, _emberMetalStreamsUtils.labelsFor)(params).join(' ');
}

function labelsForHash(hash) {
  var out = [];

  for (var prop in hash) {
    out.push(prop + '=' + (0, _emberMetalStreamsUtils.labelFor)(hash[prop]));
  }

  return out.join(' ');
}
module.exports = exports['default'];