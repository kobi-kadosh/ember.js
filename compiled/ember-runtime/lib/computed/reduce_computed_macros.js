/**
@module ember
@submodule ember-runtime
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.sum = sum;
exports.max = max;
exports.min = min;
exports.map = map;
exports.mapBy = mapBy;
exports.filter = filter;
exports.filterBy = filterBy;
exports.uniq = uniq;
exports.intersect = intersect;
exports.setDiff = setDiff;
exports.sort = sort;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalObserver = require('ember-metal/observer');

var _emberRuntimeCompare = require('ember-runtime/compare');

var _emberRuntimeCompare2 = _interopRequireDefault(_emberRuntimeCompare);

var _emberRuntimeUtils = require('ember-runtime/utils');

function reduceMacro(dependentKey, callback, initialValue) {
  return (0, _emberMetalComputed.computed)(dependentKey + '.[]', function () {
    return (0, _emberMetalProperty_get.get)(this, dependentKey).reduce(callback, initialValue);
  }).readOnly();
}

function arrayMacro(dependentKey, callback) {
  // This is a bit ugly
  var propertyName;
  if (/@each/.test(dependentKey)) {
    propertyName = dependentKey.replace(/\.@each.*$/, '');
  } else {
    propertyName = dependentKey;
    dependentKey += '.[]';
  }

  return (0, _emberMetalComputed.computed)(dependentKey, function () {
    var value = (0, _emberMetalProperty_get.get)(this, propertyName);
    if ((0, _emberRuntimeUtils.isArray)(value)) {
      return _emberMetalCore2['default'].A(callback(value));
    } else {
      return _emberMetalCore2['default'].A();
    }
  }).readOnly();
}

function multiArrayMacro(dependentKeys, callback) {
  var args = dependentKeys.map(function (key) {
    return key + '.[]';
  });

  args.push(function () {
    return _emberMetalCore2['default'].A(callback.call(this, dependentKeys));
  });

  return _emberMetalComputed.computed.apply(this, args).readOnly();
}

/**
  A computed property that returns the sum of the value
  in the dependent array.

  @method sum
  @for Ember.computed
  @param {String} dependentKey
  @return {Ember.ComputedProperty} computes the sum of all values in the dependentKey's array
  @since 1.4.0
  @public
*/

function sum(dependentKey) {
  return reduceMacro(dependentKey, function (sum, item) {
    return sum + item;
  }, 0);
}

/**
  A computed property that calculates the maximum value in the
  dependent array. This will return `-Infinity` when the dependent
  array is empty.

  ```javascript
  var Person = Ember.Object.extend({
    childAges: Ember.computed.mapBy('children', 'age'),
    maxChildAge: Ember.computed.max('childAges')
  });

  var lordByron = Person.create({ children: [] });

  lordByron.get('maxChildAge'); // -Infinity
  lordByron.get('children').pushObject({
    name: 'Augusta Ada Byron', age: 7
  });
  lordByron.get('maxChildAge'); // 7
  lordByron.get('children').pushObjects([{
    name: 'Allegra Byron',
    age: 5
  }, {
    name: 'Elizabeth Medora Leigh',
    age: 8
  }]);
  lordByron.get('maxChildAge'); // 8
  ```

  @method max
  @for Ember.computed
  @param {String} dependentKey
  @return {Ember.ComputedProperty} computes the largest value in the dependentKey's array
  @public
*/

function max(dependentKey) {
  return reduceMacro(dependentKey, function (max, item) {
    return Math.max(max, item);
  }, -Infinity);
}

/**
  A computed property that calculates the minimum value in the
  dependent array. This will return `Infinity` when the dependent
  array is empty.

  ```javascript
  var Person = Ember.Object.extend({
    childAges: Ember.computed.mapBy('children', 'age'),
    minChildAge: Ember.computed.min('childAges')
  });

  var lordByron = Person.create({ children: [] });

  lordByron.get('minChildAge'); // Infinity
  lordByron.get('children').pushObject({
    name: 'Augusta Ada Byron', age: 7
  });
  lordByron.get('minChildAge'); // 7
  lordByron.get('children').pushObjects([{
    name: 'Allegra Byron',
    age: 5
  }, {
    name: 'Elizabeth Medora Leigh',
    age: 8
  }]);
  lordByron.get('minChildAge'); // 5
  ```

  @method min
  @for Ember.computed
  @param {String} dependentKey
  @return {Ember.ComputedProperty} computes the smallest value in the dependentKey's array
  @public
*/

function min(dependentKey) {
  return reduceMacro(dependentKey, function (min, item) {
    return Math.min(min, item);
  }, Infinity);
}

