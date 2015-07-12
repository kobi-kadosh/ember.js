'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('lastIndexOf');

suite.test('should return index of object\'s last occurrence', function () {
  var expected = this.newFixture(3);
  var obj = this.newObject(expected);
  var len = 3;
  var idx;

  for (idx = 0; idx < len; idx++) {
    equal(obj.lastIndexOf(expected[idx]), idx, (0, _emberRuntimeSystemString.fmt)('obj.lastIndexOf(%@) should match idx', [expected[idx]]));
  }
});

suite.test('should return index of object\'s last occurrence even startAt search location is equal to length', function () {
  var expected = this.newFixture(3);
  var obj = this.newObject(expected);
  var len = 3;
  var idx;

  for (idx = 0; idx < len; idx++) {
    equal(obj.lastIndexOf(expected[idx], len), idx, (0, _emberRuntimeSystemString.fmt)('obj.lastIndexOfs(%@) should match idx', [expected[idx]]));
  }
});

suite.test('should return index of object\'s last occurrence even startAt search location is greater than length', function () {
  var expected = this.newFixture(3);
  var obj = this.newObject(expected);
  var len = 3;
  var idx;

  for (idx = 0; idx < len; idx++) {
    equal(obj.lastIndexOf(expected[idx], len + 1), idx, (0, _emberRuntimeSystemString.fmt)('obj.lastIndexOf(%@) should match idx', [expected[idx]]));
  }
});

suite.test('should return -1 when no match is found', function () {
  var obj = this.newObject(this.newFixture(3));
  var foo = {};

  equal(obj.lastIndexOf(foo), -1, 'obj.lastIndexOf(foo) should be -1');
});

suite.test('should return -1 when no match is found even startAt search location is equal to length', function () {
  var obj = this.newObject(this.newFixture(3));
  var foo = {};

  equal(obj.lastIndexOf(foo, obj.length), -1, 'obj.lastIndexOf(foo) should be -1');
});

suite.test('should return -1 when no match is found even startAt search location is greater than length', function () {
  var obj = this.newObject(this.newFixture(3));
  var foo = {};

  equal(obj.lastIndexOf(foo, obj.length + 1), -1, 'obj.lastIndexOf(foo) should be -1');
});

exports['default'] = suite;
module.exports = exports['default'];