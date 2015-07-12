'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

require('ember-extension-support');

// Must be required to export Ember.ContainerDebugAdapter

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var adapter, App;

function boot() {
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
}

QUnit.module('Container Debug Adapter', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create(); // ES6TODO: this comes from the ember-application package NOT ember-runtime
      App.toString = function () {
        return 'App';
      };
      App.deferReadiness();
    });
    boot();
    (0, _emberMetalRun_loop2['default'])(function () {
      adapter = App.__container__.lookup('container-debug-adapter:main');
    });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      adapter.destroy();
      App.destroy();
      App = null;
    });
  }
});

QUnit.test('the default ContainerDebugAdapter cannot catalog certain entries by type', function () {
  equal(adapter.canCatalogEntriesByType('model'), false, 'canCatalogEntriesByType should return false for model');
  equal(adapter.canCatalogEntriesByType('template'), false, 'canCatalogEntriesByType should return false for template');
});

QUnit.test('the default ContainerDebugAdapter can catalog typical entries by type', function () {
  equal(adapter.canCatalogEntriesByType('controller'), true, 'canCatalogEntriesByType should return true for controller');
  equal(adapter.canCatalogEntriesByType('route'), true, 'canCatalogEntriesByType should return true for route');
  equal(adapter.canCatalogEntriesByType('view'), true, 'canCatalogEntriesByType should return true for view');
});

QUnit.test('the default ContainerDebugAdapter catalogs controller entries', function () {
  App.PostController = _emberRuntimeControllersController2['default'].extend();
  var controllerClasses = adapter.catalogEntriesByType('controller');

  equal(controllerClasses.length, 1, 'found 1 class');
  equal(controllerClasses[0], 'post', 'found the right class');
});