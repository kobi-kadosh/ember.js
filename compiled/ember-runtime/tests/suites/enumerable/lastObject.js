'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberMetalProperty_get = require('ember-metal/property_get');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('lastObject');

suite.test('returns last item in enumerable', function () {
  var obj = this.newObject();
  var ary = this.toArray(obj);

  equal((0, _emberMetalProperty_get.get)(obj, 'lastObject'), ary[ary.length - 1]);
});

suite.test('returns undefined if enumerable is empty', function () {
  var obj = this.newObject([]);

  equal((0, _emberMetalProperty_get.get)(obj, 'lastObject'), undefined);
});

exports['default'] = suite;
module.exports = exports['default'];