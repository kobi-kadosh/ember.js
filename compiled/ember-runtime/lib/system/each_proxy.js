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

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberRuntimeMixinsArray = require('ember-runtime/mixins/array');

var _emberRuntimeMixinsArray2 = _interopRequireDefault(_emberRuntimeMixinsArray);

// ES6TODO: WAT? Circular dep?

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalEvents = require('ember-metal/events');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalProperty_events = require('ember-metal/property_events');

var EachArray = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsArray2['default'], {

  init: function init(content, keyName, owner) {
    this._super.apply(this, arguments);
    this._keyName = keyName;
    this._owner = owner;
    this._content = content;
  },

  objectAt: function objectAt(idx) {
    var item = this._content.objectAt(idx);
    return item && (0, _emberMetalProperty_get.get)(item, this._keyName);
  },

  length: (0, _emberMetalComputed.computed)(function () {
    var content = this._content;
    return content ? (0, _emberMetalProperty_get.get)(content, 'length') : 0;
  })

});

var IS_OBSERVER = /^.+:(before|change)$/;

function addObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects;
  var guid;
  if (!objects) {
    objects = proxy._objects = {};
  }

  while (--loc >= idx) {
    var item = content.objectAt(loc);
    if (item) {
      _emberMetalCore2['default'].assert('When using @each to observe the array ' + content + ', the array must return an object', (0, _emberRuntimeUtils.typeOf)(item) === 'instance' || (0, _emberRuntimeUtils.typeOf)(item) === 'object');
      (0, _emberMetalObserver.addBeforeObserver)(item, keyName, proxy, 'contentKeyWillChange');
      (0, _emberMetalObserver.addObserver)(item, keyName, proxy, 'contentKeyDidChange');

      // keep track of the index each item was found at so we can map
      // it back when the obj changes.
      guid = (0, _emberMetalUtils.guidFor)(item);
      if (!objects[guid]) {
        objects[guid] = [];
      }

      objects[guid].push(loc);
    }
  }
}

function removeObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects;
  if (!objects) {
    objects = proxy._objects = {};
  }

  var indices, guid;

  while (--loc >= idx) {
    var item = content.objectAt(loc);
    if (item) {
      (0, _emberMetalObserver.removeBeforeObserver)(item, keyName, proxy, 'contentKeyWillChange');
      (0, _emberMetalObserver.removeObserver)(item, keyName, proxy, 'contentKeyDidChange');

      guid = (0, _emberMetalUtils.guidFor)(item);
      indices = objects[guid];
      indices[indices.indexOf(loc)] = null;
    }
  }
}

/**
  This is the object instance returned when you get the `@each` property on an
  array. It uses the unknownProperty handler to automatically create
  EachArray instances for property names.
  @class EachProxy
  @private
*/
var EachProxy = _emberRuntimeSystemObject2['default'].extend({

  init: function init(content) {
    var _this = this;

    this._super.apply(this, arguments);
    this._content = content;
    content.addArrayObserver(this);

    // in case someone is already observing some keys make sure they are
    // added
    (0, _emberMetalEvents.watchedEvents)(this).forEach(function (eventName) {
      _this.didAddListener(eventName);
    });
  },

  /**
    You can directly access mapped properties by simply requesting them.
    The `unknownProperty` handler will generate an EachArray of each item.
      @method unknownProperty
    @param keyName {String}
    @param value {*}
    @private
  */
  unknownProperty: function unknownProperty(keyName, value) {
    var ret = new EachArray(this._content, keyName, this);
    (0, _emberMetalProperties.defineProperty)(this, keyName, null, ret);
    this.beginObservingContentKey(keyName);
    return ret;
  },

  // ..........................................................
  // ARRAY CHANGES
  // Invokes whenever the content array itself changes.

  arrayWillChange: function arrayWillChange(content, idx, removedCnt, addedCnt) {
    var keys = this._keys;
    var key, lim;

    lim = removedCnt > 0 ? idx + removedCnt : -1;
    (0, _emberMetalProperty_events.beginPropertyChanges)(this);

    for (key in keys) {
      if (!keys.hasOwnProperty(key)) {
        continue;
      }

      if (lim > 0) {
        removeObserverForContentKey(content, key, this, idx, lim);
      }

      (0, _emberMetalProperty_events.propertyWillChange)(this, key);
    }

    (0, _emberMetalProperty_events.propertyWillChange)(this._content, '@each');
    (0, _emberMetalProperty_events.endPropertyChanges)(this);
  },

  arrayDidChange: function arrayDidChange(content, idx, removedCnt, addedCnt) {
    var keys = this._keys;
    var lim;

    lim = addedCnt > 0 ? idx + addedCnt : -1;
    (0, _emberMetalProperty_events.changeProperties)(function () {
      for (var key in keys) {
        if (!keys.hasOwnProperty(key)) {
          continue;
        }

        if (lim > 0) {
          addObserverForContentKey(content, key, this, idx, lim);
        }

        (0, _emberMetalProperty_events.propertyDidChange)(this, key);
      }

      (0, _emberMetalProperty_events.propertyDidChange)(this._content, '@each');
    }, this);
  },

  // ..........................................................
  // LISTEN FOR NEW OBSERVERS AND OTHER EVENT LISTENERS
  // Start monitoring keys based on who is listening...

  didAddListener: function didAddListener(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.beginObservingContentKey(eventName.slice(0, -7));
    }
  },

  didRemoveListener: function didRemoveListener(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.stopObservingContentKey(eventName.slice(0, -7));
    }
  },

  // ..........................................................
  // CONTENT KEY OBSERVING
  // Actual watch keys on the source content.

  beginObservingContentKey: function beginObservingContentKey(keyName) {
    var keys = this._keys;
    if (!keys) {
      keys = this._keys = {};
    }

    if (!keys[keyName]) {
      keys[keyName] = 1;
      var content = this._content;
      var len = (0, _emberMetalProperty_get.get)(content, 'length');

      addObserverForContentKey(content, keyName, this, 0, len);
    } else {
      keys[keyName]++;
    }
  },

  stopObservingContentKey: function stopObservingContentKey(keyName) {
    var keys = this._keys;
    if (keys && keys[keyName] > 0 && --keys[keyName] <= 0) {
      var content = this._content;
      var len = (0, _emberMetalProperty_get.get)(content, 'length');

      removeObserverForContentKey(content, keyName, this, 0, len);
    }
  },

  contentKeyWillChange: function contentKeyWillChange(obj, keyName) {
    (0, _emberMetalProperty_events.propertyWillChange)(this, keyName);
  },

  contentKeyDidChange: function contentKeyDidChange(obj, keyName) {
    (0, _emberMetalProperty_events.propertyDidChange)(this, keyName);
  }
});

exports.EachArray = EachArray;
exports.EachProxy = EachProxy;