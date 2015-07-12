'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsObservable = require('ember-runtime/mixins/observable');

var _emberRuntimeMixinsObservable2 = _interopRequireDefault(_emberRuntimeMixinsObservable);

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * Added ObservableObject which applies the Ember.Observable mixin.
  * Changed reference to Ember.T_FUNCTION to 'function'
  * Changed all references to sc_super to this._super.apply(this, arguments)
  * Changed Ember.objectForPropertyPath() to Ember.getPath()
  * Removed allPropertiesDidChange test - no longer supported
  * Changed test that uses 'ObjectE' as path to 'objectE' to reflect new
    rule on using capital letters for property paths.
  * Removed test passing context to addObserver.  context param is no longer
    supported.
  * Changed calls to Ember.Binding.flushPendingChanges() -> run.sync()
  * removed test in observer around line 862 that expected key/value to be
    the last item in the chained path.  Should be root and chained path

*/

// ========================================================================
// Ember.Observable Tests
// ========================================================================

var object, ObjectC, ObjectD, objectA, objectB, lookup;

var ObservableObject = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsObservable2['default']);
var originalLookup = _emberMetalCore2['default'].lookup;

// ..........................................................
// GET()
//

QUnit.module('object.get()', {

  setup: function setup() {
    object = ObservableObject.extend(_emberRuntimeMixinsObservable2['default'], {
      computed: (0, _emberMetalComputed.computed)(function () {
        return 'value';
      }).volatile(),
      method: function method() {
        return 'value';
      },
      unknownProperty: function unknownProperty(key, value) {
        this.lastUnknownProperty = key;
        return 'unknown';
      }
    }).create({
      normal: 'value',
      numberVal: 24,
      toggleVal: true,
      nullProperty: null
    });
  }

});

QUnit.test('should get normal properties', function () {
  equal(object.get('normal'), 'value');
});

QUnit.test('should call computed properties and return their result', function () {
  equal(object.get('computed'), 'value');
});

QUnit.test('should return the function for a non-computed property', function () {
  var value = object.get('method');
  equal(typeof value, 'function');
});

QUnit.test('should return null when property value is null', function () {
  equal(object.get('nullProperty'), null);
});

QUnit.test('should call unknownProperty when value is undefined', function () {
  equal(object.get('unknown'), 'unknown');
  equal(object.lastUnknownProperty, 'unknown');
});

// ..........................................................
// Ember.GET()
//
QUnit.module('Ember.get()', {
  setup: function setup() {
    objectA = ObservableObject.extend({
      computed: (0, _emberMetalComputed.computed)(function () {
        return 'value';
      }).volatile(),
      method: function method() {
        return 'value';
      },
      unknownProperty: function unknownProperty(key, value) {
        this.lastUnknownProperty = key;
        return 'unknown';
      }
    }).create({
      normal: 'value',
      numberVal: 24,
      toggleVal: true,
      nullProperty: null
    });

    objectB = {
      normal: 'value',
      nullProperty: null
    };
  }
});

QUnit.test('should get normal properties on Ember.Observable', function () {
  equal((0, _emberMetalProperty_get.get)(objectA, 'normal'), 'value');
});

QUnit.test('should call computed properties on Ember.Observable and return their result', function () {
  equal((0, _emberMetalProperty_get.get)(objectA, 'computed'), 'value');
});

QUnit.test('should return the function for a non-computed property on Ember.Observable', function () {
  var value = (0, _emberMetalProperty_get.get)(objectA, 'method');
  equal(typeof value, 'function');
});

QUnit.test('should return null when property value is null on Ember.Observable', function () {
  equal((0, _emberMetalProperty_get.get)(objectA, 'nullProperty'), null);
});

QUnit.test('should call unknownProperty when value is undefined on Ember.Observable', function () {
  equal((0, _emberMetalProperty_get.get)(object, 'unknown'), 'unknown');
  equal(object.lastUnknownProperty, 'unknown');
});

QUnit.test('should get normal properties on standard objects', function () {
  equal((0, _emberMetalProperty_get.get)(objectB, 'normal'), 'value');
});

QUnit.test('should return null when property is null on standard objects', function () {
  equal((0, _emberMetalProperty_get.get)(objectB, 'nullProperty'), null);
});

