'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('EmberObject.extend');

QUnit.test('Basic extend', function () {
  var SomeClass = _emberRuntimeSystemObject2['default'].extend({ foo: 'BAR' });
  ok(SomeClass.isClass, 'A class has isClass of true');
  var obj = new SomeClass();
  equal(obj.foo, 'BAR');
});

QUnit.test('Sub-subclass', function () {
  var SomeClass = _emberRuntimeSystemObject2['default'].extend({ foo: 'BAR' });
  var AnotherClass = SomeClass.extend({ bar: 'FOO' });
  var obj = new AnotherClass();
  equal(obj.foo, 'BAR');
  equal(obj.bar, 'FOO');
});

QUnit.test('Overriding a method several layers deep', function () {
  var SomeClass = _emberRuntimeSystemObject2['default'].extend({
    fooCnt: 0,
    foo: function foo() {
      this.fooCnt++;
    },

    barCnt: 0,
    bar: function bar() {
      this.barCnt++;
    }
  });

  var AnotherClass = SomeClass.extend({
    barCnt: 0,
    bar: function bar() {
      this.barCnt++;
      this._super.apply(this, arguments);
    }
  });

  var FinalClass = AnotherClass.extend({
    fooCnt: 0,
    foo: function foo() {
      this.fooCnt++;
      this._super.apply(this, arguments);
    }
  });

  var obj = new FinalClass();
  obj.foo();
  obj.bar();
  equal(obj.fooCnt, 2, 'should invoke both');
  equal(obj.barCnt, 2, 'should invoke both');

  // Try overriding on create also
  obj = FinalClass.extend({
    foo: function foo() {
      this.fooCnt++;
      this._super.apply(this, arguments);
    }
  }).create();

  obj.foo();
  obj.bar();
  equal(obj.fooCnt, 3, 'should invoke final as well');
  equal(obj.barCnt, 2, 'should invoke both');
});

QUnit.test('With concatenatedProperties', function () {
  var SomeClass = _emberRuntimeSystemObject2['default'].extend({ things: 'foo', concatenatedProperties: ['things'] });
  var AnotherClass = SomeClass.extend({ things: 'bar' });
  var YetAnotherClass = SomeClass.extend({ things: 'baz' });
  var some = new SomeClass();
  var another = new AnotherClass();
  var yetAnother = new YetAnotherClass();
  deepEqual(some.get('things'), ['foo'], 'base class should have just its value');
  deepEqual(another.get('things'), ['foo', 'bar'], 'subclass should have base class\' and its own');
  deepEqual(yetAnother.get('things'), ['foo', 'baz'], 'subclass should have base class\' and its own');
});

QUnit.test('With concatenatedProperties class properties', function () {
  var SomeClass = _emberRuntimeSystemObject2['default'].extend();
  SomeClass.reopenClass({
    concatenatedProperties: ['things'],
    things: 'foo'
  });
  var AnotherClass = SomeClass.extend();
  AnotherClass.reopenClass({ things: 'bar' });
  var YetAnotherClass = SomeClass.extend();
  YetAnotherClass.reopenClass({ things: 'baz' });
  var some = new SomeClass();
  var another = new AnotherClass();
  var yetAnother = new YetAnotherClass();
  deepEqual((0, _emberMetalProperty_get.get)(some.constructor, 'things'), ['foo'], 'base class should have just its value');
  deepEqual((0, _emberMetalProperty_get.get)(another.constructor, 'things'), ['foo', 'bar'], 'subclass should have base class\' and its own');
  deepEqual((0, _emberMetalProperty_get.get)(yetAnother.constructor, 'things'), ['foo', 'baz'], 'subclass should have base class\' and its own');
});