'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

QUnit.module('ArrayProxy - content change');

QUnit.test('should update length for null content', function () {
  var proxy = _emberRuntimeSystemArray_proxy2['default'].create({
    content: _emberMetalCore2['default'].A([1, 2, 3])
  });

  equal(proxy.get('length'), 3, 'precond - length is 3');

  proxy.set('content', null);

  equal(proxy.get('length'), 0, 'length updates');
});

QUnit.test('The `arrangedContentWillChange` method is invoked before `content` is changed.', function () {
  var callCount = 0;
  var expectedLength;

  var proxy = _emberRuntimeSystemArray_proxy2['default'].extend({
    content: _emberMetalCore2['default'].A([1, 2, 3]),

    arrangedContentWillChange: function arrangedContentWillChange() {
      equal(this.get('arrangedContent.length'), expectedLength, 'hook should be invoked before array has changed');
      callCount++;
    }
  }).create();

  proxy.pushObject(4);
  equal(callCount, 0, 'pushing content onto the array doesn\'t trigger it');

  proxy.get('content').pushObject(5);
  equal(callCount, 0, 'pushing content onto the content array doesn\'t trigger it');

  expectedLength = 5;
  proxy.set('content', _emberMetalCore2['default'].A(['a', 'b']));
  equal(callCount, 1, 'replacing the content array triggers the hook');
});

QUnit.test('The `arrangedContentDidChange` method is invoked after `content` is changed.', function () {
  var callCount = 0;
  var expectedLength;

  var proxy = _emberRuntimeSystemArray_proxy2['default'].extend({
    content: _emberMetalCore2['default'].A([1, 2, 3]),

    arrangedContentDidChange: function arrangedContentDidChange() {
      equal(this.get('arrangedContent.length'), expectedLength, 'hook should be invoked after array has changed');
      callCount++;
    }
  }).create();

  equal(callCount, 0, 'hook is not called after creating the object');

  proxy.pushObject(4);
  equal(callCount, 0, 'pushing content onto the array doesn\'t trigger it');

  proxy.get('content').pushObject(5);
  equal(callCount, 0, 'pushing content onto the content array doesn\'t trigger it');

  expectedLength = 2;
  proxy.set('content', _emberMetalCore2['default'].A(['a', 'b']));
  equal(callCount, 1, 'replacing the content array triggers the hook');
});

QUnit.test('The ArrayProxy doesn\'t explode when assigned a destroyed object', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var arrayController = _emberRuntimeControllersArray_controller2['default'].create();
  var proxy = _emberRuntimeSystemArray_proxy2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    arrayController.destroy();
  });

  (0, _emberMetalProperty_set.set)(proxy, 'content', arrayController);

  ok(true, 'No exception was raised');
});