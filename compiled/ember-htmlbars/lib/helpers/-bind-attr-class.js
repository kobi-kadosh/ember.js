/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bindAttrClassHelper;

var _emberMetalProperty_get = require('ember-metal/property_get');

function bindAttrClassHelper(params) {
  var value = params[0];

  if (Array.isArray(value)) {
    value = (0, _emberMetalProperty_get.get)(value, 'length') !== 0;
  }

  if (value === true) {
    return params[1];
  }if (value === false || value === undefined || value === null) {
    return '';
  } else {
    return value;
  }
}

module.exports = exports['default'];