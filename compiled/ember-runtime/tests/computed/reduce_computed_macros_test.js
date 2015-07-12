'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalSet_properties = require('ember-metal/set_properties');

var _emberMetalSet_properties2 = _interopRequireDefault(_emberMetalSet_properties);

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeComputedReduce_computed_macros = require('ember-runtime/computed/reduce_computed_macros');

var obj;
QUnit.module('map', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      mapped: (0, _emberRuntimeComputedReduce_computed_macros.map)('array.@each.v', function (item) {
        return item.v;
      }),
      mappedObjects: (0, _emberRuntimeComputedReduce_computed_macros.map)('arrayObjects.@each.v', function (item) {
        return { name: item.v.name };
      })
    }).create({
      arrayObjects: _emberMetalCore2['default'].A([{ v: { name: 'Robert' } }, { v: { name: 'Leanna' } }]),

      array: _emberMetalCore2['default'].A([{ v: 1 }, { v: 3 }, { v: 2 }, { v: 1 }])
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('map is readOnly', function () {
  QUnit.throws(function () {
    obj.set('mapped', 1);
  }, /Cannot set read-only property "mapped" on object:/);
});

QUnit.test('it maps simple properties', function () {
  deepEqual(obj.get('mapped'), [1, 3, 2, 1]);

  obj.get('array').pushObject({ v: 5 });

  deepEqual(obj.get('mapped'), [1, 3, 2, 1, 5]);

  obj.get('array').removeAt(3);

  deepEqual(obj.get('mapped'), [1, 3, 2, 5]);
});

QUnit.test('it maps simple unshifted properties', function () {
  var array = _emberMetalCore2['default'].A();

  obj = _emberRuntimeSystemObject2['default'].extend({
    mapped: (0, _emberRuntimeComputedReduce_computed_macros.map)('array', function (item) {
      return item.toUpperCase();
    })
  }).create({
    array: array
  });

  array.unshiftObject('c');
  array.unshiftObject('b');
  array.unshiftObject('a');

  array.popObject();

  deepEqual(obj.get('mapped'), ['A', 'B'], 'properties unshifted in sequence are mapped correctly');
});

QUnit.test('it passes the index to the callback', function () {
  var array = ['a', 'b', 'c'];

  obj = _emberRuntimeSystemObject2['default'].extend({
    mapped: (0, _emberRuntimeComputedReduce_computed_macros.map)('array', function (item, index) {
      return index;
    })
  }).create({
    array: array
  });

  deepEqual(obj.get('mapped'), [0, 1, 2], 'index is passed to callback correctly');
});

QUnit.test('it maps objects', function () {
  deepEqual(obj.get('mappedObjects'), [{ name: 'Robert' }, { name: 'Leanna' }]);

  obj.get('arrayObjects').pushObject({
    v: { name: 'Eddard' }
  });

  deepEqual(obj.get('mappedObjects'), [{ name: 'Robert' }, { name: 'Leanna' }, { name: 'Eddard' }]);

  obj.get('arrayObjects').removeAt(1);

  deepEqual(obj.get('mappedObjects'), [{ name: 'Robert' }, { name: 'Eddard' }]);

  (0, _emberMetalProperty_set.set)(obj.get('arrayObjects')[0], 'v', { name: 'Stannis' });

  deepEqual(obj.get('mappedObjects'), [{ name: 'Stannis' }, { name: 'Eddard' }]);
});

QUnit.test('it maps unshifted objects with property observers', function () {
  var array = _emberMetalCore2['default'].A();
  var cObj = { v: 'c' };

  obj = _emberRuntimeSystemObject2['default'].extend({
    mapped: (0, _emberRuntimeComputedReduce_computed_macros.map)('array.@each.v', function (item) {
      return (0, _emberMetalProperty_get.get)(item, 'v').toUpperCase();
    })
  }).create({
    array: array
  });

  array.unshiftObject(cObj);
  array.unshiftObject({ v: 'b' });
  array.unshiftObject({ v: 'a' });

  (0, _emberMetalProperty_set.set)(cObj, 'v', 'd');

  deepEqual(array.mapBy('v'), ['a', 'b', 'd'], 'precond - unmapped array is correct');
  deepEqual(obj.get('mapped'), ['A', 'B', 'D'], 'properties unshifted in sequence are mapped correctly');
});

QUnit.module('mapBy', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      mapped: (0, _emberRuntimeComputedReduce_computed_macros.mapBy)('array', 'v')
    }).create({
      array: _emberMetalCore2['default'].A([{ v: 1 }, { v: 3 }, { v: 2 }, { v: 1 }])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('mapBy is readOnly', function () {
  QUnit.throws(function () {
    obj.set('mapped', 1);
  }, /Cannot set read-only property "mapped" on object:/);
});

QUnit.test('it maps properties', function () {
  deepEqual(obj.get('mapped'), [1, 3, 2, 1]);

  obj.get('array').pushObject({ v: 5 });

  deepEqual(obj.get('mapped'), [1, 3, 2, 1, 5]);

  obj.get('array').removeAt(3);

  deepEqual(obj.get('mapped'), [1, 3, 2, 5]);
});

QUnit.test('it is observable', function () {
  var calls = 0;

  deepEqual(obj.get('mapped'), [1, 3, 2, 1]);

  (0, _emberMetalObserver.addObserver)(obj, 'mapped.@each', function () {
    return calls++;
  });

  obj.get('array').pushObject({ v: 5 });

  equal(calls, 1, 'mapBy is observable');
});

QUnit.module('filter', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      filtered: (0, _emberRuntimeComputedReduce_computed_macros.filter)('array', function (item) {
        return item % 2 === 0;
      })
    }).create({
      array: _emberMetalCore2['default'].A([1, 2, 3, 4, 5, 6, 7, 8])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('filter is readOnly', function () {
  QUnit.throws(function () {
    obj.set('filtered', 1);
  }, /Cannot set read-only property "filtered" on object:/);
});

QUnit.test('it filters according to the specified filter function', function () {
  deepEqual(obj.get('filtered'), [2, 4, 6, 8], 'filter filters by the specified function');
});

QUnit.test('it passes the index to the callback', function () {
  obj = _emberRuntimeSystemObject2['default'].extend({
    filtered: (0, _emberRuntimeComputedReduce_computed_macros.filter)('array', function (item, index) {
      return index === 1;
    })
  }).create({
    array: ['a', 'b', 'c']
  });

  deepEqual((0, _emberMetalProperty_get.get)(obj, 'filtered'), ['b'], 'index is passed to callback correctly');
});

QUnit.test('it passes the array to the callback', function () {
  obj = _emberRuntimeSystemObject2['default'].extend({
    filtered: (0, _emberRuntimeComputedReduce_computed_macros.filter)('array', function (item, index, array) {
      return index === (0, _emberMetalProperty_get.get)(array, 'length') - 2;
    })
  }).create({
    array: _emberMetalCore2['default'].A(['a', 'b', 'c'])
  });

  deepEqual(obj.get('filtered'), ['b'], 'array is passed to callback correctly');
});

QUnit.test('it caches properly', function () {
  var array = obj.get('array');

  var filtered = obj.get('filtered');
  ok(filtered === obj.get('filtered'));

  array.addObject(11);
  var newFiltered = obj.get('filtered');

  ok(filtered !== newFiltered);

  ok(obj.get('filtered') === newFiltered);
});

QUnit.test('it updates as the array is modified', function () {
  var array = obj.get('array');

  deepEqual(obj.get('filtered'), [2, 4, 6, 8], 'precond - filtered array is initially correct');

  array.addObject(11);
  deepEqual(obj.get('filtered'), [2, 4, 6, 8], 'objects not passing the filter are not added');

  array.addObject(12);
  deepEqual(obj.get('filtered'), [2, 4, 6, 8, 12], 'objects passing the filter are added');

  array.removeObject(3);
  array.removeObject(4);

  deepEqual(obj.get('filtered'), [2, 6, 8, 12], 'objects removed from the dependent array are removed from the computed array');
});

QUnit.test('the dependent array can be cleared one at a time', function () {
  var array = (0, _emberMetalProperty_get.get)(obj, 'array');

  deepEqual(obj.get('filtered'), [2, 4, 6, 8], 'precond - filtered array is initially correct');

  // clear 1-8 but in a random order
  array.removeObject(3);
  array.removeObject(1);
  array.removeObject(2);
  array.removeObject(4);
  array.removeObject(8);
  array.removeObject(6);
  array.removeObject(5);
  array.removeObject(7);

  deepEqual(obj.get('filtered'), [], 'filtered array cleared correctly');
});

QUnit.test('the dependent array can be `clear`ed directly (#3272)', function () {
  deepEqual(obj.get('filtered'), [2, 4, 6, 8], 'precond - filtered array is initially correct');

  obj.get('array').clear();

  deepEqual(obj.get('filtered'), [], 'filtered array cleared correctly');
});

QUnit.test('it updates as the array is replaced', function () {
  deepEqual(obj.get('filtered'), [2, 4, 6, 8], 'precond - filtered array is initially correct');

  obj.set('array', [20, 21, 22, 23, 24]);

  deepEqual(obj.get('filtered'), [20, 22, 24], 'computed array is updated when array is changed');
});

QUnit.module('filterBy', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      a1s: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('array', 'a', 1),
      as: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('array', 'a'),
      bs: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('array', 'b')
    }).create({
      array: _emberMetalCore2['default'].A([{ name: 'one', a: 1, b: false }, { name: 'two', a: 2, b: false }, { name: 'three', a: 1, b: true }, { name: 'four', b: true }])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('filterBy is readOnly', function () {
  QUnit.throws(function () {
    obj.set('as', 1);
  }, /Cannot set read-only property "as" on object:/);
});

QUnit.test('properties can be filtered by truthiness', function () {
  deepEqual(obj.get('as').mapBy('name'), ['one', 'two', 'three'], 'properties can be filtered by existence');
  deepEqual(obj.get('bs').mapBy('name'), ['three', 'four'], 'booleans can be filtered');

  (0, _emberMetalProperty_set.set)(obj.get('array')[0], 'a', undefined);
  (0, _emberMetalProperty_set.set)(obj.get('array')[3], 'a', true);

  (0, _emberMetalProperty_set.set)(obj.get('array')[0], 'b', true);
  (0, _emberMetalProperty_set.set)(obj.get('array')[3], 'b', false);

  deepEqual(obj.get('as').mapBy('name'), ['two', 'three', 'four'], 'arrays computed by filter property respond to property changes');
  deepEqual(obj.get('bs').mapBy('name'), ['one', 'three'], 'arrays computed by filtered property respond to property changes');

  obj.get('array').pushObject({ name: 'five', a: 6, b: true });

  deepEqual(obj.get('as').mapBy('name'), ['two', 'three', 'four', 'five'], 'arrays computed by filter property respond to added objects');
  deepEqual(obj.get('bs').mapBy('name'), ['one', 'three', 'five'], 'arrays computed by filtered property respond to added objects');

  obj.get('array').popObject();

  deepEqual(obj.get('as').mapBy('name'), ['two', 'three', 'four'], 'arrays computed by filter property respond to removed objects');
  deepEqual(obj.get('bs').mapBy('name'), ['one', 'three'], 'arrays computed by filtered property respond to removed objects');

  obj.set('array', [{ name: 'six', a: 12, b: true }]);

  deepEqual(obj.get('as').mapBy('name'), ['six'], 'arrays computed by filter property respond to array changes');
  deepEqual(obj.get('bs').mapBy('name'), ['six'], 'arrays computed by filtered property respond to array changes');
});

QUnit.test('properties can be filtered by values', function () {
  deepEqual(obj.get('a1s').mapBy('name'), ['one', 'three'], 'properties can be filtered by matching value');

  obj.get('array').pushObject({ name: 'five', a: 1 });

  deepEqual(obj.get('a1s').mapBy('name'), ['one', 'three', 'five'], 'arrays computed by matching value respond to added objects');

  obj.get('array').popObject();

  deepEqual(obj.get('a1s').mapBy('name'), ['one', 'three'], 'arrays computed by matching value respond to removed objects');

  (0, _emberMetalProperty_set.set)(obj.get('array')[1], 'a', 1);
  (0, _emberMetalProperty_set.set)(obj.get('array')[2], 'a', 2);

  deepEqual(obj.get('a1s').mapBy('name'), ['one', 'two'], 'arrays computed by matching value respond to modified properties');
});

QUnit.test('properties values can be replaced', function () {
  obj = _emberRuntimeSystemObject2['default'].extend({
    a1s: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('array', 'a', 1),
    a1bs: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('a1s', 'b')
  }).create({
    array: []
  });

  deepEqual(obj.get('a1bs').mapBy('name'), [], 'properties can be filtered by matching value');

  (0, _emberMetalProperty_set.set)(obj, 'array', [{ name: 'item1', a: 1, b: true }]);

  deepEqual(obj.get('a1bs').mapBy('name'), ['item1'], 'properties can be filtered by matching value');
});

[['uniq', _emberRuntimeComputedReduce_computed_macros.uniq], ['union', _emberRuntimeComputedReduce_computed_macros.union]].forEach(function (tuple) {
  var _tuple = _slicedToArray(tuple, 2);

  var name = _tuple[0];
  var macro = _tuple[1];

  QUnit.module('computed.' + name, {
    setup: function setup() {
      obj = _emberRuntimeSystemObject2['default'].extend({
        union: macro('array', 'array2', 'array3')
      }).create({
        array: _emberMetalCore2['default'].A([1, 2, 3, 4, 5, 6]),
        array2: _emberMetalCore2['default'].A([4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9]),
        array3: _emberMetalCore2['default'].A([1, 8, 10])
      });
    },
    teardown: function teardown() {
      _emberMetalCore2['default'].run(obj, 'destroy');
    }
  });

  QUnit.test(name + ' is readOnly', function () {
    QUnit.throws(function () {
      obj.set('union', 1);
    }, /Cannot set read-only property "union" on object:/);
  });

  QUnit.test('does not include duplicates', function () {
    var array = obj.get('array');
    var array2 = obj.get('array2');

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], name + ' does not include duplicates');

    array.pushObject(8);

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], name + ' does not add existing items');

    array.pushObject(11);

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], name + ' adds new items');

    array2.removeAt(6); // remove 7

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], name + ' does not remove items that are still in the dependent array');

    array2.removeObject(7);

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 8, 9, 10, 11], name + ' removes items when their last instance is gone');
  });

  QUnit.test('has set-union semantics', function () {
    var array = obj.get('array');

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], name + ' is initially correct');

    array.removeObject(6);

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'objects are not removed if they exist in other dependent arrays');

    array.clear();

    deepEqual(obj.get('union').sort(function (x, y) {
      return x - y;
    }), [1, 4, 5, 6, 7, 8, 9, 10], 'objects are removed when they are no longer in any dependent array');
  });
});