/*
QUnit.test("raise if the provided object is null", function() {
  throws(function() {
    get(null, 'key');
  });
});
*/

QUnit.test('raise if the provided object is undefined', function () {
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(undefined, 'key');
  }, /Cannot call get with 'key' on an undefined object/i);
});

QUnit.test('should work when object is Ember (used in Ember.get)', function () {
  equal((0, _emberMetalProperty_get.get)('Ember.RunLoop'), _emberMetalCore2['default'].RunLoop, 'Ember.get');
  equal((0, _emberMetalProperty_get.get)(_emberMetalCore2['default'], 'RunLoop'), _emberMetalCore2['default'].RunLoop, 'Ember.get(Ember, RunLoop)');
});

QUnit.module('Ember.get() with paths', {
  setup: function setup() {
    lookup = _emberMetalCore2['default'].lookup = {};
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should return a property at a given path relative to the lookup', function () {
  lookup.Foo = ObservableObject.extend({
    Bar: ObservableObject.extend({
      Baz: (0, _emberMetalComputed.computed)(function () {
        return 'blargh';
      }).volatile()
    }).create()
  }).create();

  equal((0, _emberMetalProperty_get.get)('Foo.Bar.Baz'), 'blargh');
});

QUnit.test('should return a property at a given path relative to the passed object', function () {
  var foo = ObservableObject.create({
    bar: ObservableObject.extend({
      baz: (0, _emberMetalComputed.computed)(function () {
        return 'blargh';
      }).volatile()
    }).create()
  });

  equal((0, _emberMetalProperty_get.get)(foo, 'bar.baz'), 'blargh');
});

QUnit.test('should return a property at a given path relative to the lookup - JavaScript hash', function () {
  lookup.Foo = {
    Bar: {
      Baz: 'blargh'
    }
  };

  equal((0, _emberMetalProperty_get.get)('Foo.Bar.Baz'), 'blargh');
});

QUnit.test('should return a property at a given path relative to the passed object - JavaScript hash', function () {
  var foo = {
    bar: {
      baz: 'blargh'
    }
  };

  equal((0, _emberMetalProperty_get.get)(foo, 'bar.baz'), 'blargh');
});

// ..........................................................
// SET()
//

QUnit.module('object.set()', {

  setup: function setup() {
    object = ObservableObject.extend({
      computed: (0, _emberMetalComputed.computed)({
        get: function get(key) {
          return this._computed;
        },
        set: function set(key, value) {
          this._computed = value;
          return this._computed;
        }
      }).volatile(),

      method: function method(key, value) {
        if (value !== undefined) {
          this._method = value;
        }
        return this._method;
      },

      unknownProperty: function unknownProperty(key) {
        return this._unknown;
      },

      setUnknownProperty: function setUnknownProperty(key, value) {
        this._unknown = value;
        return this._unknown;
      },

      // normal property
      normal: 'value',

      // computed property
      _computed: 'computed',
      // method, but not a property
      _method: 'method',
      // null property
      nullProperty: null,

      // unknown property
      _unknown: 'unknown'
    }).create();
  }

});

QUnit.test('should change normal properties and return the value', function () {
  var ret = object.set('normal', 'changed');
  equal(object.get('normal'), 'changed');
  equal(ret, 'changed');
});

QUnit.test('should call computed properties passing value and return the value', function () {
  var ret = object.set('computed', 'changed');
  equal(object.get('_computed'), 'changed');
  equal(ret, 'changed');
});

QUnit.test('should change normal properties when passing undefined', function () {
  var ret = object.set('normal', undefined);
  equal(object.get('normal'), undefined);
  equal(ret, undefined);
});

QUnit.test('should replace the function for a non-computed property and return the value', function () {
  var ret = object.set('method', 'changed');
  equal(object.get('_method'), 'method'); // make sure this was NOT run
  ok(typeof object.get('method') !== 'function');
  equal(ret, 'changed');
});

QUnit.test('should replace prover when property value is null', function () {
  var ret = object.set('nullProperty', 'changed');
  equal(object.get('nullProperty'), 'changed');
  equal(ret, 'changed');
});

QUnit.test('should call unknownProperty with value when property is undefined', function () {
  var ret = object.set('unknown', 'changed');
  equal(object.get('_unknown'), 'changed');
  equal(ret, 'changed');
});

// ..........................................................
// COMPUTED PROPERTIES
//

QUnit.module('Computed properties', {
  setup: function setup() {
    lookup = _emberMetalCore2['default'].lookup = {};

    object = ObservableObject.extend({
      computed: (0, _emberMetalComputed.computed)({
        get: function get() {
          this.computedCalls.push('getter-called');
          return 'computed';
        },
        set: function set(key, value) {
          this.computedCalls.push(value);
        }
      }).volatile(),

      computedCached: (0, _emberMetalComputed.computed)({
        get: function get() {
          this.computedCachedCalls.push('getter-called');
          return 'computedCached';
        },
        set: function set(key, value) {
          this.computedCachedCalls.push(value);
        }
      }),

      dependent: (0, _emberMetalComputed.computed)({
        get: function get() {
          this.dependentCalls.push('getter-called');
          return 'dependent';
        },
        set: function set(key, value) {
          this.dependentCalls.push(value);
        }
      }).property('changer').volatile(),
      dependentFront: (0, _emberMetalComputed.computed)('changer', {
        get: function get() {
          this.dependentFrontCalls.push('getter-called');
          return 'dependentFront';
        },
        set: function set(key, value) {
          this.dependentFrontCalls.push(value);
        }
      }).volatile(),
      dependentCached: (0, _emberMetalComputed.computed)({
        get: function get() {
          this.dependentCachedCalls.push('getter-called!');
          return 'dependentCached';
        },
        set: function set(key, value) {
          this.dependentCachedCalls.push(value);
        }
      }).property('changer'),

      inc: (0, _emberMetalComputed.computed)('changer', function () {
        return this.incCallCount++;
      }),

      nestedInc: (0, _emberMetalComputed.computed)(function (key) {
        (0, _emberMetalProperty_get.get)(this, 'inc');
        return this.nestedIncCallCount++;
      }).property('inc'),

      isOn: (0, _emberMetalComputed.computed)({
        get: function get() {
          return this.get('state') === 'on';
        },
        set: function set(key, value) {
          this.set('state', 'on');
          return this.get('state') === 'on';
        }
      }).property('state').volatile(),

      isOff: (0, _emberMetalComputed.computed)({
        get: function get() {
          return this.get('state') === 'off';
        },
        set: function set(key, value) {
          this.set('state', 'off');
          return this.get('state') === 'off';
        }
      }).property('state').volatile()

    }).create({
      computedCalls: [],
      computedCachedCalls: [],
      changer: 'foo',
      dependentCalls: [],
      dependentFrontCalls: [],
      dependentCachedCalls: [],
      incCallCount: 0,
      nestedIncCallCount: 0,
      state: 'on'
    });
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('getting values should call function return value', function () {

  // get each property twice. Verify return.
  var keys = (0, _emberRuntimeSystemString.w)('computed computedCached dependent dependentFront dependentCached');

  keys.forEach(function (key) {
    equal(object.get(key), key, (0, _emberRuntimeSystemString.fmt)('Try #1: object.get(%@) should run function', [key]));
    equal(object.get(key), key, (0, _emberRuntimeSystemString.fmt)('Try #2: object.get(%@) should run function', [key]));
  });

  // verify each call count.  cached should only be called once
  (0, _emberRuntimeSystemString.w)('computedCalls dependentFrontCalls dependentCalls').forEach(function (key) {
    equal(object[key].length, 2, (0, _emberRuntimeSystemString.fmt)('non-cached property %@ should be called 2x', [key]));
  });

  (0, _emberRuntimeSystemString.w)('computedCachedCalls dependentCachedCalls').forEach(function (key) {
    equal(object[key].length, 1, (0, _emberRuntimeSystemString.fmt)('non-cached property %@ should be called 1x', [key]));
  });
});

QUnit.test('setting values should call function return value', function () {

  // get each property twice. Verify return.
  var keys = (0, _emberRuntimeSystemString.w)('computed dependent dependentFront computedCached dependentCached');
  var values = (0, _emberRuntimeSystemString.w)('value1 value2');

  keys.forEach(function (key) {

    equal(object.set(key, values[0]), values[0], (0, _emberRuntimeSystemString.fmt)('Try #1: object.set(%@, %@) should run function', [key, values[0]]));

    equal(object.set(key, values[1]), values[1], (0, _emberRuntimeSystemString.fmt)('Try #2: object.set(%@, %@) should run function', [key, values[1]]));

    equal(object.set(key, values[1]), values[1], (0, _emberRuntimeSystemString.fmt)('Try #3: object.set(%@, %@) should not run function since it is setting same value as before', [key, values[1]]));
  });

  // verify each call count.  cached should only be called once
  keys.forEach(function (key) {
    var calls = object[key + 'Calls'];
    var idx, expectedLength;

    // Cached properties first check their cached value before setting the
    // property. Other properties blindly call set.
    expectedLength = 3;
    equal(calls.length, expectedLength, (0, _emberRuntimeSystemString.fmt)('set(%@) should be called the right amount of times', [key]));
    for (idx = 0; idx < 2; idx++) {
      equal(calls[idx], values[idx], (0, _emberRuntimeSystemString.fmt)('call #%@ to set(%@) should have passed value %@', [idx + 1, key, values[idx]]));
    }
  });
});

QUnit.test('notify change should clear cache', function () {

  // call get several times to collect call count
  object.get('computedCached'); // should run func
  object.get('computedCached'); // should not run func

  object.propertyWillChange('computedCached').propertyDidChange('computedCached');

  object.get('computedCached'); // should run again
  equal(object.computedCachedCalls.length, 2, 'should have invoked method 2x');
});

QUnit.test('change dependent should clear cache', function () {

  // call get several times to collect call count
  var ret1 = object.get('inc'); // should run func
  equal(object.get('inc'), ret1, 'multiple calls should not run cached prop');

  object.set('changer', 'bar');

  equal(object.get('inc'), ret1 + 1, 'should increment after dependent key changes'); // should run again
});

QUnit.test('just notifying change of dependent should clear cache', function () {

  // call get several times to collect call count
  var ret1 = object.get('inc'); // should run func
  equal(object.get('inc'), ret1, 'multiple calls should not run cached prop');

  object.notifyPropertyChange('changer');

  equal(object.get('inc'), ret1 + 1, 'should increment after dependent key changes'); // should run again
});

QUnit.test('changing dependent should clear nested cache', function () {

  // call get several times to collect call count
  var ret1 = object.get('nestedInc'); // should run func
  equal(object.get('nestedInc'), ret1, 'multiple calls should not run cached prop');

  object.set('changer', 'bar');

  equal(object.get('nestedInc'), ret1 + 1, 'should increment after dependent key changes'); // should run again
});

QUnit.test('just notifying change of dependent should clear nested cache', function () {

  // call get several times to collect call count
  var ret1 = object.get('nestedInc'); // should run func
  equal(object.get('nestedInc'), ret1, 'multiple calls should not run cached prop');

  object.notifyPropertyChange('changer');

  equal(object.get('nestedInc'), ret1 + 1, 'should increment after dependent key changes'); // should run again
});

// This verifies a specific bug encountered where observers for computed
// properties would fire before their prop caches were cleared.
QUnit.test('change dependent should clear cache when observers of dependent are called', function () {

  // call get several times to collect call count
  var ret1 = object.get('inc'); // should run func
  equal(object.get('inc'), ret1, 'multiple calls should not run cached prop');

  // add observer to verify change...
  object.addObserver('inc', this, function () {
    equal(object.get('inc'), ret1 + 1, 'should increment after dependent key changes'); // should run again
  });

  // now run
  object.set('changer', 'bar');
});

QUnit.test('setting one of two computed properties that depend on a third property should clear the kvo cache', function () {
  // we have to call set twice to fill up the cache
  object.set('isOff', true);
  object.set('isOn', true);

  // setting isOff to true should clear the kvo cache
  object.set('isOff', true);
  equal(object.get('isOff'), true, 'object.isOff should be true');
  equal(object.get('isOn'), false, 'object.isOn should be false');
});

QUnit.test('dependent keys should be able to be specified as property paths', function () {
  var depObj = ObservableObject.extend({
    menuPrice: (0, _emberMetalComputed.computed)(function () {
      return this.get('menu.price');
    }).property('menu.price')
  }).create({
    menu: ObservableObject.create({
      price: 5
    })
  });

  equal(depObj.get('menuPrice'), 5, 'precond - initial value returns 5');

  depObj.set('menu.price', 6);

  equal(depObj.get('menuPrice'), 6, 'cache is properly invalidated after nested property changes');
});

QUnit.test('nested dependent keys should propagate after they update', function () {
  var bindObj;
  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.DepObj = ObservableObject.extend({
      price: (0, _emberMetalComputed.computed)(function () {
        return this.get('restaurant.menu.price');
      }).property('restaurant.menu.price')
    }).create({
      restaurant: ObservableObject.create({
        menu: ObservableObject.create({
          price: 5
        })
      })
    });

    bindObj = ObservableObject.extend({
      priceBinding: 'DepObj.price'
    }).create();
  });

  equal(bindObj.get('price'), 5, 'precond - binding propagates');

  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.DepObj.set('restaurant.menu.price', 10);
  });

  equal(bindObj.get('price'), 10, 'binding propagates after a nested dependent keys updates');

  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.DepObj.set('restaurant.menu', ObservableObject.create({
      price: 15
    }));
  });

  equal(bindObj.get('price'), 15, 'binding propagates after a middle dependent keys updates');
});

