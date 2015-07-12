/*globals EmberDev */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberRuntimeExtRsvp = require('ember-runtime/ext/rsvp');

var _emberRuntimeExtRsvp2 = _interopRequireDefault(_emberRuntimeExtRsvp);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

require('ember-routing');

var App, logs, originalLogger;

QUnit.module('Ember.Application – logging of generated classes', {
  setup: function setup() {
    logs = {};

    originalLogger = _emberMetalCore2['default'].Logger.info;

    _emberMetalCore2['default'].Logger.info = function () {
      var fullName = arguments[1].fullName;

      logs[fullName] = logs[fullName] || 0;
      logs[fullName]++;
    };

    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create({
        LOG_ACTIVE_GENERATION: true
      });

      App.Router.reopen({
        location: 'none'
      });

      App.Router.map(function () {
        this.route('posts', { resetNamespace: true });
      });

      App.deferReadiness();
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].Logger.info = originalLogger;

    (0, _emberMetalRun_loop2['default'])(App, 'destroy');

    logs = App = null;
  }
});

function visit(path) {
  QUnit.stop();

  var promise = (0, _emberMetalRun_loop2['default'])(function () {
    return new _emberRuntimeExtRsvp2['default'].Promise(function (resolve, reject) {
      var router = App.__container__.lookup('router:main');

      resolve(router.handleURL(path).then(function (value) {
        QUnit.start();
        ok(true, 'visited: `' + path + '`');
        return value;
      }, function (reason) {
        QUnit.start();
        ok(false, 'failed to visit:`' + path + '` reason: `' + QUnit.jsDump.parse(reason));
        throw reason;
      }));
    });
  });

  return {
    then: function then(resolve, reject) {
      (0, _emberMetalRun_loop2['default'])(promise, 'then', resolve, reject);
    }
  };
}

QUnit.test('log class generation if logging enabled', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(Object.keys(logs).length, 6, 'expected logs');
  });
});

QUnit.test('do NOT log class generation if logging disabled', function () {
  App.reopen({
    LOG_ACTIVE_GENERATION: false
  });

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(Object.keys(logs).length, 0, 'expected no logs');
  });
});

QUnit.test('actively generated classes get logged', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(logs['controller:application'], 1, 'expected: ApplicationController was generated');
    equal(logs['controller:posts'], 1, 'expected: PostsController was generated');

    equal(logs['route:application'], 1, 'expected: ApplicationRoute was generated');
    equal(logs['route:posts'], 1, 'expected: PostsRoute was generated');
  });
});

QUnit.test('predefined classes do not get logged', function () {
  App.ApplicationController = _emberRuntimeControllersController2['default'].extend();
  App.PostsController = _emberRuntimeControllersController2['default'].extend();

  App.ApplicationRoute = _emberRoutingSystemRoute2['default'].extend();
  App.PostsRoute = _emberRoutingSystemRoute2['default'].extend();

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    ok(!logs['controller:application'], 'did not expect: ApplicationController was generated');
    ok(!logs['controller:posts'], 'did not expect: PostsController was generated');

    ok(!logs['route:application'], 'did not expect: ApplicationRoute was generated');
    ok(!logs['route:posts'], 'did not expect: PostsRoute was generated');
  });
});

QUnit.module('Ember.Application – logging of view lookups', {
  setup: function setup() {
    logs = {};

    originalLogger = _emberMetalCore2['default'].Logger.info;

    _emberMetalCore2['default'].Logger.info = function () {
      var fullName = arguments[1].fullName;

      logs[fullName] = logs[fullName] || 0;
      logs[fullName]++;
    };

    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create({
        LOG_VIEW_LOOKUPS: true
      });

      App.Router.reopen({
        location: 'none'
      });

      App.Router.map(function () {
        this.route('posts', { resetNamespace: true });
      });

      App.deferReadiness();
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].Logger.info = originalLogger;

    (0, _emberMetalRun_loop2['default'])(App, 'destroy');

    logs = App = null;
  }
});

QUnit.test('log when template and view are missing when flag is active', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  App.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}'));
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(logs['template:application'], undefined, 'expected: Should not log template:application since it exists.');
    equal(logs['template:index'], 1, 'expected: Could not find "index" template or view.');
    equal(logs['template:posts'], 1, 'expected: Could not find "posts" template or view.');
  });
});

QUnit.test('do not log when template and view are missing when flag is not true', function () {
  App.reopen({
    LOG_VIEW_LOOKUPS: false
  });

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(Object.keys(logs).length, 0, 'expected no logs');
  });
});

QUnit.test('log which view is used with a template', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  App.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}'));
  App.register('template:foo', (0, _emberTemplateCompilerSystemCompile2['default'])('Template with custom view'));
  App.register('view:posts', _emberViewsViewsView2['default'].extend({ templateName: 'foo' }));
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(logs['view:application'], 1, 'toplevel view always get an element');
    equal(logs['view:index'], undefined, 'expected: Should not log when index is not present.');
    equal(logs['view:posts'], 1, 'expected: Rendering posts with PostsView.');
  });
});

QUnit.test('do not log which views are used with templates when flag is not true', function () {
  App.reopen({
    LOG_VIEW_LOOKUPS: false
  });

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  visit('/posts').then(function () {
    equal(Object.keys(logs).length, 0, 'expected no logs');
  });
});