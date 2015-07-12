'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberMetalProperty_get = require('ember-metal/property_get');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('sortBy');

suite.test('sort by value of property', function () {
  var obj = this.newObject([{ a: 2 }, { a: 1 }]);
  var sorted = obj.sortBy('a');

  equal((0, _emberMetalProperty_get.get)(sorted[0], 'a'), 1);
  equal((0, _emberMetalProperty_get.get)(sorted[1], 'a'), 2);
});

suite.test('supports multiple propertyNames', function () {
  var obj = this.newObject([{ a: 1, b: 2 }, { a: 1, b: 1 }]);
  var sorted = obj.sortBy('a', 'b');

  equal((0, _emberMetalProperty_get.get)(sorted[0], 'b'), 1);
  equal((0, _emberMetalProperty_get.get)(sorted[1], 'b'), 2);
});

exports['default'] = suite;
module.exports = exports['default'];