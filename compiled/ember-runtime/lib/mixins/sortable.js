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

// Ember.assert, Ember.A

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeMixinsMutable_enumerable = require('ember-runtime/mixins/mutable_enumerable');

var _emberRuntimeMixinsMutable_enumerable2 = _interopRequireDefault(_emberRuntimeMixinsMutable_enumerable);

var _emberRuntimeCompare = require('ember-runtime/compare');

var _emberRuntimeCompare2 = _interopRequireDefault(_emberRuntimeCompare);

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalComputed_macros = require('ember-metal/computed_macros');

var _emberMetalMixin = require('ember-metal/mixin');

//ES6TODO: should we access these directly from their package or from how their exposed in ember-metal?

/**
  `Ember.SortableMixin` provides a standard interface for array proxies
  to specify a sort order and maintain this sorting when objects are added,
  removed, or updated without changing the implicit order of their underlying
  model array:

  ```javascript
  songs = [
    {trackNumber: 4, title: 'Ob-La-Di, Ob-La-Da'},
    {trackNumber: 2, title: 'Back in the U.S.S.R.'},
    {trackNumber: 3, title: 'Glass Onion'},
  ];

  songsController = Ember.ArrayController.create({
    model: songs,
    sortProperties: ['trackNumber'],
    sortAscending: true
  });

  songsController.get('firstObject');  // {trackNumber: 2, title: 'Back in the U.S.S.R.'}

  songsController.addObject({trackNumber: 1, title: 'Dear Prudence'});
  songsController.get('firstObject');  // {trackNumber: 1, title: 'Dear Prudence'}
  ```

  If you add or remove the properties to sort by or change the sort direction the model
  sort order will be automatically updated.

  ```javascript
  songsController.set('sortProperties', ['title']);
  songsController.get('firstObject'); // {trackNumber: 2, title: 'Back in the U.S.S.R.'}

  songsController.toggleProperty('sortAscending');
  songsController.get('firstObject'); // {trackNumber: 4, title: 'Ob-La-Di, Ob-La-Da'}
  ```

  `SortableMixin` works by sorting the `arrangedContent` array, which is the array that
  `ArrayProxy` displays. Due to the fact that the underlying 'content' array is not changed, that
  array will not display the sorted list:

   ```javascript
  songsController.get('content').get('firstObject'); // Returns the unsorted original content
  songsController.get('firstObject'); // Returns the sorted content.
  ```

  Although the sorted content can also be accessed through the `arrangedContent` property,
  it is preferable to use the proxied class and not the `arrangedContent` array directly.

  @class SortableMixin
  @namespace Ember
  @uses Ember.MutableEnumerable
  @private
*/
exports['default'] = _emberMetalMixin.Mixin.create(_emberRuntimeMixinsMutable_enumerable2['default'], {

  /**
    Specifies which properties dictate the `arrangedContent`'s sort order.
      When specifying multiple properties the sorting will use properties
    from the `sortProperties` array prioritized from first to last.
      @property {Array} sortProperties
    @private
  */
  sortProperties: null,

  /**
    Specifies the `arrangedContent`'s sort direction.
    Sorts the content in ascending order by default. Set to `false` to
    use descending order.
      @property {Boolean} sortAscending
    @default true
    @private
  */
  sortAscending: true,

  /**
    The function used to compare two values. You can override this if you
    want to do custom comparisons. Functions must be of the type expected by
    Array#sort, i.e.,
      *  return 0 if the two parameters are equal,
    *  return a negative value if the first parameter is smaller than the second or
    *  return a positive value otherwise:
      ```javascript
    function(x, y) { // These are assumed to be integers
      if (x === y)
        return 0;
      return x < y ? -1 : 1;
    }
    ```
      @property sortFunction
    @type {Function}
    @default Ember.compare
    @private
  */
  sortFunction: _emberRuntimeCompare2['default'],

  orderBy: function orderBy(item1, item2) {
    var _this = this;

    var result = 0;
    var sortProperties = (0, _emberMetalProperty_get.get)(this, 'sortProperties');
    var sortAscending = (0, _emberMetalProperty_get.get)(this, 'sortAscending');
    var sortFunction = (0, _emberMetalProperty_get.get)(this, 'sortFunction');

    _emberMetalCore2['default'].assert('you need to define `sortProperties`', !!sortProperties);

    sortProperties.forEach(function (propertyName) {
      if (result === 0) {
        result = sortFunction.call(_this, (0, _emberMetalProperty_get.get)(item1, propertyName), (0, _emberMetalProperty_get.get)(item2, propertyName));
        if (result !== 0 && !sortAscending) {
          result = -1 * result;
        }
      }
    });

    return result;
  },

  destroy: function destroy() {
    var _this2 = this;

    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    var sortProperties = (0, _emberMetalProperty_get.get)(this, 'sortProperties');

    if (content && sortProperties) {
      content.forEach(function (item) {
        sortProperties.forEach(function (sortProperty) {
          (0, _emberMetalObserver.removeObserver)(item, sortProperty, _this2, 'contentItemSortPropertyDidChange');
        });
      });
    }

    return this._super.apply(this, arguments);
  },

  isSorted: (0, _emberMetalComputed_macros.notEmpty)('sortProperties'),

  /**
    Overrides the default `arrangedContent` from `ArrayProxy` in order to sort by `sortFunction`.
    Also sets up observers for each `sortProperty` on each item in the content Array.
      @property arrangedContent
    @private
  */
  arrangedContent: (0, _emberMetalComputed.computed)('content', 'sortProperties.@each', {
    get: function get(key) {
      var _this3 = this;

      var content = (0, _emberMetalProperty_get.get)(this, 'content');
      var isSorted = (0, _emberMetalProperty_get.get)(this, 'isSorted');
      var sortProperties = (0, _emberMetalProperty_get.get)(this, 'sortProperties');

      if (content && isSorted) {
        content = content.slice();
        content.sort(function (item1, item2) {
          return _this3.orderBy(item1, item2);
        });

        content.forEach(function (item) {
          sortProperties.forEach(function (sortProperty) {
            (0, _emberMetalObserver.addObserver)(item, sortProperty, _this3, 'contentItemSortPropertyDidChange');
          });
        });

        return _emberMetalCore2['default'].A(content);
      }

      return content;
    }
  }),

  _contentWillChange: (0, _emberMetalMixin.beforeObserver)('content', function () {
    var _this4 = this;

    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    var sortProperties = (0, _emberMetalProperty_get.get)(this, 'sortProperties');

    if (content && sortProperties) {
      content.forEach(function (item) {
        sortProperties.forEach(function (sortProperty) {
          (0, _emberMetalObserver.removeObserver)(item, sortProperty, _this4, 'contentItemSortPropertyDidChange');
        });
      });
    }

    this._super.apply(this, arguments);
  }),

  sortPropertiesWillChange: (0, _emberMetalMixin.beforeObserver)('sortProperties', function () {
    this._lastSortAscending = undefined;
  }),

  sortPropertiesDidChange: (0, _emberMetalMixin.observer)('sortProperties', function () {
    this._lastSortAscending = undefined;
  }),

  sortAscendingWillChange: (0, _emberMetalMixin.beforeObserver)('sortAscending', function () {
    this._lastSortAscending = (0, _emberMetalProperty_get.get)(this, 'sortAscending');
  }),

  sortAscendingDidChange: (0, _emberMetalMixin.observer)('sortAscending', function () {
    if (this._lastSortAscending !== undefined && (0, _emberMetalProperty_get.get)(this, 'sortAscending') !== this._lastSortAscending) {
      var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
      arrangedContent.reverseObjects();
    }
  }),

  contentArrayWillChange: function contentArrayWillChange(array, idx, removedCount, addedCount) {
    var _this5 = this;

    var isSorted = (0, _emberMetalProperty_get.get)(this, 'isSorted');

    if (isSorted) {
      var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
      var removedObjects = array.slice(idx, idx + removedCount);
      var sortProperties = (0, _emberMetalProperty_get.get)(this, 'sortProperties');

      removedObjects.forEach(function (item) {
        arrangedContent.removeObject(item);

        sortProperties.forEach(function (sortProperty) {
          (0, _emberMetalObserver.removeObserver)(item, sortProperty, _this5, 'contentItemSortPropertyDidChange');
        }, _this5);
      }, this);
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  contentArrayDidChange: function contentArrayDidChange(array, idx, removedCount, addedCount) {
    var _this6 = this;

    var isSorted = (0, _emberMetalProperty_get.get)(this, 'isSorted');
    var sortProperties = (0, _emberMetalProperty_get.get)(this, 'sortProperties');

    if (isSorted) {
      var addedObjects = array.slice(idx, idx + addedCount);

      addedObjects.forEach(function (item) {
        _this6.insertItemSorted(item);

        sortProperties.forEach(function (sortProperty) {
          (0, _emberMetalObserver.addObserver)(item, sortProperty, _this6, 'contentItemSortPropertyDidChange');
        });
      });
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  insertItemSorted: function insertItemSorted(item) {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
    var length = (0, _emberMetalProperty_get.get)(arrangedContent, 'length');

    var idx = this._binarySearch(item, 0, length);
    arrangedContent.insertAt(idx, item);
  },

  contentItemSortPropertyDidChange: function contentItemSortPropertyDidChange(item) {
    var arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');
    var oldIndex = arrangedContent.indexOf(item);
    var leftItem = arrangedContent.objectAt(oldIndex - 1);
    var rightItem = arrangedContent.objectAt(oldIndex + 1);
    var leftResult = leftItem && this.orderBy(item, leftItem);
    var rightResult = rightItem && this.orderBy(item, rightItem);

    if (leftResult < 0 || rightResult > 0) {
      arrangedContent.removeObject(item);
      this.insertItemSorted(item);
    }
  },

  _binarySearch: function _binarySearch(item, low, high) {
    var mid, midItem, res, arrangedContent;

    if (low === high) {
      return low;
    }

    arrangedContent = (0, _emberMetalProperty_get.get)(this, 'arrangedContent');

    mid = low + Math.floor((high - low) / 2);
    midItem = arrangedContent.objectAt(mid);

    res = this.orderBy(midItem, item);

    if (res < 0) {
      return this._binarySearch(item, mid + 1, high);
    } else if (res > 0) {
      return this._binarySearch(item, low, mid);
    }

    return mid;
  }
});
module.exports = exports['default'];