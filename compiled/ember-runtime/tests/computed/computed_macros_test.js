'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalComputed_macros = require('ember-metal/computed_macros');

var _emberMetalAlias = require('ember-metal/alias');

var _emberMetalAlias2 = _interopRequireDefault(_emberMetalAlias);

var _emberMetalProperties = require('ember-metal/properties');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

QUnit.module('CP macros');

(0, _emberMetalTestsProps_helper.testBoth)('Ember.computed.empty', function (get, set) {
  var obj = _emberRuntimeSystemObject2['default'].extend({
    bestLannister: null,
    lannisters: null,

    bestLannisterUnspecified: (0, _emberMetalComputed_macros.empty)('bestLannister'),
    noLannistersKnown: (0, _emberMetalComputed_macros.empty)('lannisters')
  }).create({
    lannisters: _emberMetalCore2['default'].A([])
  });

  equal(get(obj, 'bestLannisterUnspecified'), true, 'bestLannister initially empty');
  equal(get(obj, 'noLannistersKnown'), true, 'lannisters initially empty');

  get(obj, 'lannisters').pushObject('Tyrion');
  set(obj, 'bestLannister', 'Tyrion');

  equal(get(obj, 'bestLannisterUnspecified'), false, 'empty respects strings');
  equal(get(obj, 'noLannistersKnown'), false, 'empty respects array mutations');
});

