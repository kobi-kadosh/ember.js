'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTestingTest = require('ember-testing/test');

var _emberTestingTest2 = _interopRequireDefault(_emberTestingTest);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

require('ember-application');

var App, find, visit;
var originalAdapter = _emberTestingTest2['default'].adapter;

QUnit.module('ember-testing Integration', {
  setup: function setup() {
    (0, _emberViewsSystemJquery2['default'])('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create({
        rootElement: '#ember-testing'
      });

      App.Router.map(function () {
        this.route('people', { path: '/' });
      });

      App.PeopleRoute = _emberRoutingSystemRoute2['default'].extend({
        model: function model() {
          return App.Person.find();
        }
      });

      App.PeopleView = _emberViewsViewsView2['default'].extend({
        defaultTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each model as |person|}}<div class="name">{{person.firstName}}</div>{{/each}}')
      });

      App.PeopleController = _emberRuntimeControllersArray_controller2['default'].extend({});

      App.Person = _emberRuntimeSystemObject2['default'].extend({
        firstName: ''
      });

      App.Person.reopenClass({
        find: function find() {
          return _emberMetalCore2['default'].A();
        }
      });

      App.ApplicationView = _emberViewsViewsView2['default'].extend({
        defaultTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}')
      });

      App.setupForTesting();
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      App.reset();
    });

    App.injectTestHelpers();

    find = window.find;
    visit = window.visit;
  },

  teardown: function teardown() {
    App.removeTestHelpers();
    (0, _emberViewsSystemJquery2['default'])('#ember-testing-container, #ember-testing').remove();
    (0, _emberMetalRun_loop2['default'])(App, App.destroy);
    App = null;
    _emberTestingTest2['default'].adapter = originalAdapter;
  }
});

QUnit.test('template is bound to empty array of people', function () {
  App.Person.find = function () {
    return _emberMetalCore2['default'].A();
  };
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  visit('/').then(function () {
    var rows = find('.name').length;
    equal(rows, 0, 'successfully stubbed an empty array of people');
  });
});

QUnit.test('template is bound to array of 2 people', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  App.Person.find = function () {
    var people = _emberMetalCore2['default'].A();
    var first = App.Person.create({ firstName: 'x' });
    var last = App.Person.create({ firstName: 'y' });
    (0, _emberMetalRun_loop2['default'])(people, people.pushObject, first);
    (0, _emberMetalRun_loop2['default'])(people, people.pushObject, last);
    return people;
  };
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  visit('/').then(function () {
    var rows = find('.name').length;
    equal(rows, 2, 'successfully stubbed a non empty array of people');
  });
});

QUnit.test('template is again bound to empty array of people', function () {
  App.Person.find = function () {
    return _emberMetalCore2['default'].A();
  };
  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');
  visit('/').then(function () {
    var rows = find('.name').length;
    equal(rows, 0, 'successfully stubbed another empty array of people');
  });
});

QUnit.test('`visit` can be called without advancedReadiness.', function () {
  App.Person.find = function () {
    return _emberMetalCore2['default'].A();
  };

  visit('/').then(function () {
    var rows = find('.name').length;
    equal(rows, 0, 'stubbed an empty array of people without calling advancedReadiness.');
  });
});