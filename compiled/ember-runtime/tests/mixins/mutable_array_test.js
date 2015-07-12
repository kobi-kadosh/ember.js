'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeTestsSuitesMutable_array = require('ember-runtime/tests/suites/mutable_array');

var _emberRuntimeTestsSuitesMutable_array2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_array);

var _emberRuntimeMixinsMutable_array = require('ember-runtime/mixins/mutable_array');

var _emberRuntimeMixinsMutable_array2 = _interopRequireDefault(_emberRuntimeMixinsMutable_array);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/*
  Implement a basic fake mutable array.  This validates that any non-native
  enumerable can impl this API.
*/
var TestMutableArray = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsMutable_array2['default'], {

  _content: null,

  init: function init(ary) {
    this._content = _emberMetalCore2['default'].A(ary || []);
  },

  replace: function replace(idx, amt, objects) {

    var args = objects ? objects.slice() : [];
    var removeAmt = amt;
    var addAmt = args.length;

    this.arrayContentWillChange(idx, removeAmt, addAmt);

    args.unshift(amt);
    args.unshift(idx);
    this._content.splice.apply(this._content, args);
    this.arrayContentDidChange(idx, removeAmt, addAmt);
    return this;
  },

  objectAt: function objectAt(idx) {
    return this._content[idx];
  },

  length: (0, _emberMetalComputed.computed)(function () {
    return this._content.length;
  }),

  slice: function slice() {
    return this._content.slice();
  }

});

_emberRuntimeTestsSuitesMutable_array2['default'].extend({

  name: 'Basic Mutable Array',

  newObject: function newObject(ary) {
    ary = ary ? ary.slice() : this.newFixture(3);
    return new TestMutableArray(ary);
  },

  // allows for testing of the basic enumerable after an internal mutation
  mutate: function mutate(obj) {
    obj.addObject(this.getFixture(1)[0]);
  },

  toArray: function toArray(obj) {
    return obj.slice();
  }

}).run();