/**
  Returns an array mapped via the callback

  The callback method you provide should have the following signature.
  `item` is the current item in the iteration.
  `index` is the integer index of the current item in the iteration.

  ```javascript
  function(item, index);
  ```

  Example

  ```javascript
  var Hamster = Ember.Object.extend({
    excitingChores: Ember.computed.map('chores', function(chore, index) {
      return chore.toUpperCase() + '!';
    })
  });

  var hamster = Hamster.create({
    chores: ['clean', 'write more unit tests']
  });

  hamster.get('excitingChores'); // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
  ```

  @method map
  @for Ember.computed
  @param {String} dependentKey
  @param {Function} callback
  @return {Ember.ComputedProperty} an array mapped via the callback
  @public
*/

function map(dependentKey, callback) {
  return arrayMacro(dependentKey, function (value) {
    return value.map(callback);
  });
}

/**
  Returns an array mapped to the specified key.

  ```javascript
  var Person = Ember.Object.extend({
    childAges: Ember.computed.mapBy('children', 'age')
  });

  var lordByron = Person.create({ children: [] });

  lordByron.get('childAges'); // []
  lordByron.get('children').pushObject({ name: 'Augusta Ada Byron', age: 7 });
  lordByron.get('childAges'); // [7]
  lordByron.get('children').pushObjects([{
    name: 'Allegra Byron',
    age: 5
  }, {
    name: 'Elizabeth Medora Leigh',
    age: 8
  }]);
  lordByron.get('childAges'); // [7, 5, 8]
  ```

  @method mapBy
  @for Ember.computed
  @param {String} dependentKey
  @param {String} propertyKey
  @return {Ember.ComputedProperty} an array mapped to the specified key
  @public
*/

function mapBy(dependentKey, propertyKey) {
  _emberMetalCore2['default'].assert('Ember.computed.mapBy expects a property string for its second argument, ' + 'perhaps you meant to use "map"', typeof propertyKey === 'string');

  return map(dependentKey + '.@each.' + propertyKey, function (item) {
    return (0, _emberMetalProperty_get.get)(item, propertyKey);
  });
}

/**
  Filters the array by the callback.

  The callback method you provide should have the following signature.
  `item` is the current item in the iteration.
  `index` is the integer index of the current item in the iteration.
  `array` is the dependant array itself.

  ```javascript
  function(item, index, array);
  ```

  ```javascript
  var Hamster = Ember.Object.extend({
    remainingChores: Ember.computed.filter('chores', function(chore, index, array) {
      return !chore.done;
    })
  });

  var hamster = Hamster.create({
    chores: [
      { name: 'cook', done: true },
      { name: 'clean', done: true },
      { name: 'write more unit tests', done: false }
    ]
  });

  hamster.get('remainingChores'); // [{name: 'write more unit tests', done: false}]
  ```

  @method filter
  @for Ember.computed
  @param {String} dependentKey
  @param {Function} callback
  @return {Ember.ComputedProperty} the filtered array
  @public
*/

function filter(dependentKey, callback) {
  return arrayMacro(dependentKey, function (value) {
    return value.filter(callback);
  });
}

/**
  Filters the array by the property and value

  ```javascript
  var Hamster = Ember.Object.extend({
    remainingChores: Ember.computed.filterBy('chores', 'done', false)
  });

  var hamster = Hamster.create({
    chores: [
      { name: 'cook', done: true },
      { name: 'clean', done: true },
      { name: 'write more unit tests', done: false }
    ]
  });

  hamster.get('remainingChores'); // [{ name: 'write more unit tests', done: false }]
  ```

  @method filterBy
  @for Ember.computed
  @param {String} dependentKey
  @param {String} propertyKey
  @param {*} value
  @return {Ember.ComputedProperty} the filtered array
  @public
*/

function filterBy(dependentKey, propertyKey, value) {
  var callback;

  if (arguments.length === 2) {
    callback = function (item) {
      return (0, _emberMetalProperty_get.get)(item, propertyKey);
    };
  } else {
    callback = function (item) {
      return (0, _emberMetalProperty_get.get)(item, propertyKey) === value;
    };
  }

  return filter(dependentKey + '.@each.' + propertyKey, callback);
}

/**
  A computed property which returns a new array with all the unique
  elements from one or more dependent arrays.

  Example

  ```javascript
  var Hamster = Ember.Object.extend({
    uniqueFruits: Ember.computed.uniq('fruits')
  });

  var hamster = Hamster.create({
    fruits: [
      'banana',
      'grape',
      'kale',
      'banana'
    ]
  });

  hamster.get('uniqueFruits'); // ['banana', 'grape', 'kale']
  ```

  @method uniq
  @for Ember.computed
  @param {String} propertyKey*
  @return {Ember.ComputedProperty} computes a new array with all the
  unique elements from the dependent array
  @public
*/

