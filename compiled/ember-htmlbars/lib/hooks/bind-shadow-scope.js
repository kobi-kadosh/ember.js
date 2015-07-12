/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bindShadowScope;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

var _emberHtmlbarsUtilsSubscribe = require('ember-htmlbars/utils/subscribe');

var _emberHtmlbarsUtilsSubscribe2 = _interopRequireDefault(_emberHtmlbarsUtilsSubscribe);

function bindShadowScope(env, parentScope, shadowScope, options) {
  if (!options) {
    return;
  }

  var didOverrideController = false;

  if (parentScope && parentScope.overrideController) {
    didOverrideController = true;
    shadowScope.locals.controller = parentScope.locals.controller;
  }

  var view = options.view;
  if (view && !(view instanceof _emberViewsViewsComponent2['default'])) {
    newStream(shadowScope.locals, 'view', view, null);

    if (!didOverrideController) {
      newStream(shadowScope.locals, 'controller', shadowScope.locals.view.getKey('controller'));
    }

    if (view.isView) {
      newStream(shadowScope, 'self', shadowScope.locals.view.getKey('context'), null, true);
    }
  }

  shadowScope.view = view;

  if (view && options.attrs) {
    shadowScope.component = view;
  }

  if ('attrs' in options) {
    shadowScope.attrs = options.attrs;
  }

  return shadowScope;
}

function newStream(scope, key, newValue, renderNode, isSelf) {
  var stream = new _emberMetalStreamsProxyStream2['default'](newValue, isSelf ? '' : key);
  if (renderNode) {
    (0, _emberHtmlbarsUtilsSubscribe2['default'])(renderNode, scope, stream);
  }
  scope[key] = stream;
}
module.exports = exports['default'];