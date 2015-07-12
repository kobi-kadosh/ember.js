'use strict';

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

QUnit.module('set');

QUnit.test('should set arbitrary properties on an object', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null,
    undefinedValue: undefined
  };

  var newObj = {
    undefinedValue: 'emberjs'
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    equal((0, _emberMetalProperty_set.set)(newObj, key, obj[key]), obj[key], 'should return value');
    equal((0, _emberMetalProperty_get.get)(newObj, key), obj[key], 'should set value');
  }
});

QUnit.test('should call INTERCEPT_SET and support UNHANDLED_SET if INTERCEPT_SET is defined', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null,
    undefinedValue: undefined
  };

  var newObj = {
    undefinedValue: 'emberjs'
  };

  var calledWith = undefined;
  newObj[_emberMetalProperty_set.INTERCEPT_SET] = function (obj, key, value) {
    calledWith = [key, value];
    return _emberMetalProperty_set.UNHANDLED_SET;
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    calledWith = undefined;

    equal((0, _emberMetalProperty_set.set)(newObj, key, obj[key]), obj[key], 'should return value');
    equal(calledWith[0], key, 'INTERCEPT_SET called with the key');
    equal(calledWith[1], obj[key], 'INTERCEPT_SET called with the key');
    equal((0, _emberMetalProperty_get.get)(newObj, key), obj[key], 'should set value since UNHANDLED_SET was returned');
  }
});

QUnit.test('should call INTERCEPT_SET and support handling the set if it is defined', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null,
    undefinedValue: undefined
  };

  var newObj = {
    bucket: {}
  };

  var calledWith = undefined;
  newObj[_emberMetalProperty_set.INTERCEPT_SET] = function (obj, key, value) {
    (0, _emberMetalProperty_set.set)(obj.bucket, key, value);
    return value;
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    calledWith = undefined;

    equal((0, _emberMetalProperty_set.set)(newObj, key, obj[key]), obj[key], 'should return value');
    equal((0, _emberMetalProperty_get.get)(newObj.bucket, key), obj[key], 'should have moved the value to `bucket`');
    ok(newObj.bucket.hasOwnProperty(key), 'the key is defined in bucket');
    ok(!newObj.hasOwnProperty(key), 'the key is not defined on the raw object');
  }
});

QUnit.test('should call INTERCEPT_GET and INTERCEPT_SET', function () {
  var obj = {
    string: 'string',
    number: 23,
    boolTrue: true,
    boolFalse: false,
    nullValue: null,
    undefinedValue: undefined
  };

  var newObj = {
    string: null,
    number: null,
    boolTrue: null,
    boolFalse: null,
    nullValue: null,
    undefinedValue: null,
    bucket: {}
  };

  newObj[_emberMetalProperty_set.INTERCEPT_SET] = function (obj, key, value) {
    (0, _emberMetalProperty_set.set)(obj.bucket, key, value);
    return value;
  };

  newObj[_emberMetalProperty_get.INTERCEPT_GET] = function (obj, key) {
    return (0, _emberMetalProperty_get.get)(obj.bucket, key);
  };

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    equal((0, _emberMetalProperty_set.set)(newObj, key, obj[key]), obj[key], 'should return value');
    equal((0, _emberMetalProperty_get.get)(newObj.bucket, key), obj[key], 'should have moved the value to `bucket`');
    equal((0, _emberMetalProperty_get.get)(newObj, key), obj[key], 'INTERCEPT_GET was called');
  }
});

QUnit.test('should call setUnknownProperty if defined and value is undefined', function () {

  var obj = {
    count: 0,

    unknownProperty: function unknownProperty(key, value) {
      ok(false, 'should not invoke unknownProperty if setUnknownProperty is defined');
    },

    setUnknownProperty: function setUnknownProperty(key, value) {
      equal(key, 'foo', 'should pass key');
      equal(value, 'BAR', 'should pass key');
      this.count++;
      return 'FOO';
    }
  };

  equal((0, _emberMetalProperty_set.set)(obj, 'foo', 'BAR'), 'BAR', 'should return set value');
  equal(obj.count, 1, 'should have invoked');
});