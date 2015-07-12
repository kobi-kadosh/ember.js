'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsEvented = require('ember-runtime/mixins/evented');

var _emberRuntimeMixinsEvented2 = _interopRequireDefault(_emberRuntimeMixinsEvented);

var _emberRuntimeMixinsAction_handler = require('ember-runtime/mixins/action_handler');

var _emberRuntimeMixinsAction_handler2 = _interopRequireDefault(_emberRuntimeMixinsAction_handler);

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberMetalViewsRenderer = require('ember-metal-views/renderer');

var _emberMetalViewsRenderer2 = _interopRequireDefault(_emberMetalViewsRenderer);

var _emberViewsViewsStates = require('ember-views/views/states');

var _htmlbarsRuntime = require('htmlbars-runtime');

function K() {
  return this;
}

// Normally, the renderer is injected by the container when the view is looked
// up. However, if someone creates a view without looking it up via the
// container (e.g. `Ember.View.create().append()`) then we create a fallback
// DOM renderer that is shared. In general, this path should be avoided since
// views created this way cannot run in a node environment.
var renderer;

/**
  `Ember.CoreView` is an abstract class that exists to give view-like behavior
  to both Ember's main view class `Ember.View` and other classes that don't need
  the fully functionaltiy of `Ember.View`.

  Unless you have specific needs for `CoreView`, you will use `Ember.View`
  in your applications.

  @class CoreView
  @namespace Ember
  @extends Ember.Object
  @deprecated Use `Ember.View` instead.
  @uses Ember.Evented
  @uses Ember.ActionHandler
  @private
*/
var CoreView = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default'], _emberRuntimeMixinsAction_handler2['default'], {
  isView: true,

  _states: (0, _emberViewsViewsStates.cloneStates)(_emberViewsViewsStates.states),

  init: function init() {
    this._super.apply(this, arguments);
    this._state = 'preRender';
    this.currentState = this._states.preRender;
    this._isVisible = (0, _emberMetalProperty_get.get)(this, 'isVisible');

    // Fallback for legacy cases where the view was created directly
    // via `create()` instead of going through the container.
    if (!this.renderer) {
      var DOMHelper = domHelper();
      renderer = renderer || new _emberMetalViewsRenderer2['default'](new DOMHelper());
      this.renderer = renderer;
    }

    this.isDestroyingSubtree = false;
    this._dispatching = null;
  },

  /**
    If the view is currently inserted into the DOM of a parent view, this
    property will point to the parent of the view.
      @property parentView
    @type Ember.View
    @default null
    @private
  */
  parentView: null,

  _state: null,

  instrumentName: 'core_view',

  instrumentDetails: function instrumentDetails(hash) {
    hash.object = this.toString();
    hash.containerKey = this._debugContainerKey;
    hash.view = this;
  },

  /**
    Override the default event firing from `Ember.Evented` to
    also call methods with the given name.
      @method trigger
    @param name {String}
    @private
  */
  trigger: function trigger() {
    this._super.apply(this, arguments);
    var name = arguments[0];
    var method = this[name];
    if (method) {
      var length = arguments.length;
      var args = new Array(length - 1);
      for (var i = 1; i < length; i++) {
        args[i - 1] = arguments[i];
      }
      return method.apply(this, args);
    }
  },

  has: function has(name) {
    return (0, _emberRuntimeUtils.typeOf)(this[name]) === 'function' || this._super(name);
  },

  destroy: function destroy() {
    var parent = this.parentView;

    if (!this._super.apply(this, arguments)) {
      return;
    }

    this.currentState.cleanup(this);

    if (!this.ownerView.isDestroyingSubtree) {
      this.ownerView.isDestroyingSubtree = true;
      if (parent) {
        parent.removeChild(this);
      }
      if (this._renderNode) {
        _emberMetalCore2['default'].assert('BUG: Render node exists without concomitant env.', this.ownerView.env);
        _htmlbarsRuntime.internal.clearMorph(this._renderNode, this.ownerView.env, true);
      }
      this.ownerView.isDestroyingSubtree = false;
    }

    return this;
  },

  clearRenderedChildren: K,
  _transitionTo: K,
  destroyElement: K
});

CoreView.reopenClass({
  isViewFactory: true
});

var DeprecatedCoreView = CoreView.extend({
  init: function init() {
    _emberMetalCore2['default'].deprecate('Ember.CoreView is deprecated. Please use Ember.View.', false);
    this._super.apply(this, arguments);
  }
});

exports.DeprecatedCoreView = DeprecatedCoreView;
var _domHelper;
function domHelper() {
  return _domHelper = _domHelper || _emberMetalCore2['default'].__loader.require('ember-htmlbars/system/dom-helper')['default'];
}

exports['default'] = CoreView;