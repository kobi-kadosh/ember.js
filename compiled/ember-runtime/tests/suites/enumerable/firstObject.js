'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberMetalProperty_get = require('ember-metal/property_get');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('firstObject');

suite.test('returns first item in enumerable', function () {
  var obj = this.newObject();
  equal((0, _emberMetalProperty_get.get)(obj, 'firstObject'), this.toArray(obj)[0]);
});

suite.test('returns undefined if enumerable is empty', function () {
  var obj = this.newObject([]);
  equal((0, _emberMetalProperty_get.get)(obj, 'firstObject'), undefined);
});

exports['default'] = suite;
module.exports = exports['default'];