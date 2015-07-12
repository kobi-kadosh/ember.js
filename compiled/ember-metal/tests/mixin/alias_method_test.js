'use strict';

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

QUnit.module('aliasMethod');

function validateAliasMethod(obj) {
  equal(obj.fooMethod(), 'FOO', 'obj.fooMethod()');
  equal(obj.barMethod(), 'FOO', 'obj.barMethod should be a copy of foo');
}

QUnit.test('methods of another name are aliased when the mixin is applied', function () {
  var MyMixin = _emberMetalMixin.Mixin.create({
    fooMethod: function fooMethod() {
      return 'FOO';
    },
    barMethod: (0, _emberMetalMixin.aliasMethod)('fooMethod')
  });

  var obj = MyMixin.apply({});
  validateAliasMethod(obj);
});

QUnit.test('should follow aliasMethods all the way down', function () {
  var MyMixin = _emberMetalMixin.Mixin.create({
    bar: (0, _emberMetalMixin.aliasMethod)('foo'), // put first to break ordered iteration
    baz: function baz() {
      return 'baz';
    },
    foo: (0, _emberMetalMixin.aliasMethod)('baz')
  });

  var obj = MyMixin.apply({});
  equal((0, _emberMetalProperty_get.get)(obj, 'bar')(), 'baz', 'should have followed aliasMethods');
});

QUnit.test('should alias methods from other dependent mixins', function () {
  var BaseMixin = _emberMetalMixin.Mixin.create({
    fooMethod: function fooMethod() {
      return 'FOO';
    }
  });

  var MyMixin = _emberMetalMixin.Mixin.create(BaseMixin, {
    barMethod: (0, _emberMetalMixin.aliasMethod)('fooMethod')
  });

  var obj = MyMixin.apply({});
  validateAliasMethod(obj);
});

QUnit.test('should alias methods from other mixins applied at same time', function () {
  var BaseMixin = _emberMetalMixin.Mixin.create({
    fooMethod: function fooMethod() {
      return 'FOO';
    }
  });

  var MyMixin = _emberMetalMixin.Mixin.create({
    barMethod: (0, _emberMetalMixin.aliasMethod)('fooMethod')
  });

  var obj = (0, _emberMetalMixin.mixin)({}, BaseMixin, MyMixin);
  validateAliasMethod(obj);
});

QUnit.test('should alias methods from mixins already applied on object', function () {
  var BaseMixin = _emberMetalMixin.Mixin.create({
    quxMethod: function quxMethod() {
      return 'qux';
    }
  });

  var MyMixin = _emberMetalMixin.Mixin.create({
    bar: (0, _emberMetalMixin.aliasMethod)('foo'),
    barMethod: (0, _emberMetalMixin.aliasMethod)('fooMethod')
  });

  var obj = {
    fooMethod: function fooMethod() {
      return 'FOO';
    }
  };

  BaseMixin.apply(obj);
  MyMixin.apply(obj);

  validateAliasMethod(obj);
});