QUnit.test('cacheable nested dependent keys should clear after their dependencies update', function () {
  ok(true);

  var DepObj;

  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.DepObj = DepObj = ObservableObject.extend({
      price: (0, _emberMetalComputed.computed)('restaurant.menu.price', function () {
        return this.get('restaurant.menu.price');
      })
    }).create({
      restaurant: ObservableObject.create({
        menu: ObservableObject.create({
          price: 5
        })
      })
    });
  });

  equal(DepObj.get('price'), 5, 'precond - computed property is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    DepObj.set('restaurant.menu.price', 10);
  });
  equal(DepObj.get('price'), 10, 'cacheable computed properties are invalidated even if no run loop occurred');

  (0, _emberMetalRun_loop2['default'])(function () {
    DepObj.set('restaurant.menu.price', 20);
  });
  equal(DepObj.get('price'), 20, 'cacheable computed properties are invalidated after a second get before a run loop');
  equal(DepObj.get('price'), 20, 'precond - computed properties remain correct after a run loop');

  (0, _emberMetalRun_loop2['default'])(function () {
    DepObj.set('restaurant.menu', ObservableObject.create({
      price: 15
    }));
  });

  equal(DepObj.get('price'), 15, 'cacheable computed properties are invalidated after a middle property changes');

  (0, _emberMetalRun_loop2['default'])(function () {
    DepObj.set('restaurant.menu', ObservableObject.create({
      price: 25
    }));
  });

  equal(DepObj.get('price'), 25, 'cacheable computed properties are invalidated after a middle property changes again, before a run loop');
});

