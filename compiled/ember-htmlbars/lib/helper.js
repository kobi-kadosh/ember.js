'use strict';

_emberRuntimeSystemObject2['default'].defineProperty(exports, '__esModule', {
  value: true
});

exports.helper = helper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

// Ember.Helper.extend({ compute(params, hash) {} });
var Helper = _emberRuntimeSystemObject2['default'].extend({
  isHelper: true,
  recompute: function recompute() {
    this._stream.notify();
  }
});

Helper.reopenClass({
  isHelperFactory: true
});

// Ember.Helper.helper(function(params, hash) {});

function helper(helperFn) {
  return {
    isHelperInstance: true,
    compute: helperFn
  };
}

exports['default'] = Helper;