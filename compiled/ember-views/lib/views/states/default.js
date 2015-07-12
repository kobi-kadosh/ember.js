'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

/**
@module ember
@submodule ember-views
*/
exports['default'] = {
  // appendChild is only legal while rendering the buffer.
  appendChild: function appendChild() {
    throw new _emberMetalError2['default']('You can\'t use appendChild outside of the rendering process');
  },

  $: function $() {
    return undefined;
  },

  getElement: function getElement() {
    return null;
  },

  legacyAttrWillChange: function legacyAttrWillChange(view, key) {
    if (key in view.attrs && !(key in view)) {
      (0, _emberMetalProperty_events.propertyWillChange)(view, key);
    }
  },

  legacyAttrDidChange: function legacyAttrDidChange(view, key) {
    if (key in view.attrs && !(key in view)) {
      (0, _emberMetalProperty_events.propertyDidChange)(view, key);
    }
  },

  legacyPropertyDidChange: function legacyPropertyDidChange(view, key) {
    var attrs = view.attrs;

    if (attrs && key in attrs) {
      var possibleCell = attrs[key];

      if (possibleCell && possibleCell[_emberViewsCompatAttrsProxy.MUTABLE_CELL]) {
        var value = (0, _emberMetalProperty_get.get)(view, key);
        if (value === possibleCell.value) {
          return;
        }
        possibleCell.update(value);
      }
    }
  },

  // Handle events from `Ember.EventDispatcher`
  handleEvent: function handleEvent() {
    return true; // continue event propagation
  },

  cleanup: function cleanup() {},
  destroyElement: function destroyElement() {},

  rerender: function rerender(view) {
    view.renderer.ensureViewNotRendering(view);
  },
  invokeObserver: function invokeObserver() {}
};
module.exports = exports['default'];