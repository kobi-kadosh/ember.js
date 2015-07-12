'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalAlias = require('ember-metal/alias');

var _emberMetalAlias2 = _interopRequireDefault(_emberMetalAlias);

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalObserver = require('ember-metal/observer');

var obj, count;

QUnit.module('ember-metal/alias', {
  setup: function setup() {
    obj = { foo: { faz: 'FOO' } };
    count = 0;
  },
  teardown: function teardown() {
    obj = null;
  }
});

function incrementCount() {
  count++;
}

QUnit.test('should proxy get to alt key', function () {
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalAlias2['default'])('foo.faz'));
  equal((0, _emberMetalProperty_get.get)(obj, 'bar'), 'FOO');
});

QUnit.test('should proxy set to alt key', function () {
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalAlias2['default'])('foo.faz'));
  (0, _emberMetalProperty_set.set)(obj, 'bar', 'BAR');
  equal((0, _emberMetalProperty_get.get)(obj, 'foo.faz'), 'BAR');
});

QUnit.test('basic lifecycle', function () {
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalAlias2['default'])('foo.faz'));
  var m = (0, _emberMetalUtils.meta)(obj);
  (0, _emberMetalObserver.addObserver)(obj, 'bar', incrementCount);
  equal(m.deps['foo.faz'].bar, 1);
  (0, _emberMetalObserver.removeObserver)(obj, 'bar', incrementCount);
  equal(m.deps['foo.faz'].bar, 0);
});

QUnit.test('begins watching alt key as soon as alias is watched', function () {
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalAlias2['default'])('foo.faz'));
  (0, _emberMetalObserver.addObserver)(obj, 'bar', incrementCount);
  ok((0, _emberMetalWatching.isWatching)(obj, 'foo.faz'));
  (0, _emberMetalProperty_set.set)(obj, 'foo.faz', 'BAR');
  equal(count, 1);
});

QUnit.test('immediately sets up dependencies if already being watched', function () {
  (0, _emberMetalObserver.addObserver)(obj, 'bar', incrementCount);
  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalAlias2['default'])('foo.faz'));
  ok((0, _emberMetalWatching.isWatching)(obj, 'foo.faz'));
  (0, _emberMetalProperty_set.set)(obj, 'foo.faz', 'BAR');
  equal(count, 1);
});

QUnit.test('setting alias on self should fail assertion', function () {
  expectAssertion(function () {
    (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalAlias2['default'])('bar'));
  }, 'Setting alias \'bar\' on self');
});