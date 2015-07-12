'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberMetalProperty_get = require('ember-metal/property_get');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('reverseObjects');

suite.test('[A,B,C].reverseObjects() => [] + notify', function () {
  var obj, before, after, observer;

  before = this.newFixture(3);
  after = [before[2], before[1], before[0]];
  obj = this.newObject(before);
  observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');
  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  equal(obj.reverseObjects(), obj, 'return self');

  deepEqual(this.toArray(obj), after, 'post item results');
  equal((0, _emberMetalProperty_get.get)(obj, 'length'), after.length, 'length');

  equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
  equal(observer.timesCalled('@each'), 1, 'should have notified @each once');
  equal(observer.timesCalled('length'), 0, 'should have notified length once');
  equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject once');
  equal(observer.timesCalled('lastObject'), 1, 'should have notified lastObject once');
});

exports['default'] = suite;
module.exports = exports['default'];