'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateControllerFactory = generateControllerFactory;
exports['default'] = generateController;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Logger

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeUtils = require('ember-runtime/utils');

/**
@module ember
@submodule ember-routing
*/

/**
  Generates a controller factory

  The type of the generated controller factory is derived
  from the context. If the context is an array an array controller
  is generated, if an object, an object controller otherwise, a basic
  controller is generated.

  You can customize your generated controllers by defining
  `App.ObjectController` or `App.ArrayController`.

  @for Ember
  @method generateControllerFactory
  @private
*/

function generateControllerFactory(container, controllerName, context) {
  var Factory, fullName, factoryName, controllerType;

  if (context && (0, _emberRuntimeUtils.isArray)(context)) {
    controllerType = 'array';
  } else if (context) {
    controllerType = 'object';
  } else {
    controllerType = 'basic';
  }

  factoryName = 'controller:' + controllerType;

  Factory = container.lookupFactory(factoryName).extend({
    isGenerated: true,
    toString: function toString() {
      return '(generated ' + controllerName + ' controller)';
    }
  });

  fullName = 'controller:' + controllerName;

  container._registry.register(fullName, Factory);

  return Factory;
}

/**
  Generates and instantiates a controller.

  The type of the generated controller factory is derived
  from the context. If the context is an array an array controller
  is generated, if an object, an object controller otherwise, a basic
  controller is generated.

  @for Ember
  @method generateController
  @private
  @since 1.3.0
*/

function generateController(container, controllerName, context) {
  generateControllerFactory(container, controllerName, context);

  var fullName = 'controller:' + controllerName;
  var instance = container.lookup(fullName);

  if ((0, _emberMetalProperty_get.get)(instance, 'namespace.LOG_ACTIVE_GENERATION')) {
    _emberMetalCore2['default'].Logger.info('generated -> ' + fullName, { fullName: fullName });
  }

  return instance;
}