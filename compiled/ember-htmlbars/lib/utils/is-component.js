/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isComponent;

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

/*
 Given a path name, returns whether or not a component with that
 name was found in the container.
*/

function isComponent(env, scope, path) {
  var container = env.container;
  if (!container) {
    return false;
  }
  if (!_emberHtmlbarsSystemLookupHelper.CONTAINS_DASH_CACHE.get(path)) {
    return false;
  }
  return container._registry.has('component:' + path) || container._registry.has('template:components/' + path);
}

module.exports = exports['default'];