QUnit.module('computed.intersect', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      intersection: (0, _emberRuntimeComputedReduce_computed_macros.intersect)('array', 'array2', 'array3')
    }).create({
      array: _emberMetalCore2['default'].A([1, 2, 3, 4, 5, 6]),
      array2: _emberMetalCore2['default'].A([3, 3, 3, 4, 5]),
      array3: _emberMetalCore2['default'].A([3, 5, 6, 7, 8])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('intersect is readOnly', function () {
  QUnit.throws(function () {
    obj.set('intersection', 1);
  }, /Cannot set read-only property "intersection" on object:/);
});

QUnit.test('it has set-intersection semantics', function () {
  var array2 = obj.get('array2');
  var array3 = obj.get('array3');

  deepEqual(obj.get('intersection').sort(function (x, y) {
    return x - y;
  }), [3, 5], 'intersection is initially correct');

  array2.shiftObject();

  deepEqual(obj.get('intersection').sort(function (x, y) {
    return x - y;
  }), [3, 5], 'objects are not removed when they are still in all dependent arrays');

  array2.shiftObject();

  deepEqual(obj.get('intersection').sort(function (x, y) {
    return x - y;
  }), [3, 5], 'objects are not removed when they are still in all dependent arrays');

  array2.shiftObject();

  deepEqual(obj.get('intersection'), [5], 'objects are removed once they are gone from all dependent arrays');

  array2.pushObject(1);

  deepEqual(obj.get('intersection'), [5], 'objects are not added as long as they are missing from any dependent array');

  array3.pushObject(1);

  deepEqual(obj.get('intersection').sort(function (x, y) {
    return x - y;
  }), [1, 5], 'objects added once they belong to all dependent arrays');
});

QUnit.module('setDiff', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      diff: (0, _emberRuntimeComputedReduce_computed_macros.setDiff)('array', 'array2')
    }).create({
      array: _emberMetalCore2['default'].A([1, 2, 3, 4, 5, 6, 7]),
      array2: _emberMetalCore2['default'].A([3, 4, 5, 10])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('setDiff is readOnly', function () {
  QUnit.throws(function () {
    obj.set('diff', 1);
  }, /Cannot set read-only property "diff" on object:/);
});

QUnit.test('it throws an error if given fewer or more than two dependent properties', function () {
  throws(function () {
    _emberRuntimeSystemObject2['default'].extend({
      diff: (0, _emberRuntimeComputedReduce_computed_macros.setDiff)('array')
    }).create({
      array: _emberMetalCore2['default'].A([1, 2, 3, 4, 5, 6, 7]),
      array2: _emberMetalCore2['default'].A([3, 4, 5])
    });
  }, /requires exactly two dependent arrays/, 'setDiff requires two dependent arrays');

  throws(function () {
    _emberRuntimeSystemObject2['default'].extend({
      diff: (0, _emberRuntimeComputedReduce_computed_macros.setDiff)('array', 'array2', 'array3')
    }).create({
      array: _emberMetalCore2['default'].A([1, 2, 3, 4, 5, 6, 7]),
      array2: _emberMetalCore2['default'].A([3, 4, 5]),
      array3: _emberMetalCore2['default'].A([7])
    });
  }, /requires exactly two dependent arrays/, 'setDiff requires two dependent arrays');
});

QUnit.test('it has set-diff semantics', function () {
  var array1 = obj.get('array');
  var array2 = obj.get('array2');

  deepEqual(obj.get('diff').sort(function (x, y) {
    return x - y;
  }), [1, 2, 6, 7], 'set-diff is initially correct');

  array2.popObject();

  deepEqual(obj.get('diff').sort(function (x, y) {
    return x - y;
  }), [1, 2, 6, 7], 'removing objects from the remove set has no effect if the object is not in the keep set');

  array2.shiftObject();

  deepEqual(obj.get('diff').sort(function (x, y) {
    return x - y;
  }), [1, 2, 3, 6, 7], 'removing objects from the remove set adds them if they\'re in the keep set');

  array1.removeObject(3);

  deepEqual(obj.get('diff').sort(function (x, y) {
    return x - y;
  }), [1, 2, 6, 7], 'removing objects from the keep array removes them from the computed array');

  array1.pushObject(5);

  deepEqual(obj.get('diff').sort(function (x, y) {
    return x - y;
  }), [1, 2, 6, 7], 'objects added to the keep array that are in the remove array are not added to the computed array');

  array1.pushObject(22);

  deepEqual(obj.get('diff').sort(function (x, y) {
    return x - y;
  }), [1, 2, 6, 7, 22], 'objects added to the keep array not in the remove array are added to the computed array');
});

function commonSortTests() {
  QUnit.test('arrays are initially sorted', function () {
    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'array is initially sorted');
  });

  QUnit.test('default sort order is correct', function () {
    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'array is initially sorted');
  });

  QUnit.test('changing the dependent array updates the sorted array', function () {
    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

    obj.set('items', [{ fname: 'Roose', lname: 'Bolton' }, { fname: 'Theon', lname: 'Greyjoy' }, { fname: 'Ramsey', lname: 'Bolton' }, { fname: 'Stannis', lname: 'Baratheon' }]);

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Stannis', 'Ramsey', 'Roose', 'Theon'], 'changing dependent array updates sorted array');
  });

  QUnit.test('adding to the dependent array updates the sorted array', function () {
    var items = obj.get('items');

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

    items.pushObject({
      fname: 'Tyrion',
      lname: 'Lannister'
    });

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Tyrion', 'Bran', 'Robb'], 'Adding to the dependent array updates the sorted array');
  });

  QUnit.test('removing from the dependent array updates the sorted array', function () {
    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

    obj.get('items').popObject();

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Robb'], 'Removing from the dependent array updates the sorted array');
  });

  QUnit.test('distinct items may be sort-equal, although their relative order will not be guaranteed', function () {
    // We recreate jaime and "Cersei" here only for test stability: we want
    // their guid-ordering to be deterministic
    var jaimeInDisguise = {
      fname: 'Cersei',
      lname: 'Lannister',
      age: 34
    };

    var jaime = {
      fname: 'Jaime',
      lname: 'Lannister',
      age: 34
    };

    var items = obj.get('items');

    items.replace(0, 1, jaime);
    items.replace(1, 1, jaimeInDisguise);

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

    (0, _emberMetalProperty_set.set)(jaimeInDisguise, 'fname', 'Jaime');

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Jaime', 'Jaime', 'Bran', 'Robb'], 'sorted array is updated');

    (0, _emberMetalProperty_set.set)(jaimeInDisguise, 'fname', 'Cersei');

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'sorted array is updated');
  });

  QUnit.test('guid sort-order fallback with a search proxy is not confused by non-search ObjectProxys', function () {
    var tyrion = {
      fname: 'Tyrion',
      lname: 'Lannister'
    };

    var tyrionInDisguise = _emberRuntimeSystemObject_proxy2['default'].create({
      fname: 'Yollo',
      lname: '',
      content: tyrion
    });

    var items = obj.get('items');

    items.pushObject(tyrion);

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Tyrion', 'Bran', 'Robb']);

    items.pushObject(tyrionInDisguise);

    deepEqual(obj.get('sortedItems').mapBy('fname'), ['Yollo', 'Cersei', 'Jaime', 'Tyrion', 'Bran', 'Robb']);
  });
}

