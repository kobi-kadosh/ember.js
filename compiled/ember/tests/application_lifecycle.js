'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var App, container, router;

QUnit.module('Application Lifecycle', {
  setup: function setup() {
    _emberMetalCore2['default'].run(function () {
      App = _emberMetalCore2['default'].Application.create({
        rootElement: '#qunit-fixture'
      });

      App.Router = App.Router.extend({
        location: 'none'
      });

      App.deferReadiness();

      container = App.__container__;
    });
  },

  teardown: function teardown() {
    router = null;
    _emberMetalCore2['default'].run(App, 'destroy');
  }
});

function handleURL(path) {
  router = container.lookup('router:main');
  return _emberMetalCore2['default'].run(function () {
    return router.handleURL(path).then(function (value) {
      ok(true, 'url: `' + path + '` was handled');
      return value;
    }, function (reason) {
      ok(false, reason);
      throw reason;
    });
  });
}

QUnit.test('Resetting the application allows controller properties to be set when a route deactivates', function () {
  App.Router.map(function () {
    this.route('home', { path: '/' });
  });

  App.HomeRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      this.controllerFor('home').set('selectedMenuItem', 'home');
    },
    deactivate: function deactivate() {
      this.controllerFor('home').set('selectedMenuItem', null);
    }
  });
  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      this.controllerFor('application').set('selectedMenuItem', 'home');
    },
    deactivate: function deactivate() {
      this.controllerFor('application').set('selectedMenuItem', null);
    }
  });

  container.lookup('router:main');

  _emberMetalCore2['default'].run(App, 'advanceReadiness');

  handleURL('/');

  equal(_emberMetalCore2['default'].controllerFor(container, 'home').get('selectedMenuItem'), 'home');
  equal(_emberMetalCore2['default'].controllerFor(container, 'application').get('selectedMenuItem'), 'home');

  App.reset();

  equal(_emberMetalCore2['default'].controllerFor(container, 'home').get('selectedMenuItem'), null);
  equal(_emberMetalCore2['default'].controllerFor(container, 'application').get('selectedMenuItem'), null);
});

QUnit.test('Destroying the application resets the router before the container is destroyed', function () {
  App.Router.map(function () {
    this.route('home', { path: '/' });
  });

  App.HomeRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      this.controllerFor('home').set('selectedMenuItem', 'home');
    },
    deactivate: function deactivate() {
      this.controllerFor('home').set('selectedMenuItem', null);
    }
  });
  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      this.controllerFor('application').set('selectedMenuItem', 'home');
    },
    deactivate: function deactivate() {
      this.controllerFor('application').set('selectedMenuItem', null);
    }
  });

  container.lookup('router:main');

  _emberMetalCore2['default'].run(App, 'advanceReadiness');

  handleURL('/');

  equal(_emberMetalCore2['default'].controllerFor(container, 'home').get('selectedMenuItem'), 'home');
  equal(_emberMetalCore2['default'].controllerFor(container, 'application').get('selectedMenuItem'), 'home');

  _emberMetalCore2['default'].run(App, 'destroy');

  equal(_emberMetalCore2['default'].controllerFor(container, 'home').get('selectedMenuItem'), null);
  equal(_emberMetalCore2['default'].controllerFor(container, 'application').get('selectedMenuItem'), null);
});