/**
@module ember
@submodule ember-routing-views
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// FEATURES, Logger, assert

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalComputed = require('ember-metal/computed');

var _emberViewsSystemUtils = require('ember-views/system/utils');

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

var _emberHtmlbarsTemplatesLinkTo = require('ember-htmlbars/templates/link-to');

var _emberHtmlbarsTemplatesLinkTo2 = _interopRequireDefault(_emberHtmlbarsTemplatesLinkTo);

_emberHtmlbarsTemplatesLinkTo2['default'].meta.revision = 'Ember@VERSION_STRING_PLACEHOLDER';

var linkComponentClassNameBindings = ['active', 'loading', 'disabled'];
if ((0, _emberMetalFeatures2['default'])('ember-routing-transitioning-classes')) {
  linkComponentClassNameBindings = ['active', 'loading', 'disabled', 'transitioningIn', 'transitioningOut'];
}

/**
  `Ember.LinkComponent` renders an element whose `click` event triggers a
  transition of the application's instance of `Ember.Router` to
  a supplied route by name.

  Instances of `LinkComponent` will most likely be created through
  the `link-to` Handlebars helper, but properties of this class
  can be overridden to customize application-wide behavior.

  @class LinkComponent
  @namespace Ember
  @extends Ember.Component
  @see {Handlebars.helpers.link-to}
  @private
**/
var LinkComponent = _emberViewsViewsComponent2['default'].extend({
  defaultLayout: _emberHtmlbarsTemplatesLinkTo2['default'],

  tagName: 'a',

  /**
    @deprecated Use current-when instead.
    @property currentWhen
    @private
  */
  currentWhen: null,

  /**
    Used to determine when this LinkComponent is active.
      @property currentWhen
    @private
  */
  'current-when': null,

  /**
    Sets the `title` attribute of the `LinkComponent`'s HTML element.
      @property title
    @default null
    @private
  **/
  title: null,

  /**
    Sets the `rel` attribute of the `LinkComponent`'s HTML element.
      @property rel
    @default null
    @private
  **/
  rel: null,

  /**
    Sets the `tabindex` attribute of the `LinkComponent`'s HTML element.
      @property tabindex
    @default null
    @private
  **/
  tabindex: null,

  /**
    Sets the `target` attribute of the `LinkComponent`'s HTML element.
      @since 1.8.0
    @property target
    @default null
    @private
  **/
  target: null,

  /**
    The CSS class to apply to `LinkComponent`'s element when its `active`
    property is `true`.
      @property activeClass
    @type String
    @default active
    @private
  **/
  activeClass: 'active',

  /**
    The CSS class to apply to `LinkComponent`'s element when its `loading`
    property is `true`.
      @property loadingClass
    @type String
    @default loading
    @private
  **/
  loadingClass: 'loading',

  /**
    The CSS class to apply to a `LinkComponent`'s element when its `disabled`
    property is `true`.
      @property disabledClass
    @type String
    @default disabled
    @private
  **/
  disabledClass: 'disabled',
  _isDisabled: false,

  /**
    Determines whether the `LinkComponent` will trigger routing via
    the `replaceWith` routing strategy.
      @property replace
    @type Boolean
    @default false
    @private
  **/
  replace: false,

  /**
    By default the `{{link-to}}` helper will bind to the `href` and
    `title` attributes. It's discouraged that you override these defaults,
    however you can push onto the array if needed.
      @property attributeBindings
    @type Array | String
    @default ['title', 'rel', 'tabindex', 'target']
     @private
  */
  attributeBindings: ['href', 'title', 'rel', 'tabindex', 'target'],

  /**
    By default the `{{link-to}}` helper will bind to the `active`, `loading`, and
    `disabled` classes. It is discouraged to override these directly.
      @property classNameBindings
    @type Array
    @default ['active', 'loading', 'disabled']
     @private
  */
  classNameBindings: linkComponentClassNameBindings,

  /**
    By default the `{{link-to}}` helper responds to the `click` event. You
    can override this globally by setting this property to your custom
    event name.
      This is particularly useful on mobile when one wants to avoid the 300ms
    click delay using some sort of custom `tap` event.
      @property eventName
    @type String
    @default click
    @private
  */
  eventName: 'click',

  // this is doc'ed here so it shows up in the events
  // section of the API documentation, which is where
  // people will likely go looking for it.
  /**
    Triggers the `LinkComponent`'s routing behavior. If
    `eventName` is changed to a value other than `click`
    the routing behavior will trigger on that custom event
    instead.
      @event click
    @private
  */

  /**
    An overridable method called when LinkComponent objects are instantiated.
      Example:
      ```javascript
    App.MyLinkComponent = Ember.LinkComponent.extend({
      init: function() {
        this._super.apply(this, arguments);
        Ember.Logger.log('Event is ' + this.get('eventName'));
      }
    });
    ```
      NOTE: If you do override `init` for a framework class like `Ember.View` or
    `Ember.ArrayController`, be sure to call `this._super.apply(this, arguments)` in your
    `init` declaration! If you don't, Ember may not have an opportunity to
    do important setup work, and you'll see strange behavior in your
    application.
      @method init
    @private
  */
  init: function init() {
    this._super.apply(this, arguments);

    _emberMetalCore2['default'].deprecate('Using currentWhen with {{link-to}} is deprecated in favor of `current-when`.', !this.currentWhen);

    // Map desired event name to invoke function
    var eventName = (0, _emberMetalProperty_get.get)(this, 'eventName');
    this.on(eventName, this, this._invoke);
  },

  _routing: _emberRuntimeInject2['default'].service('-routing'),

  /**
    Accessed as a classname binding to apply the `LinkComponent`'s `disabledClass`
    CSS `class` to the element when the link is disabled.
      When `true` interactions with the element will not trigger route changes.
    @property disabled
    @private
  */
  disabled: (0, _emberMetalComputed.computed)({
    get: function get(key, value) {
      return false;
    },
    set: function set(key, value) {
      if (value !== undefined) {
        this.set('_isDisabled', value);
      }

      return value ? (0, _emberMetalProperty_get.get)(this, 'disabledClass') : false;
    }
  }),

  /**
    Accessed as a classname binding to apply the `LinkComponent`'s `activeClass`
    CSS `class` to the element when the link is active.
      A `LinkComponent` is considered active when its `currentWhen` property is `true`
    or the application's current route is the route the `LinkComponent` would trigger
    transitions into.
      The `currentWhen` property can match against multiple routes by separating
    route names using the ` ` (space) character.
      @property active
    @private
  */
  active: (0, _emberMetalComputed.computed)('attrs.params', '_routing.currentState', function computeLinkComponentActive() {
    var currentState = (0, _emberMetalProperty_get.get)(this, '_routing.currentState');
    if (!currentState) {
      return false;
    }

    return computeActive(this, currentState);
  }),

  willBeActive: (0, _emberMetalComputed.computed)('_routing.targetState', function () {
    var routing = (0, _emberMetalProperty_get.get)(this, '_routing');
    var targetState = (0, _emberMetalProperty_get.get)(routing, 'targetState');
    if ((0, _emberMetalProperty_get.get)(routing, 'currentState') === targetState) {
      return;
    }

    return !!computeActive(this, targetState);
  }),

  transitioningIn: (0, _emberMetalComputed.computed)('active', 'willBeActive', function () {
    var willBeActive = (0, _emberMetalProperty_get.get)(this, 'willBeActive');
    if (typeof willBeActive === 'undefined') {
      return false;
    }

    return !(0, _emberMetalProperty_get.get)(this, 'active') && willBeActive && 'ember-transitioning-in';
  }),

  transitioningOut: (0, _emberMetalComputed.computed)('active', 'willBeActive', function () {
    var willBeActive = (0, _emberMetalProperty_get.get)(this, 'willBeActive');
    if (typeof willBeActive === 'undefined') {
      return false;
    }

    return (0, _emberMetalProperty_get.get)(this, 'active') && !willBeActive && 'ember-transitioning-out';
  }),

  /**
    Event handler that invokes the link, activating the associated route.
      @private
    @method _invoke
    @param {Event} event
    @private
  */
  _invoke: function _invoke(event) {
    if (!(0, _emberViewsSystemUtils.isSimpleClick)(event)) {
      return true;
    }

    if (this.attrs.preventDefault !== false) {
      var targetAttribute = this.attrs.target;
      if (!targetAttribute || targetAttribute === '_self') {
        event.preventDefault();
      }
    }

    if (this.attrs.bubbles === false) {
      event.stopPropagation();
    }

    if ((0, _emberMetalProperty_get.get)(this, '_isDisabled')) {
      return false;
    }

    if ((0, _emberMetalProperty_get.get)(this, 'loading')) {
      _emberMetalCore2['default'].Logger.warn('This link-to is in an inactive loading state because at least one of its parameters presently has a null/undefined value, or the provided route name is invalid.');
      return false;
    }

    var targetAttribute2 = this.attrs.target;
    if (targetAttribute2 && targetAttribute2 !== '_self') {
      return false;
    }

    var routing = (0, _emberMetalProperty_get.get)(this, '_routing');
    var targetRouteName = (0, _emberMetalProperty_get.get)(this, 'targetRouteName');
    var models = (0, _emberMetalProperty_get.get)(this, 'models');
    var queryParamValues = (0, _emberMetalProperty_get.get)(this, 'queryParams.values');
    var shouldReplace = (0, _emberMetalProperty_get.get)(this, 'attrs.replace');

    routing.transitionTo(targetRouteName, models, queryParamValues, shouldReplace);
  },

  queryParams: null,

  /**
    Sets the element's `href` attribute to the url for
    the `LinkComponent`'s targeted route.
      If the `LinkComponent`'s `tagName` is changed to a value other
    than `a`, this property will be ignored.
      @property href
    @private
  */
  href: (0, _emberMetalComputed.computed)('models', 'targetRouteName', '_routing.currentState', function computeLinkComponentHref() {

    if ((0, _emberMetalProperty_get.get)(this, 'tagName') !== 'a') {
      return;
    }

    var targetRouteName = (0, _emberMetalProperty_get.get)(this, 'targetRouteName');
    var models = (0, _emberMetalProperty_get.get)(this, 'models');

    if ((0, _emberMetalProperty_get.get)(this, 'loading')) {
      return (0, _emberMetalProperty_get.get)(this, 'loadingHref');
    }

    targetRouteName = this._handleOnlyQueryParamsSupplied(targetRouteName);

    var routing = (0, _emberMetalProperty_get.get)(this, '_routing');
    var queryParams = (0, _emberMetalProperty_get.get)(this, 'queryParams.values');
    return routing.generateURL(targetRouteName, models, queryParams);
  }),

  loading: (0, _emberMetalComputed.computed)('models', 'targetRouteName', function () {
    var targetRouteName = (0, _emberMetalProperty_get.get)(this, 'targetRouteName');
    var models = (0, _emberMetalProperty_get.get)(this, 'models');

    if (!modelsAreLoaded(models) || targetRouteName == null) {
      return (0, _emberMetalProperty_get.get)(this, 'loadingClass');
    }
  }),

  _handleOnlyQueryParamsSupplied: function _handleOnlyQueryParamsSupplied(route) {
    var params = this.attrs.params.slice();
    var lastParam = params[params.length - 1];
    if (lastParam && lastParam.isQueryParams) {
      params.pop();
    }
    var onlyQueryParamsSupplied = this.attrs.hasBlock ? params.length === 0 : params.length === 1;
    if (onlyQueryParamsSupplied) {
      var appController = this.container.lookup('controller:application');
      if (appController) {
        return (0, _emberMetalProperty_get.get)(appController, 'currentRouteName');
      }
    }
    return route;
  },

  /**
    The default href value to use while a link-to is loading.
    Only applies when tagName is 'a'
      @property loadingHref
    @type String
    @default #
    @private
  */
  loadingHref: '#',

  willRender: function willRender() {
    var queryParams;

    var attrs = this.attrs;

    // Do not mutate params in place
    var params = attrs.params.slice();

    _emberMetalCore2['default'].assert('You must provide one or more parameters to the link-to helper.', params.length);

    var lastParam = params[params.length - 1];

    if (lastParam && lastParam.isQueryParams) {
      queryParams = params.pop();
    } else {
      queryParams = {};
    }

    if (attrs.disabledClass) {
      this.set('disabledClass', attrs.disabledClass);
    }

    if (attrs.activeClass) {
      this.set('activeClass', attrs.activeClass);
    }

    if (attrs.disabledWhen) {
      this.set('disabled', attrs.disabledWhen);
    }

    var currentWhen = attrs['current-when'];

    if (attrs.currentWhen) {
      _emberMetalCore2['default'].deprecate('Using currentWhen with {{link-to}} is deprecated in favor of `current-when`.', !attrs.currentWhen);
      currentWhen = attrs.currentWhen;
    }

    if (currentWhen) {
      this.set('currentWhen', currentWhen);
    }

    // TODO: Change to built-in hasBlock once it's available
    if (!attrs.hasBlock) {
      this.set('linkTitle', params.shift());
    }

    if (attrs.loadingClass) {
      (0, _emberMetalProperty_set.set)(this, 'loadingClass', attrs.loadingClass);
    }

    for (var i = 0; i < params.length; i++) {
      var value = params[i];

      while (_emberRuntimeMixinsController2['default'].detect(value)) {
        _emberMetalCore2['default'].deprecate('Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated. Please update `' + attrs.view + '` to use `{{link-to "post" someController.model}}` instead.');
        value = value.get('model');
      }

      params[i] = value;
    }

    var targetRouteName = undefined;
    var models = [];
    targetRouteName = this._handleOnlyQueryParamsSupplied(params[0]);

    for (var i = 1; i < params.length; i++) {
      models.push(params[i]);
    }

    var resolvedQueryParams = getResolvedQueryParams(queryParams, targetRouteName);

    this.set('targetRouteName', targetRouteName);
    this.set('models', models);
    this.set('queryParams', queryParams);
    this.set('resolvedQueryParams', resolvedQueryParams);
  }
});

