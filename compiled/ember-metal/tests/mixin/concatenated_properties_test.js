'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_get2 = _interopRequireDefault(_emberMetalProperty_get);

var _emberMetalMixin = require('ember-metal/mixin');

QUnit.module('Mixin concatenatedProperties');

QUnit.test('defining concatenated properties should concat future version', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    concatenatedProperties: ['foo'],
    foo: ['a', 'b', 'c']
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: ['d', 'e', 'f']
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'foo'), ['a', 'b', 'c', 'd', 'e', 'f']);
});

QUnit.test('defining concatenated properties should concat future version', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    concatenatedProperties: null
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    concatenatedProperties: null
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);

  deepEqual(obj.concatenatedProperties, []);
});

QUnit.test('concatenatedProperties should be concatenated', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    concatenatedProperties: ['foo'],
    foo: ['a', 'b', 'c']
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    concatenatedProperties: 'bar',
    foo: ['d', 'e', 'f'],
    bar: [1, 2, 3]
  });

  var MixinC = _emberMetalMixin.Mixin.create({
    bar: [4, 5, 6]
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB, MixinC);
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'concatenatedProperties'), ['foo', 'bar'], 'get concatenatedProperties');
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'foo'), ['a', 'b', 'c', 'd', 'e', 'f'], 'get foo');
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'bar'), [1, 2, 3, 4, 5, 6], 'get bar');
});

QUnit.test('adding a prop that is not an array should make array', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    concatenatedProperties: ['foo'],
    foo: [1, 2, 3]
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: 4
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'foo'), [1, 2, 3, 4]);
});

QUnit.test('adding a prop that is not an array should make array', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    concatenatedProperties: ['foo'],
    foo: 'bar'
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA);
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'foo'), ['bar']);
});

QUnit.test('adding a non-concatenable property that already has a defined value should result in an array with both values', function () {

  var mixinA = _emberMetalMixin.Mixin.create({
    foo: 1
  });

  var mixinB = _emberMetalMixin.Mixin.create({
    concatenatedProperties: ['foo'],
    foo: 2
  });

  var obj = (0, _emberMetalMixin.mixin)({}, mixinA, mixinB);
  deepEqual((0, _emberMetalProperty_get2['default'])(obj, 'foo'), [1, 2]);
});

QUnit.test('adding a concatenable property that already has a defined value should result in a concatenated value', function () {

  var mixinA = _emberMetalMixin.Mixin.create({
    foobar: 'foo'
  });

  var mixinB = _emberMetalMixin.Mixin.create({
    concatenatedProperties: ['foobar'],
    foobar: 'bar'
  });

  var obj = (0, _emberMetalMixin.mixin)({}, mixinA, mixinB);
  equal((0, _emberMetalProperty_get2['default'])(obj, 'foobar'), 'foobar');
});