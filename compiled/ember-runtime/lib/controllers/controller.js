'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

var _emberRuntimeInject = require('ember-runtime/inject');

/**
@module ember
@submodule ember-runtime
*/

/**
  @class Controller
  @namespace Ember
  @extends Ember.Object
  @uses Ember.ControllerMixin
  @public
*/
var Controller = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsController2['default']);

function controllerInjectionHelper(factory) {
  _emberMetalCore2['default'].assert('Defining an injected controller property on a ' + 'non-controller is not allowed.', _emberRuntimeMixinsController2['default'].detect(factory.PrototypeMixin));
}

/**
  Creates a property that lazily looks up another controller in the container.
  Can only be used when defining another controller.

  Example:

  ```javascript
  App.PostController = Ember.Controller.extend({
    posts: Ember.inject.controller()
  });
  ```

  This example will create a `posts` property on the `post` controller that
  looks up the `posts` controller in the container, making it easy to
  reference other controllers. This is functionally equivalent to:

  ```javascript
  App.PostController = Ember.Controller.extend({
    needs: 'posts',
    posts: Ember.computed.alias('controllers.posts')
  });
  ```

  @method controller
  @since 1.10.0
  @for Ember.inject
  @param {String} name (optional) name of the controller to inject, defaults
         to the property's name
  @return {Ember.InjectedProperty} injection descriptor instance
  @private
*/
(0, _emberRuntimeInject.createInjectionHelper)('controller', controllerInjectionHelper);

exports['default'] = Controller;
module.exports = exports['default'];