// ..........................................................
// OBSERVABLE OBJECTS
//

QUnit.module('Observable objects & object properties ', {

  setup: function setup() {
    object = ObservableObject.extend({
      getEach: function getEach() {
        var keys = ['normal', 'abnormal'];
        var ret = [];
        for (var idx = 0; idx < keys.length; idx++) {
          ret[ret.length] = this.get(keys[idx]);
        }
        return ret;
      },

      newObserver: function newObserver() {
        this.abnormal = 'changedValueObserved';
      },

      testObserver: (0, _emberMetalMixin.observer)('normal', function () {
        this.abnormal = 'removedObserver';
      }),

      testArrayObserver: (0, _emberMetalMixin.observer)('normalArray.[]', function () {
        this.abnormal = 'notifiedObserver';
      })
    }).create({
      normal: 'value',
      abnormal: 'zeroValue',
      numberVal: 24,
      toggleVal: true,
      observedProperty: 'beingWatched',
      testRemove: 'observerToBeRemoved',
      normalArray: _emberMetalCore2['default'].A([1, 2, 3, 4, 5])
    });
  }

});

QUnit.test('incrementProperty and decrementProperty', function () {
  var newValue = object.incrementProperty('numberVal');

  equal(25, newValue, 'numerical value incremented');
  object.numberVal = 24;
  newValue = object.decrementProperty('numberVal');
  equal(23, newValue, 'numerical value decremented');
  object.numberVal = 25;
  newValue = object.incrementProperty('numberVal', 5);
  equal(30, newValue, 'numerical value incremented by specified increment');
  object.numberVal = 25;
  newValue = object.incrementProperty('numberVal', -5);
  equal(20, newValue, 'minus numerical value incremented by specified increment');
  object.numberVal = 25;
  newValue = object.incrementProperty('numberVal', 0);
  equal(25, newValue, 'zero numerical value incremented by specified increment');

  expectAssertion(function () {
    newValue = object.incrementProperty('numberVal', 0 - void 0); // Increment by NaN
  }, /Must pass a numeric value to incrementProperty/i);

  expectAssertion(function () {
    newValue = object.incrementProperty('numberVal', 'Ember'); // Increment by non-numeric String
  }, /Must pass a numeric value to incrementProperty/i);

  expectAssertion(function () {
    newValue = object.incrementProperty('numberVal', 1 / 0); // Increment by Infinity
  }, /Must pass a numeric value to incrementProperty/i);

  equal(25, newValue, 'Attempting to increment by non-numeric values should not increment value');

  object.numberVal = 25;
  newValue = object.decrementProperty('numberVal', 5);
  equal(20, newValue, 'numerical value decremented by specified increment');
  object.numberVal = 25;
  newValue = object.decrementProperty('numberVal', -5);
  equal(30, newValue, 'minus numerical value decremented by specified increment');
  object.numberVal = 25;
  newValue = object.decrementProperty('numberVal', 0);
  equal(25, newValue, 'zero numerical value decremented by specified increment');

  expectAssertion(function () {
    newValue = object.decrementProperty('numberVal', 0 - void 0); // Decrement by NaN
  }, /Must pass a numeric value to decrementProperty/i);

  expectAssertion(function () {
    newValue = object.decrementProperty('numberVal', 'Ember'); // Decrement by non-numeric String
  }, /Must pass a numeric value to decrementProperty/i);

  expectAssertion(function () {
    newValue = object.decrementProperty('numberVal', 1 / 0); // Decrement by Infinity
  }, /Must pass a numeric value to decrementProperty/i);

  equal(25, newValue, 'Attempting to decrement by non-numeric values should not decrement value');
});

