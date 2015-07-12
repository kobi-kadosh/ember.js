/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = classify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsUtilsIsComponent = require('ember-htmlbars/utils/is-component');

var _emberHtmlbarsUtilsIsComponent2 = _interopRequireDefault(_emberHtmlbarsUtilsIsComponent);

function classify(env, scope, path) {
  if ((0, _emberHtmlbarsUtilsIsComponent2['default'])(env, scope, path)) {
    return 'component';
  }

  return null;
}

module.exports = exports['default'];