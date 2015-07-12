'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesMutable_enumerable = require('ember-runtime/tests/suites/mutable_enumerable');

var _emberRuntimeTestsSuitesMutable_enumerable2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_enumerable);

var _emberRuntimeMixinsMutable_enumerable = require('ember-runtime/mixins/mutable_enumerable');

var _emberRuntimeMixinsMutable_enumerable2 = _interopRequireDefault(_emberRuntimeMixinsMutable_enumerable);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_get = require('ember-metal/property_get');

/*
  Implement a basic fake mutable array.  This validates that any non-native
  enumerable can impl this API.
*/
var TestMutableEnumerable = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsMutable_enumerable2['default'], {

  _content: null,

  addObject: function addObject(obj) {
    if (this._content.indexOf(obj) >= 0) {
      return this;
    }

    this.enumerableContentWillChange(null, [obj]);
    this._content.push(obj);
    this.enumerableContentDidChange(null, [obj]);
  },

  removeObject: function removeObject(obj) {
    var idx = this._content.indexOf(obj);
    if (idx < 0) {
      return this;
    }

    this.enumerableContentWillChange([obj], null);
    this._content.splice(idx, 1);
    this.enumerableContentDidChange([obj], null);
    return this;
  },

  init: function init(ary) {
    this._content = ary || [];
  },

  nextObject: function nextObject(idx) {
    return idx >= (0, _emberMetalProperty_get.get)(this, 'length') ? undefined : this._content[idx];
  },

  length: (0, _emberMetalComputed.computed)(function () {
    return this._content.length;
  }),

  slice: function slice() {
    return this._content.slice();
  }
});

_emberRuntimeTestsSuitesMutable_enumerable2['default'].extend({

  name: 'Basic Mutable Array',

  newObject: function newObject(ary) {
    ary = ary ? ary.slice() : this.newFixture(3);
    return new TestMutableEnumerable(ary);
  },

  // allows for testing of the basic enumerable after an internal mutation
  mutate: function mutate(obj) {
    obj.addObject(this.getFixture(1)[0]);
  },

  toArray: function toArray(obj) {
    return obj.slice();
  }

}).run();