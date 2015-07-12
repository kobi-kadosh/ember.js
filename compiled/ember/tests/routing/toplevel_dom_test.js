'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var compile = _emberHtmlbarsCompat2['default'].compile;

var Router, App, templates, router, container;

function bootApplication() {
  for (var name in templates) {
    _emberMetalCore2['default'].TEMPLATES[name] = compile(templates[name]);
  }
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

QUnit.module('Top Level DOM Structure', {
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

      templates = {
        application: 'hello world'
      };
    });
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(function () {
      App.destroy();
      App = null;

      _emberMetalCore2['default'].TEMPLATES = {};
    });

    _emberMetalCore2['default'].NoneLocation.reopen({
      path: ''
    });
  }
});

QUnit.test('Topmost template always get an element', function () {
  bootApplication();
  equal(_emberMetalCore2['default'].$('#qunit-fixture > .ember-view').text(), 'hello world');
});

QUnit.test('If topmost view has its own element, it doesn\'t get wrapped in a higher element', function () {
  App.registry.register('view:application', _emberViewsViewsView2['default'].extend({
    classNames: ['im-special']
  }));
  bootApplication();
  equal(_emberMetalCore2['default'].$('#qunit-fixture > .im-special').text(), 'hello world');
});