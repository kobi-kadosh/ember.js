'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalPath_cache = require('ember-metal/path_cache');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberMetalStreamsSubscriber = require('ember-metal/streams/subscriber');

var _emberMetalStreamsSubscriber2 = _interopRequireDefault(_emberMetalStreamsSubscriber);

var _emberMetalStreamsDependency = require('ember-metal/streams/dependency');

var _emberMetalStreamsDependency2 = _interopRequireDefault(_emberMetalStreamsDependency);

/**
  @module ember-metal
*/

/**
  @private
  @class Stream
  @namespace Ember.stream
  @constructor
*/
function Stream(fn, label) {
  this.init(label);
  this.compute = fn;
}

var KeyStream;
var ProxyMixin;

Stream.prototype = {
  isStream: true,

  init: function init(label) {
    this.label = makeLabel(label);
    this.isActive = false;
    this.isDirty = true;
    this.isDestroyed = false;
    this.cache = undefined;
    this.children = undefined;
    this.subscriberHead = null;
    this.subscriberTail = null;
    this.dependencyHead = null;
    this.dependencyTail = null;
    this.observedProxy = null;
  },

  _makeChildStream: function _makeChildStream(key) {
    KeyStream = KeyStream || _emberMetalCore2['default'].__loader.require('ember-metal/streams/key-stream')['default'];
    return new KeyStream(this, key);
  },

  removeChild: function removeChild(key) {
    delete this.children[key];
  },

  getKey: function getKey(key) {
    if (this.children === undefined) {
      this.children = Object.create(null);
    }

    var keyStream = this.children[key];

    if (keyStream === undefined) {
      keyStream = this._makeChildStream(key);
      this.children[key] = keyStream;
    }

    return keyStream;
  },

  get: function get(path) {
    var firstKey = (0, _emberMetalPath_cache.getFirstKey)(path);
    var tailPath = (0, _emberMetalPath_cache.getTailPath)(path);

    if (this.children === undefined) {
      this.children = Object.create(null);
    }

    var keyStream = this.children[firstKey];

    if (keyStream === undefined) {
      keyStream = this._makeChildStream(firstKey, path);
      this.children[firstKey] = keyStream;
    }

    if (tailPath === undefined) {
      return keyStream;
    } else {
      return keyStream.get(tailPath);
    }
  },

  value: function value() {
    // TODO: Ensure value is never called on a destroyed stream
    // so that we can uncomment this assertion.
    //
    // Ember.assert("Stream error: value was called after the stream was destroyed", !this.isDestroyed);

    // TODO: Remove this block. This will require ensuring we are
    // not treating streams as "volatile" anywhere.
    if (!this.isActive) {
      this.isDirty = true;
    }

    var willRevalidate = false;

    if (!this.isActive && this.subscriberHead) {
      this.activate();
      willRevalidate = true;
    }

    if (this.isDirty) {
      if (this.isActive) {
        willRevalidate = true;
      }

      this.cache = this.compute();
      this.isDirty = false;
    }

    if (willRevalidate) {
      this.revalidate(this.cache);
    }

    return this.cache;
  },

  addMutableDependency: function addMutableDependency(object) {
    var dependency = new _emberMetalStreamsDependency2['default'](this, object);

    if (this.isActive) {
      dependency.subscribe();
    }

    if (this.dependencyHead === null) {
      this.dependencyHead = this.dependencyTail = dependency;
    } else {
      var tail = this.dependencyTail;
      tail.next = dependency;
      dependency.prev = tail;
      this.dependencyTail = dependency;
    }

    return dependency;
  },

  addDependency: function addDependency(object) {
    if ((0, _emberMetalStreamsUtils.isStream)(object)) {
      this.addMutableDependency(object);
    }
  },

  subscribeDependencies: function subscribeDependencies() {
    var dependency = this.dependencyHead;
    while (dependency) {
      var next = dependency.next;
      dependency.subscribe();
      dependency = next;
    }
  },

  unsubscribeDependencies: function unsubscribeDependencies() {
    var dependency = this.dependencyHead;
    while (dependency) {
      var next = dependency.next;
      dependency.unsubscribe();
      dependency = next;
    }
  },

  maybeDeactivate: function maybeDeactivate() {
    if (!this.subscriberHead && this.isActive) {
      this.isActive = false;
      this.unsubscribeDependencies();
      this.deactivate();
    }
  },

  activate: function activate() {
    this.isActive = true;
    this.subscribeDependencies();
  },

  revalidate: function revalidate(value) {
    if (value !== this.observedProxy) {
      this._clearObservedProxy();

      ProxyMixin = ProxyMixin || _emberMetalCore2['default'].__loader.require('ember-runtime/mixins/-proxy')['default'];

      if (ProxyMixin.detect(value)) {
        (0, _emberMetalObserver.addObserver)(value, 'content', this, this.notify);
        this.observedProxy = value;
      }
    }
  },

  _clearObservedProxy: function _clearObservedProxy() {
    if (this.observedProxy) {
      (0, _emberMetalObserver.removeObserver)(this.observedProxy, 'content', this, this.notify);
      this.observedProxy = null;
    }
  },

  deactivate: function deactivate() {
    this._clearObservedProxy();
  },

  compute: function compute() {
    throw new Error('Stream error: compute not implemented');
  },

  setValue: function setValue() {
    throw new Error('Stream error: setValue not implemented');
  },

  notify: function notify() {
    this.notifyExcept();
  },

  notifyExcept: function notifyExcept(callbackToSkip, contextToSkip) {
    if (!this.isDirty) {
      this.isDirty = true;
      this.notifySubscribers(callbackToSkip, contextToSkip);
    }
  },

  subscribe: function subscribe(callback, context) {
    _emberMetalCore2['default'].assert('You tried to subscribe to a stream but the callback provided was not a function.', typeof callback === 'function');

    var subscriber = new _emberMetalStreamsSubscriber2['default'](callback, context, this);
    if (this.subscriberHead === null) {
      this.subscriberHead = this.subscriberTail = subscriber;
    } else {
      var tail = this.subscriberTail;
      tail.next = subscriber;
      subscriber.prev = tail;
      this.subscriberTail = subscriber;
    }

    var stream = this;
    return function (prune) {
      subscriber.removeFrom(stream);
      if (prune) {
        stream.prune();
      }
    };
  },

  prune: function prune() {
    if (this.subscriberHead === null) {
      this.destroy(true);
    }
  },

  unsubscribe: function unsubscribe(callback, context) {
    var subscriber = this.subscriberHead;

    while (subscriber) {
      var next = subscriber.next;
      if (subscriber.callback === callback && subscriber.context === context) {
        subscriber.removeFrom(this);
      }
      subscriber = next;
    }
  },

  notifySubscribers: function notifySubscribers(callbackToSkip, contextToSkip) {
    var subscriber = this.subscriberHead;

    while (subscriber) {
      var next = subscriber.next;

      var callback = subscriber.callback;
      var context = subscriber.context;

      subscriber = next;

      if (callback === callbackToSkip && context === contextToSkip) {
        continue;
      }

      if (context === undefined) {
        callback(this);
      } else {
        callback.call(context, this);
      }
    }
  },

  destroy: function destroy(prune) {
    if (!this.isDestroyed) {
      this.isDestroyed = true;

      this.subscriberHead = this.subscriberTail = null;
      this.maybeDeactivate();

      var dependencies = this.dependencies;

      if (dependencies) {
        for (var i = 0, l = dependencies.length; i < l; i++) {
          dependencies[i](prune);
        }
      }

      this.dependencies = null;
      return true;
    }
  }
};

Stream.wrap = function (value, Kind, param) {
  if ((0, _emberMetalStreamsUtils.isStream)(value)) {
    return value;
  } else {
    return new Kind(value, param);
  }
};

function makeLabel(label) {
  if (label === undefined) {
    return '(no label)';
  } else {
    return label;
  }
}

exports['default'] = Stream;
module.exports = exports['default'];