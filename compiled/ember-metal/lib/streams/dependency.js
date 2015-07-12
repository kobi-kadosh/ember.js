'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

/**
  @module ember-metal
*/

/**
  @private
  @class Dependency
  @namespace Ember.streams
  @constructor
*/
function Dependency(depender, dependee) {
  _emberMetalCore2['default'].assert('Dependency error: Depender must be a stream', (0, _emberMetalStreamsUtils.isStream)(depender));

  this.next = null;
  this.prev = null;
  this.depender = depender;
  this.dependee = dependee;
  this.unsubscription = null;
}

(0, _emberMetalMerge2['default'])(Dependency.prototype, {
  subscribe: function subscribe() {
    _emberMetalCore2['default'].assert('Dependency error: Dependency tried to subscribe while already subscribed', !this.unsubscription);

    this.unsubscription = (0, _emberMetalStreamsUtils.subscribe)(this.dependee, this.depender.notify, this.depender);
  },

  unsubscribe: function unsubscribe() {
    if (this.unsubscription) {
      this.unsubscription();
      this.unsubscription = null;
    }
  },

  replace: function replace(dependee) {
    if (this.dependee !== dependee) {
      this.dependee = dependee;

      if (this.unsubscription) {
        this.unsubscribe();
        this.subscribe();
      }
    }
  },

  getValue: function getValue() {
    return (0, _emberMetalStreamsUtils.read)(this.dependee);
  },

  setValue: function setValue(value) {
    return (0, _emberMetalStreamsUtils.setValue)(this.dependee, value);
  }

  // destroy() {
  //   var next = this.next;
  //   var prev = this.prev;

  //   if (prev) {
  //     prev.next = next;
  //   } else {
  //     this.depender.dependencyHead = next;
  //   }

  //   if (next) {
  //     next.prev = prev;
  //   } else {
  //     this.depender.dependencyTail = prev;
  //   }

  //   this.unsubscribe();
  // }
});

exports['default'] = Dependency;
module.exports = exports['default'];