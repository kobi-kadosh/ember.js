'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_get2 = _interopRequireDefault(_emberMetalProperty_get);

var _emberMetalMixin = require('ember-metal/mixin');

QUnit.module('Ember.Mixin.apply');

function K() {}

QUnit.test('using apply() should apply properties', function () {
  var MixinA = _emberMetalMixin.Mixin.create({ foo: 'FOO', baz: K });
  var obj = {};
  (0, _emberMetalMixin.mixin)(obj, MixinA);

  equal((0, _emberMetalProperty_get2['default'])(obj, 'foo'), 'FOO', 'should apply foo');
  equal((0, _emberMetalProperty_get2['default'])(obj, 'baz'), K, 'should apply foo');
});

QUnit.test('applying anonymous properties', function () {
  var obj = {};
  (0, _emberMetalMixin.mixin)(obj, {
    foo: 'FOO',
    baz: K
  });

  equal((0, _emberMetalProperty_get2['default'])(obj, 'foo'), 'FOO', 'should apply foo');
  equal((0, _emberMetalProperty_get2['default'])(obj, 'baz'), K, 'should apply foo');
});

QUnit.test('applying null values', function () {
  expectAssertion(function () {
    (0, _emberMetalMixin.mixin)({}, null);
  });
});

QUnit.test('applying a property with an undefined value', function () {
  var obj = { tagName: '' };
  (0, _emberMetalMixin.mixin)(obj, { tagName: undefined });

  strictEqual((0, _emberMetalProperty_get2['default'])(obj, 'tagName'), '');
});