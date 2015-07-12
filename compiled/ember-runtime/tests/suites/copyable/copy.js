'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('copy');

suite.test('should return an equivalent copy', function () {
  var obj = this.newObject();
  var copy = obj.copy();
  ok(this.isEqual(obj, copy), 'old object and new object should be equivalent');
});

exports['default'] = suite;
module.exports = exports['default'];