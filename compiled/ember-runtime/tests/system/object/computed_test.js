'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

function K() {
  return this;
}

QUnit.module('EmberObject computed property');

(0, _emberMetalTestsProps_helper.testWithDefault)('computed property on instance', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalComputed.computed)(function () {
      return 'FOO';
    })
  });

  equal(get(new MyClass(), 'foo'), 'FOO');
});

(0, _emberMetalTestsProps_helper.testWithDefault)('computed property on subclass', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalComputed.computed)(function () {
      return 'FOO';
    })
  });

  var Subclass = MyClass.extend({
    foo: (0, _emberMetalComputed.computed)(function () {
      return 'BAR';
    })
  });

  equal(get(new Subclass(), 'foo'), 'BAR');
});

(0, _emberMetalTestsProps_helper.testWithDefault)('replacing computed property with regular val', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalComputed.computed)(function () {
      return 'FOO';
    })
  });

  var Subclass = MyClass.extend({
    foo: 'BAR'
  });

  equal(get(new Subclass(), 'foo'), 'BAR');
});

(0, _emberMetalTestsProps_helper.testWithDefault)('complex depndent keys', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({

    init: function init() {
      this._super.apply(this, arguments);
      set(this, 'bar', { baz: 'BIFF' });
    },

    count: 0,

    foo: (0, _emberMetalComputed.computed)(function () {
      set(this, 'count', get(this, 'count') + 1);
      return (0, _emberMetalProperty_get.get)(get(this, 'bar'), 'baz') + ' ' + get(this, 'count');
    }).property('bar.baz')

  });

  var Subclass = MyClass.extend({
    count: 20
  });

  var obj1 = new MyClass();
  var obj2 = new Subclass();

  equal(get(obj1, 'foo'), 'BIFF 1');
  equal(get(obj2, 'foo'), 'BIFF 21');

  set(get(obj1, 'bar'), 'baz', 'BLARG');

  equal(get(obj1, 'foo'), 'BLARG 2');
  equal(get(obj2, 'foo'), 'BIFF 21');

  set(get(obj2, 'bar'), 'baz', 'BOOM');

  equal(get(obj1, 'foo'), 'BLARG 2');
  equal(get(obj2, 'foo'), 'BOOM 22');
});

(0, _emberMetalTestsProps_helper.testWithDefault)('complex dependent keys changing complex dependent keys', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({

    init: function init() {
      this._super.apply(this, arguments);
      set(this, 'bar', { baz: 'BIFF' });
    },

    count: 0,

    foo: (0, _emberMetalComputed.computed)(function () {
      set(this, 'count', get(this, 'count') + 1);
      return (0, _emberMetalProperty_get.get)(get(this, 'bar'), 'baz') + ' ' + get(this, 'count');
    }).property('bar.baz')

  });

  var Subclass = MyClass.extend({

    init: function init() {
      this._super.apply(this, arguments);
      set(this, 'bar2', { baz: 'BIFF2' });
    },

    count: 0,

    foo: (0, _emberMetalComputed.computed)(function () {
      set(this, 'count', get(this, 'count') + 1);
      return (0, _emberMetalProperty_get.get)(get(this, 'bar2'), 'baz') + ' ' + get(this, 'count');
    }).property('bar2.baz')
  });

  var obj2 = new Subclass();

  equal(get(obj2, 'foo'), 'BIFF2 1');

  set(get(obj2, 'bar'), 'baz', 'BLARG');
  equal(get(obj2, 'foo'), 'BIFF2 1', 'should not invalidate property');

  set(get(obj2, 'bar2'), 'baz', 'BLARG');
  equal(get(obj2, 'foo'), 'BLARG 2', 'should invalidate property');
});

QUnit.test('can retrieve metadata for a computed property', function () {
  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    computedProperty: (0, _emberMetalComputed.computed)(function () {}).meta({ key: 'keyValue' })
  });

  equal((0, _emberMetalProperty_get.get)(MyClass.metaForProperty('computedProperty'), 'key'), 'keyValue', 'metadata saved on the computed property can be retrieved');

  var ClassWithNoMetadata = _emberRuntimeSystemObject2['default'].extend({
    computedProperty: (0, _emberMetalComputed.computed)(function () {}).volatile(),

    staticProperty: 12
  });

  equal(typeof ClassWithNoMetadata.metaForProperty('computedProperty'), 'object', 'returns empty hash if no metadata has been saved');

  expectAssertion(function () {
    ClassWithNoMetadata.metaForProperty('nonexistentProperty');
  }, 'metaForProperty() could not find a computed property with key \'nonexistentProperty\'.');

  expectAssertion(function () {
    ClassWithNoMetadata.metaForProperty('staticProperty');
  }, 'metaForProperty() could not find a computed property with key \'staticProperty\'.');
});

QUnit.test('can iterate over a list of computed properties for a class', function () {
  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalComputed.computed)(function () {}),

    fooDidChange: (0, _emberMetalMixin.observer)('foo', function () {}),

    bar: (0, _emberMetalComputed.computed)(function () {})
  });

  var SubClass = MyClass.extend({
    baz: (0, _emberMetalComputed.computed)(function () {})
  });

  SubClass.reopen({
    bat: (0, _emberMetalComputed.computed)(function () {}).meta({ iAmBat: true })
  });

  var list = [];

  MyClass.eachComputedProperty(function (name) {
    list.push(name);
  });

  deepEqual(list.sort(), ['bar', 'foo'], 'watched and unwatched computed properties are iterated');

  list = [];

  SubClass.eachComputedProperty(function (name, meta) {
    list.push(name);

    if (name === 'bat') {
      deepEqual(meta, { iAmBat: true });
    } else {
      deepEqual(meta, {});
    }
  });

  deepEqual(list.sort(), ['bar', 'bat', 'baz', 'foo'], 'all inherited properties are included');
});

QUnit.test('list of properties updates when an additional property is added (such cache busting)', function () {
  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalComputed.computed)(K),

    fooDidChange: (0, _emberMetalMixin.observer)('foo', function () {}),

    bar: (0, _emberMetalComputed.computed)(K)
  });

  var list = [];

  MyClass.eachComputedProperty(function (name) {
    list.push(name);
  });

  deepEqual(list.sort(), ['bar', 'foo'].sort(), 'expected two computed properties');

  MyClass.reopen({
    baz: (0, _emberMetalComputed.computed)(K)
  });

  MyClass.create(); // force apply mixins

  list = [];

  MyClass.eachComputedProperty(function (name) {
    list.push(name);
  });

  deepEqual(list.sort(), ['bar', 'foo', 'baz'].sort(), 'expected three computed properties');
});