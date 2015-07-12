/**
@module ember
@submodule ember-views
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberViewsViewsStates = require('ember-views/views/states');

var states = (0, _emberViewsViewsStates.cloneStates)(_emberViewsViewsStates.states);

(0, _emberMetalMerge2['default'])(states._default, {
  rerenderIfNeeded: function rerenderIfNeeded() {
    return this;
  }
});

(0, _emberMetalMerge2['default'])(states.inDOM, {
  rerenderIfNeeded: function rerenderIfNeeded(view) {
    if (view.normalizedValue() !== view._lastNormalizedValue) {
      view.rerender();
    }
  }
});

exports['default'] = _emberMetalMixin.Mixin.create({
  _states: states,

  normalizedValue: function normalizedValue() {
    var value = this.lazyValue.value();
    var valueNormalizer = (0, _emberMetalProperty_get.get)(this, 'valueNormalizerFunc');
    return valueNormalizer ? valueNormalizer(value) : value;
  },

  rerenderIfNeeded: function rerenderIfNeeded() {
    this.currentState.rerenderIfNeeded(this);
  }
});
module.exports = exports['default'];