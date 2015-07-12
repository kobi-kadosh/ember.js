'use strict';

var _emberMetalUtils = require('ember-metal/utils');

var obj;

QUnit.module('Ember.tryInvoke', {
  setup: function setup() {
    obj = {
      aMethodThatExists: function aMethodThatExists() {
        return true;
      },
      aMethodThatTakesArguments: function aMethodThatTakesArguments(arg1, arg2) {
        return arg1 === arg2;
      }
    };
  },

  teardown: function teardown() {
    obj = undefined;
  }
});

QUnit.test('should return undefined when the object doesn\'t exist', function () {
  equal((0, _emberMetalUtils.tryInvoke)(undefined, 'aMethodThatDoesNotExist'), undefined);
});

QUnit.test('should return undefined when asked to perform a method that doesn\'t exist on the object', function () {
  equal((0, _emberMetalUtils.tryInvoke)(obj, 'aMethodThatDoesNotExist'), undefined);
});

QUnit.test('should return what the method returns when asked to perform a method that exists on the object', function () {
  equal((0, _emberMetalUtils.tryInvoke)(obj, 'aMethodThatExists'), true);
});

QUnit.test('should return what the method returns when asked to perform a method that takes arguments and exists on the object', function () {
  equal((0, _emberMetalUtils.tryInvoke)(obj, 'aMethodThatTakesArguments', [true, true]), true);
});