function uniq() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return multiArrayMacro(args, function (dependentKeys) {
    var _this = this;

    var uniq = _emberMetalCore2['default'].A();

    dependentKeys.forEach(function (dependentKey) {
      var value = (0, _emberMetalProperty_get.get)(_this, dependentKey);
      if ((0, _emberRuntimeUtils.isArray)(value)) {
        value.forEach(function (item) {
          if (uniq.indexOf(item) === -1) {
            uniq.push(item);
          }
        });
      }
    });

    return uniq;
  });
}

/**
  Alias for [Ember.computed.uniq](/api/#method_computed_uniq).

  @method union
  @for Ember.computed
  @param {String} propertyKey*
  @return {Ember.ComputedProperty} computes a new array with all the
  unique elements from the dependent array
  @public
*/
var union = uniq;

exports.union = union;
/**
  A computed property which returns a new array with all the duplicated
  elements from two or more dependent arrays.

  Example

  ```javascript
  var obj = Ember.Object.extend({
    friendsInCommon: Ember.computed.intersect('adaFriends', 'charlesFriends')
  }).create({
    adaFriends: ['Charles Babbage', 'John Hobhouse', 'William King', 'Mary Somerville'],
    charlesFriends: ['William King', 'Mary Somerville', 'Ada Lovelace', 'George Peacock']
  });

  obj.get('friendsInCommon'); // ['William King', 'Mary Somerville']
  ```

  @method intersect
  @for Ember.computed
  @param {String} propertyKey*
  @return {Ember.ComputedProperty} computes a new array with all the
  duplicated elements from the dependent arrays
  @public
*/

function intersect() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return multiArrayMacro(args, function (dependentKeys) {
    var _this2 = this;

    var arrays = dependentKeys.map(function (dependentKey) {
      var array = (0, _emberMetalProperty_get.get)(_this2, dependentKey);

      return (0, _emberRuntimeUtils.isArray)(array) ? array : [];
    });

    var results = arrays.pop().filter(function (candidate) {
      for (var i = 0; i < arrays.length; i++) {
        var found = false;
        var array = arrays[i];
        for (var j = 0; j < array.length; j++) {
          if (array[j] === candidate) {
            found = true;
            break;
          }
        }

        if (found === false) {
          return false;
        }
      }

      return true;
    });

    return _emberMetalCore2['default'].A(results);
  });
}

/**
  A computed property which returns a new array with all the
  properties from the first dependent array that are not in the second
  dependent array.

  Example

  ```javascript
  var Hamster = Ember.Object.extend({
    likes: ['banana', 'grape', 'kale'],
    wants: Ember.computed.setDiff('likes', 'fruits')
  });

  var hamster = Hamster.create({
    fruits: [
      'grape',
      'kale',
    ]
  });

  hamster.get('wants'); // ['banana']
  ```

  @method setDiff
  @for Ember.computed
  @param {String} setAProperty
  @param {String} setBProperty
  @return {Ember.ComputedProperty} computes a new array with all the
  items from the first dependent array that are not in the second
  dependent array
  @public
*/

function setDiff(setAProperty, setBProperty) {
  if (arguments.length !== 2) {
    throw new _emberMetalError2['default']('setDiff requires exactly two dependent arrays.');
  }

  return (0, _emberMetalComputed.computed)(setAProperty + '.[]', setBProperty + '.[]', function () {
    var setA = this.get(setAProperty);
    var setB = this.get(setBProperty);

    if (!(0, _emberRuntimeUtils.isArray)(setA)) {
      return _emberMetalCore2['default'].A();
    }
    if (!(0, _emberRuntimeUtils.isArray)(setB)) {
      return _emberMetalCore2['default'].A(setA);
    }

    return setA.filter(function (x) {
      return setB.indexOf(x) === -1;
    });
  }).readOnly();
}

