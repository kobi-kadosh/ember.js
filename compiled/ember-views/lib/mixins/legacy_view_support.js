/**
@module ember
@submodule ember-views
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperty_get = require('ember-metal/property_get');

/**
  @class LegacyViewSupport
  @namespace Ember
  @private
*/
var LegacyViewSupport = _emberMetalMixin.Mixin.create({
  beforeRender: function beforeRender(buffer) {},

  afterRender: function afterRender(buffer) {},

  walkChildViews: function walkChildViews(callback) {
    var childViews = this.childViews.slice();

    while (childViews.length) {
      var view = childViews.pop();
      callback(view);
      childViews.push.apply(childViews, _toConsumableArray(view.childViews));
    }
  },

  mutateChildViews: function mutateChildViews(callback) {
    var childViews = (0, _emberMetalProperty_get.get)(this, 'childViews');
    var idx = childViews.length;
    var view;

    while (--idx >= 0) {
      view = childViews[idx];
      callback(this, view, idx);
    }

    return this;
  },

  /**
    Removes all children from the `parentView`.
      @method removeAllChildren
    @return {Ember.View} receiver
    @private
  */
  removeAllChildren: function removeAllChildren() {
    return this.mutateChildViews(function (parentView, view) {
      parentView.removeChild(view);
    });
  },

  destroyAllChildren: function destroyAllChildren() {
    return this.mutateChildViews(function (parentView, view) {
      view.destroy();
    });
  },

  /**
    Return the nearest ancestor whose parent is an instance of
    `klass`.
      @method nearestChildOf
    @param {Class} klass Subclass of Ember.View (or Ember.View itself)
    @return Ember.View
    @deprecated
    @private
  */
  nearestChildOf: function nearestChildOf(klass) {
    _emberMetalCore2['default'].deprecate('nearestChildOf has been deprecated.');

    var view = (0, _emberMetalProperty_get.get)(this, 'parentView');

    while (view) {
      if ((0, _emberMetalProperty_get.get)(view, 'parentView') instanceof klass) {
        return view;
      }
      view = (0, _emberMetalProperty_get.get)(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that is an instance of the provided
    class.
      @method nearestInstanceOf
    @param {Class} klass Subclass of Ember.View (or Ember.View itself)
    @return Ember.View
    @deprecated
    @private
  */
  nearestInstanceOf: function nearestInstanceOf(klass) {
    _emberMetalCore2['default'].deprecate('nearestInstanceOf is deprecated and will be removed from future releases. Use nearestOfType.');
    var view = (0, _emberMetalProperty_get.get)(this, 'parentView');

    while (view) {
      if (view instanceof klass) {
        return view;
      }
      view = (0, _emberMetalProperty_get.get)(view, 'parentView');
    }
  }
});

exports['default'] = LegacyViewSupport;
module.exports = exports['default'];