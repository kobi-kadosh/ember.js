'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var App, registry;

function setupExample() {
  // setup templates
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}', { moduleName: 'application' });
  _emberMetalCore2['default'].TEMPLATES.index = (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Node 1</h1>', { moduleName: 'index' });
  _emberMetalCore2['default'].TEMPLATES.posts = (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Node 1</h1>', { moduleName: 'posts' });

  App.Router.map(function () {
    this.route('posts');
  });
}

function handleURL(path) {
  var router = App.__container__.lookup('router:main');
  return (0, _emberMetalRun_loop2['default'])(router, 'handleURL', path);
}

QUnit.module('View Integration', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberMetalCore2['default'].Application.create({
        rootElement: '#qunit-fixture'
      });
      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });

      registry = App.__container__._registry;
    });

    setupExample();
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(App, 'destroy');
    App = null;
    _emberMetalCore2['default'].TEMPLATES = {};
  }
});

QUnit.test('invoking `{{view}} from a non-view backed (aka only template) template provides the correct controller to the view instance`', function (assert) {
  var controllerInMyFoo, indexController;

  _emberMetalCore2['default'].TEMPLATES.index = (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "my-foo"}}', { moduleName: 'my-foo' });

  registry.register('view:my-foo', _emberViewsViewsView2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);

      controllerInMyFoo = this.get('controller');
    }
  }));

  registry.register('controller:index', _emberMetalCore2['default'].Controller.extend({
    init: function init() {
      this._super.apply(this, arguments);

      indexController = this;
    }
  }));

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  handleURL('/');

  assert.strictEqual(controllerInMyFoo, indexController, 'controller is provided to `{{view}}`');
});