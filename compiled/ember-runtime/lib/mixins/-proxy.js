/**
@module ember
@submodule ember-runtime
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

function contentPropertyWillChange(content, contentKey) {
  var key = contentKey.slice(8); // remove "content."
  if (key in this) {
    return;
  } // if shadowed in proxy
  (0, _emberMetalProperty_events.propertyWillChange)(this, key);
}

function contentPropertyDidChange(content, contentKey) {
  var key = contentKey.slice(8); // remove "content."
  if (key in this) {
    return;
  } // if shadowed in proxy
  (0, _emberMetalProperty_events.propertyDidChange)(this, key);
}

/**
  `Ember.ProxyMixin` forwards all properties not defined by the proxy itself
  to a proxied `content` object.  See Ember.ObjectProxy for more details.

  @class ProxyMixin
  @namespace Ember
  @private
*/
exports['default'] = _emberMetalMixin.Mixin.create({
  /**
    The object whose properties will be forwarded.
      @property content
    @type Ember.Object
    @default null
    @private
  */
  content: null,
  _contentDidChange: (0, _emberMetalMixin.observer)('content', function () {
    _emberMetalCore2['default'].assert('Can\'t set Proxy\'s content to itself', (0, _emberMetalProperty_get.get)(this, 'content') !== this);
  }),

  isTruthy: _emberMetalComputed.computed.bool('content'),

  _debugContainerKey: null,

  willWatchProperty: function willWatchProperty(key) {
    var contentKey = 'content.' + key;
    (0, _emberMetalObserver.addBeforeObserver)(this, contentKey, null, contentPropertyWillChange);
    (0, _emberMetalObserver.addObserver)(this, contentKey, null, contentPropertyDidChange);
  },

  didUnwatchProperty: function didUnwatchProperty(key) {
    var contentKey = 'content.' + key;
    (0, _emberMetalObserver.removeBeforeObserver)(this, contentKey, null, contentPropertyWillChange);
    (0, _emberMetalObserver.removeObserver)(this, contentKey, null, contentPropertyDidChange);
  },

  unknownProperty: function unknownProperty(key) {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    if (content) {
      _emberMetalCore2['default'].deprecate((0, _emberRuntimeSystemString.fmt)('You attempted to access `%@` from `%@`, but object proxying is deprecated. ' + 'Please use `model.%@` instead.', [key, this, key]), !this.isController);
      return (0, _emberMetalProperty_get.get)(content, key);
    }
  },

  setUnknownProperty: function setUnknownProperty(key, value) {
    var m = (0, _emberMetalUtils.meta)(this);
    if (m.proto === this) {
      // if marked as prototype then just defineProperty
      // rather than delegate
      (0, _emberMetalProperties.defineProperty)(this, key, null, value);
      return value;
    }

    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    _emberMetalCore2['default'].assert((0, _emberRuntimeSystemString.fmt)('Cannot delegate set(\'%@\', %@) to the \'content\' property of' + ' object proxy %@: its \'content\' is undefined.', [key, value, this]), content);

    _emberMetalCore2['default'].deprecate((0, _emberRuntimeSystemString.fmt)('You attempted to set `%@` from `%@`, but object proxying is deprecated. ' + 'Please use `model.%@` instead.', [key, this, key]), !this.isController);
    return (0, _emberMetalProperty_set.set)(content, key, value);
  }

});
module.exports = exports['default'];