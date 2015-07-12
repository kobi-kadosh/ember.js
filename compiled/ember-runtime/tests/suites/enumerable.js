'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalObserver = require('ember-metal/observer');

var _emberRuntimeTestsSuitesEnumerableAny = require('ember-runtime/tests/suites/enumerable/any');

var _emberRuntimeTestsSuitesEnumerableAny2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableAny);

var _emberRuntimeTestsSuitesEnumerableIs_any = require('ember-runtime/tests/suites/enumerable/is_any');

var _emberRuntimeTestsSuitesEnumerableIs_any2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableIs_any);

var _emberRuntimeTestsSuitesEnumerableCompact = require('ember-runtime/tests/suites/enumerable/compact');

var _emberRuntimeTestsSuitesEnumerableCompact2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableCompact);

var _emberRuntimeTestsSuitesEnumerableContains = require('ember-runtime/tests/suites/enumerable/contains');

var _emberRuntimeTestsSuitesEnumerableContains2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableContains);

var _emberRuntimeTestsSuitesEnumerableEvery = require('ember-runtime/tests/suites/enumerable/every');

var _emberRuntimeTestsSuitesEnumerableEvery2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableEvery);

var _emberRuntimeTestsSuitesEnumerableFilter = require('ember-runtime/tests/suites/enumerable/filter');

var _emberRuntimeTestsSuitesEnumerableFilter2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableFilter);

var _emberRuntimeTestsSuitesEnumerableFind = require('ember-runtime/tests/suites/enumerable/find');

var _emberRuntimeTestsSuitesEnumerableFind2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableFind);

var _emberRuntimeTestsSuitesEnumerableFirstObject = require('ember-runtime/tests/suites/enumerable/firstObject');

var _emberRuntimeTestsSuitesEnumerableFirstObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableFirstObject);

var _emberRuntimeTestsSuitesEnumerableForEach = require('ember-runtime/tests/suites/enumerable/forEach');

var _emberRuntimeTestsSuitesEnumerableForEach2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableForEach);

var _emberRuntimeTestsSuitesEnumerableMapBy = require('ember-runtime/tests/suites/enumerable/mapBy');

var _emberRuntimeTestsSuitesEnumerableMapBy2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableMapBy);

var _emberRuntimeTestsSuitesEnumerableInvoke = require('ember-runtime/tests/suites/enumerable/invoke');

var _emberRuntimeTestsSuitesEnumerableInvoke2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableInvoke);

var _emberRuntimeTestsSuitesEnumerableLastObject = require('ember-runtime/tests/suites/enumerable/lastObject');

var _emberRuntimeTestsSuitesEnumerableLastObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableLastObject);

var _emberRuntimeTestsSuitesEnumerableMap = require('ember-runtime/tests/suites/enumerable/map');

var _emberRuntimeTestsSuitesEnumerableMap2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableMap);

var _emberRuntimeTestsSuitesEnumerableReduce = require('ember-runtime/tests/suites/enumerable/reduce');

var _emberRuntimeTestsSuitesEnumerableReduce2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableReduce);

var _emberRuntimeTestsSuitesEnumerableReject = require('ember-runtime/tests/suites/enumerable/reject');

var _emberRuntimeTestsSuitesEnumerableReject2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableReject);

var _emberRuntimeTestsSuitesEnumerableSortBy = require('ember-runtime/tests/suites/enumerable/sortBy');

var _emberRuntimeTestsSuitesEnumerableSortBy2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableSortBy);

var _emberRuntimeTestsSuitesEnumerableToArray = require('ember-runtime/tests/suites/enumerable/toArray');

var _emberRuntimeTestsSuitesEnumerableToArray2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableToArray);

var _emberRuntimeTestsSuitesEnumerableUniq = require('ember-runtime/tests/suites/enumerable/uniq');

var _emberRuntimeTestsSuitesEnumerableUniq2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableUniq);

var _emberRuntimeTestsSuitesEnumerableWithout = require('ember-runtime/tests/suites/enumerable/without');

var _emberRuntimeTestsSuitesEnumerableWithout2 = _interopRequireDefault(_emberRuntimeTestsSuitesEnumerableWithout);

