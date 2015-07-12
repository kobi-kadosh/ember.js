// NOTE: A previous iteration differentiated between public and private props
// as well as methods vs props.  We are just keeping these for testing; the
// current impl doesn't care about the differences as much...

'use strict';

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalMixin = require('ember-metal/mixin');

var PrivateProperty = _emberMetalMixin.Mixin.create({
  _foo: '_FOO'
});

var PublicProperty = _emberMetalMixin.Mixin.create({
  foo: 'FOO'
});

var PrivateMethod = _emberMetalMixin.Mixin.create({
  _fooMethod: function _fooMethod() {}
});

var PublicMethod = _emberMetalMixin.Mixin.create({
  fooMethod: function fooMethod() {}
});

var BarProperties = _emberMetalMixin.Mixin.create({
  _bar: '_BAR',
  bar: 'bar'
});

var BarMethods = _emberMetalMixin.Mixin.create({
  _barMethod: function _barMethod() {},
  barMethod: function barMethod() {}
});

var Combined = _emberMetalMixin.Mixin.create(BarProperties, BarMethods);

var obj;

QUnit.module('Basic introspection', {
  setup: function setup() {
    obj = {};
    (0, _emberMetalMixin.mixin)(obj, PrivateProperty, PublicProperty, PrivateMethod, PublicMethod, Combined);
  }
});

QUnit.test('Ember.mixins()', function () {

  function mapGuids(ary) {
    return ary.map(function (x) {
      return (0, _emberMetalUtils.guidFor)(x);
    });
  }

  deepEqual(mapGuids(_emberMetalMixin.Mixin.mixins(obj)), mapGuids([PrivateProperty, PublicProperty, PrivateMethod, PublicMethod, Combined, BarProperties, BarMethods]), 'should return included mixins');
});