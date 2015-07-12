'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * Changed get(obj, ) and set(obj, ) to Ember.get() and Ember.set()
  * Removed obj.instanceOf() and obj.kindOf() tests.  use obj instanceof Foo
    instead
  * Removed respondsTo() and tryToPerform() tests.  Can be brought back in a
    utils package.
  * Removed destroy() test.  You can impl yourself but not built in
  * Changed Class.subclassOf() test to Class.detect()
  * Remove broken test for 'superclass' property.
  * Removed obj.didChangeFor()
*/

// ========================================================================
// EmberObject Base Tests
// ========================================================================

var obj, obj1, don; // global variables
var TestNamespace, originalLookup, lookup;

QUnit.module('A new EmberObject instance', {

  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].create({
      foo: 'bar',
      total: 12345,
      aMethodThatExists: function aMethodThatExists() {},
      aMethodThatReturnsTrue: function aMethodThatReturnsTrue() {
        return true;
      },
      aMethodThatReturnsFoobar: function aMethodThatReturnsFoobar() {
        return 'Foobar';
      },
      aMethodThatReturnsFalse: function aMethodThatReturnsFalse() {
        return false;
      }
    });
  },

  teardown: function teardown() {
    obj = undefined;
  }

});

QUnit.test('Should return its properties when requested using EmberObject#get', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'bar');
  equal((0, _emberMetalProperty_get.get)(obj, 'total'), 12345);
});

QUnit.test('Should allow changing of those properties by calling EmberObject#set', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'bar');
  equal((0, _emberMetalProperty_get.get)(obj, 'total'), 12345);

  (0, _emberMetalProperty_set.set)(obj, 'foo', 'Chunky Bacon');
  (0, _emberMetalProperty_set.set)(obj, 'total', 12);

  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'Chunky Bacon');
  equal((0, _emberMetalProperty_get.get)(obj, 'total'), 12);
});

QUnit.module('EmberObject observers', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    // create a namespace
    lookup['TestNamespace'] = TestNamespace = {
      obj: _emberRuntimeSystemObject2['default'].create({
        value: 'test'
      })
    };

    // create an object
    obj = _emberRuntimeSystemObject2['default'].extend({
      // normal observer
      observer: (0, _emberMetalMixin.observer)('prop1', function () {
        this._normal = true;
      }),

      globalObserver: (0, _emberMetalMixin.observer)('TestNamespace.obj.value', function () {
        this._global = true;
      }),

      bothObserver: (0, _emberMetalMixin.observer)('prop1', 'TestNamespace.obj.value', function () {
        this._both = true;
      })
    }).create({
      prop1: null
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('Local observers work', function () {
  obj._normal = false;
  (0, _emberMetalProperty_set.set)(obj, 'prop1', false);
  equal(obj._normal, true, 'Normal observer did change.');
});

QUnit.test('Global observers work', function () {
  obj._global = false;
  (0, _emberMetalProperty_set.set)(TestNamespace.obj, 'value', 'test2');
  equal(obj._global, true, 'Global observer did change.');
});

QUnit.test('Global+Local observer works', function () {
  obj._both = false;
  (0, _emberMetalProperty_set.set)(obj, 'prop1', false);
  equal(obj._both, true, 'Both observer did change.');
});

QUnit.module('EmberObject superclass and subclasses', {
  setup: function setup() {
    obj = _emberRuntimeSystemObject2['default'].extend({
      method1: function method1() {
        return 'hello';
      }
    });
    obj1 = obj.extend();
    don = obj1.create({
      method2: function method2() {
        return this.superclass();
      }
    });
  },

  teardown: function teardown() {
    obj = undefined;
    obj1 = undefined;
    don = undefined;
  }
});

QUnit.test('Checking the detect() function on an object and its subclass', function () {
  equal(obj.detect(obj1), true);
  equal(obj1.detect(obj), false);
});

QUnit.test('Checking the detectInstance() function on an object and its subclass', function () {
  ok(_emberRuntimeSystemObject2['default'].detectInstance(obj.create()));
  ok(obj.detectInstance(obj.create()));
});