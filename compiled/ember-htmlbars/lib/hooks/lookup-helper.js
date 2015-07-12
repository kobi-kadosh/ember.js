'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = lookupHelperHook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

var _emberHtmlbarsSystemLookupHelper2 = _interopRequireDefault(_emberHtmlbarsSystemLookupHelper);

function lookupHelperHook(env, scope, helperName) {
  return (0, _emberHtmlbarsSystemLookupHelper2['default'])(helperName, scope.self, env);
}

module.exports = exports['default'];