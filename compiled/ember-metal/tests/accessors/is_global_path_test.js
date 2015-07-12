'use strict';

var _emberMetalBinding = require('ember-metal/binding');

QUnit.module('Ember.isGlobalPath');

QUnit.test('global path\'s are recognized', function () {
  ok((0, _emberMetalBinding.isGlobalPath)('App.myProperty'));
  ok((0, _emberMetalBinding.isGlobalPath)('App.myProperty.subProperty'));
});

QUnit.test('if there is a \'this\' in the path, it\'s not a global path', function () {
  ok(!(0, _emberMetalBinding.isGlobalPath)('this.myProperty'));
  ok(!(0, _emberMetalBinding.isGlobalPath)('this'));
});

QUnit.test('if the path starts with a lowercase character, it is not a global path', function () {
  ok(!(0, _emberMetalBinding.isGlobalPath)('myObj'));
  ok(!(0, _emberMetalBinding.isGlobalPath)('myObj.SecondProperty'));
});