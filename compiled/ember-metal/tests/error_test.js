'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

QUnit.module('Ember Error Throwing');

QUnit.test('new Ember.Error displays provided message', function () {
  throws(function () {
    throw new _emberMetalCore2['default'].Error('A Message');
  }, function (e) {
    return e.message === 'A Message';
  }, 'the assigned message was displayed');
});