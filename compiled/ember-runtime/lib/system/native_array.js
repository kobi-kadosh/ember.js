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

// Ember.EXTEND_PROTOTYPES

var _emberMetalReplace = require('ember-metal/replace');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeMixinsArray = require('ember-runtime/mixins/array');

var _emberRuntimeMixinsArray2 = _interopRequireDefault(_emberRuntimeMixinsArray);

var _emberRuntimeMixinsMutable_array = require('ember-runtime/mixins/mutable_array');

var _emberRuntimeMixinsMutable_array2 = _interopRequireDefault(_emberRuntimeMixinsMutable_array);

var _emberRuntimeMixinsObservable = require('ember-runtime/mixins/observable');

var _emberRuntimeMixinsObservable2 = _interopRequireDefault(_emberRuntimeMixinsObservable);

var _emberRuntimeMixinsCopyable = require('ember-runtime/mixins/copyable');

var _emberRuntimeMixinsCopyable2 = _interopRequireDefault(_emberRuntimeMixinsCopyable);

var _emberRuntimeMixinsFreezable = require('ember-runtime/mixins/freezable');

var _emberRuntimeCopy = require('ember-runtime/copy');

var _emberRuntimeCopy2 = _interopRequireDefault(_emberRuntimeCopy);

// Add Ember.Array to Array.prototype. Remove methods with native
// implementations and supply some more optimized versions of generic methods
// because they are so common.

/**
  The NativeArray mixin contains the properties needed to make the native
  Array support Ember.MutableArray and all of its dependent APIs. Unless you
  have `Ember.EXTEND_PROTOTYPES` or `Ember.EXTEND_PROTOTYPES.Array` set to
  false, this will be applied automatically. Otherwise you can apply the mixin
  at anytime by calling `Ember.NativeArray.activate`.

  @class NativeArray
  @namespace Ember
  @uses Ember.MutableArray
  @uses Ember.Observable
  @uses Ember.Copyable
  @public
*/
var NativeArray = _emberMetalMixin.Mixin.create(_emberRuntimeMixinsMutable_array2['default'], _emberRuntimeMixinsObservable2['default'], _emberRuntimeMixinsCopyable2['default'], {

  // because length is a built-in property we need to know to just get the
  // original property.
  get: function get(key) {
    if (key === 'length') {
      return this.length;
    } else if ('number' === typeof key) {
      return this[key];
    } else {
      return this._super(key);
    }
  },

  objectAt: function objectAt(idx) {
    return this[idx];
  },

  // primitive for array support.
  replace: function replace(idx, amt, objects) {

    if (this.isFrozen) {
      throw _emberRuntimeMixinsFreezable.FROZEN_ERROR;
    }

    // if we replaced exactly the same number of items, then pass only the
    // replaced range. Otherwise, pass the full remaining array length
    // since everything has shifted
    var len = objects ? (0, _emberMetalProperty_get.get)(objects, 'length') : 0;
    this.arrayContentWillChange(idx, amt, len);

    if (len === 0) {
      this.splice(idx, amt);
    } else {
      (0, _emberMetalReplace._replace)(this, idx, amt, objects);
    }

    this.arrayContentDidChange(idx, amt, len);
    return this;
  },

  // If you ask for an unknown property, then try to collect the value
  // from member items.
  unknownProperty: function unknownProperty(key, value) {
    var ret; // = this.reducedProperty(key, value);
    if (value !== undefined && ret === undefined) {
      ret = this[key] = value;
    }
    return ret;
  },

  indexOf: Array.prototype.indexOf,
  lastIndexOf: Array.prototype.lastIndexOf,

  copy: function copy(deep) {
    if (deep) {
      return this.map(function (item) {
        return (0, _emberRuntimeCopy2['default'])(item, true);
      });
    }

    return this.slice();
  }
});

// Remove any methods implemented natively so we don't override them
var ignore = ['length'];
NativeArray.keys().forEach(function (methodName) {
  if (Array.prototype[methodName]) {
    ignore.push(methodName);
  }
});

exports.NativeArray // TODO: only use default export
 = NativeArray = NativeArray.without.apply(NativeArray, ignore);

/**
  Creates an `Ember.NativeArray` from an Array like object.
  Does not modify the original object. Ember.A is not needed if
  `Ember.EXTEND_PROTOTYPES` is `true` (the default value). However,
  it is recommended that you use Ember.A when creating addons for
  ember or when you can not guarantee that `Ember.EXTEND_PROTOTYPES`
  will be `true`.

  Example

  ```js
  var Pagination = Ember.CollectionView.extend({
    tagName: 'ul',
    classNames: ['pagination'],

    init: function() {
      this._super.apply(this, arguments);
      if (!this.get('content')) {
        this.set('content', Ember.A());
      }
    }
  });
  ```

  @method A
  @for Ember
  @return {Ember.NativeArray}
  @public
*/
var A = function A(arr) {
  if (arr === undefined) {
    arr = [];
  }
  return _emberRuntimeMixinsArray2['default'].detect(arr) ? arr : NativeArray.apply(arr);
};

/**
  Activates the mixin on the Array.prototype if not already applied. Calling
  this method more than once is safe. This will be called when ember is loaded
  unless you have `Ember.EXTEND_PROTOTYPES` or `Ember.EXTEND_PROTOTYPES.Array`
  set to `false`.

  Example

  ```js
  if (Ember.EXTEND_PROTOTYPES === true || Ember.EXTEND_PROTOTYPES.Array) {
    Ember.NativeArray.activate();
  }
  ```

  @method activate
  @for Ember.NativeArray
  @static
  @return {void}
  @private
*/
NativeArray.activate = function () {
  NativeArray.apply(Array.prototype);

  exports.A = A = function (arr) {
    return arr || [];
  };
};

if (_emberMetalCore2['default'].EXTEND_PROTOTYPES === true || _emberMetalCore2['default'].EXTEND_PROTOTYPES.Array) {
  NativeArray.activate();
}

_emberMetalCore2['default'].A = A; // ES6TODO: Setting A onto the object returned by ember-metal/core to avoid circles
exports.A = A;
exports.NativeArray = NativeArray;
exports['default'] = NativeArray;