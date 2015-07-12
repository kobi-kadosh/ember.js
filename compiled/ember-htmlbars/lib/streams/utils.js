'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getArrayValues = getArrayValues;
exports.getHashValues = getHashValues;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsHooksGetValue = require('ember-htmlbars/hooks/get-value');

var _emberHtmlbarsHooksGetValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetValue);

// We don't want to leak mutable cells into helpers, which
// are pure functions that can only work with values.

function getArrayValues(params) {
  var l = params.length;
  var out = new Array(l);
  for (var i = 0; i < l; i++) {
    out[i] = (0, _emberHtmlbarsHooksGetValue2['default'])(params[i]);
  }

  return out;
}

function getHashValues(hash) {
  var out = {};
  for (var prop in hash) {
    out[prop] = (0, _emberHtmlbarsHooksGetValue2['default'])(hash[prop]);
  }

  return out;
}