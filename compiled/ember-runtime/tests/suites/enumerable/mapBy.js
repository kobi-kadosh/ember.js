'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('mapBy');

suite.test('get value of each property', function () {
  var obj = this.newObject([{ a: 1 }, { a: 2 }]);
  equal(obj.mapBy('a').join(''), '12');
});

suite.test('should work also through getEach alias', function () {
  var obj = this.newObject([{ a: 1 }, { a: 2 }]);
  equal(obj.getEach('a').join(''), '12');
});

exports['default'] = suite;
module.exports = exports['default'];