var ObserverClass = _emberRuntimeSystemObject2['default'].extend({

  _keysBefore: null,
  _keys: null,
  _values: null,
  _before: null,
  _after: null,

  isEnabled: true,

  init: function init() {
    this._super.apply(this, arguments);
    this.reset();
  },

  propertyWillChange: function propertyWillChange(target, key) {
    if (this._keysBefore[key] === undefined) {
      this._keysBefore[key] = 0;
    }
    this._keysBefore[key]++;
  },

  /*
    Invoked when the property changes.  Just records the parameters for
    later analysis.
  */
  propertyDidChange: function propertyDidChange(target, key, value) {
    if (this._keys[key] === undefined) {
      this._keys[key] = 0;
    }
    this._keys[key]++;
    this._values[key] = value;
  },

  /*
    Resets the recorded results for another run.
      @returns {Object} receiver
  */
  reset: function reset() {
    this._keysBefore = {};
    this._keys = {};
    this._values = {};
    this._before = null;
    this._after = null;
    return this;
  },

  observeBefore: function observeBefore(obj) {
    var keys = Array.prototype.slice.call(arguments, 1);
    var loc = keys.length;
    while (--loc >= 0) {
      (0, _emberMetalObserver.addBeforeObserver)(obj, keys[loc], this, 'propertyWillChange');
    }

    return this;
  },

  /*
    Begins observing the passed key names on the passed object.  Any changes
    on the named properties will be recorded.
      @param {Ember.Enumerable} obj
      The enumerable to observe.
      @returns {Object} receiver
  */
  observe: function observe(obj) {
    if (obj.addObserver) {
      var keys = Array.prototype.slice.call(arguments, 1);
      var loc = keys.length;

      while (--loc >= 0) {
        obj.addObserver(keys[loc], this, 'propertyDidChange');
      }
    } else {
      this.isEnabled = false;
    }
    return this;
  },

  /*
    Returns true if the passed key was invoked.  If you pass a value as
    well then validates that the values match.
      @param {String} key
      Key to validate
      @param {Object} value
      (Optional) value
      @returns {Boolean}
  */
  validate: function validate(key, value) {
    if (!this.isEnabled) {
      return true;
    }

    if (!this._keys[key]) {
      return false;
    }

    if (arguments.length > 1) {
      return this._values[key] === value;
    } else {
      return true;
    }
  },

  /*
    Returns times the before observer as invoked.
      @param {String} key
      Key to check
  */
  timesCalledBefore: function timesCalledBefore(key) {
    return this._keysBefore[key] || 0;
  },

  /*
    Returns times the observer as invoked.
      @param {String} key
      Key to check
  */
  timesCalled: function timesCalled(key) {
    return this._keys[key] || 0;
  },

  /*
    begins acting as an enumerable observer.
  */
  observeEnumerable: function observeEnumerable(obj) {
    obj.addEnumerableObserver(this);
    return this;
  },

  stopObserveEnumerable: function stopObserveEnumerable(obj) {
    obj.removeEnumerableObserver(this);
    return this;
  },

  enumerableWillChange: function enumerableWillChange() {
    equal(this._before, null, 'should only call once');
    this._before = Array.prototype.slice.call(arguments);
  },

  enumerableDidChange: function enumerableDidChange() {
    equal(this._after, null, 'should only call once');
    this._after = Array.prototype.slice.call(arguments);
  }

});

var EnumerableTests = _emberRuntimeTestsSuitesSuite.Suite.extend({
  /*
    __Required.__ You must implement this method to apply this mixin.
      Implement to return a new enumerable object for testing.  Should accept
    either no parameters, a single number (indicating the desired length of
    the collection) or an array of objects.
      @param {Array} content
      An array of items to include in the enumerable optionally.
      @returns {Ember.Enumerable} a new enumerable
  */
  newObject: null,

  /*
    Implement to return a set of new fixture strings that can be applied to
    the enumerable.  This may be passed into the newObject method.
      @param {Number} count
      The number of items required.
      @returns {Array} array of strings
  */
  newFixture: function newFixture(cnt) {
    var ret = [];
    while (--cnt >= 0) {
      ret.push((0, _emberMetalUtils.generateGuid)());
    }

    return ret;
  },

  /*
    Implement to return a set of new fixture objects that can be applied to
    the enumerable.  This may be passed into the newObject method.
      @param {Number} cnt
      The number of items required.
      @returns {Array} array of objects
  */
  newObjectsFixture: function newObjectsFixture(cnt) {
    var ret = [];
    var item;
    while (--cnt >= 0) {
      item = {};
      (0, _emberMetalUtils.guidFor)(item);
      ret.push(item);
    }
    return ret;
  },

  /*
    __Required.__ You must implement this method to apply this mixin.
      Implement accept an instance of the enumerable and return an array
    containing the objects in the enumerable.  This is used only for testing
    so performance is not important.
      @param {Ember.Enumerable} enumerable
      The enumerable to convert.
      @returns {Array} array of items
  */
  toArray: null,

  /*
    Implement this method if your object can mutate internally (even if it
    does not support the MutableEnumerable API).  The method should accept
    an object of your desired type and modify it somehow.  Suite tests will
    use this to ensure that all appropriate caches, etc. clear when the
    mutation occurs.
      If you do not define this optional method, then mutation-related tests
    will be skipped.
      @param {Ember.Enumerable} enumerable
      The enumerable to mutate
      @returns {void}
  */
  mutate: function mutate() {},

  /*
    Becomes true when you define a new mutate() method, indicating that
    mutation tests should run.  This is calculated automatically.
      @type Boolean
  */
  canTestMutation: (0, _emberMetalComputed.computed)(function () {
    return this.mutate !== EnumerableTests.prototype.mutate;
  }),

  /*
    Invoked to actually run the test - overridden by mixins
  */
  run: function run() {},

  /*
    Creates a new observer object for testing.  You can add this object as an
    observer on an array and it will record results anytime it is invoked.
    After running the test, call the validate() method on the observer to
    validate the results.
  */
  newObserver: function newObserver(obj) {
    var ret = (0, _emberMetalProperty_get.get)(this, 'observerClass').create();
    if (arguments.length > 0) {
      ret.observeBefore.apply(ret, arguments);
    }

    if (arguments.length > 0) {
      ret.observe.apply(ret, arguments);
    }

    return ret;
  },

  observerClass: ObserverClass
});

EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableAny2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableIs_any2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableCompact2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableContains2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableEvery2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableFilter2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableFind2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableFirstObject2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableForEach2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableMapBy2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableInvoke2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableLastObject2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableMap2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableReduce2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableReject2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableSortBy2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableToArray2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableUniq2['default']);
EnumerableTests.importModuleTests(_emberRuntimeTestsSuitesEnumerableWithout2['default']);

exports['default'] = EnumerableTests;
exports.EnumerableTests = EnumerableTests;
exports.ObserverClass = ObserverClass;