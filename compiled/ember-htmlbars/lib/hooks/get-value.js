/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getValue;

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

function getValue(ref) {
  var value = (0, _emberMetalStreamsUtils.read)(ref);

  if (value && value[_emberViewsCompatAttrsProxy.MUTABLE_CELL]) {
    return value.value;
  }

  return value;
}

module.exports = exports['default'];