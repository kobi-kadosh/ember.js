'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeCopy = require('ember-runtime/copy');

var _emberRuntimeCopy2 = _interopRequireDefault(_emberRuntimeCopy);

QUnit.module('Ember Copy Method');

QUnit.test('Ember.copy null', function () {
  var obj = { field: null };

  equal((0, _emberRuntimeCopy2['default'])(obj, true).field, null, 'null should still be null');
});

QUnit.test('Ember.copy date', function () {
  var date = new Date(2014, 7, 22);
  var dateCopy = (0, _emberRuntimeCopy2['default'])(date);

  equal(date.getTime(), dateCopy.getTime(), 'dates should be equivalent');
});

QUnit.test('Ember.copy null prototype object', function () {
  var obj = Object.create(null);

  obj.foo = 'bar';

  equal((0, _emberRuntimeCopy2['default'])(obj).foo, 'bar', 'bar should still be bar');
});