LinkComponent.toString = function () {
  return 'LinkComponent';
};

function computeActive(view, routerState) {
  if ((0, _emberMetalProperty_get.get)(view, 'loading')) {
    return false;
  }

  var currentWhen = (0, _emberMetalProperty_get.get)(view, 'currentWhen');
  var isCurrentWhenSpecified = !!currentWhen;
  currentWhen = currentWhen || (0, _emberMetalProperty_get.get)(view, 'targetRouteName');
  currentWhen = currentWhen.split(' ');
  for (var i = 0, len = currentWhen.length; i < len; i++) {
    if (isActiveForRoute(view, currentWhen[i], isCurrentWhenSpecified, routerState)) {
      return (0, _emberMetalProperty_get.get)(view, 'activeClass');
    }
  }

  return false;
}

function modelsAreLoaded(models) {
  for (var i = 0, l = models.length; i < l; i++) {
    if (models[i] == null) {
      return false;
    }
  }

  return true;
}

function isActiveForRoute(view, routeName, isCurrentWhenSpecified, routerState) {
  var service = (0, _emberMetalProperty_get.get)(view, '_routing');
  return service.isActiveForRoute((0, _emberMetalProperty_get.get)(view, 'models'), (0, _emberMetalProperty_get.get)(view, 'resolvedQueryParams'), routeName, routerState, isCurrentWhenSpecified);
}

function getResolvedQueryParams(queryParamsObject, targetRouteName) {
  var resolvedQueryParams = {};

  if (!queryParamsObject) {
    return resolvedQueryParams;
  }

  var values = queryParamsObject.values;
  for (var key in values) {
    if (!values.hasOwnProperty(key)) {
      continue;
    }
    resolvedQueryParams[key] = values[key];
  }

  return resolvedQueryParams;
}

exports['default'] = LinkComponent;
module.exports = exports['default'];