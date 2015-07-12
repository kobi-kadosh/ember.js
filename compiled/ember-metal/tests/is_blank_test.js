'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_blank = require('ember-metal/is_blank');

var _emberMetalIs_blank2 = _interopRequireDefault(_emberMetalIs_blank);

QUnit.module('Ember.isBlank');

QUnit.test('Ember.isBlank', function () {
  var string = 'string';
  var fn = function fn() {};
  var object = { length: 0 };

  equal(true, (0, _emberMetalIs_blank2['default'])(null), 'for null');
  equal(true, (0, _emberMetalIs_blank2['default'])(undefined), 'for undefined');
  equal(true, (0, _emberMetalIs_blank2['default'])(''), 'for an empty String');
  equal(true, (0, _emberMetalIs_blank2['default'])('  '), 'for a whitespace String');
  equal(true, (0, _emberMetalIs_blank2['default'])('\n\t'), 'for another whitespace String');
  equal(false, (0, _emberMetalIs_blank2['default'])('\n\t Hi'), 'for a String with whitespaces');
  equal(false, (0, _emberMetalIs_blank2['default'])(true), 'for true');
  equal(false, (0, _emberMetalIs_blank2['default'])(false), 'for false');
  equal(false, (0, _emberMetalIs_blank2['default'])(string), 'for a String');
  equal(false, (0, _emberMetalIs_blank2['default'])(fn), 'for a Function');
  equal(false, (0, _emberMetalIs_blank2['default'])(0), 'for 0');
  equal(true, (0, _emberMetalIs_blank2['default'])([]), 'for an empty Array');
  equal(false, (0, _emberMetalIs_blank2['default'])({}), 'for an empty Object');
  equal(true, (0, _emberMetalIs_blank2['default'])(object), 'for an Object that has zero \'length\'');
  equal(false, (0, _emberMetalIs_blank2['default'])([1, 2, 3]), 'for a non-empty array');
});