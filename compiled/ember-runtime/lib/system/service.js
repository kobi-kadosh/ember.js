'use strict';

_emberRuntimeSystemObject2['default'].defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeInject = require('ember-runtime/inject');

/**
  Creates a property that lazily looks up a service in the container. There
  are no restrictions as to what objects a service can be injected into.

  Example:

  ```javascript
  App.ApplicationRoute = Ember.Route.extend({
    authManager: Ember.inject.service('auth'),

    model: function() {
      return this.get('authManager').findCurrentUser();
    }
  });
  ```

  This example will create an `authManager` property on the application route
  that looks up the `auth` service in the container, making it easily
  accessible in the `model` hook.

  @method service
  @since 1.10.0
  @for Ember.inject
  @param {String} name (optional) name of the service to inject, defaults to
         the property's name
  @return {Ember.InjectedProperty} injection descriptor instance
  @public
*/
(0, _emberRuntimeInject.createInjectionHelper)('service');

/**
  @class Service
  @namespace Ember
  @extends Ember.Object
  @since 1.10.0
  @public
*/
var Service = _emberRuntimeSystemObject2['default'].extend();

Service.reopenClass({
  isServiceFactory: true
});

exports['default'] = Service;
module.exports = exports['default'];