'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalEvents = require('ember-metal/events');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var moduleOptions, originalLookup;

moduleOptions = {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = {};
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
};

QUnit.module('EmberObject.create', moduleOptions);

QUnit.test('simple properties are set', function () {
  var o = _emberRuntimeSystemObject2['default'].create({ ohai: 'there' });
  equal(o.get('ohai'), 'there');
});

QUnit.test('calls computed property setters', function () {
  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalComputed.computed)({
      get: function get() {
        return 'this is not the value you\'re looking for';
      },
      set: function set(key, value) {
        return value;
      }
    })
  });

  var o = MyClass.create({ foo: 'bar' });
  equal(o.get('foo'), 'bar');
});

if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
  QUnit.test('sets up mandatory setters for watched simple properties', function () {

    var MyClass = _emberRuntimeSystemObject2['default'].extend({
      foo: null,
      bar: null,
      fooDidChange: (0, _emberMetalMixin.observer)('foo', function () {})
    });

    var o = MyClass.create({ foo: 'bar', bar: 'baz' });
    equal(o.get('foo'), 'bar');

    // Catch IE8 where Object.getOwnPropertyDescriptor exists but only works on DOM elements
    try {
      Object.getOwnPropertyDescriptor({}, 'foo');
    } catch (e) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(o, 'foo');
    ok(descriptor.set, 'Mandatory setter was setup');

    descriptor = Object.getOwnPropertyDescriptor(o, 'bar');
    ok(!descriptor.set, 'Mandatory setter was not setup');
  });
}

QUnit.test('allows bindings to be defined', function () {
  var obj = _emberRuntimeSystemObject2['default'].create({
    foo: 'foo',
    barBinding: 'foo'
  });

  equal(obj.get('bar'), 'foo', 'The binding value is correct');
});

QUnit.test('calls setUnknownProperty if defined', function () {
  var setUnknownPropertyCalled = false;

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    setUnknownProperty: function setUnknownProperty(key, value) {
      setUnknownPropertyCalled = true;
    }
  });

  MyClass.create({ foo: 'bar' });
  ok(setUnknownPropertyCalled, 'setUnknownProperty was called');
});

QUnit.test('throws if you try to define a computed property', function () {
  expectAssertion(function () {
    _emberRuntimeSystemObject2['default'].create({
      foo: (0, _emberMetalComputed.computed)(function () {})
    });
  }, 'Ember.Object.create no longer supports defining computed properties. Define computed properties using extend() or reopen() before calling create().');
});

QUnit.test('throws if you try to call _super in a method', function () {
  expectAssertion(function () {
    _emberRuntimeSystemObject2['default'].create({
      foo: function foo() {
        this._super.apply(this, arguments);
      }
    });
  }, 'Ember.Object.create no longer supports defining methods that call _super.');
});

QUnit.test('throws if you try to \'mixin\' a definition', function () {
  var myMixin = _emberMetalMixin.Mixin.create({
    adder: function adder(arg1, arg2) {
      return arg1 + arg2;
    }
  });

  expectAssertion(function () {
    _emberRuntimeSystemObject2['default'].create(myMixin);
  }, 'Ember.Object.create no longer supports mixing in other definitions, use .extend & .create seperately instead.');
});

// This test is for IE8.
QUnit.test('property name is the same as own prototype property', function () {
  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    toString: function toString() {
      return 'MyClass';
    }
  });

  equal(MyClass.create().toString(), 'MyClass', 'should inherit property from the arguments of `EmberObject.create`');
});

QUnit.test('inherits properties from passed in EmberObject', function () {
  var baseObj = _emberRuntimeSystemObject2['default'].create({ foo: 'bar' });
  var secondaryObj = _emberRuntimeSystemObject2['default'].create(baseObj);

  equal(secondaryObj.foo, baseObj.foo, 'Em.O.create inherits properties from EmberObject parameter');
});

QUnit.test('throws if you try to pass anything a string as a parameter', function () {
  var expected = 'EmberObject.create only accepts an objects.';

  throws(function () {
    _emberRuntimeSystemObject2['default'].create('some-string');
  }, expected);
});

QUnit.test('EmberObject.create can take undefined as a parameter', function () {
  var o = _emberRuntimeSystemObject2['default'].create(undefined);
  deepEqual(_emberRuntimeSystemObject2['default'].create(), o);
});

QUnit.test('EmberObject.create can take null as a parameter', function () {
  var o = _emberRuntimeSystemObject2['default'].create(null);
  deepEqual(_emberRuntimeSystemObject2['default'].create(), o);
});

QUnit.module('EmberObject.createWithMixins', moduleOptions);

QUnit.test('Creates a new object that contains passed properties', function () {

  var called = false;
  var obj = _emberRuntimeSystemObject2['default'].extend({
    method: function method() {
      called = true;
    }
  }).create({
    prop: 'FOO'
  });

  equal((0, _emberMetalProperty_get.get)(obj, 'prop'), 'FOO', 'obj.prop');
  obj.method();
  ok(called, 'method executed');
});

// ..........................................................
// WORKING WITH MIXINS
//

QUnit.test('Creates a new object that includes mixins and properties', function () {

  var MixinA = _emberMetalMixin.Mixin.create({ mixinA: 'A' });

  expectDeprecation(function () {
    _emberRuntimeSystemObject2['default'].createWithMixins(MixinA, { prop: 'FOO' });
  }, '.createWithMixins is deprecated, please use .create or .extend accordingly');
});

// ..........................................................
// LIFECYCLE
//

QUnit.test('Configures _super() on methods with override', function () {
  var MixinA = _emberMetalMixin.Mixin.create({ method: function method() {} });
  expectDeprecation(function () {
    _emberRuntimeSystemObject2['default'].createWithMixins(MixinA, {
      method: function method() {
        this._super.apply(this, arguments);
      }
    });
  }, '.createWithMixins is deprecated, please use .create or .extend accordingly');
});

QUnit.test('Calls all mixin inits if defined', function () {
  var Mixin1 = _emberMetalMixin.Mixin.create({
    init: function init() {
      this._super.apply(this, arguments);
    }
  });

  var Mixin2 = _emberMetalMixin.Mixin.create({
    init: function init() {
      this._super.apply(this, arguments);
    }
  });

  expectDeprecation(function () {
    _emberRuntimeSystemObject2['default'].createWithMixins(Mixin1, Mixin2);
  }, '.createWithMixins is deprecated, please use .create or .extend accordingly');
});

QUnit.test('Triggers init', function () {
  expectDeprecation(function () {
    _emberRuntimeSystemObject2['default'].createWithMixins({
      markAsCompleted: (0, _emberMetalEvents.on)('init', function () {})
    });
  }, '.createWithMixins is deprecated, please use .create or .extend accordingly');
});