'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_empty = require('ember-metal/is_empty');

var _emberMetalIs_empty2 = _interopRequireDefault(_emberMetalIs_empty);

var _emberMetalMap = require('ember-metal/map');

QUnit.module('Ember.isEmpty');

QUnit.test('Ember.isEmpty', function () {
  var string = 'string';
  var fn = function fn() {};
  var object = { length: 0 };

  equal(true, (0, _emberMetalIs_empty2['default'])(null), 'for null');
  equal(true, (0, _emberMetalIs_empty2['default'])(undefined), 'for undefined');
  equal(true, (0, _emberMetalIs_empty2['default'])(''), 'for an empty String');
  equal(false, (0, _emberMetalIs_empty2['default'])(true), 'for true');
  equal(false, (0, _emberMetalIs_empty2['default'])(false), 'for false');
  equal(false, (0, _emberMetalIs_empty2['default'])(string), 'for a String');
  equal(false, (0, _emberMetalIs_empty2['default'])(fn), 'for a Function');
  equal(false, (0, _emberMetalIs_empty2['default'])(0), 'for 0');
  equal(true, (0, _emberMetalIs_empty2['default'])([]), 'for an empty Array');
  equal(false, (0, _emberMetalIs_empty2['default'])({}), 'for an empty Object');
  equal(true, (0, _emberMetalIs_empty2['default'])(object), 'for an Object that has zero \'length\'');
});

QUnit.test('Ember.isEmpty Ember.Map', function () {
  var map = new _emberMetalMap.Map();
  equal(true, (0, _emberMetalIs_empty2['default'])(map), 'Empty map is empty');
  map.set('foo', 'bar');
  equal(false, (0, _emberMetalIs_empty2['default'])(map), 'Map is not empty');
});

QUnit.test('Ember.isEmpty Ember.OrderedSet', function () {
  var orderedSet = new _emberMetalMap.OrderedSet();
  equal(true, (0, _emberMetalIs_empty2['default'])(orderedSet), 'Empty ordered set is empty');
  orderedSet.add('foo');
  equal(false, (0, _emberMetalIs_empty2['default'])(orderedSet), 'Ordered set is not empty');
});