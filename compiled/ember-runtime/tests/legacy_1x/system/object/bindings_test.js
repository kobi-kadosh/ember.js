'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalWatching = require('ember-metal/watching');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * changed Ember.Bending.flushPendingChanges() -> run.sync();
  * changes obj.set() and obj.get() to Ember.set() and Ember.get()
  * Fixed an actual bug in unit tests around line 133
  * fixed 'bindings should disconnect on destroy' test to use destroy.
*/

// ========================================================================
// EmberObject bindings Tests
// ========================================================================

var testObject, fromObject, extraObject, TestObject;
var TestNamespace, originalLookup, lookup;

var bindModuleOpts = {

  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    testObject = _emberRuntimeSystemObject2['default'].create({
      foo: 'bar',
      bar: 'foo',
      extraObject: null
    });

    fromObject = _emberRuntimeSystemObject2['default'].create({
      bar: 'foo',
      extraObject: null
    });

    extraObject = _emberRuntimeSystemObject2['default'].create({
      foo: 'extraObjectValue'
    });

    lookup['TestNamespace'] = TestNamespace = {
      fromObject: fromObject,
      testObject: testObject
    };
  },

  teardown: function teardown() {
    testObject = fromObject = extraObject = null;
    _emberMetalCore2['default'].lookup = originalLookup;
  }

};

QUnit.module('bind() method', bindModuleOpts);

QUnit.test('bind(TestNamespace.fromObject.bar) should follow absolute path', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    // create binding
    testObject.bind('foo', 'TestNamespace.fromObject.bar');

    // now make a change to see if the binding triggers.
    (0, _emberMetalProperty_set.set)(fromObject, 'bar', 'changedValue');
  });

  equal('changedValue', (0, _emberMetalProperty_get.get)(testObject, 'foo'), 'testObject.foo');
});

QUnit.test('bind(.bar) should bind to relative path', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    // create binding
    testObject.bind('foo', 'bar');

    // now make a change to see if the binding triggers.
    (0, _emberMetalProperty_set.set)(testObject, 'bar', 'changedValue');
  });

  equal('changedValue', (0, _emberMetalProperty_get.get)(testObject, 'foo'), 'testObject.foo');
});

var fooBindingModuleOpts = {

  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    TestObject = _emberRuntimeSystemObject2['default'].extend({
      foo: 'bar',
      bar: 'foo',
      extraObject: null
    });

    fromObject = _emberRuntimeSystemObject2['default'].create({
      bar: 'foo',
      extraObject: null
    });

    extraObject = _emberRuntimeSystemObject2['default'].create({
      foo: 'extraObjectValue'
    });

    lookup['TestNamespace'] = TestNamespace = {
      fromObject: fromObject,
      testObject: TestObject
    };
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
    TestObject = fromObject = extraObject = null;
    //  delete TestNamespace;
  }

};

QUnit.module('fooBinding method', fooBindingModuleOpts);

QUnit.test('fooBinding: TestNamespace.fromObject.bar should follow absolute path', function () {
  // create binding
  (0, _emberMetalRun_loop2['default'])(function () {
    testObject = TestObject.extend({
      fooBinding: 'TestNamespace.fromObject.bar'
    }).create();

    // now make a change to see if the binding triggers.
    (0, _emberMetalProperty_set.set)(fromObject, 'bar', 'changedValue');
  });

  equal('changedValue', (0, _emberMetalProperty_get.get)(testObject, 'foo'), 'testObject.foo');
});

QUnit.test('fooBinding: .bar should bind to relative path', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    testObject = TestObject.extend({
      fooBinding: 'bar'
    }).create();
    // now make a change to see if the binding triggers.
    (0, _emberMetalProperty_set.set)(testObject, 'bar', 'changedValue');
  });

  equal('changedValue', (0, _emberMetalProperty_get.get)(testObject, 'foo'), 'testObject.foo');
});

QUnit.test('fooBinding: should disconnect bindings when destroyed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    testObject = TestObject.extend({
      fooBinding: 'TestNamespace.fromObject.bar'
    }).create();

    (0, _emberMetalProperty_set.set)(TestNamespace.fromObject, 'bar', 'BAZ');
  });

  equal((0, _emberMetalProperty_get.get)(testObject, 'foo'), 'BAZ', 'binding should have synced');

  (0, _emberMetalWatching.destroy)(testObject);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(TestNamespace.fromObject, 'bar', 'BIFF');
  });

  ok((0, _emberMetalProperty_get.get)(testObject, 'foo') !== 'bar', 'binding should not have synced');
});