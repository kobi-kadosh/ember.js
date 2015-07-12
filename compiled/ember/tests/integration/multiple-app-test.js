'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var App1, App2, actions;

function startApp(rootElement) {
  var application;

  (0, _emberMetalRun_loop2['default'])(function () {
    application = _emberMetalCore2['default'].Application.create({
      rootElement: rootElement
    });
    application.deferReadiness();

    application.Router.reopen({
      location: 'none'
    });

    var registry = application.__container__._registry;

    registry.register('component:special-button', _emberMetalCore2['default'].Component.extend({
      actions: {
        doStuff: function doStuff() {
          actions.push(rootElement);
        }
      }
    }));
    registry.register('template:application', (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}', { moduleName: 'application' }));
    registry.register('template:index', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Node 1</h1>{{special-button}}', { moduleName: 'index' }));
    registry.register('template:components/special-button', (0, _emberTemplateCompilerSystemCompile2['default'])('<button class=\'do-stuff\' {{action \'doStuff\'}}>Button</button>', { moduleName: 'components/special-button' }));
  });

  return application;
}

function handleURL(application, path) {
  var router = application.__container__.lookup('router:main');
  return (0, _emberMetalRun_loop2['default'])(router, 'handleURL', path);
}

QUnit.module('View Integration', {
  setup: function setup() {
    actions = [];
    _emberMetalCore2['default'].$('#qunit-fixture').html('<div id="app-1"></div><div id="app-2"></div>');
    App1 = startApp('#app-1');
    App2 = startApp('#app-2');
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(App1, 'destroy');
    (0, _emberMetalRun_loop2['default'])(App2, 'destroy');
    App1 = App2 = null;
  }
});

QUnit.test('booting multiple applications can properly handle events', function (assert) {
  (0, _emberMetalRun_loop2['default'])(App1, 'advanceReadiness');
  (0, _emberMetalRun_loop2['default'])(App2, 'advanceReadiness');

  handleURL(App1, '/');
  handleURL(App2, '/');

  _emberMetalCore2['default'].$('#app-2 .do-stuff').click();
  _emberMetalCore2['default'].$('#app-1 .do-stuff').click();

  assert.deepEqual(actions, ['#app-2', '#app-1']);
});