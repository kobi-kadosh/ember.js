'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// for Ember.A

var _emberRuntimeTestsSuitesEnumerable = require('ember-runtime/tests/suites/enumerable');

var _emberRuntimeTestsSuitesEnumerable2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerable);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsEnumerable = require('ember-runtime/mixins/enumerable');

var _emberRuntimeMixinsEnumerable2 = _interopRequireDefault(_emberRuntimeMixinsEnumerable);

var _emberRuntimeMixinsArray = require('ember-runtime/mixins/array');

var _emberRuntimeMixinsArray2 = _interopRequireDefault(_emberRuntimeMixinsArray);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalMixin = require('ember-metal/mixin');

function K() {
  return this;
}

/*
  Implement a basic fake enumerable.  This validates that any non-native
  enumerable can impl this API.
*/
var TestEnumerable = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default'], {

  _content: null,

  init: function init(ary) {
    this._content = ary || [];
  },

  addObject: function addObject(obj) {
    if (this._content.indexOf(obj) >= 0) {
      return this;
    }

    this._content.push(obj);
    this.enumerableContentDidChange();
  },

  nextObject: function nextObject(idx) {
    return idx >= (0, _emberMetalProperty_get.get)(this, 'length') ? undefined : this._content[idx];
  },

  length: (0, _emberMetalComputed.computed)(function () {
    return this._content.length;
  }),

  slice: function slice() {
    return this._content.slice();
  }

});

_emberRuntimeTestsSuitesEnumerable2['default'].extend({

  name: 'Basic Enumerable',

  newObject: function newObject(ary) {
    ary = ary ? ary.slice() : this.newFixture(3);
    return new TestEnumerable(ary);
  },

  // allows for testing of the basic enumerable after an internal mutation
  mutate: function mutate(obj) {
    obj.addObject(obj._content.length + 1);
  },

  toArray: function toArray(obj) {
    return obj.slice();
  }

}).run();

QUnit.module('Ember.Enumerable');

QUnit.test('should apply Ember.Array to return value of map', function () {
  var x = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default']).create();
  var y = x.map(K);
  equal(_emberRuntimeMixinsArray2['default'].detect(y), true, 'should have mixin applied');
});

QUnit.test('should apply Ember.Array to return value of filter', function () {
  var x = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default']).create();
  var y = x.filter(K);
  equal(_emberRuntimeMixinsArray2['default'].detect(y), true, 'should have mixin applied');
});

QUnit.test('should apply Ember.Array to return value of invoke', function () {
  var x = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default']).create();
  var y = x.invoke(K);
  equal(_emberRuntimeMixinsArray2['default'].detect(y), true, 'should have mixin applied');
});

QUnit.test('should apply Ember.Array to return value of toArray', function () {
  var x = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default']).create();
  var y = x.toArray(K);
  equal(_emberRuntimeMixinsArray2['default'].detect(y), true, 'should have mixin applied');
});

QUnit.test('should apply Ember.Array to return value of without', function () {
  var x = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default'], {
    contains: function contains() {
      return true;
    }
  }).create();
  var y = x.without(K);
  equal(_emberRuntimeMixinsArray2['default'].detect(y), true, 'should have mixin applied');
});

QUnit.test('should apply Ember.Array to return value of uniq', function () {
  var x = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default']).create();
  var y = x.uniq(K);
  equal(_emberRuntimeMixinsArray2['default'].detect(y), true, 'should have mixin applied');
});

QUnit.test('any', function () {
  var kittens = _emberMetalCore2['default'].A([{
    color: 'white'
  }, {
    color: 'black'
  }, {
    color: 'white'
  }]);
  var foundWhite = kittens.any(function (kitten) {
    return kitten.color === 'white';
  });
  var foundWhite2 = kittens.isAny('color', 'white');

  equal(foundWhite, true);
  equal(foundWhite2, true);
});

QUnit.test('any with NaN', function () {
  var numbers = _emberMetalCore2['default'].A([1, 2, NaN, 4]);

  var hasNaN = numbers.any(function (n) {
    return isNaN(n);
  });

  equal(hasNaN, true, 'works when matching NaN');
});

QUnit.test('every', function () {
  var allColorsKittens = _emberMetalCore2['default'].A([{
    color: 'white'
  }, {
    color: 'black'
  }, {
    color: 'white'
  }]);
  var allWhiteKittens = _emberMetalCore2['default'].A([{
    color: 'white'
  }, {
    color: 'white'
  }, {
    color: 'white'
  }]);
  var allWhite = false;
  var whiteKittenPredicate = function whiteKittenPredicate(kitten) {
    return kitten.color === 'white';
  };

  allWhite = allColorsKittens.every(whiteKittenPredicate);
  equal(allWhite, false);

  allWhite = allWhiteKittens.every(whiteKittenPredicate);
  equal(allWhite, true);

  allWhite = allColorsKittens.isEvery('color', 'white');
  equal(allWhite, false);

  allWhite = allWhiteKittens.isEvery('color', 'white');
  equal(allWhite, true);
});

