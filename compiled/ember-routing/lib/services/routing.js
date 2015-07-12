/**
@module ember
@submodule ember-routing
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalComputed_macros = require('ember-metal/computed_macros');

var _emberRoutingUtils = require('ember-routing/utils');

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

/**
  The Routing service is used by LinkComponent, and provides facilities for
  the component/view layer to interact with the router.

  While still private, this service can eventually be opened up, and provides
  the set of API needed for components to control routing without interacting
  with router internals.

  @private
  @class RoutingService
*/
exports['default'] = _emberRuntimeSystemService2['default'].extend({
  router: null,

  targetState: (0, _emberMetalComputed_macros.readOnly)('router.targetState'),
  currentState: (0, _emberMetalComputed_macros.readOnly)('router.currentState'),
  currentRouteName: (0, _emberMetalComputed_macros.readOnly)('router.currentRouteName'),

  availableRoutes: function availableRoutes() {
    return Object.keys((0, _emberMetalProperty_get.get)(this, 'router').router.recognizer.names);
  },

  hasRoute: function hasRoute(routeName) {
    return (0, _emberMetalProperty_get.get)(this, 'router').hasRoute(routeName);
  },

  transitionTo: function transitionTo(routeName, models, queryParams, shouldReplace) {
    var router = (0, _emberMetalProperty_get.get)(this, 'router');

    var transition = router._doTransition(routeName, models, queryParams);

    if (shouldReplace) {
      transition.method('replace');
    }
  },

  normalizeQueryParams: function normalizeQueryParams(routeName, models, queryParams) {
    var router = (0, _emberMetalProperty_get.get)(this, 'router');
    router._prepareQueryParams(routeName, models, queryParams);
  },

  generateURL: function generateURL(routeName, models, queryParams) {
    var router = (0, _emberMetalProperty_get.get)(this, 'router');
    if (!router.router) {
      return;
    }

    var visibleQueryParams = {};
    (0, _emberMetalMerge2['default'])(visibleQueryParams, queryParams);

    this.normalizeQueryParams(routeName, models, visibleQueryParams);

    var args = (0, _emberRoutingUtils.routeArgs)(routeName, models, visibleQueryParams);
    return router.generate.apply(router, args);
  },

  isActiveForRoute: function isActiveForRoute(contexts, queryParams, routeName, routerState, isCurrentWhenSpecified) {
    var router = (0, _emberMetalProperty_get.get)(this, 'router');

    var handlers = router.router.recognizer.handlersFor(routeName);
    var leafName = handlers[handlers.length - 1].handler;
    var maximumContexts = numberOfContextsAcceptedByHandler(routeName, handlers);

    // NOTE: any ugliness in the calculation of activeness is largely
    // due to the fact that we support automatic normalizing of
    // `resource` -> `resource.index`, even though there might be
    // dynamic segments / query params defined on `resource.index`
    // which complicates (and makes somewhat ambiguous) the calculation
    // of activeness for links that link to `resource` instead of
    // directly to `resource.index`.

    // if we don't have enough contexts revert back to full route name
    // this is because the leaf route will use one of the contexts
    if (contexts.length > maximumContexts) {
      routeName = leafName;
    }

    return routerState.isActiveIntent(routeName, contexts, queryParams, !isCurrentWhenSpecified);
  }
});

function numberOfContextsAcceptedByHandler(handler, handlerInfos) {
  var req = 0;
  for (var i = 0, l = handlerInfos.length; i < l; i++) {
    req = req + handlerInfos[i].names.length;
    if (handlerInfos[i].handler === handler) {
      break;
    }
  }

  return req;
}
module.exports = exports['default'];