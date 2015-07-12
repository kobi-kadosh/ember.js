'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var Router, router, App, container;

function bootApplication() {
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

function handleURL(path) {
  return _emberMetalCore2['default'].run(function () {
    return router.handleURL(path).then(function (value) {
      ok(true, 'url: `' + path + '` was handled');
      return value;
    }, function (reason) {
      ok(false, 'failed to visit:`' + path + '` reason: `' + QUnit.jsDump.parse(reason));
      throw reason;
    });
  });
}

QUnit.module('Router.map', {
  setup: function setup() {
    _emberMetalCore2['default'].run(function () {
      App = _emberMetalCore2['default'].Application.create({
        name: 'App',
        rootElement: '#qunit-fixture'
      });

      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });

      Router = App.Router;

      container = App.__container__;
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(function () {
      App.destroy();
      App = null;

      _emberMetalCore2['default'].TEMPLATES = {};
      //Ember.Logger.error = originalLoggerError;
    });
  }
});

QUnit.test('Router.map returns an Ember Router class', function () {
  expect(1);

  var ret = App.Router.map(function () {
    this.route('hello');
  });

  ok(_emberMetalCore2['default'].Router.detect(ret));
});

QUnit.test('Router.map can be called multiple times', function () {
  expect(4);

  _emberMetalCore2['default'].TEMPLATES.hello = (0, _emberTemplateCompilerSystemCompile2['default'])('Hello!');
  _emberMetalCore2['default'].TEMPLATES.goodbye = (0, _emberTemplateCompilerSystemCompile2['default'])('Goodbye!');

  App.Router.map(function () {
    this.route('hello');
  });

  App.Router.map(function () {
    this.route('goodbye');
  });

  bootApplication();

  handleURL('/hello');

  equal(_emberMetalCore2['default'].$('#qunit-fixture').text(), 'Hello!', 'The hello template was rendered');

  handleURL('/goodbye');

  equal(_emberMetalCore2['default'].$('#qunit-fixture').text(), 'Goodbye!', 'The goodbye template was rendered');
});