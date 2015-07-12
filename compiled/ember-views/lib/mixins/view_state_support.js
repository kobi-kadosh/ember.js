'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMixin = require('ember-metal/mixin');

var ViewStateSupport = _emberMetalMixin.Mixin.create({
  transitionTo: function transitionTo(state) {
    _emberMetalCore2['default'].deprecate('Ember.View#transitionTo has been deprecated, it is for internal use only');
    this._transitionTo(state);
  },

  _transitionTo: function _transitionTo(state) {
    var priorState = this.currentState;
    var currentState = this.currentState = this._states[state];
    this._state = state;

    if (priorState && priorState.exit) {
      priorState.exit(this);
    }
    if (currentState.enter) {
      currentState.enter(this);
    }
  }
});

exports['default'] = ViewStateSupport;
module.exports = exports['default'];