'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalUtils = require('ember-metal/utils');

QUnit.module('mandatory-setters');

function hasMandatorySetter(object, property) {
  var meta = (0, _emberMetalUtils.meta)(object);

  return property in meta.values;
}

if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
  QUnit.test('does not assert if property is not being watched', function () {
    var obj = {
      someProp: null,
      toString: function toString() {
        return 'custom-object';
      }
    };

    obj.someProp = 'blastix';
    equal((0, _emberMetalProperty_get.get)(obj, 'someProp'), 'blastix');
  });

  QUnit.test('should not setup mandatory-setter if property is not writable', function () {
    expect(6);

    var obj = {};

    Object.defineProperty(obj, 'a', { value: true });
    Object.defineProperty(obj, 'b', { value: false });
    Object.defineProperty(obj, 'c', { value: undefined });
    Object.defineProperty(obj, 'd', { value: undefined, writable: false });
    Object.defineProperty(obj, 'e', { value: undefined, configurable: false });
    Object.defineProperty(obj, 'f', { value: undefined, configurable: true });

    (0, _emberMetalWatching.watch)(obj, 'a');
    (0, _emberMetalWatching.watch)(obj, 'b');
    (0, _emberMetalWatching.watch)(obj, 'c');
    (0, _emberMetalWatching.watch)(obj, 'd');
    (0, _emberMetalWatching.watch)(obj, 'e');
    (0, _emberMetalWatching.watch)(obj, 'f');

    ok(!hasMandatorySetter(obj, 'a'), 'mandatory-setter should not be installed');
    ok(!hasMandatorySetter(obj, 'b'), 'mandatory-setter should not be installed');
    ok(!hasMandatorySetter(obj, 'c'), 'mandatory-setter should not be installed');
    ok(!hasMandatorySetter(obj, 'd'), 'mandatory-setter should not be installed');
    ok(!hasMandatorySetter(obj, 'e'), 'mandatory-setter should not be installed');
    ok(!hasMandatorySetter(obj, 'f'), 'mandatory-setter should not be installed');
  });

  QUnit.test('should not setup mandatory-setter if setter is already setup on property', function () {
    expect(2);

    var obj = { someProp: null };

    Object.defineProperty(obj, 'someProp', {
      set: function set(value) {
        equal(value, 'foo-bar', 'custom setter was called');
      }
    });

    (0, _emberMetalWatching.watch)(obj, 'someProp');
    ok(!hasMandatorySetter(obj, 'someProp'), 'mandatory-setter should not be installed');

    obj.someProp = 'foo-bar';
  });

  QUnit.test('should assert if set without Ember.set when property is being watched', function () {
    var obj = {
      someProp: null,
      toString: function toString() {
        return 'custom-object';
      }
    };

    (0, _emberMetalWatching.watch)(obj, 'someProp');

    expectAssertion(function () {
      obj.someProp = 'foo-bar';
    }, 'You must use Ember.set() to set the `someProp` property (of custom-object) to `foo-bar`.');
  });

  QUnit.test('should not assert if set with Ember.set when property is being watched', function () {
    var obj = {
      someProp: null,
      toString: function toString() {
        return 'custom-object';
      }
    };

    (0, _emberMetalWatching.watch)(obj, 'someProp');
    (0, _emberMetalProperty_set.set)(obj, 'someProp', 'foo-bar');

    equal((0, _emberMetalProperty_get.get)(obj, 'someProp'), 'foo-bar');
  });

  QUnit.test('does not setup mandatory-setter if non-configurable', function () {
    var obj = {
      someProp: null,
      toString: function toString() {
        return 'custom-object';
      }
    };
    var meta = (0, _emberMetalUtils.meta)(obj);

    Object.defineProperty(obj, 'someProp', {
      configurable: false,
      enumerable: true,
      value: 'blastix'
    });

    (0, _emberMetalWatching.watch)(obj, 'someProp');
    ok(!('someProp' in meta.values), 'blastix');
  });

  QUnit.test('sets up mandatory-setter if property comes from prototype', function () {
    expect(2);

    var obj = {
      someProp: null,
      toString: function toString() {
        return 'custom-object';
      }
    };
    var obj2 = Object.create(obj);

    (0, _emberMetalWatching.watch)(obj2, 'someProp');
    var meta = (0, _emberMetalUtils.meta)(obj2);

    ok('someProp' in meta.values, 'mandatory setter has been setup');

    expectAssertion(function () {
      obj2.someProp = 'foo-bar';
    }, 'You must use Ember.set() to set the `someProp` property (of custom-object) to `foo-bar`.');
  });
}