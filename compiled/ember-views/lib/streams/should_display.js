'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = shouldDisplay;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function shouldDisplay(predicate) {
  if ((0, _emberMetalStreamsUtils.isStream)(predicate)) {
    return new ShouldDisplayStream(predicate);
  }

  var type = typeof predicate;

  if (type === 'boolean') {
    return predicate;
  }

  if (type && type === 'object') {
    var isTruthy = (0, _emberMetalProperty_get.get)(predicate, 'isTruthy');
    if (typeof isTruthy === 'boolean') {
      return isTruthy;
    }
  }

  if ((0, _emberRuntimeUtils.isArray)(predicate)) {
    return (0, _emberMetalProperty_get.get)(predicate, 'length') !== 0;
  } else {
    return !!predicate;
  }
}

function ShouldDisplayStream(predicate) {
  _emberMetalCore2['default'].assert('ShouldDisplayStream error: predicate must be a stream', (0, _emberMetalStreamsUtils.isStream)(predicate));

  var isTruthy = predicate.get('isTruthy');

  this.init();
  this.predicate = predicate;
  this.isTruthy = isTruthy;
  this.lengthDep = null;

  this.addDependency(predicate);
  this.addDependency(isTruthy);
}

ShouldDisplayStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(ShouldDisplayStream.prototype, {
  compute: function compute() {
    var truthy = (0, _emberMetalStreamsUtils.read)(this.isTruthy);

    if (typeof truthy === 'boolean') {
      return truthy;
    }

    if (this.lengthDep) {
      return this.lengthDep.getValue() !== 0;
    } else {
      return !!(0, _emberMetalStreamsUtils.read)(this.predicate);
    }
  },

  revalidate: function revalidate() {
    if ((0, _emberRuntimeUtils.isArray)((0, _emberMetalStreamsUtils.read)(this.predicate))) {
      if (!this.lengthDep) {
        this.lengthDep = this.addMutableDependency(this.predicate.get('length'));
      }
    } else {
      if (this.lengthDep) {
        this.lengthDep.destroy();
        this.lengthDep = null;
      }
    }
  }
});
module.exports = exports['default'];