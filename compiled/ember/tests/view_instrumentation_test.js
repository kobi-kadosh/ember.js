'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberMetalInstrumentation = require('ember-metal/instrumentation');

var compile = _emberHtmlbarsCompat2['default'].compile;

var App, $fixture;

function setupExample() {
  // setup templates
  _emberMetalCore2['default'].TEMPLATES.application = compile('{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h1>Node 1</h1>');
  _emberMetalCore2['default'].TEMPLATES.posts = compile('<h1>Node 1</h1>');

  App.Router.map(function () {
    this.route('posts');
  });
}

function handleURL(path) {
  var router = App.__container__.lookup('router:main');
  return (0, _emberMetalRun_loop2['default'])(router, 'handleURL', path);
}

QUnit.module('View Instrumentation', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberMetalCore2['default'].Application.create({
        rootElement: '#qunit-fixture'
      });
      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });
    });

    $fixture = (0, _emberViewsSystemJquery2['default'])('#qunit-fixture');
    setupExample();
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(App, 'destroy');
    App = null;
    _emberMetalCore2['default'].TEMPLATES = {};
  }
});

QUnit.test('Nodes without view instances are instrumented', function (assert) {
  var called = false;
  var subscriber = (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before() {
      called = true;
    },
    after: function after() {}
  });
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  assert.ok(called, 'Instrumentation called on first render');
  called = false;
  handleURL('/posts');
  assert.ok(called, 'instrumentation called on transition to non-view backed route');
  (0, _emberMetalInstrumentation.unsubscribe)(subscriber);
});