QUnit.test('toggle function, should be boolean', function () {
  equal(object.toggleProperty('toggleVal', true, false), object.get('toggleVal'));
  equal(object.toggleProperty('toggleVal', true, false), object.get('toggleVal'));
  equal(object.toggleProperty('toggleVal', undefined, undefined), object.get('toggleVal'));
});

QUnit.test('should notify array observer when array changes', function () {
  (0, _emberMetalProperty_get.get)(object, 'normalArray').replace(0, 0, 6);
  equal(object.abnormal, 'notifiedObserver', 'observer should be notified');
});

QUnit.module('object.addObserver()', {
  setup: function setup() {

    ObjectC = ObservableObject.create({

      objectE: ObservableObject.create({
        propertyVal: 'chainedProperty'
      }),

      normal: 'value',
      normal1: 'zeroValue',
      normal2: 'dependentValue',
      incrementor: 10,

      action: function action() {
        this.normal1 = 'newZeroValue';
      },

      observeOnceAction: function observeOnceAction() {
        this.incrementor = this.incrementor + 1;
      },

      chainedObserver: function chainedObserver() {
        this.normal2 = 'chainedPropertyObserved';
      }

    });
  }
});

QUnit.test('should register an observer for a property', function () {
  ObjectC.addObserver('normal', ObjectC, 'action');
  ObjectC.set('normal', 'newValue');
  equal(ObjectC.normal1, 'newZeroValue');
});

