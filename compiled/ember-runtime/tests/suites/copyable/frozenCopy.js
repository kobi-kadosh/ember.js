'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberRuntimeMixinsFreezable = require('ember-runtime/mixins/freezable');

var _emberMetalProperty_get = require('ember-metal/property_get');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('frozenCopy');

suite.test('frozen objects should return same instance', function () {
  var obj, copy;

  obj = this.newObject();
  if ((0, _emberMetalProperty_get.get)(this, 'shouldBeFreezable')) {
    ok(!_emberRuntimeMixinsFreezable.Freezable || _emberRuntimeMixinsFreezable.Freezable.detect(obj), 'object should be freezable');

    copy = obj.frozenCopy();
    ok(this.isEqual(obj, copy), 'new copy should be equal');
    ok((0, _emberMetalProperty_get.get)(copy, 'isFrozen'), 'returned value should be frozen');

    copy = obj.freeze().frozenCopy();
    equal(copy, obj, 'returns frozen object should be same');
    ok((0, _emberMetalProperty_get.get)(copy, 'isFrozen'), 'returned object should be frozen');
  } else {
    ok(!_emberRuntimeMixinsFreezable.Freezable || !_emberRuntimeMixinsFreezable.Freezable.detect(obj), 'object should not be freezable');
  }
});

exports['default'] = suite;
module.exports = exports['default'];