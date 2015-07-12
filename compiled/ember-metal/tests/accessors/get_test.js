'use strict';

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalObserver = require('ember-metal/observer');

QUnit.module('Ember.get');

QUnit.test('should get arbitrary properties on an object', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    equal((0, _emberMetalProperty_get.get)(obj, key), obj[key], key);
  }
});

QUnit.test('should invoke INTERCEPT_GET even if the property exists', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null
  };

  var calledWith = undefined;
  obj[_emberMetalProperty_get.INTERCEPT_GET] = function (obj, key) {
    calledWith = [obj, key];
    return _emberMetalProperty_get.UNHANDLED_GET;
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    calledWith = undefined;
    equal((0, _emberMetalProperty_get.get)(obj, key), obj[key], key);
    equal(calledWith[0], obj, 'the object was passed');
    equal(calledWith[1], key, 'the key was passed');
  }
});

QUnit.test('should invoke INTERCEPT_GET and accept a return value', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null
  };

  obj[_emberMetalProperty_get.INTERCEPT_GET] = function (obj, key) {
    return key;
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key) || key === _emberMetalProperty_get.INTERCEPT_GET) {
      continue;
    }
    equal((0, _emberMetalProperty_get.get)(obj, key), key, key);
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('should call unknownProperty on watched values if the value is undefined', function (get, set) {
  var obj = {
    count: 0,
    unknownProperty: function unknownProperty(key) {
      equal(key, 'foo', 'should pass key');
      this.count++;
      return 'FOO';
    }
  };

  var count = 0;
  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    count++;
  });

  equal(get(obj, 'foo'), 'FOO', 'should return value from unknown');
});

QUnit.test('warn on attempts to get a property of undefined', function () {
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(undefined, 'aProperty');
  }, /Cannot call get with 'aProperty' on an undefined object/i);
});

QUnit.test('warn on attempts to get a property path of undefined', function () {
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(undefined, 'aProperty.on.aPath');
  }, /Cannot call get with 'aProperty.on.aPath' on an undefined object/);
});

QUnit.test('returns null when fetching a complex local path on a null context', function () {
  equal((0, _emberMetalProperty_get.get)(null, 'aProperty.on.aPath'), null);
});

QUnit.test('returns null when fetching a simple local path on a null context', function () {
  equal((0, _emberMetalProperty_get.get)(null, 'aProperty'), null);
});

QUnit.test('warn on attempts to get a falsy property', function () {
  var obj = {};
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(obj, null);
  }, /Cannot call get with null key/);
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(obj, NaN);
  }, /Cannot call get with NaN key/);
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(obj, undefined);
  }, /Cannot call get with undefined key/);
  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(obj, false);
  }, /Cannot call get with false key/);
});

// ..........................................................
// BUGS
//

QUnit.test('(regression) watched properties on unmodified inherited objects should still return their original value', function () {

  var MyMixin = _emberMetalMixin.Mixin.create({
    someProperty: 'foo',
    propertyDidChange: (0, _emberMetalMixin.observer)('someProperty', function () {})
  });

  var baseObject = MyMixin.apply({});
  var theRealObject = Object.create(baseObject);

  equal((0, _emberMetalProperty_get.get)(theRealObject, 'someProperty'), 'foo', 'should return the set value, not false');
});

QUnit.module('Ember.getWithDefault');

QUnit.test('should get arbitrary properties on an object', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    equal((0, _emberMetalProperty_get.getWithDefault)(obj, key, 'fail'), obj[key], key);
  }

  obj = {
    undef: undefined
  };

  equal((0, _emberMetalProperty_get.getWithDefault)(obj, 'undef', 'default'), 'default', 'explicit undefined retrieves the default');
  equal((0, _emberMetalProperty_get.getWithDefault)(obj, 'not-present', 'default'), 'default', 'non-present key retrieves the default');
});

QUnit.test('should call unknownProperty if defined and value is undefined', function () {

  var obj = {
    count: 0,
    unknownProperty: function unknownProperty(key) {
      equal(key, 'foo', 'should pass key');
      this.count++;
      return 'FOO';
    }
  };

  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'FOO', 'should return value from unknown');
  equal(obj.count, 1, 'should have invoked');
});

(0, _emberMetalTestsProps_helper.testBoth)('if unknownProperty is present, it is called', function (get, set) {
  var obj = {
    count: 0,
    unknownProperty: function unknownProperty(key) {
      if (key === 'foo') {
        equal(key, 'foo', 'should pass key');
        this.count++;
        return 'FOO';
      }
    }
  };

  var count = 0;
  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    count++;
  });

  equal((0, _emberMetalProperty_get.getWithDefault)(obj, 'foo', 'fail'), 'FOO', 'should return value from unknownProperty');
  equal((0, _emberMetalProperty_get.getWithDefault)(obj, 'bar', 'default'), 'default', 'should convert undefined from unknownProperty into default');
});

// ..........................................................
// BUGS
//

QUnit.test('(regression) watched properties on unmodified inherited objects should still return their original value', function () {

  var MyMixin = _emberMetalMixin.Mixin.create({
    someProperty: 'foo',
    propertyDidChange: (0, _emberMetalMixin.observer)('someProperty', function () {})
  });

  var baseObject = MyMixin.apply({});
  var theRealObject = Object.create(baseObject);

  equal((0, _emberMetalProperty_get.getWithDefault)(theRealObject, 'someProperty', 'fail'), 'foo', 'should return the set value, not false');
});

// NOTHING TO DO

// NOTHING TO DO