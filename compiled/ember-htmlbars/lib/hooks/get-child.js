/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getChild;

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function getChild(parent, key) {
  if ((0, _emberMetalStreamsUtils.isStream)(parent)) {
    return parent.getKey(key);
  }

  // This should only happen when we are looking at an `attrs` hash
  // That might change if it is possible to pass object literals
  // through the templating system.
  return parent[key];
}

module.exports = exports['default'];