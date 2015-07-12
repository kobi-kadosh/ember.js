'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalObserver = require('ember-metal/observer');

var originalLookup = _emberMetalCore2['default'].lookup;
var obj, count, Global, lookup;

QUnit.module('computed');

QUnit.test('computed property should be an instance of descriptor', function () {
  ok((0, _emberMetalComputed.computed)(function () {}) instanceof _emberMetalProperties.Descriptor);
});

QUnit.test('defining computed property should invoke property on get', function () {

  var obj = {};
  var count = 0;
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function (key) {
    count++;
    return 'computed ' + key;
  }));

  equal(get(obj, 'foo'), 'computed foo', 'should return value');
  equal(count, 1, 'should have invoked computed property');
});

QUnit.test('defining computed property should invoke property on set', function () {
  var obj = {};
  var count = 0;
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
    get: function get(key) {
      return this['__' + key];
    },
    set: function set(key, value) {
      count++;
      this['__' + key] = 'computed ' + value;
      return this['__' + key];
    }
  }));

  equal(set(obj, 'foo', 'bar'), 'bar', 'should return set value');
  equal(count, 1, 'should have invoked computed property');
  equal(get(obj, 'foo'), 'computed bar', 'should return new value');
});

var objA, objB;
QUnit.module('computed should inherit through prototype', {
  setup: function setup() {
    objA = { __foo: 'FOO' };
    (0, _emberMetalProperties.defineProperty)(objA, 'foo', (0, _emberMetalComputed.computed)({
      get: function get(key) {
        return this['__' + key];
      },
      set: function set(key, value) {
        this['__' + key] = 'computed ' + value;
        return this['__' + key];
      }
    }));

    objB = Object.create(objA);
    objB.__foo = 'FOO'; // make a copy;
  },

  teardown: function teardown() {
    objA = objB = null;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('using get() and set()', function (get, set) {
  equal(get(objA, 'foo'), 'FOO', 'should get FOO from A');
  equal(get(objB, 'foo'), 'FOO', 'should get FOO from B');

  set(objA, 'foo', 'BIFF');
  equal(get(objA, 'foo'), 'computed BIFF', 'should change A');
  equal(get(objB, 'foo'), 'FOO', 'should NOT change B');

  set(objB, 'foo', 'bar');
  equal(get(objB, 'foo'), 'computed bar', 'should change B');
  equal(get(objA, 'foo'), 'computed BIFF', 'should NOT change A');

  set(objA, 'foo', 'BAZ');
  equal(get(objA, 'foo'), 'computed BAZ', 'should change A');
  equal(get(objB, 'foo'), 'computed bar', 'should NOT change B');
});

QUnit.module('redefining computed property to normal', {
  setup: function setup() {
    objA = { __foo: 'FOO' };
    (0, _emberMetalProperties.defineProperty)(objA, 'foo', (0, _emberMetalComputed.computed)({
      get: function get(key) {
        return this['__' + key];
      },
      set: function set(key, value) {
        this['__' + key] = 'computed ' + value;
        return this['__' + key];
      }
    }));

    objB = Object.create(objA);
    (0, _emberMetalProperties.defineProperty)(objB, 'foo'); // make this just a normal property.
  },

  teardown: function teardown() {
    objA = objB = null;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('using get() and set()', function (get, set) {
  equal(get(objA, 'foo'), 'FOO', 'should get FOO from A');
  equal(get(objB, 'foo'), undefined, 'should get undefined from B');

  set(objA, 'foo', 'BIFF');
  equal(get(objA, 'foo'), 'computed BIFF', 'should change A');
  equal(get(objB, 'foo'), undefined, 'should NOT change B');

  set(objB, 'foo', 'bar');
  equal(get(objB, 'foo'), 'bar', 'should change B');
  equal(get(objA, 'foo'), 'computed BIFF', 'should NOT change A');

  set(objA, 'foo', 'BAZ');
  equal(get(objA, 'foo'), 'computed BAZ', 'should change A');
  equal(get(objB, 'foo'), 'bar', 'should NOT change B');
});

QUnit.module('redefining computed property to another property', {
  setup: function setup() {
    objA = { __foo: 'FOO' };
    (0, _emberMetalProperties.defineProperty)(objA, 'foo', (0, _emberMetalComputed.computed)({
      get: function get(key) {
        return this['__' + key];
      },
      set: function set(key, value) {
        this['__' + key] = 'A ' + value;
        return this['__' + key];
      }
    }));

    objB = Object.create(objA);
    objB.__foo = 'FOO';
    (0, _emberMetalProperties.defineProperty)(objB, 'foo', (0, _emberMetalComputed.computed)({
      get: function get(key) {
        return this['__' + key];
      },
      set: function set(key, value) {
        this['__' + key] = 'B ' + value;
        return this['__' + key];
      }
    }));
  },

  teardown: function teardown() {
    objA = objB = null;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('using get() and set()', function (get, set) {
  equal(get(objA, 'foo'), 'FOO', 'should get FOO from A');
  equal(get(objB, 'foo'), 'FOO', 'should get FOO from B');

  set(objA, 'foo', 'BIFF');
  equal(get(objA, 'foo'), 'A BIFF', 'should change A');
  equal(get(objB, 'foo'), 'FOO', 'should NOT change B');

  set(objB, 'foo', 'bar');
  equal(get(objB, 'foo'), 'B bar', 'should change B');
  equal(get(objA, 'foo'), 'A BIFF', 'should NOT change A');

  set(objA, 'foo', 'BAZ');
  equal(get(objA, 'foo'), 'A BAZ', 'should change A');
  equal(get(objB, 'foo'), 'B bar', 'should NOT change B');
});

QUnit.module('computed - metadata');

QUnit.test('can set metadata on a computed property', function () {
  var computedProperty = (0, _emberMetalComputed.computed)(function () {});
  computedProperty.meta({ key: 'keyValue' });

  equal(computedProperty.meta().key, 'keyValue', 'saves passed meta hash to the _meta property');
});

QUnit.test('meta should return an empty hash if no meta is set', function () {
  var computedProperty = (0, _emberMetalComputed.computed)(function () {});
  deepEqual(computedProperty.meta(), {}, 'returned value is an empty hash');
});

// ..........................................................
// CACHEABLE
//

QUnit.module('computed - cacheable', {
  setup: function setup() {
    obj = {};
    count = 0;
    var func = function func(key, value) {
      count++;
      return 'bar ' + count;
    };
    (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({ get: func, set: func }));
  },

  teardown: function teardown() {
    obj = count = null;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('cacheable should cache', function (get, set) {
  equal(get(obj, 'foo'), 'bar 1', 'first get');
  equal(get(obj, 'foo'), 'bar 1', 'second get');
  equal(count, 1, 'should only invoke once');
});

(0, _emberMetalTestsProps_helper.testBoth)('modifying a cacheable property should update cache', function (get, set) {
  equal(get(obj, 'foo'), 'bar 1', 'first get');
  equal(get(obj, 'foo'), 'bar 1', 'second get');

  equal(set(obj, 'foo', 'baz'), 'baz', 'setting');
  equal(get(obj, 'foo'), 'bar 2', 'third get');
  equal(count, 2, 'should not invoke again');
});

(0, _emberMetalTestsProps_helper.testBoth)('inherited property should not pick up cache', function (get, set) {
  var objB = Object.create(obj);

  equal(get(obj, 'foo'), 'bar 1', 'obj first get');
  equal(get(objB, 'foo'), 'bar 2', 'objB first get');

  equal(get(obj, 'foo'), 'bar 1', 'obj second get');
  equal(get(objB, 'foo'), 'bar 2', 'objB second get');

  set(obj, 'foo', 'baz'); // modify A
  equal(get(obj, 'foo'), 'bar 3', 'obj third get');
  equal(get(objB, 'foo'), 'bar 2', 'objB third get');
});

(0, _emberMetalTestsProps_helper.testBoth)('cacheFor should return the cached value', function (get, set) {
  equal((0, _emberMetalComputed.cacheFor)(obj, 'foo'), undefined, 'should not yet be a cached value');

  get(obj, 'foo');

  equal((0, _emberMetalComputed.cacheFor)(obj, 'foo'), 'bar 1', 'should retrieve cached value');
});

(0, _emberMetalTestsProps_helper.testBoth)('cacheFor should return falsy cached values', function (get, set) {

  (0, _emberMetalProperties.defineProperty)(obj, 'falsy', (0, _emberMetalComputed.computed)(function () {
    return false;
  }));

  equal((0, _emberMetalComputed.cacheFor)(obj, 'falsy'), undefined, 'should not yet be a cached value');

  get(obj, 'falsy');

  equal((0, _emberMetalComputed.cacheFor)(obj, 'falsy'), false, 'should retrieve cached value');
});

(0, _emberMetalTestsProps_helper.testBoth)('setting a cached computed property passes the old value as the third argument', function (get, set) {
  var obj = {
    foo: 0
  };

  var receivedOldValue;

  (0, _emberMetalProperties.defineProperty)(obj, 'plusOne', (0, _emberMetalComputed.computed)({
    get: function get() {},
    set: function set(key, value, oldValue) {
      receivedOldValue = oldValue;
      return value;
    } }).property('foo'));

  set(obj, 'plusOne', 1);
  strictEqual(receivedOldValue, undefined, 'oldValue should be undefined');

  set(obj, 'plusOne', 2);
  strictEqual(receivedOldValue, 1, 'oldValue should be 1');

  set(obj, 'plusOne', 3);
  strictEqual(receivedOldValue, 2, 'oldValue should be 2');
});

// ..........................................................
// DEPENDENT KEYS
//

QUnit.module('computed - dependentkey', {
  setup: function setup() {
    obj = { bar: 'baz' };
    count = 0;
    var getterAndSetter = function getterAndSetter(key, value) {
      count++;
      get(this, 'bar');
      return 'bar ' + count;
    };
    (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
      get: getterAndSetter,
      set: getterAndSetter
    }).property('bar'));
  },

  teardown: function teardown() {
    obj = count = null;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('should lazily watch dependent keys on set', function (get, set) {
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'precond not watching dependent key');
  set(obj, 'foo', 'bar');
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), true, 'lazily watching dependent key');
});

(0, _emberMetalTestsProps_helper.testBoth)('should lazily watch dependent keys on get', function (get, set) {
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'precond not watching dependent key');
  get(obj, 'foo');
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), true, 'lazily watching dependent key');
});

(0, _emberMetalTestsProps_helper.testBoth)('local dependent key should invalidate cache', function (get, set) {
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'precond not watching dependent key');
  equal(get(obj, 'foo'), 'bar 1', 'get once');
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), true, 'lazily setup watching dependent key');
  equal(get(obj, 'foo'), 'bar 1', 'cached retrieve');

  set(obj, 'bar', 'BIFF'); // should invalidate foo

  equal(get(obj, 'foo'), 'bar 2', 'should recache');
  equal(get(obj, 'foo'), 'bar 2', 'cached retrieve');
});

(0, _emberMetalTestsProps_helper.testBoth)('should invalidate multiple nested dependent keys', function (get, set) {
  var count = 0;
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)(function () {
    count++;
    get(this, 'baz');
    return 'baz ' + count;
  }).property('baz'));

  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'precond not watching dependent key');
  equal((0, _emberMetalWatching.isWatching)(obj, 'baz'), false, 'precond not watching dependent key');
  equal(get(obj, 'foo'), 'bar 1', 'get once');
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), true, 'lazily setup watching dependent key');
  equal((0, _emberMetalWatching.isWatching)(obj, 'baz'), true, 'lazily setup watching dependent key');
  equal(get(obj, 'foo'), 'bar 1', 'cached retrieve');

  set(obj, 'baz', 'BIFF'); // should invalidate bar -> foo
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'should not be watching dependent key after cache cleared');
  equal((0, _emberMetalWatching.isWatching)(obj, 'baz'), false, 'should not be watching dependent key after cache cleared');

  equal(get(obj, 'foo'), 'bar 2', 'should recache');
  equal(get(obj, 'foo'), 'bar 2', 'cached retrieve');
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), true, 'lazily setup watching dependent key');
  equal((0, _emberMetalWatching.isWatching)(obj, 'baz'), true, 'lazily setup watching dependent key');
});

