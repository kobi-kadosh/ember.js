'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

/*
 In Ember 1.x, controllers subtly affect things like template scope
 and action targets in exciting and often inscrutable ways. This test
 file contains integration tests that verify the correct behavior of
 the many parts of the system that change and rely upon controller scope,
 from the runtime up to the templating layer.
*/

var compile = _emberHtmlbarsCompat2['default'].compile;
var App, $fixture, templates;

QUnit.module('Template scoping examples', {
  setup: function setup() {
    _emberMetalCore2['default'].run(function () {
      templates = _emberMetalCore2['default'].TEMPLATES;
      App = _emberMetalCore2['default'].Application.create({
        name: 'App',
        rootElement: '#qunit-fixture'
      });
      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });

      App.LoadingRoute = _emberMetalCore2['default'].Route.extend();
    });

    $fixture = _emberMetalCore2['default'].$('#qunit-fixture');
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(function () {
      App.destroy();
    });

    App = null;

    _emberMetalCore2['default'].TEMPLATES = {};
  }
});

QUnit.test('Actions inside an outlet go to the associated controller', function () {
  expect(1);

  templates.index = compile('{{component-with-action action=\'componentAction\'}}');

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    actions: {
      componentAction: function componentAction() {
        ok(true, 'received the click');
      }
    }
  });

  App.ComponentWithActionComponent = _emberMetalCore2['default'].Component.extend({
    classNames: ['component-with-action'],
    click: function click() {
      this.sendAction();
    }
  });

  bootApp();

  $fixture.find('.component-with-action').click();
});

QUnit.test('the controller property is provided to route driven views', function () {
  var applicationController, applicationViewController;

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
    init: function init() {
      this._super.apply(this, arguments);
      applicationController = this;
    }
  });

  App.ApplicationView = _emberViewsViewsView2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      applicationViewController = this.get('controller');
    }
  });

  bootApp();

  equal(applicationViewController, applicationController, 'application view should get its controller set properly');
});

// This test caught a regression where {{#each}}s used directly in a template
// (i.e., not inside a view or component) did not have access to a container and
// would raise an exception.
QUnit.test('{{#each}} inside outlet can have an itemController', function (assert) {
  expectDeprecation(function () {
    templates.index = compile('\n      {{#each model itemController=\'thing\'}}\n        <p>hi</p>\n      {{/each}}\n    ');
  }, 'Using \'itemController\' with \'{{each}}\' (L2:C20) is deprecated.  Please refactor to a component.');

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    model: _emberMetalCore2['default'].A([1, 2, 3])
  });

  App.ThingController = _emberMetalCore2['default'].Controller.extend();

  bootApp();

  assert.equal($fixture.find('p').length, 3, 'the {{#each}} rendered without raising an exception');
});

QUnit.test('actions within a context shifting {{each}} with `itemController` [DEPRECATED]', function (assert) {
  expectDeprecation(function () {
    templates.index = compile('\n      {{#each model itemController=\'thing\'}}\n        {{controller}}\n        <p><a {{action \'checkController\' controller}}>Click me</a></p>\n      {{/each}}\n    ');
  });

  App.IndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return _emberMetalCore2['default'].A([{ name: 'red' }, { name: 'yellow' }, { name: 'blue' }]);
    }
  });

  App.ThingController = _emberMetalCore2['default'].Controller.extend({
    actions: {
      checkController: function checkController(controller) {
        assert.ok(controller === this, 'correct controller was passed as action context');
      }
    }
  });

  bootApp();

  $fixture.find('a').first().click();
});

function bootApp() {
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}