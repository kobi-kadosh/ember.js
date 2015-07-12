/**
@module ember
@submodule ember-runtime
*/

// require('ember-runtime/mixins/array');
// require('ember-runtime/mixins/mutable_enumerable');

// ..........................................................
// CONSTANTS
//

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// ..........................................................
// HELPERS
//

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeMixinsArray = require('ember-runtime/mixins/array');

var _emberRuntimeMixinsArray2 = _interopRequireDefault(_emberRuntimeMixinsArray);

var _emberRuntimeMixinsMutable_enumerable = require('ember-runtime/mixins/mutable_enumerable');

var _emberRuntimeMixinsMutable_enumerable2 = _interopRequireDefault(_emberRuntimeMixinsMutable_enumerable);

var _emberRuntimeMixinsEnumerable = require('ember-runtime/mixins/enumerable');

var _emberRuntimeMixinsEnumerable2 = _interopRequireDefault(_emberRuntimeMixinsEnumerable);

var OUT_OF_RANGE_EXCEPTION = 'Index out of range';
var EMPTY = [];

/**
  This mixin defines the API for modifying array-like objects. These methods
  can be applied only to a collection that keeps its items in an ordered set.
  It builds upon the Array mixin and adds methods to modify the array.
  Concrete implementations of this class include ArrayProxy and ArrayController.

  It is important to use the methods in this class to modify arrays so that
  changes are observable. This allows the binding system in Ember to function
  correctly.


  Note that an Array can change even if it does not implement this mixin.
  For example, one might implement a SparseArray that cannot be directly
  modified, but if its underlying enumerable changes, it will change also.

  @class MutableArray
  @namespace Ember
  @uses Ember.Array
  @uses Ember.MutableEnumerable
  @public
*/
exports['default'] = _emberMetalMixin.Mixin.create(_emberRuntimeMixinsArray2['default'], _emberRuntimeMixinsMutable_enumerable2['default'], {

  /**
    __Required.__ You must implement this method to apply this mixin.
      This is one of the primitives you must implement to support `Ember.Array`.
    You should replace amt objects started at idx with the objects in the
    passed array. You should also call `this.enumerableContentDidChange()`
      @method replace
    @param {Number} idx Starting index in the array to replace. If
      idx >= length, then append to the end of the array.
    @param {Number} amt Number of elements that should be removed from
      the array, starting at *idx*.
    @param {Array} objects An array of zero or more objects that should be
      inserted into the array at *idx*
    @public
  */
  replace: null,

  /**
    Remove all elements from the array. This is useful if you
    want to reuse an existing array without having to recreate it.
      ```javascript
    var colors = ['red', 'green', 'blue'];
      color.length();   //  3
    colors.clear();   //  []
    colors.length();  //  0
    ```
      @method clear
    @return {Ember.Array} An empty Array.
    @public
  */
  clear: function clear() {
    var len = (0, _emberMetalProperty_get.get)(this, 'length');
    if (len === 0) {
      return this;
    }

    this.replace(0, len, EMPTY);
    return this;
  },

  /**
    This will use the primitive `replace()` method to insert an object at the
    specified index.
      ```javascript
    var colors = ['red', 'green', 'blue'];
      colors.insertAt(2, 'yellow');  // ['red', 'green', 'yellow', 'blue']
    colors.insertAt(5, 'orange');  // Error: Index out of range
    ```
      @method insertAt
    @param {Number} idx index of insert the object at.
    @param {Object} object object to insert
    @return {Ember.Array} receiver
    @public
  */
  insertAt: function insertAt(idx, object) {
    if (idx > (0, _emberMetalProperty_get.get)(this, 'length')) {
      throw new _emberMetalError2['default'](OUT_OF_RANGE_EXCEPTION);
    }

    this.replace(idx, 0, [object]);
    return this;
  },

  /**
    Remove an object at the specified index using the `replace()` primitive
    method. You can pass either a single index, or a start and a length.
      If you pass a start and length that is beyond the
    length this method will throw an `OUT_OF_RANGE_EXCEPTION`.
      ```javascript
    var colors = ['red', 'green', 'blue', 'yellow', 'orange'];
      colors.removeAt(0);     // ['green', 'blue', 'yellow', 'orange']
    colors.removeAt(2, 2);  // ['green', 'blue']
    colors.removeAt(4, 2);  // Error: Index out of range
    ```
      @method removeAt
    @param {Number} start index, start of range
    @param {Number} len length of passing range
    @return {Ember.Array} receiver
    @public
  */
  removeAt: function removeAt(start, len) {
    if ('number' === typeof start) {

      if (start < 0 || start >= (0, _emberMetalProperty_get.get)(this, 'length')) {
        throw new _emberMetalError2['default'](OUT_OF_RANGE_EXCEPTION);
      }

      // fast case
      if (len === undefined) {
        len = 1;
      }

      this.replace(start, len, EMPTY);
    }

    return this;
  },

  /**
    Push the object onto the end of the array. Works just like `push()` but it
    is KVO-compliant.
      ```javascript
    var colors = ['red', 'green'];
      colors.pushObject('black');     // ['red', 'green', 'black']
    colors.pushObject(['yellow']);  // ['red', 'green', ['yellow']]
    ```
      @method pushObject
    @param {*} obj object to push
    @return object same object passed as a param
    @public
  */
  pushObject: function pushObject(obj) {
    this.insertAt((0, _emberMetalProperty_get.get)(this, 'length'), obj);
    return obj;
  },

  /**
    Add the objects in the passed numerable to the end of the array. Defers
    notifying observers of the change until all objects are added.
      ```javascript
    var colors = ['red'];
      colors.pushObjects(['yellow', 'orange']);  // ['red', 'yellow', 'orange']
    ```
      @method pushObjects
    @param {Ember.Enumerable} objects the objects to add
    @return {Ember.Array} receiver
    @public
  */
  pushObjects: function pushObjects(objects) {
    if (!(_emberRuntimeMixinsEnumerable2['default'].detect(objects) || Array.isArray(objects))) {
      throw new TypeError('Must pass Ember.Enumerable to Ember.MutableArray#pushObjects');
    }
    this.replace((0, _emberMetalProperty_get.get)(this, 'length'), 0, objects);
    return this;
  },

  /**
    Pop object from array or nil if none are left. Works just like `pop()` but
    it is KVO-compliant.
      ```javascript
    var colors = ['red', 'green', 'blue'];
      colors.popObject();   // 'blue'
    console.log(colors);  // ['red', 'green']
    ```
      @method popObject
    @return object
    @public
  */
  popObject: function popObject() {
    var len = (0, _emberMetalProperty_get.get)(this, 'length');
    if (len === 0) {
      return null;
    }

    var ret = this.objectAt(len - 1);
    this.removeAt(len - 1, 1);
    return ret;
  },

  /**
    Shift an object from start of array or nil if none are left. Works just
    like `shift()` but it is KVO-compliant.
      ```javascript
    var colors = ['red', 'green', 'blue'];
      colors.shiftObject();  // 'red'
    console.log(colors);   // ['green', 'blue']
    ```
      @method shiftObject
    @return object
    @public
  */
  shiftObject: function shiftObject() {
    if ((0, _emberMetalProperty_get.get)(this, 'length') === 0) {
      return null;
    }

    var ret = this.objectAt(0);
    this.removeAt(0);
    return ret;
  },

  /**
    Unshift an object to start of array. Works just like `unshift()` but it is
    KVO-compliant.
      ```javascript
    var colors = ['red'];
      colors.unshiftObject('yellow');    // ['yellow', 'red']
    colors.unshiftObject(['black']);   // [['black'], 'yellow', 'red']
    ```
      @method unshiftObject
    @param {*} obj object to unshift
    @return object same object passed as a param
    @public
  */
  unshiftObject: function unshiftObject(obj) {
    this.insertAt(0, obj);
    return obj;
  },

  /**
    Adds the named objects to the beginning of the array. Defers notifying
    observers until all objects have been added.
      ```javascript
    var colors = ['red'];
      colors.unshiftObjects(['black', 'white']);   // ['black', 'white', 'red']
    colors.unshiftObjects('yellow'); // Type Error: 'undefined' is not a function
    ```
      @method unshiftObjects
    @param {Ember.Enumerable} objects the objects to add
    @return {Ember.Array} receiver
    @public
  */
  unshiftObjects: function unshiftObjects(objects) {
    this.replace(0, 0, objects);
    return this;
  },

  /**
    Reverse objects in the array. Works just like `reverse()` but it is
    KVO-compliant.
      @method reverseObjects
    @return {Ember.Array} receiver
     @public
  */
  reverseObjects: function reverseObjects() {
    var len = (0, _emberMetalProperty_get.get)(this, 'length');
    if (len === 0) {
      return this;
    }

    var objects = this.toArray().reverse();
    this.replace(0, len, objects);
    return this;
  },

  /**
    Replace all the receiver's content with content of the argument.
    If argument is an empty array receiver will be cleared.
      ```javascript
    var colors = ['red', 'green', 'blue'];
      colors.setObjects(['black', 'white']);  // ['black', 'white']
    colors.setObjects([]);                  // []
    ```
      @method setObjects
    @param {Ember.Array} objects array whose content will be used for replacing
        the content of the receiver
    @return {Ember.Array} receiver with the new content
    @public
  */
  setObjects: function setObjects(objects) {
    if (objects.length === 0) {
      return this.clear();
    }

    var len = (0, _emberMetalProperty_get.get)(this, 'length');
    this.replace(0, len, objects);
    return this;
  },

  // ..........................................................
  // IMPLEMENT Ember.MutableEnumerable
  //

  /**
    Remove all occurrences of an object in the array.
      ```javascript
    var cities = ['Chicago', 'Berlin', 'Lima', 'Chicago'];
      cities.removeObject('Chicago');  // ['Berlin', 'Lima']
    cities.removeObject('Lima');     // ['Berlin']
    cities.removeObject('Tokyo')     // ['Berlin']
    ```
      @method removeObject
    @param {*} obj object to remove
    @return {Ember.Array} receiver
    @public
  */
  removeObject: function removeObject(obj) {
    var loc = (0, _emberMetalProperty_get.get)(this, 'length') || 0;
    while (--loc >= 0) {
      var curObject = this.objectAt(loc);

      if (curObject === obj) {
        this.removeAt(loc);
      }
    }
    return this;
  },

  /**
    Push the object onto the end of the array if it is not already
    present in the array.
      ```javascript
    var cities = ['Chicago', 'Berlin'];
      cities.addObject('Lima');    // ['Chicago', 'Berlin', 'Lima']
    cities.addObject('Berlin');  // ['Chicago', 'Berlin', 'Lima']
    ```
      @method addObject
    @param {*} obj object to add, if not already present
    @return {Ember.Array} receiver
    @public
  */
  addObject: function addObject(obj) {
    if (!this.contains(obj)) {
      this.pushObject(obj);
    }

    return this;
  }
});
module.exports = exports['default'];