/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bindSelf;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

var _emberHtmlbarsUtilsSubscribe = require('ember-htmlbars/utils/subscribe');

var _emberHtmlbarsUtilsSubscribe2 = _interopRequireDefault(_emberHtmlbarsUtilsSubscribe);

function bindSelf(env, scope, _self) {
  var self = _self;

  if (self && self.hasBoundController) {
    var controller = self.controller;

    self = self.self;

    newStream(scope.locals, 'controller', controller || self);
  }

  if (self && self.isView) {
    scope.view = self;
    newStream(scope.locals, 'view', self, null);
    newStream(scope.locals, 'controller', scope.locals.view.getKey('controller'));
    newStream(scope, 'self', scope.locals.view.getKey('context'), null, true);
    return;
  }

  newStream(scope, 'self', self, null, true);

  if (!scope.locals.controller) {
    scope.locals.controller = scope.self;
  }
}

function newStream(scope, key, newValue, renderNode, isSelf) {
  var stream = new _emberMetalStreamsProxyStream2['default'](newValue, isSelf ? '' : key);
  if (renderNode) {
    (0, _emberHtmlbarsUtilsSubscribe2['default'])(renderNode, scope, stream);
  }
  scope[key] = stream;
}
module.exports = exports['default'];