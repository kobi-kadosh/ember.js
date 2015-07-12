'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('toArray');

suite.test('toArray should convert to an array', function () {
  var obj = this.newObject();
  deepEqual(obj.toArray(), this.toArray(obj));
});

exports['default'] = suite;
module.exports = exports['default'];