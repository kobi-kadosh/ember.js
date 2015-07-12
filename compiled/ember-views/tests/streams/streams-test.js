'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsStreamsShould_display = require('ember-views/streams/should_display');

var _emberViewsStreamsShould_display2 = _interopRequireDefault(_emberViewsStreamsShould_display);

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalComputed2 = _interopRequireDefault(_emberMetalComputed);

QUnit.module('shouldDisplay');

QUnit.test('predicate permutations', function () {
  equal((0, _emberViewsStreamsShould_display2['default'])(0), false, 'shouldDisplay(0)');
  equal((0, _emberViewsStreamsShould_display2['default'])(-1), true, 'shouldDisplay(-1)');
  equal((0, _emberViewsStreamsShould_display2['default'])(1), true, 'shouldDisplay(1)');
  equal((0, _emberViewsStreamsShould_display2['default'])(Number(1)), true, 'shouldDisplay(Number(1))');
  equal((0, _emberViewsStreamsShould_display2['default'])(Number(0)), false, 'shouldDisplay(Number(0))');
  equal((0, _emberViewsStreamsShould_display2['default'])(Number(-1)), true, 'shouldDisplay(Number(-1))');
  equal((0, _emberViewsStreamsShould_display2['default'])(Boolean(true)), true, 'shouldDisplay(Boolean(true))');
  equal((0, _emberViewsStreamsShould_display2['default'])(Boolean(false)), false, 'shouldDisplay(Boolean(false))');
  equal((0, _emberViewsStreamsShould_display2['default'])(NaN), false, 'shouldDisplay(NaN)');
  equal((0, _emberViewsStreamsShould_display2['default'])('string'), true, 'shouldDisplay("string")');
  equal((0, _emberViewsStreamsShould_display2['default'])(String('string')), true, 'shouldDisplay(String("string"))');
  equal((0, _emberViewsStreamsShould_display2['default'])(Infinity), true, 'shouldDisplay(Infinity)');
  equal((0, _emberViewsStreamsShould_display2['default'])(-Infinity), true, 'shouldDisplay(-Infinity)');
  equal((0, _emberViewsStreamsShould_display2['default'])([]), false, 'shouldDisplay([])');
  equal((0, _emberViewsStreamsShould_display2['default'])([1]), true, 'shouldDisplay([1])');
  equal((0, _emberViewsStreamsShould_display2['default'])({}), true, 'shouldDisplay({})');
  equal((0, _emberViewsStreamsShould_display2['default'])(true), true, 'shouldDisplay(true)');
  equal((0, _emberViewsStreamsShould_display2['default'])(false), false, 'shouldDisplay(false)');
  equal((0, _emberViewsStreamsShould_display2['default'])({ isTruthy: true }), true, 'shouldDisplay({ isTruthy: true })');
  equal((0, _emberViewsStreamsShould_display2['default'])({ isTruthy: false }), false, 'shouldDisplay({ isTruthy: false })');

  equal((0, _emberViewsStreamsShould_display2['default'])(function foo() {}), true, 'shouldDisplay(function (){})');

  function falseFunction() {}
  falseFunction.isTruthy = false;

  equal((0, _emberViewsStreamsShould_display2['default'])(falseFunction), true, 'shouldDisplay(function.isTruthy = false)');

  function trueFunction() {}
  falseFunction.isTruthy = true;
  equal((0, _emberViewsStreamsShould_display2['default'])(trueFunction), true, 'shouldDisplay(function.isTruthy = true)');

  var truthyObj = {};
  (0, _emberMetalProperties.defineProperty)(truthyObj, 'isTruthy', (0, _emberMetalComputed2['default'])(function () {
    return true;
  }));
  equal((0, _emberViewsStreamsShould_display2['default'])(truthyObj), true, 'shouldDisplay(obj.get("isTruthy") === true)');

  var falseyObj = {};
  (0, _emberMetalProperties.defineProperty)(falseyObj, 'isTruthy', (0, _emberMetalComputed2['default'])(function () {
    return false;
  }));
  equal((0, _emberViewsStreamsShould_display2['default'])(falseyObj), false, 'shouldDisplay(obj.get("isFalsey") === false)');

  var falsyArray = [1];
  falsyArray.isTruthy = false;
  equal((0, _emberViewsStreamsShould_display2['default'])(falsyArray), false, '[1].isTruthy = false');

  var falseyCPArray = [1];
  (0, _emberMetalProperties.defineProperty)(falseyCPArray, 'isTruthy', (0, _emberMetalComputed2['default'])(function () {
    return false;
  }));
  equal((0, _emberViewsStreamsShould_display2['default'])(falseyCPArray), false, 'shouldDisplay([1].get("isFalsey") === true');
});