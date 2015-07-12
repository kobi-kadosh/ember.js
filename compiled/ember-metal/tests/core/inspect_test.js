'use strict';

var _emberMetalUtils = require('ember-metal/utils');

QUnit.module('Ember.inspect');

QUnit.test('strings', function () {
  equal((0, _emberMetalUtils.inspect)('foo'), 'foo');
});

QUnit.test('numbers', function () {
  equal((0, _emberMetalUtils.inspect)(2.6), '2.6');
});

QUnit.test('null', function () {
  equal((0, _emberMetalUtils.inspect)(null), 'null');
});

QUnit.test('undefined', function () {
  equal((0, _emberMetalUtils.inspect)(undefined), 'undefined');
});

QUnit.test('true', function () {
  equal((0, _emberMetalUtils.inspect)(true), 'true');
});

QUnit.test('false', function () {
  equal((0, _emberMetalUtils.inspect)(false), 'false');
});

QUnit.test('object', function () {
  equal((0, _emberMetalUtils.inspect)({}), '{}');
  equal((0, _emberMetalUtils.inspect)({ foo: 'bar' }), '{foo: bar}');
  equal((0, _emberMetalUtils.inspect)({ foo: function foo() {
      return this;
    } }), '{foo: function() { ... }}');
});

QUnit.test('objects without a prototype', function () {
  var prototypelessObj = Object.create(null);
  equal((0, _emberMetalUtils.inspect)({ foo: prototypelessObj }), '{foo: [object Object]}');
});

QUnit.test('array', function () {
  equal((0, _emberMetalUtils.inspect)([1, 2, 3]), '[1,2,3]');
});

QUnit.test('regexp', function () {
  equal((0, _emberMetalUtils.inspect)(/regexp/), '/regexp/');
});

QUnit.test('date', function () {
  var inspected = (0, _emberMetalUtils.inspect)(new Date('Sat Apr 30 2011 13:24:11'));
  ok(inspected.match(/Sat Apr 30/), 'The inspected date has its date');
  ok(inspected.match(/2011/), 'The inspected date has its year');
  ok(inspected.match(/13:24:11/), 'The inspected date has its time');
});