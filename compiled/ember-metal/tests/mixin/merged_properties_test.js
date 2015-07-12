'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

QUnit.module('Mixin mergedProperties');

QUnit.test('defining mergedProperties should merge future version', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: { a: true, b: true, c: true }
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: { d: true, e: true, f: true }
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foo'), { a: true, b: true, c: true, d: true, e: true, f: true });
});

QUnit.test('defining mergedProperties on future mixin should merged into past', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    foo: { a: true, b: true, c: true }
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: { d: true, e: true, f: true }
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foo'), { a: true, b: true, c: true, d: true, e: true, f: true });
});

QUnit.test('defining mergedProperties with null properties should keep properties null', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: null
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: null
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), null);
});

QUnit.test('mergedProperties\' properties can get overwritten', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: { a: 1 }
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: { a: 2 }
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foo'), { a: 2 });
});

QUnit.test('mergedProperties should be concatenated', function () {

  var MixinA = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: { a: true, b: true, c: true }
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    mergedProperties: 'bar',
    foo: { d: true, e: true, f: true },
    bar: { a: true, l: true }
  });

  var MixinC = _emberMetalMixin.Mixin.create({
    bar: { e: true, x: true }
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB, MixinC);
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'mergedProperties'), ['foo', 'bar'], 'get mergedProperties');
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foo'), { a: true, b: true, c: true, d: true, e: true, f: true }, 'get foo');
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'bar'), { a: true, l: true, e: true, x: true }, 'get bar');
});

QUnit.test('mergedProperties should exist even if not explicitly set on create', function () {

  var AnObj = _emberMetalCore2['default'].Object.extend({
    mergedProperties: ['options'],
    options: {
      a: 'a',
      b: {
        c: 'ccc'
      }
    }
  });

  var obj = AnObj.create({
    options: {
      a: 'A'
    }
  });

  equal((0, _emberMetalProperty_get.get)(obj, 'options').a, 'A');
  equal((0, _emberMetalProperty_get.get)(obj, 'options').b.c, 'ccc');
});

QUnit.test('mergedProperties\' overwriting methods can call _super', function () {

  expect(4);

  var MixinA = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: {
      meth: function meth(a) {
        equal(a, 'WOOT', '_super successfully called MixinA\'s `foo.meth` method');
        return 'WAT';
      }
    }
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: {
      meth: function meth(a) {
        ok(true, 'MixinB\'s `foo.meth` method called');
        return this._super.apply(this, arguments);
      }
    }
  });

  var MixinC = _emberMetalMixin.Mixin.create({
    foo: {
      meth: function meth(a) {
        ok(true, 'MixinC\'s `foo.meth` method called');
        return this._super(a);
      }
    }
  });

  var obj = (0, _emberMetalMixin.mixin)({}, MixinA, MixinB, MixinC);
  equal(obj.foo.meth('WOOT'), 'WAT');
});

QUnit.test('Merging an Array should raise an error', function () {

  expect(1);

  var MixinA = _emberMetalMixin.Mixin.create({
    mergedProperties: ['foo'],
    foo: { a: true, b: true, c: true }
  });

  var MixinB = _emberMetalMixin.Mixin.create({
    foo: ['a']
  });

  expectAssertion(function () {
    (0, _emberMetalMixin.mixin)({}, MixinA, MixinB);
  }, 'You passed in `["a"]` as the value for `foo` but `foo` cannot be an Array');
});