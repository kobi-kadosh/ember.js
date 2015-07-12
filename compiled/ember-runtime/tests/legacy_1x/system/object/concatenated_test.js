'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemString2 = _interopRequireDefault(_emberRuntimeSystemString);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * changed get(obj, ) and set(obj, ) to Ember.get() and Ember.set()
  * converted uses of obj.isEqual() to use deepEqual() test since isEqual is not
    always defined
*/

function K() {
  return this;
}

var klass;

QUnit.module('EmberObject Concatenated Properties', {
  setup: function setup() {
    klass = _emberRuntimeSystemObject2['default'].extend({
      concatenatedProperties: ['values', 'functions'],
      values: ['a', 'b', 'c'],
      functions: [K]
    });
  }
});

QUnit.test('concatenates instances', function () {
  var obj = klass.create({
    values: ['d', 'e', 'f']
  });

  var values = (0, _emberMetalProperty_get.get)(obj, 'values');
  var expected = ['a', 'b', 'c', 'd', 'e', 'f'];

  deepEqual(values, expected, _emberRuntimeSystemString2['default'].fmt('should concatenate values property (expected: %@, got: %@)', [expected, values]));
});

QUnit.test('concatenates subclasses', function () {
  var subKlass = klass.extend({
    values: ['d', 'e', 'f']
  });
  var obj = subKlass.create();

  var values = (0, _emberMetalProperty_get.get)(obj, 'values');
  var expected = ['a', 'b', 'c', 'd', 'e', 'f'];

  deepEqual(values, expected, _emberRuntimeSystemString2['default'].fmt('should concatenate values property (expected: %@, got: %@)', [expected, values]));
});

QUnit.test('concatenates reopen', function () {
  klass.reopen({
    values: ['d', 'e', 'f']
  });
  var obj = klass.create();

  var values = (0, _emberMetalProperty_get.get)(obj, 'values');
  var expected = ['a', 'b', 'c', 'd', 'e', 'f'];

  deepEqual(values, expected, _emberRuntimeSystemString2['default'].fmt('should concatenate values property (expected: %@, got: %@)', [expected, values]));
});

QUnit.test('concatenates mixin', function () {
  var mixin = {
    values: ['d', 'e']
  };
  var subKlass = klass.extend(mixin, {
    values: ['f']
  });
  var obj = subKlass.create();

  var values = (0, _emberMetalProperty_get.get)(obj, 'values');
  var expected = ['a', 'b', 'c', 'd', 'e', 'f'];

  deepEqual(values, expected, _emberRuntimeSystemString2['default'].fmt('should concatenate values property (expected: %@, got: %@)', [expected, values]));
});

QUnit.test('concatenates reopen, subclass, and instance', function () {
  klass.reopen({ values: ['d'] });
  var subKlass = klass.extend({ values: ['e'] });
  var obj = subKlass.create({ values: ['f'] });

  var values = (0, _emberMetalProperty_get.get)(obj, 'values');
  var expected = ['a', 'b', 'c', 'd', 'e', 'f'];

  deepEqual(values, expected, _emberRuntimeSystemString2['default'].fmt('should concatenate values property (expected: %@, got: %@)', [expected, values]));
});

QUnit.test('concatenates subclasses when the values are functions', function () {
  var subKlass = klass.extend({
    functions: K
  });
  var obj = subKlass.create();

  var values = (0, _emberMetalProperty_get.get)(obj, 'functions');
  var expected = [K, K];

  deepEqual(values, expected, _emberRuntimeSystemString2['default'].fmt('should concatenate functions property (expected: %@, got: %@)', [expected, values]));
});