(0, _emberMetalTestsProps_helper.testBoth)('circular keys should not blow up', function (get, set) {
  var func = function func(key, value) {
    count++;
    return 'bar ' + count;
  };
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)({ get: func, set: func }).property('foo'));

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function (key) {
    count++;
    return 'foo ' + count;
  }).property('bar'));

  equal(get(obj, 'foo'), 'foo 1', 'get once');
  equal(get(obj, 'foo'), 'foo 1', 'cached retrieve');

  set(obj, 'bar', 'BIFF'); // should invalidate bar -> foo -> bar

  equal(get(obj, 'foo'), 'foo 3', 'should recache');
  equal(get(obj, 'foo'), 'foo 3', 'cached retrieve');
});

(0, _emberMetalTestsProps_helper.testBoth)('redefining a property should undo old dependent keys', function (get, set) {

  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'precond not watching dependent key');
  equal(get(obj, 'foo'), 'bar 1');
  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), true, 'lazily watching dependent key');

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
    count++;
    return 'baz ' + count;
  }).property('baz'));

  equal((0, _emberMetalWatching.isWatching)(obj, 'bar'), false, 'after redefining should not be watching dependent key');

  equal(get(obj, 'foo'), 'baz 2');

  set(obj, 'bar', 'BIFF'); // should not kill cache
  equal(get(obj, 'foo'), 'baz 2');

  set(obj, 'baz', 'BOP');
  equal(get(obj, 'foo'), 'baz 3');
});

