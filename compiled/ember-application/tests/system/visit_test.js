'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberApplicationSystemApplicationInstance = require('ember-application/system/application-instance');

var _emberApplicationSystemApplicationInstance2 = _interopRequireDefault(_emberApplicationSystemApplicationInstance);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

function createApplication() {
  var App = _emberApplicationSystemApplication2['default'].extend().create({
    autoboot: false,
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_ACTIVE_GENERATION: true
  });

  App.Router = _emberRoutingSystemRouter2['default'].extend();

  return App;
}

if ((0, _emberMetalFeatures2['default'])('ember-application-visit')) {
  QUnit.module('Ember.Application - visit()');

  // This tests whether the application is "autobooted" by registering an
  // instance initializer and asserting it never gets run. Since this is
  // inherently testing that async behavior *doesn't* happen, we set a
  // 500ms timeout to verify that when autoboot is set to false, the
  // instance initializer that would normally get called on DOM ready
  // does not fire.
  QUnit.test('Applications with autoboot set to false do not autoboot', function (assert) {
    QUnit.expect(1);
    QUnit.stop();

    (0, _emberMetalRun_loop2['default'])(function () {
      var app = createApplication();

      // Start the timeout
      var timeout = setTimeout(function () {
        ok(true, '500ms elapsed without initializers being called');
        QUnit.start();
      }, 500);

      // Create an instance initializer that should *not* get run.
      app.instanceInitializer({
        name: 'assert-no-autoboot',
        initialize: function initialize() {
          clearTimeout(timeout);
          QUnit.start();
          assert.ok(false, 'instance should not have been created');
        }
      });
    });
  });

  QUnit.test('visit() returns a promise that resolves when the view has rendered', function (assert) {
    QUnit.expect(3);
    QUnit.stop();

    var app;

    (0, _emberMetalRun_loop2['default'])(function () {
      app = createApplication();
      app.instanceInitializer({
        name: 'register-application-template',
        initialize: function initialize(app) {
          app.registry.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Hello world</h1>'));
        }
      });
    });

    assert.equal(_emberMetalCore2['default'].$('#qunit-fixture').children().length, 0, 'there are no elements in the fixture element');

    app.visit('/').then(function (instance) {
      QUnit.start();
      assert.ok(instance instanceof _emberApplicationSystemApplicationInstance2['default'], 'promise is resolved with an ApplicationInstance');

      (0, _emberMetalRun_loop2['default'])(instance.view, 'appendTo', '#qunit-fixture');
      assert.equal(_emberMetalCore2['default'].$('#qunit-fixture > .ember-view h1').text(), 'Hello world', 'the application was rendered once the promise resolves');

      instance.destroy();
    }, function (error) {
      QUnit.start();
      assert.ok(false, 'The visit() promise was rejected: ' + error);
    });
  });

  QUnit.test('Views created via visit() are not added to the global views hash', function (assert) {
    QUnit.expect(6);
    QUnit.stop();

    var app;

    (0, _emberMetalRun_loop2['default'])(function () {
      app = createApplication();
      app.instanceInitializer({
        name: 'register-application-template',
        initialize: function initialize(app) {
          app.registry.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Hello world</h1> {{view "child"}}'));
          app.registry.register('view:application', _emberViewsViewsView2['default'].extend({
            elementId: 'my-cool-app'
          }));
          app.registry.register('view:child', _emberViewsViewsView2['default'].extend({
            elementId: 'child-view'
          }));
        }
      });
    });

    assert.equal(_emberMetalCore2['default'].$('#qunit-fixture').children().length, 0, 'there are no elements in the fixture element');

    app.visit('/').then(function (instance) {
      QUnit.start();
      assert.ok(instance instanceof _emberApplicationSystemApplicationInstance2['default'], 'promise is resolved with an ApplicationInstance');

      (0, _emberMetalRun_loop2['default'])(instance.view, 'appendTo', '#qunit-fixture');
      assert.equal(_emberMetalCore2['default'].$('#qunit-fixture > #my-cool-app h1').text(), 'Hello world', 'the application was rendered once the promise resolves');
      assert.strictEqual(_emberViewsViewsView2['default'].views['my-cool-app'], undefined, 'view was not registered globally');
      ok(instance.container.lookup('-view-registry:main')['my-cool-app'] instanceof _emberViewsViewsView2['default'], 'view was registered on the instance\'s view registry');
      ok(instance.container.lookup('-view-registry:main')['child-view'] instanceof _emberViewsViewsView2['default'], 'child view was registered on the instance\'s view registry');

      instance.destroy();
    }, function (error) {
      QUnit.start();
      assert.ok(false, 'The visit() promise was rejected: ' + error);
    });
  });
}