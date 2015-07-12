'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('Ember Type Checking');

QUnit.test('Ember.typeOf', function () {
  var MockedDate = function MockedDate() {};
  MockedDate.prototype = new Date();

  var mockedDate = new MockedDate();
  var date = new Date();
  var error = new Error('boum');
  var object = { a: 'b' };
  var a = null;
  var arr = [1, 2, 3];
  var obj = {};
  var instance = _emberRuntimeSystemObject2['default'].create({ method: function method() {} });

  equal((0, _emberRuntimeUtils.typeOf)(), 'undefined', 'undefined');
  equal((0, _emberRuntimeUtils.typeOf)(null), 'null', 'null');
  equal((0, _emberRuntimeUtils.typeOf)('Cyril'), 'string', 'Cyril');
  equal((0, _emberRuntimeUtils.typeOf)(101), 'number', '101');
  equal((0, _emberRuntimeUtils.typeOf)(true), 'boolean', 'true');
  equal((0, _emberRuntimeUtils.typeOf)([1, 2, 90]), 'array', '[1,2,90]');
  equal((0, _emberRuntimeUtils.typeOf)(/abc/), 'regexp', '/abc/');
  equal((0, _emberRuntimeUtils.typeOf)(date), 'date', 'new Date()');
  equal((0, _emberRuntimeUtils.typeOf)(mockedDate), 'date', 'mocked date');
  equal((0, _emberRuntimeUtils.typeOf)(error), 'error', 'error');
  equal((0, _emberRuntimeUtils.typeOf)(object), 'object', 'object');
  equal((0, _emberRuntimeUtils.typeOf)(undefined), 'undefined', 'item of type undefined');
  equal((0, _emberRuntimeUtils.typeOf)(a), 'null', 'item of type null');
  equal((0, _emberRuntimeUtils.typeOf)(arr), 'array', 'item of type array');
  equal((0, _emberRuntimeUtils.typeOf)(obj), 'object', 'item of type object');
  equal((0, _emberRuntimeUtils.typeOf)(instance), 'instance', 'item of type instance');
  equal((0, _emberRuntimeUtils.typeOf)(instance.method), 'function', 'item of type function');
  equal((0, _emberRuntimeUtils.typeOf)(_emberRuntimeSystemObject2['default'].extend()), 'class', 'item of type class');
  equal((0, _emberRuntimeUtils.typeOf)(new Error()), 'error', 'item of type error');
});