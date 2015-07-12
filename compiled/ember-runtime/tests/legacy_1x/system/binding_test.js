'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalBinding = require('ember-metal/binding');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * All calls to run.sync() were changed to
    run.sync()

  * Bindings no longer accept a root object as their second param.  Instead
    our test binding objects were put under a single object they could
    originate from.

  * tests that inspected internal properties were removed.

  * converted foo.get/foo.set to use get/Ember.set

  * Removed tests for Binding.isConnected.  Since binding instances are now
    shared this property no longer makes sense.

  * Changed call calls for obj.bind(...) to bind(obj, ...);

  * Changed all calls to sc_super() to this._super.apply(this, arguments)

  * Changed all calls to disconnect() to pass the root object.

  * removed calls to Binding.destroy() as that method is no longer useful
    (or defined)

  * changed use of T_STRING to 'string'
*/

// ========================================================================
// Binding Tests
// ========================================================================

var TestNamespace, fromObject, toObject, binding, Bon1, bon2, root; // global variables
var originalLookup, lookup;

QUnit.module('basic object binding', {
  setup: function setup() {
    fromObject = _emberRuntimeSystemObject2['default'].create({ value: 'start' });
    toObject = _emberRuntimeSystemObject2['default'].create({ value: 'end' });
    root = { fromObject: fromObject, toObject: toObject };
    (0, _emberMetalRun_loop2['default'])(function () {
      binding = (0, _emberMetalBinding.bind)(root, 'toObject.value', 'fromObject.value');
    });
  }
});

QUnit.test('binding should have synced on connect', function () {
  equal((0, _emberMetalProperty_get.get)(toObject, 'value'), 'start', 'toObject.value should match fromObject.value');
});

QUnit.test('fromObject change should propagate to toObject only after flush', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(fromObject, 'value', 'change');
    equal((0, _emberMetalProperty_get.get)(toObject, 'value'), 'start');
  });
  equal((0, _emberMetalProperty_get.get)(toObject, 'value'), 'change');
});

QUnit.test('toObject change should propagate to fromObject only after flush', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(toObject, 'value', 'change');
    equal((0, _emberMetalProperty_get.get)(fromObject, 'value'), 'start');
  });
  equal((0, _emberMetalProperty_get.get)(fromObject, 'value'), 'change');
});

QUnit.test('deferred observing during bindings', function () {

  // setup special binding
  fromObject = _emberRuntimeSystemObject2['default'].create({
    value1: 'value1',
    value2: 'value2'
  });

  toObject = _emberRuntimeSystemObject2['default'].extend({
    observer: (0, _emberMetalMixin.observer)('value1', 'value2', function () {
      equal((0, _emberMetalProperty_get.get)(this, 'value1'), 'CHANGED', 'value1 when observer fires');
      equal((0, _emberMetalProperty_get.get)(this, 'value2'), 'CHANGED', 'value2 when observer fires');
      this.callCount++;
    })
  }).create({
    value1: 'value1',
    value2: 'value2',

    callCount: 0
  });

  var root = { fromObject: fromObject, toObject: toObject };
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalBinding.bind)(root, 'toObject.value1', 'fromObject.value1');
    (0, _emberMetalBinding.bind)(root, 'toObject.value2', 'fromObject.value2');

    // change both value1 + value2, then  flush bindings.  observer should only
    // fire after bindings are done flushing.
    (0, _emberMetalProperty_set.set)(fromObject, 'value1', 'CHANGED');
    (0, _emberMetalProperty_set.set)(fromObject, 'value2', 'CHANGED');
  });

  equal(toObject.callCount, 2, 'should call observer twice');
});

QUnit.test('binding disconnection actually works', function () {
  binding.disconnect(root);
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(fromObject, 'value', 'change');
  });
  equal((0, _emberMetalProperty_get.get)(toObject, 'value'), 'start');
});

// ..........................................................
// one way binding
//

QUnit.module('one way binding', {

  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      fromObject = _emberRuntimeSystemObject2['default'].create({ value: 'start' });
      toObject = _emberRuntimeSystemObject2['default'].create({ value: 'end' });
      root = { fromObject: fromObject, toObject: toObject };
      binding = (0, _emberMetalBinding.oneWay)(root, 'toObject.value', 'fromObject.value');
    });
  },
  teardown: function teardown() {
    _emberMetalRun_loop2['default'].cancelTimers();
  }
});

QUnit.test('fromObject change should propagate after flush', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(fromObject, 'value', 'change');
    equal((0, _emberMetalProperty_get.get)(toObject, 'value'), 'start');
  });
  equal((0, _emberMetalProperty_get.get)(toObject, 'value'), 'change');
});

QUnit.test('toObject change should NOT propagate', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(toObject, 'value', 'change');
    equal((0, _emberMetalProperty_get.get)(fromObject, 'value'), 'start');
  });
  equal((0, _emberMetalProperty_get.get)(fromObject, 'value'), 'start');
});

var first, second, third, binding1, binding2; // global variables

