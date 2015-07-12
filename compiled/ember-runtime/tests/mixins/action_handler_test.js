'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

QUnit.module('ActionHandler');

QUnit.test('passing a function for the actions hash triggers an assertion', function () {
  expect(1);

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: function actions() {}
  });

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      controller.create();
    });
  });
});