(0, _emberMetalTestsProps_helper.testBoth)('Ember.computed.notEmpty', function (get, set) {
  var obj = _emberRuntimeSystemObject2['default'].extend({
    bestLannister: null,
    lannisters: null,

    bestLannisterSpecified: (0, _emberMetalComputed_macros.notEmpty)('bestLannister'),
    LannistersKnown: (0, _emberMetalComputed_macros.notEmpty)('lannisters')
  }).create({
    lannisters: _emberMetalCore2['default'].A([])
  });

  equal(get(obj, 'bestLannisterSpecified'), false, 'bestLannister initially empty');
  equal(get(obj, 'LannistersKnown'), false, 'lannisters initially empty');

  get(obj, 'lannisters').pushObject('Tyrion');
  set(obj, 'bestLannister', 'Tyrion');

  equal(get(obj, 'bestLannisterSpecified'), true, 'empty respects strings');
  equal(get(obj, 'LannistersKnown'), true, 'empty respects array mutations');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.not', function (get, set) {
  var obj = { foo: true };
  (0, _emberMetalProperties.defineProperty)(obj, 'notFoo', (0, _emberMetalComputed_macros.not)('foo'));
  equal(get(obj, 'notFoo'), false);

  obj = { foo: { bar: true } };
  (0, _emberMetalProperties.defineProperty)(obj, 'notFoo', (0, _emberMetalComputed_macros.not)('foo.bar'));
  equal(get(obj, 'notFoo'), false);
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.empty', function (get, set) {
  var obj = { foo: [], bar: undefined, baz: null, quz: '' };
  (0, _emberMetalProperties.defineProperty)(obj, 'fooEmpty', (0, _emberMetalComputed_macros.empty)('foo'));
  (0, _emberMetalProperties.defineProperty)(obj, 'barEmpty', (0, _emberMetalComputed_macros.empty)('bar'));
  (0, _emberMetalProperties.defineProperty)(obj, 'bazEmpty', (0, _emberMetalComputed_macros.empty)('baz'));
  (0, _emberMetalProperties.defineProperty)(obj, 'quzEmpty', (0, _emberMetalComputed_macros.empty)('quz'));

  equal(get(obj, 'fooEmpty'), true);
  set(obj, 'foo', [1]);
  equal(get(obj, 'fooEmpty'), false);
  equal(get(obj, 'barEmpty'), true);
  equal(get(obj, 'bazEmpty'), true);
  equal(get(obj, 'quzEmpty'), true);
  set(obj, 'quz', 'asdf');
  equal(get(obj, 'quzEmpty'), false);
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.bool', function (get, set) {
  var obj = { foo: function foo() {}, bar: 'asdf', baz: null, quz: false };
  (0, _emberMetalProperties.defineProperty)(obj, 'fooBool', (0, _emberMetalComputed_macros.bool)('foo'));
  (0, _emberMetalProperties.defineProperty)(obj, 'barBool', (0, _emberMetalComputed_macros.bool)('bar'));
  (0, _emberMetalProperties.defineProperty)(obj, 'bazBool', (0, _emberMetalComputed_macros.bool)('baz'));
  (0, _emberMetalProperties.defineProperty)(obj, 'quzBool', (0, _emberMetalComputed_macros.bool)('quz'));
  equal(get(obj, 'fooBool'), true);
  equal(get(obj, 'barBool'), true);
  equal(get(obj, 'bazBool'), false);
  equal(get(obj, 'quzBool'), false);
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.alias', function (get, set) {
  var obj = { bar: 'asdf', baz: null, quz: false };
  (0, _emberMetalProperties.defineProperty)(obj, 'bay', (0, _emberMetalComputed.computed)(function (key) {
    return 'apple';
  }));

  (0, _emberMetalProperties.defineProperty)(obj, 'barAlias', (0, _emberMetalAlias2['default'])('bar'));
  (0, _emberMetalProperties.defineProperty)(obj, 'bazAlias', (0, _emberMetalAlias2['default'])('baz'));
  (0, _emberMetalProperties.defineProperty)(obj, 'quzAlias', (0, _emberMetalAlias2['default'])('quz'));
  (0, _emberMetalProperties.defineProperty)(obj, 'bayAlias', (0, _emberMetalAlias2['default'])('bay'));

  equal(get(obj, 'barAlias'), 'asdf');
  equal(get(obj, 'bazAlias'), null);
  equal(get(obj, 'quzAlias'), false);
  equal(get(obj, 'bayAlias'), 'apple');

  set(obj, 'barAlias', 'newBar');
  set(obj, 'bazAlias', 'newBaz');
  set(obj, 'quzAlias', null);

  equal(get(obj, 'barAlias'), 'newBar');
  equal(get(obj, 'bazAlias'), 'newBaz');
  equal(get(obj, 'quzAlias'), null);

  equal(get(obj, 'bar'), 'newBar');
  equal(get(obj, 'baz'), 'newBaz');
  equal(get(obj, 'quz'), null);
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.alias set', function (get, set) {
  var obj = {};
  var constantValue = 'always `a`';

  (0, _emberMetalProperties.defineProperty)(obj, 'original', (0, _emberMetalComputed.computed)({
    get: function get(key) {
      return constantValue;
    },
    set: function set(key, value) {
      return constantValue;
    }
  }));
  (0, _emberMetalProperties.defineProperty)(obj, 'aliased', (0, _emberMetalAlias2['default'])('original'));

  equal(get(obj, 'original'), constantValue);
  equal(get(obj, 'aliased'), constantValue);

  set(obj, 'aliased', 'should not set to this value');

  equal(get(obj, 'original'), constantValue);
  equal(get(obj, 'aliased'), constantValue);
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.match', function (get, set) {
  var obj = { name: 'Paul' };
  (0, _emberMetalProperties.defineProperty)(obj, 'isPaul', (0, _emberMetalComputed_macros.match)('name', /Paul/));

  equal(get(obj, 'isPaul'), true, 'is Paul');

  set(obj, 'name', 'Pierre');

  equal(get(obj, 'isPaul'), false, 'is not Paul anymore');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.notEmpty', function (get, set) {
  var obj = { items: [1] };
  (0, _emberMetalProperties.defineProperty)(obj, 'hasItems', (0, _emberMetalComputed_macros.notEmpty)('items'));

  equal(get(obj, 'hasItems'), true, 'is not empty');

  set(obj, 'items', []);

  equal(get(obj, 'hasItems'), false, 'is empty');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.equal', function (get, set) {
  var obj = { name: 'Paul' };
  (0, _emberMetalProperties.defineProperty)(obj, 'isPaul', (0, _emberMetalComputed_macros.equal)('name', 'Paul'));

  equal(get(obj, 'isPaul'), true, 'is Paul');

  set(obj, 'name', 'Pierre');

  equal(get(obj, 'isPaul'), false, 'is not Paul anymore');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.gt', function (get, set) {
  var obj = { number: 2 };
  (0, _emberMetalProperties.defineProperty)(obj, 'isGreaterThenOne', (0, _emberMetalComputed_macros.gt)('number', 1));

  equal(get(obj, 'isGreaterThenOne'), true, 'is gt');

  set(obj, 'number', 1);

  equal(get(obj, 'isGreaterThenOne'), false, 'is not gt');

  set(obj, 'number', 0);

  equal(get(obj, 'isGreaterThenOne'), false, 'is not gt');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.gte', function (get, set) {
  var obj = { number: 2 };
  (0, _emberMetalProperties.defineProperty)(obj, 'isGreaterOrEqualThenOne', (0, _emberMetalComputed_macros.gte)('number', 1));

  equal(get(obj, 'isGreaterOrEqualThenOne'), true, 'is gte');

  set(obj, 'number', 1);

  equal(get(obj, 'isGreaterOrEqualThenOne'), true, 'is gte');

  set(obj, 'number', 0);

  equal(get(obj, 'isGreaterOrEqualThenOne'), false, 'is not gte');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.lt', function (get, set) {
  var obj = { number: 0 };
  (0, _emberMetalProperties.defineProperty)(obj, 'isLesserThenOne', (0, _emberMetalComputed_macros.lt)('number', 1));

  equal(get(obj, 'isLesserThenOne'), true, 'is lt');

  set(obj, 'number', 1);

  equal(get(obj, 'isLesserThenOne'), false, 'is not lt');

  set(obj, 'number', 2);

  equal(get(obj, 'isLesserThenOne'), false, 'is not lt');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.lte', function (get, set) {
  var obj = { number: 0 };
  (0, _emberMetalProperties.defineProperty)(obj, 'isLesserOrEqualThenOne', (0, _emberMetalComputed_macros.lte)('number', 1));

  equal(get(obj, 'isLesserOrEqualThenOne'), true, 'is lte');

  set(obj, 'number', 1);

  equal(get(obj, 'isLesserOrEqualThenOne'), true, 'is lte');

  set(obj, 'number', 2);

  equal(get(obj, 'isLesserOrEqualThenOne'), false, 'is not lte');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.and', function (get, set) {
  var obj = { one: true, two: true };
  (0, _emberMetalProperties.defineProperty)(obj, 'oneAndTwo', (0, _emberMetalComputed_macros.and)('one', 'two'));

  equal(get(obj, 'oneAndTwo'), true, 'one and two');

  set(obj, 'one', false);

  equal(get(obj, 'oneAndTwo'), false, 'one and not two');

  set(obj, 'one', true);
  set(obj, 'two', 2);

  equal(get(obj, 'oneAndTwo'), 2, 'returns truthy value as in &&');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.or', function (get, set) {
  var obj = { one: true, two: true };
  (0, _emberMetalProperties.defineProperty)(obj, 'oneOrTwo', (0, _emberMetalComputed_macros.or)('one', 'two'));

  equal(get(obj, 'oneOrTwo'), true, 'one or two');

  set(obj, 'one', false);

  equal(get(obj, 'oneOrTwo'), true, 'one or two');

  set(obj, 'two', false);

  equal(get(obj, 'oneOrTwo'), false, 'nore one nore two');

  set(obj, 'two', true);

  equal(get(obj, 'oneOrTwo'), true, 'one or two');

  set(obj, 'one', 1);

  equal(get(obj, 'oneOrTwo'), 1, 'returns truthy value as in ||');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.collect', function (get, set) {
  var obj = { one: 'foo', two: 'bar', three: null };
  (0, _emberMetalProperties.defineProperty)(obj, 'all', (0, _emberMetalComputed_macros.collect)('one', 'two', 'three', 'four'));

  deepEqual(get(obj, 'all'), ['foo', 'bar', null, null], 'have all of them');

  set(obj, 'four', true);

  deepEqual(get(obj, 'all'), ['foo', 'bar', null, true], 'have all of them');

  var a = [];
  set(obj, 'one', 0);
  set(obj, 'three', a);

  deepEqual(get(obj, 'all'), [0, 'bar', a, true], 'have all of them');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.oneWay', function (get, set) {
  var obj = {
    firstName: 'Teddy',
    lastName: 'Zeenny'
  };

  (0, _emberMetalProperties.defineProperty)(obj, 'nickName', (0, _emberMetalComputed_macros.oneWay)('firstName'));

  equal(get(obj, 'firstName'), 'Teddy');
  equal(get(obj, 'lastName'), 'Zeenny');
  equal(get(obj, 'nickName'), 'Teddy');

  set(obj, 'nickName', 'TeddyBear');

  equal(get(obj, 'firstName'), 'Teddy');
  equal(get(obj, 'lastName'), 'Zeenny');

  equal(get(obj, 'nickName'), 'TeddyBear');

  set(obj, 'firstName', 'TEDDDDDDDDYYY');

  equal(get(obj, 'nickName'), 'TeddyBear');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.readOnly', function (get, set) {
  var obj = {
    firstName: 'Teddy',
    lastName: 'Zeenny'
  };

  (0, _emberMetalProperties.defineProperty)(obj, 'nickName', (0, _emberMetalComputed_macros.readOnly)('firstName'));

  equal(get(obj, 'firstName'), 'Teddy');
  equal(get(obj, 'lastName'), 'Zeenny');
  equal(get(obj, 'nickName'), 'Teddy');

  throws(function () {
    set(obj, 'nickName', 'TeddyBear');
  }, / /);

  equal(get(obj, 'firstName'), 'Teddy');
  equal(get(obj, 'lastName'), 'Zeenny');

  equal(get(obj, 'nickName'), 'Teddy');

  set(obj, 'firstName', 'TEDDDDDDDDYYY');

  equal(get(obj, 'nickName'), 'TEDDDDDDDDYYY');
});

