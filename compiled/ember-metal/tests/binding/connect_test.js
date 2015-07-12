'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalBinding = require('ember-metal/binding');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

function performTest(binding, a, b, get, set, connect) {
  if (connect === undefined) {
    connect = function () {
      binding.connect(a);
    };
  }

  ok(!_emberMetalRun_loop2['default'].currentRunLoop, 'performTest should not have a currentRunLoop');

  equal(get(a, 'foo'), 'FOO', 'a should not have changed');
  equal(get(b, 'bar'), 'BAR', 'b should not have changed');

  connect();

  equal(get(a, 'foo'), 'BAR', 'a should have changed');
  equal(get(b, 'bar'), 'BAR', 'b should have changed');
  //
  // make sure changes sync both ways
  (0, _emberMetalRun_loop2['default'])(function () {
    set(b, 'bar', 'BAZZ');
  });
  equal(get(a, 'foo'), 'BAZZ', 'a should have changed');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(a, 'foo', 'BARF');
  });
  equal(get(b, 'bar'), 'BARF', 'a should have changed');
}

var originalLookup, lookup, GlobalB;

QUnit.module('Ember.Binding', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};
  },
  teardown: function teardown() {
    lookup = null;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('Connecting a binding between two properties', function (get, set) {
  var a = { foo: 'FOO', bar: 'BAR' };

  // a.bar -> a.foo
  var binding = new _emberMetalBinding.Binding('foo', 'bar');

  performTest(binding, a, a, get, set);
});

(0, _emberMetalTestsProps_helper.testBoth)('Connecting a binding between two objects', function (get, set) {
  var b = { bar: 'BAR' };
  var a = { foo: 'FOO', b: b };

  // b.bar -> a.foo
  var binding = new _emberMetalBinding.Binding('foo', 'b.bar');

  performTest(binding, a, b, get, set);
});

(0, _emberMetalTestsProps_helper.testBoth)('Connecting a binding to path', function (get, set) {
  var a = { foo: 'FOO' };
  lookup['GlobalB'] = GlobalB = {
    b: { bar: 'BAR' }
  };

  var b = get(GlobalB, 'b');

  // globalB.b.bar -> a.foo
  var binding = new _emberMetalBinding.Binding('foo', 'GlobalB.b.bar');

  performTest(binding, a, b, get, set);

  // make sure modifications update
  b = { bar: 'BIFF' };

  (0, _emberMetalRun_loop2['default'])(function () {
    set(GlobalB, 'b', b);
  });

  equal(get(a, 'foo'), 'BIFF', 'a should have changed');
});

(0, _emberMetalTestsProps_helper.testBoth)('Calling connect more than once', function (get, set) {
  var b = { bar: 'BAR' };
  var a = { foo: 'FOO', b: b };

  // b.bar -> a.foo
  var binding = new _emberMetalBinding.Binding('foo', 'b.bar');

  performTest(binding, a, b, get, set, function () {
    binding.connect(a);

    binding.connect(a);
  });
});

QUnit.test('inherited bindings should sync on create', function () {
  var a;
  (0, _emberMetalRun_loop2['default'])(function () {
    var A = function A() {
      (0, _emberMetalBinding.bind)(this, 'foo', 'bar.baz');
    };

    a = new A();
    (0, _emberMetalProperty_set.set)(a, 'bar', { baz: 'BAZ' });
  });

  equal((0, _emberMetalProperty_get.get)(a, 'foo'), 'BAZ', 'should have synced binding on new obj');
});