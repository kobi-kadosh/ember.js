'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function KeyStream(source, key) {
  _emberMetalCore2['default'].assert('KeyStream error: source must be a stream', (0, _emberMetalStreamsUtils.isStream)(source)); // TODO: This isn't necessary.
  _emberMetalCore2['default'].assert('KeyStream error: key must be a non-empty string', typeof key === 'string' && key.length > 0);
  _emberMetalCore2['default'].assert('KeyStream error: key must not have a \'.\'', key.indexOf('.') === -1);

  // used to get the original path for debugging and legacy purposes
  var label = labelFor(source, key);

  this.init(label);
  this.path = label;
  this.sourceDep = this.addMutableDependency(source);
  this.observedObject = null;
  this.key = key;
}

function labelFor(source, key) {
  return source.label ? source.label + '.' + key : key;
}

KeyStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(KeyStream.prototype, {
  compute: function compute() {
    var object = this.sourceDep.getValue();
    if (object) {
      return (0, _emberMetalProperty_get.get)(object, this.key);
    }
  },

  setValue: function setValue(value) {
    var object = this.sourceDep.getValue();
    if (object) {
      (0, _emberMetalProperty_set.set)(object, this.key, value);
    }
  },

  setSource: function setSource(source) {
    this.sourceDep.replace(source);
    this.notify();
  },

  _super$revalidate: _emberMetalStreamsStream2['default'].prototype.revalidate,

  revalidate: function revalidate(value) {
    this._super$revalidate(value);

    var object = this.sourceDep.getValue();
    if (object !== this.observedObject) {
      this._clearObservedObject();

      if (object && typeof object === 'object') {
        (0, _emberMetalObserver.addObserver)(object, this.key, this, this.notify);
        this.observedObject = object;
      }
    }
  },

  _super$deactivate: _emberMetalStreamsStream2['default'].prototype.deactivate,

  _clearObservedObject: function _clearObservedObject() {
    if (this.observedObject) {
      (0, _emberMetalObserver.removeObserver)(this.observedObject, this.key, this, this.notify);
      this.observedObject = null;
    }
  },

  deactivate: function deactivate() {
    this._super$deactivate();
    this._clearObservedObject();
  }
});

exports['default'] = KeyStream;
module.exports = exports['default'];