QUnit.test('should register an observer for a property - Special case of chained property', function () {
  ObjectC.addObserver('objectE.propertyVal', ObjectC, 'chainedObserver');
  ObjectC.objectE.set('propertyVal', 'chainedPropertyValue');
  equal('chainedPropertyObserved', ObjectC.normal2);
  ObjectC.normal2 = 'dependentValue';
  ObjectC.set('objectE', '');
  equal('chainedPropertyObserved', ObjectC.normal2);
});

QUnit.module('object.removeObserver()', {
  setup: function setup() {
    ObjectD = ObservableObject.create({

      objectF: ObservableObject.create({
        propertyVal: 'chainedProperty'
      }),

      normal: 'value',
      normal1: 'zeroValue',
      normal2: 'dependentValue',
      ArrayKeys: ['normal', 'normal1'],

      addAction: function addAction() {
        this.normal1 = 'newZeroValue';
      },
      removeAction: function removeAction() {
        this.normal2 = 'newDependentValue';
      },
      removeChainedObserver: function removeChainedObserver() {
        this.normal2 = 'chainedPropertyObserved';
      },

      observableValue: 'hello world',

      observer1: function observer1() {},
      observer2: function observer2() {
        this.removeObserver('observableValue', null, 'observer1');
        this.removeObserver('observableValue', null, 'observer2');
        this.hasObserverFor('observableValue'); // Tickle 'getMembers()'
        this.removeObserver('observableValue', null, 'observer3');
      },
      observer3: function observer3() {}
    });
  }
});

