'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = invokeHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberHtmlbarsSystemInvokeHelper = require('ember-htmlbars/system/invoke-helper');

var _emberHtmlbarsUtilsSubscribe = require('ember-htmlbars/utils/subscribe');

var _emberHtmlbarsUtilsSubscribe2 = _interopRequireDefault(_emberHtmlbarsUtilsSubscribe);

function invokeHelper(morph, env, scope, visitor, params, hash, helper, templates, context) {

  if (helper.isLegacyViewHelper) {
    _emberMetalCore2['default'].assert('You can only pass attributes (such as name=value) not bare ' + 'values to a helper for a View found in \'' + helper.viewClass + '\'', params.length === 0);

    env.hooks.keyword('view', morph, env, scope, [helper.viewClass], hash, templates.template.raw, null, visitor);
    // Opts into a special mode for view helpers
    return { handled: true };
  }

  var helperStream = (0, _emberHtmlbarsSystemInvokeHelper.buildHelperStream)(helper, params, hash, templates, env, scope, context);

  // Ember.Helper helpers are pure values, thus linkable
  if (helperStream.linkable) {

    if (morph) {
      // When processing an inline expression the params and hash have already
      // been linked. Thus, HTMLBars will not link the returned helperStream.
      // We subscribe the morph to the helperStream here, and also subscribe
      // the helperStream to any params.
      var addedDependency = false;
      for (var i = 0, l = params.length; i < l; i++) {
        addedDependency = true;
        helperStream.addDependency(params[i]);
      }
      for (var key in hash) {
        addedDependency = true;
        helperStream.addDependency(hash[key]);
      }
      if (addedDependency) {
        (0, _emberHtmlbarsUtilsSubscribe2['default'])(morph, env, scope, helperStream);
      }
    }

    return { link: true, value: helperStream };
  }

  // Legacy helpers are not linkable, they must run every rerender
  return { value: helperStream.value() };
}

module.exports = exports['default'];