(0, _emberMetalTestsProps_helper.testBoth)('computed.deprecatingAlias', function (get, set) {
  var obj = { bar: 'asdf', baz: null, quz: false };
  (0, _emberMetalProperties.defineProperty)(obj, 'bay', (0, _emberMetalComputed.computed)(function (key) {
    return 'apple';
  }));

  (0, _emberMetalProperties.defineProperty)(obj, 'barAlias', (0, _emberMetalComputed_macros.deprecatingAlias)('bar'));
  (0, _emberMetalProperties.defineProperty)(obj, 'bazAlias', (0, _emberMetalComputed_macros.deprecatingAlias)('baz'));
  (0, _emberMetalProperties.defineProperty)(obj, 'quzAlias', (0, _emberMetalComputed_macros.deprecatingAlias)('quz'));
  (0, _emberMetalProperties.defineProperty)(obj, 'bayAlias', (0, _emberMetalComputed_macros.deprecatingAlias)('bay'));

  expectDeprecation(function () {
    equal(get(obj, 'barAlias'), 'asdf');
  }, 'Usage of `barAlias` is deprecated, use `bar` instead.');

  expectDeprecation(function () {
    equal(get(obj, 'bazAlias'), null);
  }, 'Usage of `bazAlias` is deprecated, use `baz` instead.');

  expectDeprecation(function () {
    equal(get(obj, 'quzAlias'), false);
  }, 'Usage of `quzAlias` is deprecated, use `quz` instead.');

  expectDeprecation(function () {
    equal(get(obj, 'bayAlias'), 'apple');
  }, 'Usage of `bayAlias` is deprecated, use `bay` instead.');

  expectDeprecation(function () {
    set(obj, 'barAlias', 'newBar');
  }, 'Usage of `barAlias` is deprecated, use `bar` instead.');

  expectDeprecation(function () {
    set(obj, 'bazAlias', 'newBaz');
  }, 'Usage of `bazAlias` is deprecated, use `baz` instead.');

  expectDeprecation(function () {
    set(obj, 'quzAlias', null);
  }, 'Usage of `quzAlias` is deprecated, use `quz` instead.');

  equal(get(obj, 'barAlias'), 'newBar');
  equal(get(obj, 'bazAlias'), 'newBaz');
  equal(get(obj, 'quzAlias'), null);

  equal(get(obj, 'bar'), 'newBar');
  equal(get(obj, 'baz'), 'newBaz');
  equal(get(obj, 'quz'), null);
});