QUnit.module('sort - sortProperties', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      sortedItems: (0, _emberRuntimeComputedReduce_computed_macros.sort)('items', 'itemSorting')
    }).create({
      itemSorting: _emberMetalCore2['default'].A(['lname', 'fname']),
      items: _emberMetalCore2['default'].A([{ fname: 'Jaime', lname: 'Lannister', age: 34 }, { fname: 'Cersei', lname: 'Lannister', age: 34 }, { fname: 'Robb', lname: 'Stark', age: 16 }, { fname: 'Bran', lname: 'Stark', age: 8 }])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('sort is readOnly', function () {
  QUnit.throws(function () {
    obj.set('sortedItems', 1);
  }, /Cannot set read-only property "sortedItems" on object:/);
});

commonSortTests();

QUnit.test('updating sort properties detaches observers for old sort properties', function () {
  var objectToRemove = obj.get('items')[3];

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  obj.set('itemSorting', _emberMetalCore2['default'].A(['fname:desc']));

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Robb', 'Jaime', 'Cersei', 'Bran'], 'after updating sort properties array is updated');

  obj.get('items').removeObject(objectToRemove);

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Robb', 'Jaime', 'Cersei'], 'after removing item array is updated');

  (0, _emberMetalProperty_set.set)(objectToRemove, 'lname', 'Updated-Stark');

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Robb', 'Jaime', 'Cersei'], 'after changing removed item array is not updated');
});

QUnit.test('updating sort properties updates the sorted array', function () {
  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  obj.set('itemSorting', _emberMetalCore2['default'].A(['fname:desc']));

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Robb', 'Jaime', 'Cersei', 'Bran'], 'after updating sort properties array is updated');
});

QUnit.test('updating sort properties invalidates the sorted array', function () {
  var sortProps = obj.get('itemSorting');

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  sortProps.clear();
  sortProps.pushObject('fname');

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Robb'], 'after updating sort properties array is updated');
});

QUnit.test('updating new sort properties invalidates the sorted array', function () {
  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  obj.set('itemSorting', _emberMetalCore2['default'].A(['age:desc', 'fname:asc']));

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Robb', 'Bran'], 'precond - array is correct after item sorting is changed');

  (0, _emberMetalProperty_set.set)(obj.get('items')[1], 'age', 29);

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Jaime', 'Cersei', 'Robb', 'Bran'], 'after updating sort properties array is updated');
});

QUnit.test('sort direction defaults to ascending', function () {
  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb']);
});

QUnit.test('sort direction defaults to ascending (with sort property change)', function () {
  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  obj.set('itemSorting', _emberMetalCore2['default'].A(['fname']));

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Robb'], 'sort direction defaults to ascending');
});

QUnit.test('updating an item\'s sort properties updates the sorted array', function () {
  var tyrionInDisguise = obj.get('items')[1];

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  (0, _emberMetalProperty_set.set)(tyrionInDisguise, 'fname', 'Tyrion');

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Jaime', 'Tyrion', 'Bran', 'Robb'], 'updating an item\'s sort properties updates the sorted array');
});

QUnit.test('updating several of an item\'s sort properties updated the sorted array', function () {
  var sansaInDisguise = obj.get('items')[1];

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  (0, _emberMetalSet_properties2['default'])(sansaInDisguise, {
    fname: 'Sansa',
    lname: 'Stark'
  });

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Jaime', 'Bran', 'Robb', 'Sansa'], 'updating an item\'s sort properties updates the sorted array');
});

