'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

function ProxyStream(source, label) {
  this.init(label);
  this.sourceDep = this.addMutableDependency(source);
}

ProxyStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(ProxyStream.prototype, {
  compute: function compute() {
    return this.sourceDep.getValue();
  },

  setValue: function setValue(value) {
    this.sourceDep.setValue(value);
  },

  setSource: function setSource(source) {
    this.sourceDep.replace(source);
    this.notify();
  }
});

exports['default'] = ProxyStream;
module.exports = exports['default'];