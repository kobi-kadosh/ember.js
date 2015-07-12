'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('indexOf');

suite.test('should return index of object', function () {
  var expected = this.newFixture(3);
  var obj = this.newObject(expected);
  var len = 3;
  var idx;

  for (idx = 0; idx < len; idx++) {
    equal(obj.indexOf(expected[idx]), idx, (0, _emberRuntimeSystemString.fmt)('obj.indexOf(%@) should match idx', [expected[idx]]));
  }
});

suite.test('should return -1 when requesting object not in index', function () {
  var obj = this.newObject(this.newFixture(3));
  var foo = {};

  equal(obj.indexOf(foo), -1, 'obj.indexOf(foo) should be < 0');
});

exports['default'] = suite;
module.exports = exports['default'];