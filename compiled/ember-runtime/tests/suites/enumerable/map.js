'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalUtils = require('ember-metal/utils');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('map');

function mapFunc(item) {
  return item ? item.toString() : null;
}

suite.test('map should iterate over list', function () {
  var obj = this.newObject();
  var ary = this.toArray(obj).map(mapFunc);
  var found = [];

  found = obj.map(mapFunc);
  deepEqual(found, ary, 'mapped arrays should match');
});

suite.test('map should iterate over list after mutation', function () {
  if ((0, _emberMetalProperty_get.get)(this, 'canTestMutation')) {
    expect(0);
    return;
  }

  var obj = this.newObject();
  var ary = this.toArray(obj).map(mapFunc);
  var found;

  found = obj.map(mapFunc);
  deepEqual(found, ary, 'items passed during forEach should match');

  this.mutate(obj);
  ary = this.toArray(obj).map(mapFunc);
  found = obj.map(mapFunc);
  deepEqual(found, ary, 'items passed during forEach should match');
});

suite.test('2nd target parameter', function () {
  var obj = this.newObject();
  var target = this;

  obj.map(function () {});

  obj.map(function () {
    equal((0, _emberMetalUtils.guidFor)(this), (0, _emberMetalUtils.guidFor)(target), 'should pass target as this if context');
  }, target);
});

suite.test('callback params', function () {
  var obj = this.newObject();
  var ary = this.toArray(obj);
  var loc = 0;

  obj.map(function (item, idx, enumerable) {
    equal(item, ary[loc], 'item param');
    equal(idx, loc, 'idx param');
    equal((0, _emberMetalUtils.guidFor)(enumerable), (0, _emberMetalUtils.guidFor)(obj), 'enumerable param');
    loc++;
  });
});

exports['default'] = suite;
module.exports = exports['default'];

// ES6TODO: When transpiled we will end up with "use strict" which disables automatically binding to the global context.
// Therefore, the following test can never pass in strict mode unless we modify the `map` function implementation to
// use `Ember.lookup` if target is not specified.
//
// equal(guidFor(this), guidFor(global), 'should pass the global object as this if no context');