'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalEvents = require('ember-metal/events');

var _emberMetalWatching = require('ember-metal/watching');

var willCount, didCount, willKeys, didKeys, originalLookup, lookup, Global;

QUnit.module('watch', {
  setup: function setup() {
    willCount = didCount = 0;
    willKeys = [];
    didKeys = [];

    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

function addListeners(obj, keyPath) {
  (0, _emberMetalEvents.addListener)(obj, keyPath + ':before', function () {
    willCount++;
    willKeys.push(keyPath);
  });
  (0, _emberMetalEvents.addListener)(obj, keyPath + ':change', function () {
    didCount++;
    didKeys.push(keyPath);
  });
}

(0, _emberMetalTestsProps_helper.testBoth)('watching a computed property', function (get, set) {
  var obj = {};
  _emberMetalCore2['default'].defineProperty(obj, 'foo', _emberMetalCore2['default'].computed({
    get: function get() {
      return this.__foo;
    },
    set: function set(keyName, value) {
      if (value !== undefined) {
        this.__foo = value;
      }
      return this.__foo;
    }
  }));
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');
  set(obj, 'foo', 'bar');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');
});

(0, _emberMetalTestsProps_helper.testBoth)('watching a regular defined property', function (get, set) {
  var obj = { foo: 'baz' };
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');
  equal(get(obj, 'foo'), 'baz', 'should have original prop');

  set(obj, 'foo', 'bar');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  equal(get(obj, 'foo'), 'bar', 'should get new value');
  equal(obj.foo, 'bar', 'property should be accessible on obj');
});

(0, _emberMetalTestsProps_helper.testBoth)('watching a regular undefined property', function (get, set) {
  var obj = {};
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');

  equal('foo' in obj, false, 'precond undefined');

  set(obj, 'foo', 'bar');

  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  equal(get(obj, 'foo'), 'bar', 'should get new value');
  equal(obj.foo, 'bar', 'property should be accessible on obj');
});

(0, _emberMetalTestsProps_helper.testBoth)('watches should inherit', function (get, set) {
  var obj = { foo: 'baz' };
  var objB = Object.create(obj);

  addListeners(obj, 'foo');
  (0, _emberMetalWatching.watch)(obj, 'foo');
  equal(get(obj, 'foo'), 'baz', 'should have original prop');

  set(obj, 'foo', 'bar');
  set(objB, 'foo', 'baz');
  equal(willCount, 2, 'should have invoked willCount once only');
  equal(didCount, 2, 'should have invoked didCount once only');
});

QUnit.test('watching an object THEN defining it should work also', function () {
  var obj = {};
  addListeners(obj, 'foo');

  (0, _emberMetalWatching.watch)(obj, 'foo');

  _emberMetalCore2['default'].defineProperty(obj, 'foo');
  _emberMetalCore2['default'].set(obj, 'foo', 'bar');

  equal(_emberMetalCore2['default'].get(obj, 'foo'), 'bar', 'should have set');
  equal(willCount, 1, 'should have invoked willChange once');
  equal(didCount, 1, 'should have invoked didChange once');
});

QUnit.test('watching a chain then defining the property', function () {
  var obj = {};
  var foo = { bar: 'bar' };
  addListeners(obj, 'foo.bar');
  addListeners(foo, 'bar');

  (0, _emberMetalWatching.watch)(obj, 'foo.bar');

  _emberMetalCore2['default'].defineProperty(obj, 'foo', undefined, foo);
  _emberMetalCore2['default'].set(foo, 'bar', 'baz');

  deepEqual(willKeys, ['foo.bar', 'bar'], 'should have invoked willChange with bar, foo.bar');
  deepEqual(didKeys, ['foo.bar', 'bar'], 'should have invoked didChange with bar, foo.bar');
  equal(willCount, 2, 'should have invoked willChange twice');
  equal(didCount, 2, 'should have invoked didChange twice');
});

QUnit.test('watching a chain then defining the nested property', function () {
  var bar = {};
  var obj = { foo: bar };
  var baz = { baz: 'baz' };
  addListeners(obj, 'foo.bar.baz');
  addListeners(baz, 'baz');

  (0, _emberMetalWatching.watch)(obj, 'foo.bar.baz');

  _emberMetalCore2['default'].defineProperty(bar, 'bar', undefined, baz);
  _emberMetalCore2['default'].set(baz, 'baz', 'BOO');

  deepEqual(willKeys, ['foo.bar.baz', 'baz'], 'should have invoked willChange with bar, foo.bar');
  deepEqual(didKeys, ['foo.bar.baz', 'baz'], 'should have invoked didChange with bar, foo.bar');
  equal(willCount, 2, 'should have invoked willChange twice');
  equal(didCount, 2, 'should have invoked didChange twice');
});

(0, _emberMetalTestsProps_helper.testBoth)('watching an object value then unwatching should restore old value', function (get, set) {
  var obj = { foo: { bar: { baz: { biff: 'BIFF' } } } };
  addListeners(obj, 'foo.bar.baz.biff');

  (0, _emberMetalWatching.watch)(obj, 'foo.bar.baz.biff');

  var foo = _emberMetalCore2['default'].get(obj, 'foo');
  equal(get(get(get(foo, 'bar'), 'baz'), 'biff'), 'BIFF', 'biff should exist');

  (0, _emberMetalWatching.unwatch)(obj, 'foo.bar.baz.biff');
  equal(get(get(get(foo, 'bar'), 'baz'), 'biff'), 'BIFF', 'biff should exist');
});

(0, _emberMetalTestsProps_helper.testBoth)('watching a global object that does not yet exist should queue', function (get, set) {
  lookup['Global'] = Global = null;

  var obj = {};
  addListeners(obj, 'Global.foo');

  (0, _emberMetalWatching.watch)(obj, 'Global.foo'); // only works on global chained props

  equal(willCount, 0, 'should not have fired yet');
  equal(didCount, 0, 'should not have fired yet');

  lookup['Global'] = Global = { foo: 'bar' };
  addListeners(Global, 'foo');

  _emberMetalWatching.watch.flushPending(); // this will also be invoked automatically on ready

  equal(willCount, 0, 'should not have fired yet');
  equal(didCount, 0, 'should not have fired yet');

  set(Global, 'foo', 'baz');

  // should fire twice because this is a chained property (once on key, once
  // on path)
  equal(willCount, 2, 'should be watching');
  equal(didCount, 2, 'should be watching');

  lookup['Global'] = Global = null; // reset
});

QUnit.test('when watching a global object, destroy should remove chain watchers from the global object', function () {
  lookup['Global'] = Global = { foo: 'bar' };
  var obj = {};
  addListeners(obj, 'Global.foo');

  (0, _emberMetalWatching.watch)(obj, 'Global.foo');

  var meta_Global = _emberMetalCore2['default'].meta(Global);
  var chainNode = _emberMetalCore2['default'].meta(obj).chains._chains.Global._chains.foo;
  var index = meta_Global.chainWatchers.foo.indexOf(chainNode);

  equal(meta_Global.watching.foo, 1, 'should be watching foo');
  strictEqual(meta_Global.chainWatchers.foo[index], chainNode, 'should have chain watcher');

  (0, _emberMetalWatching.destroy)(obj);

  index = meta_Global.chainWatchers.foo.indexOf(chainNode);
  equal(meta_Global.watching.foo, 0, 'should not be watching foo');
  equal(index, -1, 'should not have chain watcher');

  lookup['Global'] = Global = null; // reset
});

QUnit.test('when watching another object, destroy should remove chain watchers from the other object', function () {
  var objA = {};
  var objB = { foo: 'bar' };
  objA.b = objB;
  addListeners(objA, 'b.foo');

  (0, _emberMetalWatching.watch)(objA, 'b.foo');

  var meta_objB = _emberMetalCore2['default'].meta(objB);
  var chainNode = _emberMetalCore2['default'].meta(objA).chains._chains.b._chains.foo;
  var index = meta_objB.chainWatchers.foo.indexOf(chainNode);

  equal(meta_objB.watching.foo, 1, 'should be watching foo');
  strictEqual(meta_objB.chainWatchers.foo[index], chainNode, 'should have chain watcher');

  (0, _emberMetalWatching.destroy)(objA);

  index = meta_objB.chainWatchers.foo.indexOf(chainNode);
  equal(meta_objB.watching.foo, 0, 'should not be watching foo');
  equal(index, -1, 'should not have chain watcher');
});

// TESTS for length property

(0, _emberMetalTestsProps_helper.testBoth)('watching "length" property on an object', function (get, set) {
  var obj = { length: '26.2 miles' };
  addListeners(obj, 'length');

  (0, _emberMetalWatching.watch)(obj, 'length');
  equal(get(obj, 'length'), '26.2 miles', 'should have original prop');

  set(obj, 'length', '10k');
  equal(willCount, 1, 'should have invoked willCount');
  equal(didCount, 1, 'should have invoked didCount');

  equal(get(obj, 'length'), '10k', 'should get new value');
  equal(obj.length, '10k', 'property should be accessible on obj');
});

(0, _emberMetalTestsProps_helper.testBoth)('watching "length" property on an array', function (get, set) {
  var arr = [];
  addListeners(arr, 'length');

  (0, _emberMetalWatching.watch)(arr, 'length');
  equal(get(arr, 'length'), 0, 'should have original prop');

  set(arr, 'length', '10');
  equal(willCount, 0, 'should NOT have invoked willCount');
  equal(didCount, 0, 'should NOT have invoked didCount');

  equal(get(arr, 'length'), 10, 'should get new value');
  equal(arr.length, 10, 'property should be accessible on arr');
});