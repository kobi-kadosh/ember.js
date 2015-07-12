'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

var _emberRoutingServicesRouting = require('ember-routing/services/routing');

var _emberRoutingServicesRouting2 = _interopRequireDefault(_emberRoutingServicesRouting);

(0, _emberRuntimeSystemLazy_load.onLoad)('Ember.Application', function (Application) {
  Application.initializer({
    name: 'routing-service',
    initialize: function initialize(registry) {
      // Register the routing service...
      registry.register('service:-routing', _emberRoutingServicesRouting2['default']);
      // Then inject the app router into it
      registry.injection('service:-routing', 'router', 'router:main');
    }
  });
});