'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var compile = _emberHtmlbarsCompat2['default'].compile;

var App, $fixture;

function setupExample() {
  // setup templates
  _emberMetalCore2['default'].TEMPLATES.application = compile('{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h1>People</h1><ul>{{#each model as |person|}}<li>Hello, <b>{{person.fullName}}</b>!</li>{{/each}}</ul>');

  App.Person = _emberMetalCore2['default'].Object.extend({
    firstName: null,
    lastName: null,

    fullName: _emberMetalCore2['default'].computed('firstName', 'lastName', function () {
      return this.get('firstName') + ' ' + this.get('lastName');
    })
  });

  App.IndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
      var people = _emberMetalCore2['default'].A([App.Person.create({
        firstName: 'Tom',
        lastName: 'Dale'
      }), App.Person.create({
        firstName: 'Yehuda',
        lastName: 'Katz'
      })]);
      return people;
    }
  });
}

QUnit.module('Homepage Example', {
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

      App.LoadingRoute = _emberMetalCore2['default'].Route.extend();
    });

    $fixture = _emberMetalCore2['default'].$('#qunit-fixture');
    setupExample();
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].run(function () {
      App.destroy();
    });

    App = null;

    _emberMetalCore2['default'].TEMPLATES = {};
  }
});

QUnit.test('The example renders correctly', function () {
  _emberMetalCore2['default'].run(App, 'advanceReadiness');

  equal($fixture.find('h1:contains(People)').length, 1);
  equal($fixture.find('li').length, 2);
  equal($fixture.find('li:nth-of-type(1)').text(), 'Hello, Tom Dale!');
  equal($fixture.find('li:nth-of-type(2)').text(), 'Hello, Yehuda Katz!');
});