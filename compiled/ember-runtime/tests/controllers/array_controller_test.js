'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeTestsSuitesMutable_array = require('ember-runtime/tests/suites/mutable_array');

var _emberRuntimeTestsSuitesMutable_array2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_array);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

QUnit.module('ember-runtime/controllers/array_controller_test');

_emberRuntimeTestsSuitesMutable_array2['default'].extend({
  name: 'Ember.ArrayController',

  newObject: function newObject(ary) {
    var ret = ary ? ary.slice() : this.newFixture(3);
    expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
    return _emberRuntimeControllersArray_controller2['default'].create({
      model: _emberMetalCore2['default'].A(ret)
    });
  },

  mutate: function mutate(obj) {
    obj.pushObject(_emberMetalCore2['default'].get(obj, 'length') + 1);
  },

  toArray: function toArray(obj) {
    return obj.toArray ? obj.toArray() : obj.slice();
  }
}).run();

QUnit.module('ember-runtime: array_controller');

QUnit.test('defaults its `model` to an empty array', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var Controller = _emberRuntimeControllersArray_controller2['default'].extend();
  deepEqual(Controller.create().get('model'), [], '`ArrayController` defaults its model to an empty array');
  equal(Controller.create().get('firstObject'), undefined, 'can fetch firstObject');
  equal(Controller.create().get('lastObject'), undefined, 'can fetch lastObject');
});

QUnit.test('Ember.ArrayController length property works even if model was not set initially', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var controller = _emberRuntimeControllersArray_controller2['default'].create();
  controller.pushObject('item');
  equal(controller.get('length'), 1);
});

QUnit.test('works properly when model is set to an Ember.A()', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var controller = _emberRuntimeControllersArray_controller2['default'].create();

  (0, _emberMetalProperty_set.set)(controller, 'model', _emberMetalCore2['default'].A(['red', 'green']));

  deepEqual((0, _emberMetalProperty_get.get)(controller, 'model'), ['red', 'green'], 'can set model as an Ember.Array');
});

QUnit.test('works properly when model is set to a plain array', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var controller = _emberRuntimeControllersArray_controller2['default'].create();

  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    (0, _emberMetalProperty_set.set)(controller, 'model', ['red', 'green']);

    deepEqual((0, _emberMetalProperty_get.get)(controller, 'model'), ['red', 'green'], 'can set model as a plain array');
  } else {
    expectAssertion(function () {
      (0, _emberMetalProperty_set.set)(controller, 'model', ['red', 'green']);
    }, /ArrayController expects `model` to implement the Ember.Array mixin. This can often be fixed by wrapping your model with `Ember\.A\(\)`./);
  }
});

QUnit.test('works properly when model is set to `null`', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var controller = _emberRuntimeControllersArray_controller2['default'].create();

  (0, _emberMetalProperty_set.set)(controller, 'model', null);
  equal((0, _emberMetalProperty_get.get)(controller, 'model'), null, 'can set model to `null`');

  (0, _emberMetalProperty_set.set)(controller, 'model', undefined);
  equal((0, _emberMetalProperty_get.get)(controller, 'model'), undefined, 'can set model to `undefined`');

  (0, _emberMetalProperty_set.set)(controller, 'model', false);
  equal((0, _emberMetalProperty_get.get)(controller, 'model'), false, 'can set model to `undefined`');
});