// ..........................................................
// chained binding
//

QUnit.module('chained binding', {

  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      first = _emberRuntimeSystemObject2['default'].create({ output: 'first' });

      second = _emberRuntimeSystemObject2['default'].extend({
        inputDidChange: (0, _emberMetalMixin.observer)('input', function () {
          (0, _emberMetalProperty_set.set)(this, 'output', (0, _emberMetalProperty_get.get)(this, 'input'));
        })
      }).create({
        input: 'second',
        output: 'second'
      });

      third = _emberRuntimeSystemObject2['default'].create({ input: 'third' });

      root = { first: first, second: second, third: third };
      binding1 = (0, _emberMetalBinding.bind)(root, 'second.input', 'first.output');
      binding2 = (0, _emberMetalBinding.bind)(root, 'second.output', 'third.input');
    });
  },
  teardown: function teardown() {
    _emberMetalRun_loop2['default'].cancelTimers();
  }
});

QUnit.test('changing first output should propagate to third after flush', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(first, 'output', 'change');
    equal('change', (0, _emberMetalProperty_get.get)(first, 'output'), 'first.output');
    ok('change' !== (0, _emberMetalProperty_get.get)(third, 'input'), 'third.input');
  });

  equal('change', (0, _emberMetalProperty_get.get)(first, 'output'), 'first.output');
  equal('change', (0, _emberMetalProperty_get.get)(second, 'input'), 'second.input');
  equal('change', (0, _emberMetalProperty_get.get)(second, 'output'), 'second.output');
  equal('change', (0, _emberMetalProperty_get.get)(third, 'input'), 'third.input');
});

// ..........................................................
// Custom Binding
//

QUnit.module('Custom Binding', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    Bon1 = _emberRuntimeSystemObject2['default'].extend({
      value1: 'hi',
      value2: 83,
      array1: []
    });

    bon2 = _emberRuntimeSystemObject2['default'].create({
      val1: 'hello',
      val2: 25,
      arr: [1, 2, 3, 4]
    });

    _emberMetalCore2['default'].lookup['TestNamespace'] = TestNamespace = {
      bon2: bon2,
      Bon1: Bon1
    };
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
    Bon1 = bon2 = TestNamespace = null;
    _emberMetalRun_loop2['default'].cancelTimers();
  }
});

QUnit.test('two bindings to the same value should sync in the order they are initialized', function () {

  _emberMetalRun_loop2['default'].begin();

  var a = _emberRuntimeSystemObject2['default'].create({
    foo: 'bar'
  });

  var b = _emberRuntimeSystemObject2['default'].extend({
    C: _emberRuntimeSystemObject2['default'].extend({
      foo: 'bee',
      fooBinding: 'owner.foo'
    }),

    init: function init() {
      this._super.apply(this, arguments);
      (0, _emberMetalProperty_set.set)(this, 'c', this.C.create({ owner: this }));
    }
  }).create({
    foo: 'baz',
    fooBinding: 'a.foo',
    a: a
  });

  _emberMetalRun_loop2['default'].end();

  equal((0, _emberMetalProperty_get.get)(a, 'foo'), 'bar', 'a.foo should not change');
  equal((0, _emberMetalProperty_get.get)(b, 'foo'), 'bar', 'a.foo should propagate up to b.foo');
  equal((0, _emberMetalProperty_get.get)(b.c, 'foo'), 'bar', 'a.foo should propagate up to b.c.foo');
});

// ..........................................................
// propertyNameBinding with longhand
//

QUnit.module('propertyNameBinding with longhand', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    _emberMetalCore2['default'].lookup['TestNamespace'] = TestNamespace = {};
    (0, _emberMetalRun_loop2['default'])(function () {
      TestNamespace.fromObject = _emberRuntimeSystemObject2['default'].create({
        value: 'originalValue'
      });

      TestNamespace.toObject = _emberRuntimeSystemObject2['default'].extend({
        valueBinding: _emberMetalBinding.Binding.from('TestNamespace.fromObject.value'),
        relativeBinding: _emberMetalBinding.Binding.from('localValue')
      }).create({
        localValue: 'originalLocal'
      });
    });
  },
  teardown: function teardown() {
    TestNamespace = undefined;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('works with full path', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(TestNamespace.fromObject, 'value', 'updatedValue');
  });

  equal((0, _emberMetalProperty_get.get)(TestNamespace.toObject, 'value'), 'updatedValue');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(TestNamespace.fromObject, 'value', 'newerValue');
  });

  equal((0, _emberMetalProperty_get.get)(TestNamespace.toObject, 'value'), 'newerValue');
});

QUnit.test('works with local path', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(TestNamespace.toObject, 'localValue', 'updatedValue');
  });

  equal((0, _emberMetalProperty_get.get)(TestNamespace.toObject, 'relative'), 'updatedValue');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(TestNamespace.toObject, 'localValue', 'newerValue');
  });

  equal((0, _emberMetalProperty_get.get)(TestNamespace.toObject, 'relative'), 'newerValue');
});