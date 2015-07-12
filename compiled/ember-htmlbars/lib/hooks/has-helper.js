'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = hasHelperHook;

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

function hasHelperHook(env, scope, helperName) {
  if (env.helpers[helperName]) {
    return true;
  }

  var container = env.container;
  if ((0, _emberHtmlbarsSystemLookupHelper.validateLazyHelperName)(helperName, container, env.hooks.keywords, env.knownHelpers)) {
    var containerName = 'helper:' + helperName;
    if (container._registry.has(containerName)) {
      return true;
    }
  }

  return false;
}

module.exports = exports['default'];