(0, _emberMetalTestsProps_helper.testBoth)('can watch multiple dependent keys specified declaratively via brace expansion', function (get, set) {
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function (key) {
    count++;
    return 'foo ' + count;
  }).property('qux.{bar,baz}'));

  equal(get(obj, 'foo'), 'foo 1', 'get once');
  equal(get(obj, 'foo'), 'foo 1', 'cached retrieve');

  set(obj, 'qux', {});
  set(obj, 'qux.bar', 'bar'); // invalidate foo

  equal(get(obj, 'foo'), 'foo 2', 'foo invalidated from bar');

  set(obj, 'qux.baz', 'baz'); // invalidate foo

  equal(get(obj, 'foo'), 'foo 3', 'foo invalidated from baz');

  set(obj, 'qux.quux', 'quux'); // do not invalidate foo

  equal(get(obj, 'foo'), 'foo 3', 'foo not invalidated by quux');
});

(0, _emberMetalTestsProps_helper.testBoth)('throws assertion if brace expansion notation has spaces', function (get, set) {
  throws(function () {
    (0, _emberMetalProperties.defineProperty)(obj, 'roo', (0, _emberMetalComputed.computed)(function (key) {
      count++;
      return 'roo ' + count;
    }).property('fee.{bar, baz,bop , }'));
  }, /cannot contain spaces/);
});

