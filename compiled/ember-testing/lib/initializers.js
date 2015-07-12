'use strict';

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

var name = 'deferReadiness in `testing` mode';

(0, _emberRuntimeSystemLazy_load.onLoad)('Ember.Application', function (Application) {
  if (!Application.initializers[name]) {
    Application.initializer({
      name: name,

      initialize: function initialize(registry, application) {
        if (application.testing) {
          application.deferReadiness();
        }
      }
    });
  }
});