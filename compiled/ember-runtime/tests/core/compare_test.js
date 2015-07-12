'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeCompare = require('ember-runtime/compare');

var _emberRuntimeCompare2 = _interopRequireDefault(_emberRuntimeCompare);

var _emberRuntimeMixinsComparable = require('ember-runtime/mixins/comparable');

var _emberRuntimeMixinsComparable2 = _interopRequireDefault(_emberRuntimeMixinsComparable);

var data = [];
var Comp = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsComparable2['default']);

Comp.reopenClass({
  compare: function compare(obj) {
    return obj.get('val');
  }
});

QUnit.module('Ember.compare()', {
  setup: function setup() {
    data[0] = null;
    data[1] = false;
    data[2] = true;
    data[3] = -12;
    data[4] = 3.5;
    data[5] = 'a string';
    data[6] = 'another string';
    data[7] = 'last string';
    data[8] = [1, 2];
    data[9] = [1, 2, 3];
    data[10] = [1, 3];
    data[11] = { a: 'hash' };
    data[12] = _emberRuntimeSystemObject2['default'].create();
    data[13] = function (a) {
      return a;
    };
    data[14] = new Date('2012/01/01');
    data[15] = new Date('2012/06/06');
  }
});

QUnit.test('ordering should work', function () {
  var suspect, comparable, failureMessage, suspectIndex, comparableIndex;

  for (suspectIndex = 0; suspectIndex < data.length; suspectIndex++) {
    suspect = data[suspectIndex];

    equal((0, _emberRuntimeCompare2['default'])(suspect, suspect), 0, suspectIndex + ' should equal itself');

    for (comparableIndex = suspectIndex + 1; comparableIndex < data.length; comparableIndex++) {
      comparable = data[comparableIndex];

      failureMessage = 'data[' + suspectIndex + '] (' + (0, _emberRuntimeUtils.typeOf)(suspect) + ') should be smaller than data[' + comparableIndex + '] (' + (0, _emberRuntimeUtils.typeOf)(comparable) + ')';

      equal((0, _emberRuntimeCompare2['default'])(suspect, comparable), -1, failureMessage);
    }
  }
});

QUnit.test('comparables should return values in the range of -1, 0, 1', function () {
  var negOne = Comp.create({
    val: -1
  });

  var zero = Comp.create({
    val: 0
  });

  var one = Comp.create({
    val: 1
  });

  equal((0, _emberRuntimeCompare2['default'])(negOne, 'a'), -1, 'First item comparable - returns -1 (not negated)');
  equal((0, _emberRuntimeCompare2['default'])(zero, 'b'), 0, 'First item comparable - returns  0 (not negated)');
  equal((0, _emberRuntimeCompare2['default'])(one, 'c'), 1, 'First item comparable - returns  1 (not negated)');

  equal((0, _emberRuntimeCompare2['default'])('a', negOne), 1, 'Second item comparable - returns -1 (negated)');
  equal((0, _emberRuntimeCompare2['default'])('b', zero), 0, 'Second item comparable - returns  0 (negated)');
  equal((0, _emberRuntimeCompare2['default'])('c', one), -1, 'Second item comparable - returns  1 (negated)');
});