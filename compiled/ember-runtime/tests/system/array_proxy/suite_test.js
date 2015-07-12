'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeTestsSuitesMutable_array = require('ember-runtime/tests/suites/mutable_array');

var _emberRuntimeTestsSuitesMutable_array2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_array);

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberMetalProperty_get = require('ember-metal/property_get');

_emberRuntimeTestsSuitesMutable_array2['default'].extend({

  name: 'Ember.ArrayProxy',

  newObject: function newObject(ary) {
    var ret = ary ? ary.slice() : this.newFixture(3);
    return _emberRuntimeSystemArray_proxy2['default'].create({ content: _emberMetalCore2['default'].A(ret) });
  },

  mutate: function mutate(obj) {
    obj.pushObject((0, _emberMetalProperty_get.get)(obj, 'length') + 1);
  },

  toArray: function toArray(obj) {
    return obj.toArray ? obj.toArray() : obj.slice();
  }

}).run();