QUnit.test('updating an item\'s sort properties does not error when binary search does a self compare (#3273)', function () {
  var jaime = {
    name: 'Jaime',
    status: 1
  };

  var cersei = {
    name: 'Cersei',
    status: 2
  };

  var obj = _emberRuntimeSystemObject2['default'].extend({
    sortProps: ['status'],
    sortedPeople: (0, _emberRuntimeComputedReduce_computed_macros.sort)('people', 'sortProps')
  }).create({
    people: [jaime, cersei]
  });

  deepEqual(obj.get('sortedPeople'), [jaime, cersei], 'precond - array is initially sorted');

  (0, _emberMetalProperty_set.set)(cersei, 'status', 3);

  deepEqual(obj.get('sortedPeople'), [jaime, cersei], 'array is sorted correctly');

  (0, _emberMetalProperty_set.set)(cersei, 'status', 2);

  deepEqual(obj.get('sortedPeople'), [jaime, cersei], 'array is sorted correctly');
});

QUnit.test('array observers do not leak', function () {
  var daria = { name: 'Daria' };
  var jane = { name: 'Jane' };

  var sisters = [jane, daria];

  var sortProps = _emberMetalCore2['default'].A(['name']);
  var jaime = _emberRuntimeSystemObject2['default'].extend({
    sortedPeople: (0, _emberRuntimeComputedReduce_computed_macros.sort)('sisters', 'sortProps'),
    sortProps: sortProps
  }).create({
    sisters: sisters
  });

  jaime.get('sortedPeople');
  _emberMetalCore2['default'].run(jaime, 'destroy');

  try {
    sortProps.pushObject({
      name: 'Anna'
    });
    ok(true);
  } catch (e) {
    ok(false, e);
  }
});

