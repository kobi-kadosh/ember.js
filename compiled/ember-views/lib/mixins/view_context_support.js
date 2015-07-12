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

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberViewsMixinsLegacy_view_support = require('ember-views/mixins/legacy_view_support');

var _emberViewsMixinsLegacy_view_support2 = _interopRequireDefault(_emberViewsMixinsLegacy_view_support);

var _emberMetalEvents = require('ember-metal/events');

var ViewContextSupport = _emberMetalMixin.Mixin.create(_emberViewsMixinsLegacy_view_support2['default'], {
  /**
    The object from which templates should access properties.
      This object will be passed to the template function each time the render
    method is called, but it is up to the individual function to decide what
    to do with it.
      By default, this will be the view's controller.
      @property context
    @type Object
    @private
  */
  context: (0, _emberMetalComputed.computed)({
    get: function get() {
      return (0, _emberMetalProperty_get.get)(this, '_context');
    },
    set: function set(key, value) {
      (0, _emberMetalProperty_set.set)(this, '_context', value);
      return value;
    }
  }).volatile(),

  /**
    Private copy of the view's template context. This can be set directly
    by Handlebars without triggering the observer that causes the view
    to be re-rendered.
      The context of a view is looked up as follows:
      1. Supplied context (usually by Handlebars)
    2. Specified controller
    3. `parentView`'s context (for a child of a ContainerView)
      The code in Handlebars that overrides the `_context` property first
    checks to see whether the view has a specified controller. This is
    something of a hack and should be revisited.
      @property _context
    @private
  */
  _context: (0, _emberMetalComputed.computed)({
    get: function get() {
      var parentView, controller;

      if (controller = (0, _emberMetalProperty_get.get)(this, 'controller')) {
        return controller;
      }

      parentView = this.parentView;
      if (parentView) {
        return (0, _emberMetalProperty_get.get)(parentView, '_context');
      }
      return null;
    },
    set: function set(key, value) {
      return value;
    }
  }),

  _controller: null,

  /**
    The controller managing this view. If this property is set, it will be
    made available for use by the template.
      @property controller
    @type Object
    @private
  */
  controller: (0, _emberMetalComputed.computed)({
    get: function get() {
      if (this._controller) {
        return this._controller;
      }

      return this.parentView ? (0, _emberMetalProperty_get.get)(this.parentView, 'controller') : null;
    },
    set: function set(_, value) {
      this._controller = value;
      return value;
    }
  }),

  _legacyControllerDidChange: (0, _emberMetalMixin.observer)('controller', function () {
    this.walkChildViews(function (view) {
      return view.notifyPropertyChange('controller');
    });
  }),

  _notifyControllerChange: (0, _emberMetalEvents.on)('parentViewDidChange', function () {
    this.notifyPropertyChange('controller');
  })
});

exports['default'] = ViewContextSupport;
module.exports = exports['default'];