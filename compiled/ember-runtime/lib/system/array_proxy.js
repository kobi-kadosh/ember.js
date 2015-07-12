'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsMutable_array = require('ember-runtime/mixins/mutable_array');

var _emberRuntimeMixinsMutable_array2 = _interopRequireDefault(_emberRuntimeMixinsMutable_array);

var _emberRuntimeMixinsEnumerable = require('ember-runtime/mixins/enumerable');

var _emberRuntimeMixinsEnumerable2 = _interopRequireDefault(_emberRuntimeMixinsEnumerable);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberMetalAlias = require('ember-metal/alias');

var _emberMetalAlias2 = _interopRequireDefault(_emberMetalAlias);

/**
@module ember
@submodule ember-runtime
*/

var OUT_OF_RANGE_EXCEPTION = 'Index out of range';
var EMPTY = [];

function K() {
  return this;
}

/**
  An ArrayProxy wraps any other object that implements `Ember.Array` and/or
  `Ember.MutableArray,` forwarding all requests. This makes it very useful for
  a number of binding use cases or other cases where being able to swap
  out the underlying array is useful.

  A simple example of usage:

  ```javascript
  var pets = ['dog', 'cat', 'fish'];
  var ap = Ember.ArrayProxy.create({ content: Ember.A(pets) });

  ap.get('firstObject');                        // 'dog'
  ap.set('content', ['amoeba', 'paramecium']);
  ap.get('firstObject');                        // 'amoeba'
  ```

  This class can also be useful as a layer to transform the contents of
  an array, as they are accessed. This can be done by overriding
  `objectAtContent`:

  ```javascript
  var pets = ['dog', 'cat', 'fish'];
  var ap = Ember.ArrayProxy.create({
      content: Ember.A(pets),
      objectAtContent: function(idx) {
          return this.get('content').objectAt(idx).toUpperCase();
      }
  });

  ap.get('firstObject'); // . 'DOG'
  ```

  @class ArrayProxy
  @namespace Ember
  @extends Ember.Object
  @uses Ember.MutableArray
  @private
*/
var ArrayProxy = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsMutable_array2['default'], {

  /**
    The content array. Must be an object that implements `Ember.Array` and/or
    `Ember.MutableArray.`
      @property content
    @type Ember.Array
    @private
  */
  content: null,

  /**
   The array that the proxy pretends to be. In the default `ArrayProxy`
   implementation, this and `content` are the same. Subclasses of `ArrayProxy`
   can override this property to provide things like sorting and filtering.
     @property arrangedContent
   @private
  */
  arrangedContent: (0, _emberMetalAlias2['default'])('content'),

  /**
    Should actually retrieve the object at the specified index from the
    content. You can override this method in subclasses to transform the
    content item to something new.
      This method will only be called if content is non-`null`.
      @method objectAtContent
    @param {Number} idx The index to retrieve.
    @return {Object} the value or undefined if none found
    @private
  */
  objectAtContent: function objectAtContent(idx) {
    return (0, _emberMetalProperty_get.get)(this, 'arrangedContent').objectAt(idx);
  },

  /**
    Should actually replace the specified objects on the content array.
    You can override this method in subclasses to transform the content item
    into something new.
      This method will only be called if content is non-`null`.
      @method replaceContent
    @param {Number} idx The starting index
    @param {Number} amt The number of items to remove from the content.
    @param {Array} objects Optional array of objects to insert or null if no
      objects.
    @return {void}
    @private
  */
  replaceContent: function replaceContent(idx, amt, objects) {
    (0, _emberMetalProperty_get.get)(this, 'content').replace(idx, amt, objects);
  },

  /**
    Invoked when the content property is about to change. Notifies observers that the
    entire array content will change.
      @private
    @method _contentWillChange
  */
  _contentWillChange: (0, _emberMetalMixin.beforeObserver)('content', function () {
    this._teardownContent();
  }),

  _teardownContent: function _teardownContent() {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');

    if (content) {
      content.removeArrayObserver(this, {
        willChange: 'contentArrayWillChange',
        didChange: 'contentArrayDidChange'
      });
    }
  },

  /**
    Override to implement content array `willChange` observer.
      @method contentArrayWillChange
      @param {Ember.Array} contentArray the content array
    @param {Number} start starting index of the change
    @param {Number} removeCount count of items removed
    @param {Number} addCount count of items added
    @private
  */
  contentArrayWillChange: K,
  /**
    Override to implement content array `didChange` observer.
      @method contentArrayDidChange
      @param {Ember.Array} contentArray the content array
    @param {Number} start starting index of the change
    @param {Number} removeCount count of items removed
    @param {Number} addCount count of items added
    @private
  */
  contentArrayDidChange: K,

  /**
    Invoked when the content property changes. Notifies observers that the
    entire array content has changed.
      @private
    @method _contentDidChange
  */
  _contentDidChange: (0, _emberMetalMixin.observer)('content', function () {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');

    _emberMetalCore2['default'].assert('Can\'t set ArrayProxy\'s content to itself', content !== this);

    this._setupContent();
  }),

  _setupContent: function _setupContent() {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');

    if (content) {
      _emberMetalCore2['default'].assert((0, _emberRuntimeSystemString.fmt)('ArrayProxy expects an Array or ' + 'Ember.ArrayProxy, but you passed %@', [typeof content]), (0, _emberRuntimeUtils.isArray)(content) || content.isDestroyed);

      content.addArrayObserver(this, {
        willChange: 'contentArrayWillChange',
        didChange: 'contentArrayDidChange'
      });
    }
  },

  _arrangedContentWillChange: (0, _emberMetalMixin.beforeObserver)('arrangedContent', function () {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
    var len = arrangedContent ? (0, _emberMetalProperty_get.get)(arrangedContent, 'length') : 0;

    this.arrangedContentArrayWillChange(this, 0, len, undefined);
    this.arrangedContentWillChange(this);

    this._teardownArrangedContent(arrangedContent);
  }),

  _arrangedContentDidChange: (0, _emberMetalMixin.observer)('arrangedContent', function () {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
    var len = arrangedContent ? (0, _emberMetalProperty_get.get)(arrangedContent, 'length') : 0;

    _emberMetalCore2['default'].assert('Can\'t set ArrayProxy\'s content to itself', arrangedContent !== this);

    this._setupArrangedContent();

    this.arrangedContentDidChange(this);
    this.arrangedContentArrayDidChange(this, 0, undefined, len);
  }),

  _setupArrangedContent: function _setupArrangedContent() {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');

    if (arrangedContent) {
      _emberMetalCore2['default'].assert((0, _emberRuntimeSystemString.fmt)('ArrayProxy expects an Array or ' + 'Ember.ArrayProxy, but you passed %@', [typeof arrangedContent]), (0, _emberRuntimeUtils.isArray)(arrangedContent) || arrangedContent.isDestroyed);

      arrangedContent.addArrayObserver(this, {
        willChange: 'arrangedContentArrayWillChange',
        didChange: 'arrangedContentArrayDidChange'
      });
    }
  },

  _teardownArrangedContent: function _teardownArrangedContent() {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');

    if (arrangedContent) {
      arrangedContent.removeArrayObserver(this, {
        willChange: 'arrangedContentArrayWillChange',
        didChange: 'arrangedContentArrayDidChange'
      });
    }
  },

  arrangedContentWillChange: K,
  arrangedContentDidChange: K,

  objectAt: function objectAt(idx) {
    return (0, _emberMetalProperty_get.get)(this, 'content') && this.objectAtContent(idx);
  },

  length: (0, _emberMetalComputed.computed)(function () {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
    return arrangedContent ? (0, _emberMetalProperty_get.get)(arrangedContent, 'length') : 0;
    // No dependencies since Enumerable notifies length of change
  }),

  _replace: function _replace(idx, amt, objects) {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    _emberMetalCore2['default'].assert('The content property of ' + this.constructor + ' should be set before modifying it', content);
    if (content) {
      this.replaceContent(idx, amt, objects);
    }

    return this;
  },

  replace: function replace() {
    if ((0, _emberMetalProperty_get.get)(this, 'arrangedContent') === (0, _emberMetalProperty_get.get)(this, 'content')) {
      this._replace.apply(this, arguments);
    } else {
      throw new _emberMetalError2['default']('Using replace on an arranged ArrayProxy is not allowed.');
    }
  },

  _insertAt: function _insertAt(idx, object) {
    if (idx > (0, _emberMetalProperty_get.get)(this, 'content.length')) {
      throw new _emberMetalError2['default'](OUT_OF_RANGE_EXCEPTION);
    }

    this._replace(idx, 0, [object]);
    return this;
  },

  insertAt: function insertAt(idx, object) {
    if ((0, _emberMetalProperty_get.get)(this, 'arrangedContent') === (0, _emberMetalProperty_get.get)(this, 'content')) {
      return this._insertAt(idx, object);
    } else {
      throw new _emberMetalError2['default']('Using insertAt on an arranged ArrayProxy is not allowed.');
    }
  },

  removeAt: function removeAt(start, len) {
    if ('number' === typeof start) {
      var content = (0, _emberMetalProperty_get.get)(this, 'content');
      var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
      var indices = [];
      var i;

      if (start < 0 || start >= (0, _emberMetalProperty_get.get)(this, 'length')) {
        throw new _emberMetalError2['default'](OUT_OF_RANGE_EXCEPTION);
      }

      if (len === undefined) {
        len = 1;
      }

      // Get a list of indices in original content to remove
      for (i = start; i < start + len; i++) {
        // Use arrangedContent here so we avoid confusion with objects transformed by objectAtContent
        indices.push(content.indexOf(arrangedContent.objectAt(i)));
      }

      // Replace in reverse order since indices will change
      indices.sort(function (a, b) {
        return b - a;
      });

      (0, _emberMetalProperty_events.beginPropertyChanges)();
      for (i = 0; i < indices.length; i++) {
        this._replace(indices[i], 1, EMPTY);
      }
      (0, _emberMetalProperty_events.endPropertyChanges)();
    }

    return this;
  },

  pushObject: function pushObject(obj) {
    this._insertAt((0, _emberMetalProperty_get.get)(this, 'content.length'), obj);
    return obj;
  },

  pushObjects: function pushObjects(objects) {
    if (!(_emberRuntimeMixinsEnumerable2['default'].detect(objects) || (0, _emberRuntimeUtils.isArray)(objects))) {
      throw new TypeError('Must pass Ember.Enumerable to Ember.MutableArray#pushObjects');
    }
    this._replace((0, _emberMetalProperty_get.get)(this, 'length'), 0, objects);
    return this;
  },

  setObjects: function setObjects(objects) {
    if (objects.length === 0) {
      return this.clear();
    }

    var len = (0, _emberMetalProperty_get.get)(this, 'length');
    this._replace(0, len, objects);
    return this;
  },

  unshiftObject: function unshiftObject(obj) {
    this._insertAt(0, obj);
    return obj;
  },

  unshiftObjects: function unshiftObjects(objects) {
    this._replace(0, 0, objects);
    return this;
  },

  slice: function slice() {
    var arr = this.toArray();
    return arr.slice.apply(arr, arguments);
  },

  arrangedContentArrayWillChange: function arrangedContentArrayWillChange(item, idx, removedCnt, addedCnt) {
    this.arrayContentWillChange(idx, removedCnt, addedCnt);
  },

  arrangedContentArrayDidChange: function arrangedContentArrayDidChange(item, idx, removedCnt, addedCnt) {
    this.arrayContentDidChange(idx, removedCnt, addedCnt);
  },

  init: function init() {
    this._super.apply(this, arguments);
    this._setupContent();
    this._setupArrangedContent();
  },

  willDestroy: function willDestroy() {
    this._teardownArrangedContent();
    this._teardownContent();
  }
});

exports['default'] = ArrayProxy;
module.exports = exports['default'];