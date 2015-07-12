'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('addObject');

suite.test('should return receiver', function () {
  var before, obj;
  before = this.newFixture(3);
  obj = this.newObject(before);
  equal(obj.addObject(before[1]), obj, 'should return receiver');
});

suite.test('[A,B].addObject(C) => [A,B,C] + notify', function () {
  var obj, before, after, observer, item;

  before = this.newFixture(2);
  item = this.newFixture(1)[0];
  after = [before[0], before[1], item];
  obj = this.newObject(before);
  observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');
  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  obj.addObject(item);

  deepEqual(this.toArray(obj), after, 'post item results');
  equal(_emberMetalCore2['default'].get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    equal(observer.timesCalled('@each'), 1, 'should have notified @each once');
    equal(observer.timesCalled('length'), 1, 'should have notified length once');
    equal(observer.timesCalled('lastObject'), 1, 'should have notified lastObject once');

    equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject once');
  }
});

suite.test('[A,B,C].addObject(A) => [A,B,C] + NO notify', function () {
  var obj, before, after, observer, item;

  before = this.newFixture(3);
  after = before;
  item = before[0];
  obj = this.newObject(before);
  observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');
  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  obj.addObject(item); // note: item in set

  deepEqual(this.toArray(obj), after, 'post item results');
  equal(_emberMetalCore2['default'].get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    equal(observer.validate('[]'), false, 'should NOT have notified []');
    equal(observer.validate('@each'), false, 'should NOT have notified @each');
    equal(observer.validate('length'), false, 'should NOT have notified length');
    equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject once');
    equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject once');
  }
});

exports['default'] = suite;
module.exports = exports['default'];