/**
  A computed property which returns a new array with all the
  properties from the first dependent array sorted based on a property
  or sort function.

  The callback method you provide should have the following signature:

  ```javascript
  function(itemA, itemB);
  ```

  - `itemA` the first item to compare.
  - `itemB` the second item to compare.

  This function should return negative number (e.g. `-1`) when `itemA` should come before
  `itemB`. It should return positive number (e.g. `1`) when `itemA` should come after
  `itemB`. If the `itemA` and `itemB` are equal this function should return `0`.

  Therefore, if this function is comparing some numeric values, simple `itemA - itemB` or
  `itemA.get( 'foo' ) - itemB.get( 'foo' )` can be used instead of series of `if`.

  Example

  ```javascript
  var ToDoList = Ember.Object.extend({
    // using standard ascending sort
    todosSorting: ['name'],
    sortedTodos: Ember.computed.sort('todos', 'todosSorting'),

    // using descending sort
    todosSortingDesc: ['name:desc'],
    sortedTodosDesc: Ember.computed.sort('todos', 'todosSortingDesc'),

    // using a custom sort function
    priorityTodos: Ember.computed.sort('todos', function(a, b){
      if (a.priority > b.priority) {
        return 1;
      } else if (a.priority < b.priority) {
        return -1;
      }

      return 0;
    })
  });

  var todoList = ToDoList.create({todos: [
    { name: 'Unit Test', priority: 2 },
    { name: 'Documentation', priority: 3 },
    { name: 'Release', priority: 1 }
  ]});

  todoList.get('sortedTodos');      // [{ name:'Documentation', priority:3 }, { name:'Release', priority:1 }, { name:'Unit Test', priority:2 }]
  todoList.get('sortedTodosDesc');  // [{ name:'Unit Test', priority:2 }, { name:'Release', priority:1 }, { name:'Documentation', priority:3 }]
  todoList.get('priorityTodos');    // [{ name:'Release', priority:1 }, { name:'Unit Test', priority:2 }, { name:'Documentation', priority:3 }]
  ```

  @method sort
  @for Ember.computed
  @param {String} itemsKey
  @param {String or Function} sortDefinition a dependent key to an
  array of sort properties (add `:desc` to the arrays sort properties to sort descending) or a function to use when sorting
  @return {Ember.ComputedProperty} computes a new sorted array based
  on the sort property array or callback function
  @public
*/

function sort(itemsKey, sortDefinition) {
  _emberMetalCore2['default'].assert('Ember.computed.sort requires two arguments: an array key to sort and ' + 'either a sort properties key or sort function', arguments.length === 2);

  if (typeof sortDefinition === 'function') {
    return customSort(itemsKey, sortDefinition);
  } else {
    return propertySort(itemsKey, sortDefinition);
  }
}

function customSort(itemsKey, comparator) {
  return arrayMacro(itemsKey, function (value) {
    return value.slice().sort(comparator);
  });
}

// This one needs to dynamically set up and tear down observers on the itemsKey
// depending on the sortProperties
function propertySort(itemsKey, sortPropertiesKey) {
  var cp = new _emberMetalComputed.ComputedProperty(function (key) {
    var _this3 = this;

    function didChange() {
      this.notifyPropertyChange(key);
    }

    var items = itemsKey === '@this' ? this : (0, _emberMetalProperty_get.get)(this, itemsKey);
    var sortProperties = (0, _emberMetalProperty_get.get)(this, sortPropertiesKey);

    // TODO: Ideally we'd only do this if things have changed
    if (cp._sortPropObservers) {
      cp._sortPropObservers.forEach(function (args) {
        return _emberMetalObserver.removeObserver.apply(null, args);
      });
    }

    cp._sortPropObservers = [];

    if (!(0, _emberRuntimeUtils.isArray)(sortProperties)) {
      return items;
    }

    // Normalize properties
    var normalizedSort = sortProperties.map(function (p) {
      var _p$split = p.split(':');

      var _p$split2 = _slicedToArray(_p$split, 2);

      var prop = _p$split2[0];
      var direction = _p$split2[1];

      direction = direction || 'asc';

      return [prop, direction];
    });

    // TODO: Ideally we'd only do this if things have changed
    // Add observers
    normalizedSort.forEach(function (prop) {
      var args = [_this3, itemsKey + '.@each.' + prop[0], didChange];
      cp._sortPropObservers.push(args);
      _emberMetalObserver.addObserver.apply(null, args);
    });

    return _emberMetalCore2['default'].A(items.slice().sort(function (itemA, itemB) {

      for (var i = 0; i < normalizedSort.length; ++i) {
        var _normalizedSort$i = _slicedToArray(normalizedSort[i], 2);

        var prop = _normalizedSort$i[0];
        var direction = _normalizedSort$i[1];

        var result = (0, _emberRuntimeCompare2['default'])((0, _emberMetalProperty_get.get)(itemA, prop), (0, _emberMetalProperty_get.get)(itemB, prop));
        if (result !== 0) {
          return direction === 'desc' ? -1 * result : result;
        }
      }

      return 0;
    }));
  });

  return cp.property(itemsKey + '.[]', sortPropertiesKey + '.[]').readOnly();
}