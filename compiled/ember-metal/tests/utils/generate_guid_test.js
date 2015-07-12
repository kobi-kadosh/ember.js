'use strict';

var _emberMetalUtils = require('ember-metal/utils');

QUnit.module('Ember.generateGuid');

QUnit.test('Prefix', function () {
  var a = {};

  ok((0, _emberMetalUtils.generateGuid)(a, 'tyrell').indexOf('tyrell') > -1, 'guid can be prefixed');
});