QUnit.test('property paths in sort properties update the sorted array', function () {
  var jaime = {
    relatedObj: { status: 1, firstName: 'Jaime', lastName: 'Lannister' }
  };

  var cersei = {
    relatedObj: { status: 2, firstName: 'Cersei', lastName: 'Lannister' }
  };

  var sansa = _emberRuntimeSystemObject2['default'].create({
    relatedObj: { status: 3, firstName: 'Sansa', lastName: 'Stark' }
  });

  var obj = _emberRuntimeSystemObject2['default'].extend({
    sortProps: ['relatedObj.status'],
    sortedPeople: (0, _emberRuntimeComputedReduce_computed_macros.sort)('people', 'sortProps')
  }).create({
    people: [jaime, cersei, sansa]
  });

  deepEqual(obj.get('sortedPeople'), [jaime, cersei, sansa], 'precond - array is initially sorted');

  (0, _emberMetalProperty_get.get)(cersei, 'status', 3);

  deepEqual(obj.get('sortedPeople'), [jaime, cersei, sansa], 'array is sorted correctly');

  (0, _emberMetalProperty_set.set)(cersei, 'status', 1);

  deepEqual(obj.get('sortedPeople'), [jaime, cersei, sansa], 'array is sorted correctly');

  sansa.set('status', 1);

  deepEqual(obj.get('sortedPeople'), [jaime, cersei, sansa], 'array is sorted correctly');

  obj.set('sortProps', ['relatedObj.firstName']);

  deepEqual(obj.get('sortedPeople'), [cersei, jaime, sansa], 'array is sorted correctly');
});

