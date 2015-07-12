'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberMetalMixin = require('ember-metal/mixin');

QUnit.module('Ember.ObjectController');

QUnit.test('should be able to set the target property of an ObjectController', function () {
  expectDeprecation(_emberRuntimeControllersObject_controller.objectControllerDeprecation);

  var controller = _emberRuntimeControllersObject_controller2['default'].create();
  var target = {};

  controller.set('target', target);
  equal(controller.get('target'), target, 'able to set the target property');
});

// See https://github.com/emberjs/ember.js/issues/5112
QUnit.test('can observe a path on an ObjectController', function () {
  expectDeprecation(_emberRuntimeControllersObject_controller.objectControllerDeprecation);

  var controller = _emberRuntimeControllersObject_controller2['default'].extend({
    baz: (0, _emberMetalMixin.observer)('foo.bar', function () {})
  }).create();
  controller.set('model', {});
  ok(true, 'should not fail');
});

QUnit.test('accessing model properties via proxy behavior results in a deprecation [DEPRECATED]', function () {
  var controller;

  expectDeprecation(function () {
    controller = _emberRuntimeControllersObject_controller2['default'].extend({
      model: {
        foo: 'bar',
        baz: 'qux'
      }
    }).create();
  }, _emberRuntimeControllersObject_controller.objectControllerDeprecation);

  expectDeprecation(function () {
    controller.get('bar');
  }, /object proxying is deprecated\. Please use `model\.bar` instead\./);
});

QUnit.test('setting model properties via proxy behavior results in a deprecation [DEPRECATED]', function () {
  var controller;

  expectDeprecation(function () {
    controller = _emberRuntimeControllersObject_controller2['default'].extend({
      model: {
        foo: 'bar',
        baz: 'qux'
      }
    }).create();
  }, _emberRuntimeControllersObject_controller.objectControllerDeprecation);

  expectDeprecation(function () {
    controller.set('bar', 'derp');
  }, /object proxying is deprecated\. Please use `model\.bar` instead\./);
});

QUnit.test('auto-generated controllers are not deprecated', function () {
  expectNoDeprecation(function () {
    _emberRuntimeControllersObject_controller2['default'].extend({
      isGenerated: true
    }).create();
  });
});