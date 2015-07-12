/**
 @module ember
 @submodule ember-views
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

function K() {
  return this;
}

/**
 @class VisibilitySupport
 @namespace Ember
 @public
*/
var VisibilitySupport = _emberMetalMixin.Mixin.create({
  /**
    If `false`, the view will appear hidden in DOM.
      @property isVisible
    @type Boolean
    @default null
    @public
  */
  isVisible: true,

  becameVisible: K,
  becameHidden: K,

  /**
    When the view's `isVisible` property changes, toggle the visibility
    element of the actual DOM element.
      @method _isVisibleDidChange
    @private
  */
  _isVisibleDidChange: (0, _emberMetalMixin.observer)('isVisible', function () {
    if (this._isVisible === (0, _emberMetalProperty_get.get)(this, 'isVisible')) {
      return;
    }
    _emberMetalRun_loop2['default'].scheduleOnce('render', this, this._toggleVisibility);
  }),

  _toggleVisibility: function _toggleVisibility() {
    var $el = this.$();
    var isVisible = (0, _emberMetalProperty_get.get)(this, 'isVisible');

    if (this._isVisible === isVisible) {
      return;
    }

    // It's important to keep these in sync, even if we don't yet have
    // an element in the DOM to manipulate:
    this._isVisible = isVisible;

    if (!$el) {
      return;
    }

    $el.toggle(isVisible);

    if (this._isAncestorHidden()) {
      return;
    }

    if (isVisible) {
      this._notifyBecameVisible();
    } else {
      this._notifyBecameHidden();
    }
  },

  _notifyBecameVisible: function _notifyBecameVisible() {
    this.trigger('becameVisible');

    this.forEachChildView(function (view) {
      var isVisible = (0, _emberMetalProperty_get.get)(view, 'isVisible');

      if (isVisible || isVisible === null) {
        view._notifyBecameVisible();
      }
    });
  },

  _notifyBecameHidden: function _notifyBecameHidden() {
    this.trigger('becameHidden');
    this.forEachChildView(function (view) {
      var isVisible = (0, _emberMetalProperty_get.get)(view, 'isVisible');

      if (isVisible || isVisible === null) {
        view._notifyBecameHidden();
      }
    });
  },

  _isAncestorHidden: function _isAncestorHidden() {
    var parent = (0, _emberMetalProperty_get.get)(this, 'parentView');

    while (parent) {
      if ((0, _emberMetalProperty_get.get)(parent, 'isVisible') === false) {
        return true;
      }

      parent = (0, _emberMetalProperty_get.get)(parent, 'parentView');
    }

    return false;
  }
});

exports['default'] = VisibilitySupport;
module.exports = exports['default'];