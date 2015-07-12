'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeCompare = require('ember-runtime/compare');

var _emberRuntimeCompare2 = _interopRequireDefault(_emberRuntimeCompare);

var _emberRuntimeMixinsComparable = require('ember-runtime/mixins/comparable');

var _emberRuntimeMixinsComparable2 = _interopRequireDefault(_emberRuntimeMixinsComparable);

var Rectangle = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsComparable2['default'], {
  length: 0,
  width: 0,

  area: function area() {
    return (0, _emberMetalProperty_get.get)(this, 'length') * (0, _emberMetalProperty_get.get)(this, 'width');
  },

  compare: function compare(a, b) {
    return (0, _emberRuntimeCompare2['default'])(a.area(), b.area());
  }

});

var r1, r2;

QUnit.module('Comparable', {

  setup: function setup() {
    r1 = Rectangle.create({ length: 6, width: 12 });
    r2 = Rectangle.create({ length: 6, width: 13 });
  },

  teardown: function teardown() {}

});

QUnit.test('should be comparable and return the correct result', function () {
  equal(_emberRuntimeMixinsComparable2['default'].detect(r1), true);
  equal((0, _emberRuntimeCompare2['default'])(r1, r1), 0);
  equal((0, _emberRuntimeCompare2['default'])(r1, r2), -1);
  equal((0, _emberRuntimeCompare2['default'])(r2, r1), 1);
});