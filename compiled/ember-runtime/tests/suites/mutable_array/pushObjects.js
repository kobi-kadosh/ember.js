'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('pushObjects');

suite.test('should raise exception if not Ember.Enumerable is passed to pushObjects', function () {
  var obj = this.newObject([]);

  throws(function () {
    obj.pushObjects('string');
  });
});

exports['default'] = suite;
module.exports = exports['default'];