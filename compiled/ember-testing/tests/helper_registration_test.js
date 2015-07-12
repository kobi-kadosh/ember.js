'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTestingTest = require('ember-testing/test');

var _emberTestingTest2 = _interopRequireDefault(_emberTestingTest);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var App, appBooted, helperContainer;

function registerHelper() {
  _emberTestingTest2['default'].registerHelper('boot', function (app) {
    (0, _emberMetalRun_loop2['default'])(app, app.advanceReadiness);
    appBooted = true;
    return app.testHelpers.wait();
  });
}

function unregisterHelper() {
  _emberTestingTest2['default'].unregisterHelper('boot');
}

var originalAdapter = _emberTestingTest2['default'].adapter;

function setupApp() {
  appBooted = false;
  helperContainer = {};

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
    App.injectTestHelpers(helperContainer);
  });
}

function destroyApp() {
  if (App) {
    (0, _emberMetalRun_loop2['default'])(App, 'destroy');
    App = null;
  }
}

QUnit.module('Test - registerHelper/unregisterHelper', {
  teardown: function teardown() {
    _emberTestingTest2['default'].adapter = originalAdapter;
    destroyApp();
  }
});

QUnit.test('Helper gets registered', function () {
  expect(2);

  registerHelper();
  setupApp();

  ok(App.testHelpers.boot);
  ok(helperContainer.boot);
});

QUnit.test('Helper is ran when called', function () {
  expect(1);

  registerHelper();
  setupApp();

  App.testHelpers.boot().then(function () {
    ok(appBooted);
  });
});

QUnit.test('Helper can be unregistered', function () {
  expect(4);

  registerHelper();
  setupApp();

  ok(App.testHelpers.boot);
  ok(helperContainer.boot);

  unregisterHelper();

  setupApp();

  ok(!App.testHelpers.boot, 'once unregistered the helper is not added to App.testHelpers');
  ok(!helperContainer.boot, 'once unregistered the helper is not added to the helperContainer');
});