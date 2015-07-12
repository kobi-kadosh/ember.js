'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

QUnit.module('Ember Type Checking');

var global = undefined;

QUnit.test('Ember.isArray', function () {
  var numarray = [1, 2, 3];
  var number = 23;
  var strarray = ['Hello', 'Hi'];
  var string = 'Hello';
  var object = {};
  var length = { length: 12 };
  var fn = function fn() {};
  var arrayProxy = _emberRuntimeSystemArray_proxy2['default'].create({ content: _emberMetalCore2['default'].A() });

  equal((0, _emberRuntimeUtils.isArray)(numarray), true, '[1,2,3]');
  equal((0, _emberRuntimeUtils.isArray)(number), false, '23');
  equal((0, _emberRuntimeUtils.isArray)(strarray), true, '["Hello", "Hi"]');
  equal((0, _emberRuntimeUtils.isArray)(string), false, '"Hello"');
  equal((0, _emberRuntimeUtils.isArray)(object), false, '{}');
  equal((0, _emberRuntimeUtils.isArray)(length), true, '{ length: 12 }');
  equal((0, _emberRuntimeUtils.isArray)(global), false, 'global');
  equal((0, _emberRuntimeUtils.isArray)(fn), false, 'function() {}');
  equal((0, _emberRuntimeUtils.isArray)(arrayProxy), true, '[]');
});