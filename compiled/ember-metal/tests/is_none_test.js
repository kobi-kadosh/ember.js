'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

QUnit.module('Ember.isNone');

QUnit.test('Ember.isNone', function () {
  var string = 'string';
  var fn = function fn() {};

  equal(true, (0, _emberMetalIs_none2['default'])(null), 'for null');
  equal(true, (0, _emberMetalIs_none2['default'])(undefined), 'for undefined');
  equal(false, (0, _emberMetalIs_none2['default'])(''), 'for an empty String');
  equal(false, (0, _emberMetalIs_none2['default'])(true), 'for true');
  equal(false, (0, _emberMetalIs_none2['default'])(false), 'for false');
  equal(false, (0, _emberMetalIs_none2['default'])(string), 'for a String');
  equal(false, (0, _emberMetalIs_none2['default'])(fn), 'for a Function');
  equal(false, (0, _emberMetalIs_none2['default'])(0), 'for 0');
  equal(false, (0, _emberMetalIs_none2['default'])([]), 'for an empty Array');
  equal(false, (0, _emberMetalIs_none2['default'])({}), 'for an empty Object');
});