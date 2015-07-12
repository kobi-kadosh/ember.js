'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = RenderEnv;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsEnv = require('ember-htmlbars/env');

var _emberHtmlbarsEnv2 = _interopRequireDefault(_emberHtmlbarsEnv);

var _emberHtmlbarsSystemDiscoverKnownHelpers = require('ember-htmlbars/system/discover-known-helpers');

var _emberHtmlbarsSystemDiscoverKnownHelpers2 = _interopRequireDefault(_emberHtmlbarsSystemDiscoverKnownHelpers);

function RenderEnv(options) {
  this.lifecycleHooks = options.lifecycleHooks || [];
  this.renderedViews = options.renderedViews || [];
  this.renderedNodes = options.renderedNodes || {};
  this.hasParentOutlet = options.hasParentOutlet || false;

  this.view = options.view;
  this.outletState = options.outletState;
  this.container = options.container;
  this.renderer = options.renderer;
  this.dom = options.dom;
  this.knownHelpers = options.knownHelpers || (0, _emberHtmlbarsSystemDiscoverKnownHelpers2['default'])(options.container);

  this.hooks = _emberHtmlbarsEnv2['default'].hooks;
  this.helpers = _emberHtmlbarsEnv2['default'].helpers;
  this.useFragmentCache = _emberHtmlbarsEnv2['default'].useFragmentCache;
}

RenderEnv.build = function (view) {
  return new RenderEnv({
    view: view,
    outletState: view.outletState,
    container: view.container,
    renderer: view.renderer,
    dom: view.renderer._dom
  });
};

RenderEnv.prototype.childWithView = function (view) {
  return new RenderEnv({
    view: view,
    outletState: this.outletState,
    container: this.container,
    renderer: this.renderer,
    dom: this.dom,
    lifecycleHooks: this.lifecycleHooks,
    renderedViews: this.renderedViews,
    renderedNodes: this.renderedNodes,
    hasParentOutlet: this.hasParentOutlet,
    knownHelpers: this.knownHelpers
  });
};

RenderEnv.prototype.childWithOutletState = function (outletState) {
  var hasParentOutlet = arguments[1] === undefined ? this.hasParentOutlet : arguments[1];

  return new RenderEnv({
    view: this.view,
    outletState: outletState,
    container: this.container,
    renderer: this.renderer,
    dom: this.dom,
    lifecycleHooks: this.lifecycleHooks,
    renderedViews: this.renderedViews,
    renderedNodes: this.renderedNodes,
    hasParentOutlet: hasParentOutlet,
    knownHelpers: this.knownHelpers
  });
};
module.exports = exports['default'];