QUnit.test('should unregister an observer for a property', function () {
  ObjectD.addObserver('normal', ObjectD, 'addAction');
  ObjectD.set('normal', 'newValue');
  equal(ObjectD.normal1, 'newZeroValue');

  ObjectD.set('normal1', 'zeroValue');

  ObjectD.removeObserver('normal', ObjectD, 'addAction');
  ObjectD.set('normal', 'newValue');
  equal(ObjectD.normal1, 'zeroValue');
});

QUnit.test('should unregister an observer for a property - special case when key has a \'.\' in it.', function () {
  ObjectD.addObserver('objectF.propertyVal', ObjectD, 'removeChainedObserver');
  ObjectD.objectF.set('propertyVal', 'chainedPropertyValue');
  ObjectD.removeObserver('objectF.propertyVal', ObjectD, 'removeChainedObserver');
  ObjectD.normal2 = 'dependentValue';
  ObjectD.objectF.set('propertyVal', 'removedPropertyValue');
  equal('dependentValue', ObjectD.normal2);
  ObjectD.set('objectF', '');
  equal('dependentValue', ObjectD.normal2);
});

QUnit.test('removing an observer inside of an observer shouldn’t cause any problems', function () {
  // The observable system should be protected against clients removing
  // observers in the middle of observer notification.
  var encounteredError = false;
  try {
    ObjectD.addObserver('observableValue', null, 'observer1');
    ObjectD.addObserver('observableValue', null, 'observer2');
    ObjectD.addObserver('observableValue', null, 'observer3');
    (0, _emberMetalRun_loop2['default'])(function () {
      ObjectD.set('observableValue', 'hi world');
    });
  } catch (e) {
    encounteredError = true;
  }
  equal(encounteredError, false);
});

QUnit.module('Bind function ', {

  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    objectA = ObservableObject.create({
      name: 'Sproutcore',
      location: 'Timbaktu'
    });

    objectB = ObservableObject.create({
      normal: 'value',
      computed: function computed() {
        this.normal = 'newValue';
      }
    });

    lookup = _emberMetalCore2['default'].lookup = {
      'Namespace': {
        objectA: objectA,
        objectB: objectB
      }
    };
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should bind property with method parameter as undefined', function () {
  // creating binding
  (0, _emberMetalRun_loop2['default'])(function () {
    objectA.bind('name', 'Namespace.objectB.normal', undefined);
  });

  // now make a change to see if the binding triggers.
  (0, _emberMetalRun_loop2['default'])(function () {
    objectB.set('normal', 'changedValue');
  });

  // support new-style bindings if available
  equal('changedValue', objectA.get('name'), 'objectA.name is bound');
});

// ..........................................................
// SPECIAL CASES
//

QUnit.test('changing chained observer object to null should not raise exception', function () {

  var obj = ObservableObject.create({
    foo: ObservableObject.create({
      bar: ObservableObject.create({ bat: 'BAT' })
    })
  });

  var callCount = 0;
  obj.foo.addObserver('bar.bat', obj, function (target, key, value) {
    callCount++;
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    obj.foo.set('bar', null);
  });

  equal(callCount, 1, 'changing bar should trigger observer');
  expect(1);
});

// Just an observer

// Just an observer