function sortByLnameFname(a, b) {
  var lna = (0, _emberMetalProperty_get.get)(a, 'lname');
  var lnb = (0, _emberMetalProperty_get.get)(b, 'lname');

  if (lna !== lnb) {
    return lna > lnb ? 1 : -1;
  }

  return sortByFnameAsc(a, b);
}

function sortByFnameAsc(a, b) {
  var fna = (0, _emberMetalProperty_get.get)(a, 'fname');
  var fnb = (0, _emberMetalProperty_get.get)(b, 'fname');

  if (fna === fnb) {
    return 0;
  }
  return fna > fnb ? 1 : -1;
}

QUnit.module('sort - sort function', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      sortedItems: (0, _emberRuntimeComputedReduce_computed_macros.sort)('items.@each.fname', sortByLnameFname)
    }).create({
      items: _emberMetalCore2['default'].A([{ fname: 'Jaime', lname: 'Lannister', age: 34 }, { fname: 'Cersei', lname: 'Lannister', age: 34 }, { fname: 'Robb', lname: 'Stark', age: 16 }, { fname: 'Bran', lname: 'Stark', age: 8 }])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('sort (with function) is readOnly', function () {
  QUnit.throws(function () {
    obj.set('sortedItems', 1);
  }, /Cannot set read-only property "sortedItems" on object:/);
});

commonSortTests();

QUnit.test('changing item properties specified via @each triggers a resort of the modified item', function () {
  var items = (0, _emberMetalProperty_get.get)(obj, 'items');

  var tyrionInDisguise = items[1];

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  (0, _emberMetalProperty_set.set)(tyrionInDisguise, 'fname', 'Tyrion');

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Jaime', 'Tyrion', 'Bran', 'Robb'], 'updating a specified property on an item resorts it');
});

QUnit.test('changing item properties not specified via @each does not trigger a resort', function () {
  var items = obj.get('items');
  var cersei = items[1];

  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'precond - array is initially sorted');

  (0, _emberMetalProperty_set.set)(cersei, 'lname', 'Stark'); // plot twist! (possibly not canon)

  // The array has become unsorted.  If your sort function is sensitive to
  // properties, they *must* be specified as dependent item property keys or
  // we'll be doing binary searches on unsorted arrays.
  deepEqual(obj.get('sortedItems').mapBy('fname'), ['Cersei', 'Jaime', 'Bran', 'Robb'], 'updating an unspecified property on an item does not resort it');
});

QUnit.module('sort - stability', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      sortProps: ['count', 'name'],
      sortedItems: (0, _emberRuntimeComputedReduce_computed_macros.sort)('items', 'sortProps')
    }).create({
      items: [{ name: 'A', count: 1 }, { name: 'B', count: 1 }, { name: 'C', count: 1 }, { name: 'D', count: 1 }]
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('sorts correctly as only one property changes', function () {
  deepEqual(obj.get('sortedItems').mapBy('name'), ['A', 'B', 'C', 'D'], 'initial');

  (0, _emberMetalProperty_set.set)(obj.get('items')[3], 'count', 2);

  deepEqual(obj.get('sortedItems').mapBy('name'), ['A', 'B', 'C', 'D'], 'final');
});

QUnit.module('sort - concurrency', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      sortProps: ['count'],
      sortedItems: (0, _emberRuntimeComputedReduce_computed_macros.sort)('items', 'sortProps'),
      customSortedItems: (0, _emberRuntimeComputedReduce_computed_macros.sort)('items.@each.count', function (a, b) {
        return a.count - b.count;
      })
    }).create({
      items: _emberMetalCore2['default'].A([{ name: 'A', count: 1 }, { name: 'B', count: 2 }, { name: 'C', count: 3 }, { name: 'D', count: 4 }])
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('sorts correctly after mutation to the sort properties', function () {
  var sorted = obj.get('sortedItems');
  deepEqual(sorted.mapBy('name'), ['A', 'B', 'C', 'D'], 'initial');

  (0, _emberMetalProperty_set.set)(obj.get('items')[1], 'count', 5);
  (0, _emberMetalProperty_set.set)(obj.get('items')[2], 'count', 6);

  deepEqual(obj.get('sortedItems').mapBy('name'), ['A', 'D', 'B', 'C'], 'final');
});

QUnit.test('sort correctl after mutation to the sor ', function () {
  deepEqual(obj.get('customSortedItems').mapBy('name'), ['A', 'B', 'C', 'D'], 'initial');

  (0, _emberMetalProperty_set.set)(obj.get('items')[1], 'count', 5);
  (0, _emberMetalProperty_set.set)(obj.get('items')[2], 'count', 6);

  deepEqual(obj.get('customSortedItems').mapBy('name'), ['A', 'D', 'B', 'C'], 'final');

  deepEqual(obj.get('sortedItems').mapBy('name'), ['A', 'D', 'B', 'C'], 'final');
});

QUnit.module('max', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      max: (0, _emberRuntimeComputedReduce_computed_macros.max)('items')
    }).create({
      items: _emberMetalCore2['default'].A([1, 2, 3])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('max is readOnly', function () {
  QUnit.throws(function () {
    obj.set('max', 1);
  }, /Cannot set read-only property "max" on object:/);
});

QUnit.test('max tracks the max number as objects are added', function () {
  equal(obj.get('max'), 3, 'precond - max is initially correct');

  var items = obj.get('items');

  items.pushObject(5);

  equal(obj.get('max'), 5, 'max updates when a larger number is added');

  items.pushObject(2);

  equal(obj.get('max'), 5, 'max does not update when a smaller number is added');
});

QUnit.test('max recomputes when the current max is removed', function () {
  equal(obj.get('max'), 3, 'precond - max is initially correct');

  obj.get('items').removeObject(2);

  equal(obj.get('max'), 3, 'max is unchanged when a non-max item is removed');

  obj.get('items').removeObject(3);

  equal(obj.get('max'), 1, 'max is recomputed when the current max is removed');
});

QUnit.module('min', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      min: (0, _emberRuntimeComputedReduce_computed_macros.min)('items')
    }).create({
      items: _emberMetalCore2['default'].A([1, 2, 3])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('min is readOnly', function () {
  QUnit.throws(function () {
    obj.set('min', 1);
  }, /Cannot set read-only property "min" on object:/);
});

QUnit.test('min tracks the min number as objects are added', function () {
  equal(obj.get('min'), 1, 'precond - min is initially correct');

  obj.get('items').pushObject(-2);

  equal(obj.get('min'), -2, 'min updates when a smaller number is added');

  obj.get('items').pushObject(2);

  equal(obj.get('min'), -2, 'min does not update when a larger number is added');
});

QUnit.test('min recomputes when the current min is removed', function () {
  var items = obj.get('items');

  equal(obj.get('min'), 1, 'precond - min is initially correct');

  items.removeObject(2);

  equal(obj.get('min'), 1, 'min is unchanged when a non-min item is removed');

  items.removeObject(1);

  equal(obj.get('min'), 3, 'min is recomputed when the current min is removed');
});

QUnit.module('Ember.arrayComputed - mixed sugar', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      lannisters: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('items', 'lname', 'Lannister'),
      lannisterSorting: _emberMetalCore2['default'].A(['fname']),
      sortedLannisters: (0, _emberRuntimeComputedReduce_computed_macros.sort)('lannisters', 'lannisterSorting'),

      starks: (0, _emberRuntimeComputedReduce_computed_macros.filterBy)('items', 'lname', 'Stark'),
      starkAges: (0, _emberRuntimeComputedReduce_computed_macros.mapBy)('starks', 'age'),
      oldestStarkAge: (0, _emberRuntimeComputedReduce_computed_macros.max)('starkAges')
    }).create({
      items: _emberMetalCore2['default'].A([{ fname: 'Jaime', lname: 'Lannister', age: 34 }, { fname: 'Cersei', lname: 'Lannister', age: 34 }, { fname: 'Robb', lname: 'Stark', age: 16 }, { fname: 'Bran', lname: 'Stark', age: 8 }])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('filtering and sorting can be combined', function () {
  var items = obj.get('items');

  deepEqual(obj.get('sortedLannisters').mapBy('fname'), ['Cersei', 'Jaime'], 'precond - array is initially filtered and sorted');

  items.pushObject({ fname: 'Tywin', lname: 'Lannister' });
  items.pushObject({ fname: 'Lyanna', lname: 'Stark' });
  items.pushObject({ fname: 'Gerion', lname: 'Lannister' });

  deepEqual(obj.get('sortedLannisters').mapBy('fname'), ['Cersei', 'Gerion', 'Jaime', 'Tywin'], 'updates propagate to array');
});

QUnit.test('filtering, sorting and reduce (max) can be combined', function () {
  var items = obj.get('items');

  equal(16, obj.get('oldestStarkAge'), 'precond - end of chain is initially correct');

  items.pushObject({ fname: 'Rickon', lname: 'Stark', age: 5 });

  equal(16, obj.get('oldestStarkAge'), 'chain is updated correctly');

  items.pushObject({ fname: 'Eddard', lname: 'Stark', age: 35 });

  equal(35, obj.get('oldestStarkAge'), 'chain is updated correctly');
});

function todo(name, priority) {
  return _emberRuntimeSystemObject2['default'].create({ name: name, priority: priority });
}

function priorityComparator(todoA, todoB) {
  var pa = parseInt((0, _emberMetalProperty_get.get)(todoA, 'priority'), 10);
  var pb = parseInt((0, _emberMetalProperty_get.get)(todoB, 'priority'), 10);

  return pa - pb;
}

function evenPriorities(todo) {
  var p = parseInt((0, _emberMetalProperty_get.get)(todo, 'priority'), 10);

  return p % 2 === 0;
}

QUnit.module('Ember.arrayComputed - chains', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      sorted: (0, _emberRuntimeComputedReduce_computed_macros.sort)('todos.@each.priority', priorityComparator),
      filtered: (0, _emberRuntimeComputedReduce_computed_macros.filter)('sorted.@each.priority', evenPriorities)
    }).create({
      todos: _emberMetalCore2['default'].A([todo('E', 4), todo('D', 3), todo('C', 2), todo('B', 1), todo('A', 0)])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('it can filter and sort when both depend on the same item property', function () {
  deepEqual(obj.get('todos').mapBy('name'), ['E', 'D', 'C', 'B', 'A'], 'precond - todos initially correct');
  deepEqual(obj.get('sorted').mapBy('name'), ['A', 'B', 'C', 'D', 'E'], 'precond - sorted initially correct');
  deepEqual(obj.get('filtered').mapBy('name'), ['A', 'C', 'E'], 'precond - filtered initially correct');

  (0, _emberMetalProperty_set.set)(obj.get('todos')[1], 'priority', 6);

  deepEqual(obj.get('todos').mapBy('name'), ['E', 'D', 'C', 'B', 'A'], 'precond - todos remain correct');
  deepEqual(obj.get('sorted').mapBy('name'), ['A', 'B', 'C', 'E', 'D'], 'precond - sorted updated correctly');
  deepEqual(obj.get('filtered').mapBy('name'), ['A', 'C', 'E', 'D'], 'filtered updated correctly');
});

var userFnCalls;
QUnit.module('Chaining array and reduced CPs', {
  setup: function setup() {
    userFnCalls = 0;
    obj = _emberRuntimeSystemObject2['default'].extend({
      mapped: (0, _emberRuntimeComputedReduce_computed_macros.mapBy)('array', 'v'),
      max: (0, _emberRuntimeComputedReduce_computed_macros.max)('mapped'),
      maxDidChange: (0, _emberMetalMixin.observer)('max', function () {
        return userFnCalls++;
      })
    }).create({
      array: _emberMetalCore2['default'].A([{ v: 1 }, { v: 3 }, { v: 2 }, { v: 1 }])
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('it computes interdependent array computed properties', function () {
  equal(obj.get('max'), 3, 'sanity - it properly computes the maximum value');

  var calls = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'max', function () {
    return calls++;
  });

  obj.get('array').pushObject({ v: 5 });

  equal(obj.get('max'), 5, 'maximum value is updated correctly');
  equal(userFnCalls, 1, 'object defined observers fire');
  equal(calls, 1, 'runtime created observers fire');
});

QUnit.module('sum', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      total: (0, _emberRuntimeComputedReduce_computed_macros.sum)('array')
    }).create({
      array: _emberMetalCore2['default'].A([1, 2, 3])
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(obj, 'destroy');
  }
});

QUnit.test('sum is readOnly', function () {
  QUnit.throws(function () {
    obj.set('total', 1);
  }, /Cannot set read-only property "total" on object:/);
});
QUnit.test('sums the values in the dependentKey', function () {
  equal(obj.get('total'), 6, 'sums the values');
});

QUnit.test('updates when array is modified', function () {
  obj.get('array').pushObject(1);

  equal(obj.get('total'), 7, 'recomputed when elements are added');

  obj.get('array').popObject();

  equal(obj.get('total'), 6, 'recomputes when elements are removed');
});