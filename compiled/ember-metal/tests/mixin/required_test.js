'use strict';

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperty_get = require('ember-metal/property_get');

var PartialMixin, FinalMixin, obj;

QUnit.module('Module.required', {
  setup: function setup() {
    expectDeprecation(function () {
      PartialMixin = _emberMetalMixin.Mixin.create({
        foo: (0, _emberMetalMixin.required)(),
        bar: 'BAR'
      });
    }, 'Ember.required is deprecated as its behavior is inconsistent and unreliable.');

    FinalMixin = _emberMetalMixin.Mixin.create({
      foo: 'FOO'
    });

    obj = {};
  },

  teardown: function teardown() {
    PartialMixin = FinalMixin = obj = null;
  }
});

QUnit.test('applying a mixin to meet requirement', function () {
  FinalMixin.apply(obj);
  PartialMixin.apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'FOO', 'should now be defined');
});

QUnit.test('combined mixins to meet requirement', function () {
  _emberMetalMixin.Mixin.create(PartialMixin, FinalMixin).apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'FOO', 'should now be defined');
});

QUnit.test('merged mixin', function () {
  _emberMetalMixin.Mixin.create(PartialMixin, { foo: 'FOO' }).apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'FOO', 'should now be defined');
});

QUnit.test('define property on source object', function () {
  obj.foo = 'FOO';
  PartialMixin.apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'FOO', 'should now be defined');
});

QUnit.test('using apply', function () {
  (0, _emberMetalMixin.mixin)(obj, PartialMixin, { foo: 'FOO' });
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'FOO', 'should now be defined');
});