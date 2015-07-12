'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = updateScope;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

var _emberHtmlbarsUtilsSubscribe = require('ember-htmlbars/utils/subscribe');

var _emberHtmlbarsUtilsSubscribe2 = _interopRequireDefault(_emberHtmlbarsUtilsSubscribe);

function updateScope(scope, key, newValue, renderNode, isSelf) {
  var existing = scope[key];

  if (existing) {
    existing.setSource(newValue);
  } else {
    var stream = new _emberMetalStreamsProxyStream2['default'](newValue, isSelf ? null : key);
    if (renderNode) {
      (0, _emberHtmlbarsUtilsSubscribe2['default'])(renderNode, scope, stream);
    }
    scope[key] = stream;
  }
}

module.exports = exports['default'];