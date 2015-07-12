'use strict';

var _emberMetalUtils = require('ember-metal/utils');

var obj;

QUnit.module('Ember.canInvoke', {
  setup: function setup() {
    obj = {
      foobar: 'foobar',
      aMethodThatExists: function aMethodThatExists() {}
    };
  },

  teardown: function teardown() {
    obj = undefined;
  }
});

QUnit.test('should return false if the object doesn\'t exist', function () {
  equal((0, _emberMetalUtils.canInvoke)(undefined, 'aMethodThatDoesNotExist'), false);
});

QUnit.test('should return true if the method exists on the object', function () {
  equal((0, _emberMetalUtils.canInvoke)(obj, 'aMethodThatExists'), true);
});

QUnit.test('should return false if the method doesn\'t exist on the object', function () {
  equal((0, _emberMetalUtils.canInvoke)(obj, 'aMethodThatDoesNotExist'), false);
});

QUnit.test('should return false if the property exists on the object but is a non-function', function () {
  equal((0, _emberMetalUtils.canInvoke)(obj, 'foobar'), false);
});