// ..........................................................
// CONTENT DID CHANGE
//

var DummyEnum = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default'], {
  nextObject: function nextObject() {},
  length: 0
});

var obj, observer;

// ..........................................................
// NOTIFY ENUMERABLE PROPERTY
//

QUnit.module('mixins/enumerable/enumerableContentDidChange');

QUnit.test('should notify observers of []', function () {

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEnumerable2['default'], {
    nextObject: function nextObject() {}, // avoid exceptions

    enumerablePropertyDidChange: (0, _emberMetalMixin.observer)('[]', function () {
      this._count++;
    })
  }).create({
    _count: 0
  });

  equal(obj._count, 0, 'should not have invoked yet');
  obj.enumerableContentWillChange();
  obj.enumerableContentDidChange();
  equal(obj._count, 1, 'should have invoked');
});

// ..........................................................
// NOTIFY CHANGES TO LENGTH
//

QUnit.module('notify observers of length', {
  setup: function setup() {
    obj = DummyEnum.extend({
      lengthDidChange: (0, _emberMetalMixin.observer)('length', function () {
        this._after++;
      })
    }).create({
      _after: 0
    });

    equal(obj._after, 0, 'should not have fired yet');
  },

  teardown: function teardown() {
    obj = null;
  }
});

QUnit.test('should notify observers when call with no params', function () {
  obj.enumerableContentWillChange();
  equal(obj._after, 0);

  obj.enumerableContentDidChange();
  equal(obj._after, 1);
});

// API variation that included items only
QUnit.test('should not notify when passed arrays of same length', function () {
  var added = ['foo'];
  var removed = ['bar'];

  obj.enumerableContentWillChange(removed, added);
  equal(obj._after, 0);

  obj.enumerableContentDidChange(removed, added);
  equal(obj._after, 0);
});

QUnit.test('should notify when passed arrays of different length', function () {
  var added = ['foo'];
  var removed = ['bar', 'baz'];

  obj.enumerableContentWillChange(removed, added);
  equal(obj._after, 0);

  obj.enumerableContentDidChange(removed, added);
  equal(obj._after, 1);
});

// API variation passes indexes only
QUnit.test('should not notify when passed with indexes', function () {
  obj.enumerableContentWillChange(1, 1);
  equal(obj._after, 0);

  obj.enumerableContentDidChange(1, 1);
  equal(obj._after, 0);
});

QUnit.test('should notify when passed old index API with delta', function () {
  obj.enumerableContentWillChange(1, 2);
  equal(obj._after, 0);

  obj.enumerableContentDidChange(1, 2);
  equal(obj._after, 1);
});

// ..........................................................
// NOTIFY ENUMERABLE OBSERVER
//

QUnit.module('notify enumerable observers', {
  setup: function setup() {
    obj = DummyEnum.create();

    observer = _emberRuntimeSystemObject2['default'].extend({
      enumerableWillChange: function enumerableWillChange() {
        equal(this._before, null); // should only call once
        this._before = Array.prototype.slice.call(arguments);
      },

      enumerableDidChange: function enumerableDidChange() {
        equal(this._after, null); // should only call once
        this._after = Array.prototype.slice.call(arguments);
      }
    }).create({
      _before: null,
      _after: null
    });

    obj.addEnumerableObserver(observer);
  },

  teardown: function teardown() {
    obj = observer = null;
  }
});

QUnit.test('should notify enumerable observers when called with no params', function () {
  obj.enumerableContentWillChange();
  deepEqual(observer._before, [obj, null, null]);

  obj.enumerableContentDidChange();
  deepEqual(observer._after, [obj, null, null]);
});

// API variation that included items only
QUnit.test('should notify when called with same length items', function () {
  var added = ['foo'];
  var removed = ['bar'];

  obj.enumerableContentWillChange(removed, added);
  deepEqual(observer._before, [obj, removed, added]);

  obj.enumerableContentDidChange(removed, added);
  deepEqual(observer._after, [obj, removed, added]);
});

QUnit.test('should notify when called with diff length items', function () {
  var added = ['foo', 'baz'];
  var removed = ['bar'];

  obj.enumerableContentWillChange(removed, added);
  deepEqual(observer._before, [obj, removed, added]);

  obj.enumerableContentDidChange(removed, added);
  deepEqual(observer._after, [obj, removed, added]);
});

QUnit.test('should not notify when passed with indexes only', function () {
  obj.enumerableContentWillChange(1, 2);
  deepEqual(observer._before, [obj, 1, 2]);

  obj.enumerableContentDidChange(1, 2);
  deepEqual(observer._after, [obj, 1, 2]);
});

QUnit.test('removing enumerable observer should disable', function () {
  obj.removeEnumerableObserver(observer);
  obj.enumerableContentWillChange();
  deepEqual(observer._before, null);

  obj.enumerableContentDidChange();
  deepEqual(observer._after, null);
});