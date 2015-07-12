'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeTestsSuitesMutable_array = require('ember-runtime/tests/suites/mutable_array');

var _emberRuntimeTestsSuitesMutable_array2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_array);

_emberRuntimeTestsSuitesMutable_array2['default'].extend({

  name: 'Native Array',

  newObject: function newObject(ary) {
    return _emberMetalCore2['default'].A(ary ? ary.slice() : this.newFixture(3));
  },

  mutate: function mutate(obj) {
    obj.pushObject(obj.length + 1);
  },

  toArray: function toArray(obj) {
    return obj.slice(); // make a copy.
  }

}).run();