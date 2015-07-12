/**
@module ember
@submodule ember-views
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalSet_properties = require('ember-metal/set_properties');

var _emberMetalSet_properties2 = _interopRequireDefault(_emberMetalSet_properties);

var EMPTY_ARRAY = [];

var ViewChildViewsSupport = _emberMetalMixin.Mixin.create({
  /**
    Array of child views. You should never edit this array directly.
    Instead, use `appendChild` and `removeFromParent`.
      @property childViews
    @type Array
    @default []
    @private
  */
  childViews: EMPTY_ARRAY,

  init: function init() {
    this._super.apply(this, arguments);

    // setup child views. be sure to clone the child views array first
    // 2.0TODO: Remove Ember.A() here
    this.childViews = _emberMetalCore2['default'].A(this.childViews.slice());
    this.ownerView = this;
  },

  appendChild: function appendChild(view) {
    this.linkChild(view);
    this.childViews.push(view);
  },

  destroyChild: function destroyChild(view) {
    view.destroy();
  },

  /**
    Removes the child view from the parent view.
      @method removeChild
    @param {Ember.View} view
    @return {Ember.View} receiver
    @private
  */
  removeChild: function removeChild(view) {
    // If we're destroying, the entire subtree will be
    // freed, and the DOM will be handled separately,
    // so no need to mess with childViews.
    if (this.isDestroying) {
      return;
    }

    // update parent node
    this.unlinkChild(view);

    // remove view from childViews array.
    var childViews = (0, _emberMetalProperty_get.get)(this, 'childViews');

    var index = childViews.indexOf(view);
    if (index !== -1) {
      childViews.splice(index, 1);
    }

    return this;
  },

  /**
    Instantiates a view to be added to the childViews array during view
    initialization. You generally will not call this method directly unless
    you are overriding `createChildViews()`. Note that this method will
    automatically configure the correct settings on the new view instance to
    act as a child of the parent.
      @method createChildView
    @param {Class|String} viewClass
    @param {Object} [attrs] Attributes to add
    @return {Ember.View} new instance
    @private
  */
  createChildView: function createChildView(maybeViewClass, _attrs) {
    if (!maybeViewClass) {
      throw new TypeError('createChildViews first argument must exist');
    }

    if (maybeViewClass.isView && maybeViewClass.parentView === this && maybeViewClass.container === this.container) {
      return maybeViewClass;
    }

    var attrs = _attrs || {};
    var view;
    attrs.renderer = this.renderer;
    attrs._viewRegistry = this._viewRegistry;

    if (maybeViewClass.isViewFactory) {
      attrs.container = this.container;

      view = maybeViewClass.create(attrs);

      if (view.viewName) {
        (0, _emberMetalProperty_set.set)(this, view.viewName, view);
      }
    } else if ('string' === typeof maybeViewClass) {
      var fullName = 'view:' + maybeViewClass;
      var ViewKlass = this.container.lookupFactory(fullName);

      _emberMetalCore2['default'].assert('Could not find view: \'' + fullName + '\'', !!ViewKlass);

      view = ViewKlass.create(attrs);
    } else {
      view = maybeViewClass;
      _emberMetalCore2['default'].assert('You must pass instance or subclass of View', view.isView);

      attrs.container = this.container;
      (0, _emberMetalSet_properties2['default'])(view, attrs);
    }

    this.linkChild(view);

    return view;
  },

  linkChild: function linkChild(instance) {
    instance.container = this.container;
    (0, _emberMetalProperty_set.set)(instance, 'parentView', this);
    instance.trigger('parentViewDidChange');
    instance.ownerView = this.ownerView;
  },

  unlinkChild: function unlinkChild(instance) {
    (0, _emberMetalProperty_set.set)(instance, 'parentView', null);
    instance.trigger('parentViewDidChange');
  }
});

exports['default'] = ViewChildViewsSupport;
module.exports = exports['default'];