// ..........................................................
// CHAINED DEPENDENT KEYS
//

var func;
var moduleOpts = {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    lookup = _emberMetalCore2['default'].lookup = {};

    obj = {
      foo: {
        bar: {
          baz: {
            biff: 'BIFF'
          }
        }
      }
    };

    Global = {
      foo: {
        bar: {
          baz: {
            biff: 'BIFF'
          }
        }
      }
    };

    lookup['Global'] = Global;

    count = 0;
    func = function () {
      count++;
      return get(obj, 'foo.bar.baz.biff') + ' ' + count;
    };
  },

  teardown: function teardown() {
    obj = count = func = Global = null;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
};

QUnit.module('computed - dependentkey with chained properties', moduleOpts);

(0, _emberMetalTestsProps_helper.testBoth)('depending on simple chain', function (get, set) {

  // assign computed property
  (0, _emberMetalProperties.defineProperty)(obj, 'prop', (0, _emberMetalComputed.computed)(func).property('foo.bar.baz.biff'));

  equal(get(obj, 'prop'), 'BIFF 1');

  set(get(obj, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 2');
  equal(get(obj, 'prop'), 'BUZZ 2');

  set(get(obj, 'foo.bar'), 'baz', { biff: 'BLOB' });
  equal(get(obj, 'prop'), 'BLOB 3');
  equal(get(obj, 'prop'), 'BLOB 3');

  set(get(obj, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 4');
  equal(get(obj, 'prop'), 'BUZZ 4');

  set(get(obj, 'foo'), 'bar', { baz: { biff: 'BOOM' } });
  equal(get(obj, 'prop'), 'BOOM 5');
  equal(get(obj, 'prop'), 'BOOM 5');

  set(get(obj, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 6');
  equal(get(obj, 'prop'), 'BUZZ 6');

  set(obj, 'foo', { bar: { baz: { biff: 'BLARG' } } });
  equal(get(obj, 'prop'), 'BLARG 7');
  equal(get(obj, 'prop'), 'BLARG 7');

  set(get(obj, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 8');
  equal(get(obj, 'prop'), 'BUZZ 8');

  (0, _emberMetalProperties.defineProperty)(obj, 'prop');
  set(obj, 'prop', 'NONE');
  equal(get(obj, 'prop'), 'NONE');

  set(obj, 'foo', { bar: { baz: { biff: 'BLARG' } } });
  equal(get(obj, 'prop'), 'NONE'); // should do nothing
  equal(count, 8, 'should be not have invoked computed again');
});

(0, _emberMetalTestsProps_helper.testBoth)('depending on Global chain', function (get, set) {

  // assign computed property
  (0, _emberMetalProperties.defineProperty)(obj, 'prop', (0, _emberMetalComputed.computed)(function () {
    count++;
    return get('Global.foo.bar.baz.biff') + ' ' + count;
  }).property('Global.foo.bar.baz.biff'));

  equal(get(obj, 'prop'), 'BIFF 1');

  set(get(Global, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 2');
  equal(get(obj, 'prop'), 'BUZZ 2');

  set(get(Global, 'foo.bar'), 'baz', { biff: 'BLOB' });
  equal(get(obj, 'prop'), 'BLOB 3');
  equal(get(obj, 'prop'), 'BLOB 3');

  set(get(Global, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 4');
  equal(get(obj, 'prop'), 'BUZZ 4');

  set(get(Global, 'foo'), 'bar', { baz: { biff: 'BOOM' } });
  equal(get(obj, 'prop'), 'BOOM 5');
  equal(get(obj, 'prop'), 'BOOM 5');

  set(get(Global, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 6');
  equal(get(obj, 'prop'), 'BUZZ 6');

  set(Global, 'foo', { bar: { baz: { biff: 'BLARG' } } });
  equal(get(obj, 'prop'), 'BLARG 7');
  equal(get(obj, 'prop'), 'BLARG 7');

  set(get(Global, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(get(obj, 'prop'), 'BUZZ 8');
  equal(get(obj, 'prop'), 'BUZZ 8');

  (0, _emberMetalProperties.defineProperty)(obj, 'prop');
  set(obj, 'prop', 'NONE');
  equal(get(obj, 'prop'), 'NONE');

  set(Global, 'foo', { bar: { baz: { biff: 'BLARG' } } });
  equal(get(obj, 'prop'), 'NONE'); // should do nothing
  equal(count, 8, 'should be not have invoked computed again');
});

(0, _emberMetalTestsProps_helper.testBoth)('chained dependent keys should evaluate computed properties lazily', function (get, set) {
  (0, _emberMetalProperties.defineProperty)(obj.foo.bar, 'b', (0, _emberMetalComputed.computed)(func));
  (0, _emberMetalProperties.defineProperty)(obj.foo, 'c', (0, _emberMetalComputed.computed)(function () {}).property('bar.b'));
  equal(count, 0, 'b should not run');
});

// ..........................................................
// improved-cp-syntax
//

QUnit.module('computed - improved cp syntax');

QUnit.test('setter and getters are passed using an object', function () {
  var testObj = _emberMetalCore2['default'].Object.extend({
    a: '1',
    b: '2',
    aInt: (0, _emberMetalComputed.computed)('a', {
      get: function get(keyName) {
        equal(keyName, 'aInt', 'getter receives the keyName');
        return parseInt(this.get('a'));
      },
      set: function set(keyName, value, oldValue) {
        equal(keyName, 'aInt', 'setter receives the keyName');
        equal(value, 123, 'setter receives the new value');
        equal(oldValue, 1, 'setter receives the old value');
        this.set('a', '' + value); // side effect
        return parseInt(this.get('a'));
      }
    })
  }).create();

  ok(testObj.get('aInt') === 1, 'getter works');
  testObj.set('aInt', 123);
  ok(testObj.get('a') === '123', 'setter works');
  ok(testObj.get('aInt') === 123, 'cp has been updated too');
});

QUnit.test('setter can be omited', function () {
  var testObj = _emberMetalCore2['default'].Object.extend({
    a: '1',
    b: '2',
    aInt: (0, _emberMetalComputed.computed)('a', {
      get: function get(keyName) {
        equal(keyName, 'aInt', 'getter receives the keyName');
        return parseInt(this.get('a'));
      }
    })
  }).create();

  ok(testObj.get('aInt') === 1, 'getter works');
  ok(testObj.get('a') === '1');
  testObj.set('aInt', '123');
  ok(testObj.get('aInt') === '123', 'cp has been updated too');
});

QUnit.test('the return value of the setter gets cached', function () {
  var testObj = _emberMetalCore2['default'].Object.extend({
    a: '1',
    sampleCP: (0, _emberMetalComputed.computed)('a', {
      get: function get(keyName) {
        ok(false, 'The getter should not be invoked');
        return 'get-value';
      },
      set: function set(keyName, value, oldValue) {
        return 'set-value';
      }
    })
  }).create();

  testObj.set('sampleCP', 'abcd');
  ok(testObj.get('sampleCP') === 'set-value', 'The return value of the CP was cached');
});

// ..........................................................
// BUGS
//

QUnit.module('computed edge cases');

QUnit.test('adding a computed property should show up in key iteration', function () {

  var obj = {};
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {}));

  var found = [];
  for (var key in obj) {
    found.push(key);
  }
  ok(found.indexOf('foo') >= 0, 'should find computed property in iteration found=' + found);
  ok('foo' in obj, 'foo in obj should pass');
});

(0, _emberMetalTestsProps_helper.testBoth)('when setting a value after it had been retrieved empty don\'t pass function UNDEFINED as oldValue', function (get, set) {
  var obj = {};
  var oldValueIsNoFunction = true;

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
    get: function get() {},
    set: function set(key, value, oldValue) {
      if (typeof oldValue === 'function') {
        oldValueIsNoFunction = false;
      }
      return undefined;
    }
  }));

  get(obj, 'foo');
  set(obj, 'foo', undefined);

  ok(oldValueIsNoFunction);
});

QUnit.module('computed - setter');

(0, _emberMetalTestsProps_helper.testBoth)('setting a watched computed property', function (_get, _set) {
  var obj = {
    firstName: 'Yehuda',
    lastName: 'Katz'
  };
  (0, _emberMetalProperties.defineProperty)(obj, 'fullName', (0, _emberMetalComputed.computed)({
    get: function get() {
      return _get(this, 'firstName') + ' ' + _get(this, 'lastName');
    },
    set: function set(key, value) {
      var values = value.split(' ');
      _set(this, 'firstName', values[0]);
      _set(this, 'lastName', values[1]);
      return value;
    }
  }).property('firstName', 'lastName'));
  var fullNameWillChange = 0;
  var fullNameDidChange = 0;
  var firstNameWillChange = 0;
  var firstNameDidChange = 0;
  var lastNameWillChange = 0;
  var lastNameDidChange = 0;
  (0, _emberMetalObserver.addBeforeObserver)(obj, 'fullName', function () {
    fullNameWillChange++;
  });
  (0, _emberMetalObserver.addObserver)(obj, 'fullName', function () {
    fullNameDidChange++;
  });
  (0, _emberMetalObserver.addBeforeObserver)(obj, 'firstName', function () {
    firstNameWillChange++;
  });
  (0, _emberMetalObserver.addObserver)(obj, 'firstName', function () {
    firstNameDidChange++;
  });
  (0, _emberMetalObserver.addBeforeObserver)(obj, 'lastName', function () {
    lastNameWillChange++;
  });
  (0, _emberMetalObserver.addObserver)(obj, 'lastName', function () {
    lastNameDidChange++;
  });

  equal(_get(obj, 'fullName'), 'Yehuda Katz');

  _set(obj, 'fullName', 'Yehuda Katz');

  _set(obj, 'fullName', 'Kris Selden');

  equal(_get(obj, 'fullName'), 'Kris Selden');
  equal(_get(obj, 'firstName'), 'Kris');
  equal(_get(obj, 'lastName'), 'Selden');

  equal(fullNameWillChange, 1);
  equal(fullNameDidChange, 1);
  equal(firstNameWillChange, 1);
  equal(firstNameDidChange, 1);
  equal(lastNameWillChange, 1);
  equal(lastNameDidChange, 1);
});

(0, _emberMetalTestsProps_helper.testBoth)('setting a cached computed property that modifies the value you give it', function (_get2, _set2) {
  var obj = {
    foo: 0
  };
  (0, _emberMetalProperties.defineProperty)(obj, 'plusOne', (0, _emberMetalComputed.computed)({
    get: function get(key) {
      return _get2(this, 'foo') + 1;
    },
    set: function set(key, value) {
      _set2(this, 'foo', value);
      return value + 1;
    }
  }).property('foo'));
  var plusOneWillChange = 0;
  var plusOneDidChange = 0;
  (0, _emberMetalObserver.addBeforeObserver)(obj, 'plusOne', function () {
    plusOneWillChange++;
  });
  (0, _emberMetalObserver.addObserver)(obj, 'plusOne', function () {
    plusOneDidChange++;
  });

  equal(_get2(obj, 'plusOne'), 1);
  _set2(obj, 'plusOne', 1);
  equal(_get2(obj, 'plusOne'), 2);
  _set2(obj, 'plusOne', 1);
  equal(_get2(obj, 'plusOne'), 2);

  equal(plusOneWillChange, 1);
  equal(plusOneDidChange, 1);

  _set2(obj, 'foo', 5);
  equal(_get2(obj, 'plusOne'), 6);

  equal(plusOneWillChange, 2);
  equal(plusOneDidChange, 2);
});

QUnit.module('computed - default setter');

(0, _emberMetalTestsProps_helper.testBoth)('when setting a value on a computed property that doesn\'t handle sets', function (get, set) {
  var obj = {};
  var observerFired = false;

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
    return 'foo';
  }));

  (0, _emberMetalObserver.addObserver)(obj, 'foo', null, function () {
    observerFired = true;
  });

  set(obj, 'foo', 'bar');

  equal(get(obj, 'foo'), 'bar', 'The set value is properly returned');
  ok(typeof obj.foo === 'string', 'The computed property was removed');
  ok(observerFired, 'The observer was still notified');
});

QUnit.module('computed - readOnly');

QUnit.test('is chainable', function () {
  var cp = (0, _emberMetalComputed.computed)(function () {}).readOnly();

  ok(cp instanceof _emberMetalProperties.Descriptor);
  ok(cp instanceof _emberMetalComputed.ComputedProperty);
});

QUnit.test('throws assertion if called over a CP with a setter defined with the new syntax', function () {
  expectAssertion(function () {
    (0, _emberMetalComputed.computed)({
      get: function get() {},
      set: function set() {}
    }).readOnly();
  }, /Computed properties that define a setter using the new syntax cannot be read-only/);
});

(0, _emberMetalTestsProps_helper.testBoth)('protects against setting', function (get, set) {
  var obj = {};

  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)(function (key) {
    return 'barValue';
  }).readOnly());

  equal(get(obj, 'bar'), 'barValue');

  throws(function () {
    set(obj, 'bar', 'newBar');
  }, /Cannot set read\-only property "bar" on object:/);

  equal(get(obj, 'bar'), 'barValue');
});