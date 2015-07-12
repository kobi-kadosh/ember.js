'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

/**
  @module ember-metal
*/

/**
  @private
  @class Subscriber
  @namespace Ember.streams
  @constructor
*/
function Subscriber(callback, context) {
  this.next = null;
  this.prev = null;
  this.callback = callback;
  this.context = context;
}

(0, _emberMetalMerge2['default'])(Subscriber.prototype, {
  removeFrom: function removeFrom(stream) {
    var next = this.next;
    var prev = this.prev;

    if (prev) {
      prev.next = next;
    } else {
      stream.subscriberHead = next;
    }

    if (next) {
      next.prev = prev;
    } else {
      stream.subscriberTail = prev;
    }

    stream.maybeDeactivate();
  }
});

exports['default'] = Subscriber;
module.exports = exports['default'];