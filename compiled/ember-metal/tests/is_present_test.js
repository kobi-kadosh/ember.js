'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_present = require('ember-metal/is_present');

var _emberMetalIs_present2 = _interopRequireDefault(_emberMetalIs_present);

QUnit.module('Ember.isPresent');

QUnit.test('Ember.isPresent', function () {
  var string = 'string';
  var fn = function fn() {};
  var object = { length: 0 };

  equal(false, (0, _emberMetalIs_present2['default'])(), 'for no params');
  equal(false, (0, _emberMetalIs_present2['default'])(null), 'for null');
  equal(false, (0, _emberMetalIs_present2['default'])(undefined), 'for undefined');
  equal(false, (0, _emberMetalIs_present2['default'])(''), 'for an empty String');
  equal(false, (0, _emberMetalIs_present2['default'])('  '), 'for a whitespace String');
  equal(false, (0, _emberMetalIs_present2['default'])('\n\t'), 'for another whitespace String');
  equal(true, (0, _emberMetalIs_present2['default'])('\n\t Hi'), 'for a String with whitespaces');
  equal(true, (0, _emberMetalIs_present2['default'])(true), 'for true');
  equal(true, (0, _emberMetalIs_present2['default'])(false), 'for false');
  equal(true, (0, _emberMetalIs_present2['default'])(string), 'for a String');
  equal(true, (0, _emberMetalIs_present2['default'])(fn), 'for a Function');
  equal(true, (0, _emberMetalIs_present2['default'])(0), 'for 0');
  equal(false, (0, _emberMetalIs_present2['default'])([]), 'for an empty Array');
  equal(true, (0, _emberMetalIs_present2['default'])({}), 'for an empty Object');
  equal(false, (0, _emberMetalIs_present2['default'])(object), 'for an Object that has zero \'length\'');
  equal(true, (0, _emberMetalIs_present2['default'])([1, 2, 3]), 'for a non-empty array');
});