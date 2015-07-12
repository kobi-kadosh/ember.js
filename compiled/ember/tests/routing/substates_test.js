'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var compile = _emberHtmlbarsCompat2['default'].compile;

var Router, App, templates, router, container, counter;

function step(expectedValue, description) {
  equal(counter, expectedValue, 'Step ' + expectedValue + ': ' + description);
  counter++;
}

function bootApplication(startingURL) {

  for (var name in templates) {
    _emberMetalCore2['default'].TEMPLATES[name] = compile(templates[name]);
  }

  if (startingURL) {
    _emberMetalCore2['default'].NoneLocation.reopen({
      path: startingURL
    });
  }

  startingURL = startingURL || '';
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

QUnit.module('Loading/Error Substates', {
  setup: function setup() {
    counter = 1;

    _emberMetalCore2['default'].run(function () {
      App = _emberMetalCore2['default'].Application.create({
        name: 'App',
        rootElement: '#qunit-fixture',
        // fake a modules resolver
        Resolver: _emberMetalCore2['default'].DefaultResolver.extend({ moduleBasedResolver: true })
      });

      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });

      Router = App.Router;

      container = App.__container__;

      templates = {
        application: '<div id="app">{{outlet}}</div>',
        index: 'INDEX',
        loading: 'LOADING',
        bro: 'BRO',
        sis: 'SIS'
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

QUnit.test('Slow promise from a child route of application enters nested loading state', function () {

  var broModel = {};
  var broDeferred = _emberMetalCore2['default'].RSVP.defer();

  Router.map(function () {
    this.route('bro');
  });

  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      step(2, 'ApplicationRoute#setup');
    }
  });

  App.BroRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      step(1, 'BroRoute#model');
      return broDeferred.promise;
    }
  });

  bootApplication('/bro');

  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'LOADING', 'The Loading template is nested in application template\'s outlet');

  _emberMetalCore2['default'].run(broDeferred, 'resolve', broModel);

  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'BRO', 'bro template has loaded and replaced loading template');
});

QUnit.test('Slow promises waterfall on startup', function () {

  expect(7);

  var grandmaDeferred = _emberMetalCore2['default'].RSVP.defer();
  var sallyDeferred = _emberMetalCore2['default'].RSVP.defer();

  Router.map(function () {
    this.route('grandma', function () {
      this.route('mom', { resetNamespace: true }, function () {
        this.route('sally');
      });
    });
  });

  templates.grandma = 'GRANDMA {{outlet}}';
  templates.mom = 'MOM {{outlet}}';
  templates['mom/loading'] = 'MOMLOADING';
  templates['mom/sally'] = 'SALLY';

  App.GrandmaRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      step(1, 'GrandmaRoute#model');
      return grandmaDeferred.promise;
    }
  });

  App.MomRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      step(2, 'Mom#model');
      return {};
    }
  });

  App.MomSallyRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      step(3, 'SallyRoute#model');
      return sallyDeferred.promise;
    },
    setupController: function setupController() {
      step(4, 'SallyRoute#setupController');
    }
  });

  bootApplication('/grandma/mom/sally');

  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'LOADING', 'The Loading template is nested in application template\'s outlet');

  _emberMetalCore2['default'].run(grandmaDeferred, 'resolve', {});
  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'GRANDMA MOM MOMLOADING', 'Mom\'s child loading route is displayed due to sally\'s slow promise');

  _emberMetalCore2['default'].run(sallyDeferred, 'resolve', {});
  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'GRANDMA MOM SALLY', 'Sally template displayed');
});

QUnit.test('ApplicationRoute#currentPath reflects loading state path', function () {

  expect(4);

  var momDeferred = _emberMetalCore2['default'].RSVP.defer();

  Router.map(function () {
    this.route('grandma', function () {
      this.route('mom');
    });
  });

  templates.grandma = 'GRANDMA {{outlet}}';
  templates['grandma/loading'] = 'GRANDMALOADING';
  templates['grandma/mom'] = 'MOM';

  App.GrandmaMomRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return momDeferred.promise;
    }
  });

  bootApplication('/grandma/mom');

  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'GRANDMA GRANDMALOADING');

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), 'grandma.loading', 'currentPath reflects loading state');

  _emberMetalCore2['default'].run(momDeferred, 'resolve', {});
  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'GRANDMA MOM');
  equal(appController.get('currentPath'), 'grandma.mom', 'currentPath reflects final state');
});

QUnit.test('Slow promises returned from ApplicationRoute#model don\'t enter LoadingRoute', function () {

  expect(2);

  var appDeferred = _emberMetalCore2['default'].RSVP.defer();

  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return appDeferred.promise;
    }
  });

  App.LoadingRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      ok(false, 'shouldn\'t get here');
    }
  });

  bootApplication();

  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), '', 'nothing has been rendered yet');

  _emberMetalCore2['default'].run(appDeferred, 'resolve', {});
  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'INDEX');
});

QUnit.test('Don\'t enter loading route unless either route or template defined', function () {

  delete templates.loading;

  expect(2);

  var indexDeferred = _emberMetalCore2['default'].RSVP.defer();

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

  App.IndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return indexDeferred.promise;
    }
  });

  bootApplication();

  var appController = container.lookup('controller:application');
  ok(appController.get('currentPath') !== 'loading', 'loading state not entered');

  _emberMetalCore2['default'].run(indexDeferred, 'resolve', {});
  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'INDEX');
});

QUnit.test('Enter loading route if only LoadingRoute defined', function () {

  delete templates.loading;

  expect(4);

  var indexDeferred = _emberMetalCore2['default'].RSVP.defer();

  App.IndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      step(1, 'IndexRoute#model');
      return indexDeferred.promise;
    }
  });

  App.LoadingRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      step(2, 'LoadingRoute#setupController');
    }
  });

  bootApplication();

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), 'loading', 'loading state entered');

  _emberMetalCore2['default'].run(indexDeferred, 'resolve', {});
  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'INDEX');
});

QUnit.test('Enter child loading state of pivot route', function () {

  expect(4);

  var deferred = _emberMetalCore2['default'].RSVP.defer();

  Router.map(function () {
    this.route('grandma', function () {
      this.route('mom', { resetNamespace: true }, function () {
        this.route('sally');
      });
      this.route('smells');
    });
  });

  templates['grandma/loading'] = 'GMONEYLOADING';

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

  App.MomSallyRoute = _emberMetalCore2['default'].Route.extend({
    setupController: function setupController() {
      step(1, 'SallyRoute#setupController');
    }
  });

  App.GrandmaSmellsRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return deferred.promise;
    }
  });

  bootApplication('/grandma/mom/sally');

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), 'grandma.mom.sally', 'Initial route fully loaded');

  _emberMetalCore2['default'].run(router, 'transitionTo', 'grandma.smells');
  equal(appController.get('currentPath'), 'grandma.loading', 'in pivot route\'s child loading state');

  _emberMetalCore2['default'].run(deferred, 'resolve', {});

  equal(appController.get('currentPath'), 'grandma.smells', 'Finished transition');
});

QUnit.test('Loading actions bubble to root, but don\'t enter substates above pivot', function () {

  expect(6);

  delete templates.loading;

  var sallyDeferred = _emberMetalCore2['default'].RSVP.defer();
  var smellsDeferred = _emberMetalCore2['default'].RSVP.defer();

  Router.map(function () {
    this.route('grandma', function () {
      this.route('mom', { resetNamespace: true }, function () {
        this.route('sally');
      });
      this.route('smells');
    });
  });

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

  App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
    actions: {
      loading: function loading(transition, route) {
        ok(true, 'loading action received on ApplicationRoute');
      }
    }
  });

  App.MomSallyRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return sallyDeferred.promise;
    }
  });

  App.GrandmaSmellsRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return smellsDeferred.promise;
    }
  });

  bootApplication('/grandma/mom/sally');

  var appController = container.lookup('controller:application');
  ok(!appController.get('currentPath'), 'Initial route fully loaded');
  _emberMetalCore2['default'].run(sallyDeferred, 'resolve', {});

  equal(appController.get('currentPath'), 'grandma.mom.sally', 'transition completed');

  _emberMetalCore2['default'].run(router, 'transitionTo', 'grandma.smells');
  equal(appController.get('currentPath'), 'grandma.mom.sally', 'still in initial state because the only loading state is above the pivot route');

  _emberMetalCore2['default'].run(smellsDeferred, 'resolve', {});

  equal(appController.get('currentPath'), 'grandma.smells', 'Finished transition');
});

QUnit.test('Default error event moves into nested route', function () {

  expect(5);

  templates['grandma'] = 'GRANDMA {{outlet}}';
  templates['grandma/error'] = 'ERROR: {{model.msg}}';

  Router.map(function () {
    this.route('grandma', function () {
      this.route('mom', { resetNamespace: true }, function () {
        this.route('sally');
      });
    });
  });

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

  App.MomSallyRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      step(1, 'MomSallyRoute#model');

      return _emberMetalCore2['default'].RSVP.reject({
        msg: 'did it broke?'
      });
    },
    actions: {
      error: function error() {
        step(2, 'MomSallyRoute#actions.error');
        return true;
      }
    }
  });

  bootApplication('/grandma/mom/sally');

  step(3, 'App finished booting');

  equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'GRANDMA ERROR: did it broke?', 'error bubbles');

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), 'grandma.error', 'Initial route fully loaded');
});

if ((0, _emberMetalFeatures2['default'])('ember-routing-named-substates')) {

  QUnit.test('Slow promises returned from ApplicationRoute#model enter ApplicationLoadingRoute if present', function () {

    expect(2);

    var appDeferred = _emberMetalCore2['default'].RSVP.defer();

    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return appDeferred.promise;
      }
    });

    var loadingRouteEntered = false;
    App.ApplicationLoadingRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController() {
        loadingRouteEntered = true;
      }
    });

    bootApplication();

    ok(loadingRouteEntered, 'ApplicationLoadingRoute was entered');

    _emberMetalCore2['default'].run(appDeferred, 'resolve', {});
    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'INDEX');
  });

  QUnit.test('Slow promises returned from ApplicationRoute#model enter application_loading if template present', function () {

    expect(3);

    templates['application_loading'] = 'TOPLEVEL LOADING';

    var appDeferred = _emberMetalCore2['default'].RSVP.defer();
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return appDeferred.promise;
      }
    });

    var loadingRouteEntered = false;
    App.ApplicationLoadingRoute = _emberMetalCore2['default'].Route.extend({
      setupController: function setupController() {
        loadingRouteEntered = true;
      }
    });

    App.ApplicationLoadingView = _emberViewsViewsView2['default'].extend({
      elementId: 'toplevel-loading'
    });

    bootApplication();

    equal(_emberMetalCore2['default'].$('#qunit-fixture > #toplevel-loading').text(), 'TOPLEVEL LOADING');

    _emberMetalCore2['default'].run(appDeferred, 'resolve', {});

    equal(_emberMetalCore2['default'].$('#toplevel-loading', '#qunit-fixture').length, 0, 'top-level loading View has been entirely removed from DOM');
    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'INDEX');
  });

  QUnit.test('Default error event moves into nested route, prioritizing more specifically named error route', function () {

    expect(5);

    templates['grandma'] = 'GRANDMA {{outlet}}';
    templates['grandma/error'] = 'ERROR: {{model.msg}}';
    templates['grandma/mom_error'] = 'MOM ERROR: {{model.msg}}';

    Router.map(function () {
      this.route('grandma', function () {
        this.route('mom', { resetNamespace: true }, function () {
          this.route('sally');
        });
      });
    });

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    App.MomSallyRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        step(1, 'MomSallyRoute#model');

        return _emberMetalCore2['default'].RSVP.reject({
          msg: 'did it broke?'
        });
      },
      actions: {
        error: function error() {
          step(2, 'MomSallyRoute#actions.error');
          return true;
        }
      }
    });

    bootApplication('/grandma/mom/sally');

    step(3, 'App finished booting');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'GRANDMA MOM ERROR: did it broke?', 'the more specifically-named mom error substate was entered over the other error route');

    var appController = container.lookup('controller:application');
    equal(appController.get('currentPath'), 'grandma.mom_error', 'Initial route fully loaded');
  });

  QUnit.test('Prioritized substate entry works with preserved-namespace nested routes', function () {

    expect(2);

    templates['foo/bar_loading'] = 'FOOBAR LOADING';
    templates['foo/bar/index'] = 'YAY';

    Router.map(function () {
      this.route('foo', function () {
        this.route('foo.bar', { path: '/bar', resetNamespace: true }, function () {});
      });
    });

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    var deferred = _emberMetalCore2['default'].RSVP.defer();
    App.FooBarRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return deferred.promise;
      }
    });

    bootApplication('/foo/bar');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'FOOBAR LOADING', 'foo.bar_loading was entered (as opposed to something like foo/foo/bar_loading)');

    _emberMetalCore2['default'].run(deferred, 'resolve');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'YAY');
  });

  QUnit.test('Prioritized loading substate entry works with preserved-namespace nested routes', function () {

    expect(2);

    templates['foo/bar_loading'] = 'FOOBAR LOADING';
    templates['foo/bar'] = 'YAY';

    Router.map(function () {
      this.route('foo', function () {
        this.route('bar');
      });
    });

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    var deferred = _emberMetalCore2['default'].RSVP.defer();
    App.FooBarRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return deferred.promise;
      }
    });

    bootApplication('/foo/bar');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'FOOBAR LOADING', 'foo.bar_loading was entered (as opposed to something like foo/foo/bar_loading)');

    _emberMetalCore2['default'].run(deferred, 'resolve');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'YAY');
  });

  QUnit.test('Prioritized error substate entry works with preserved-namespace nested routes', function () {

    expect(1);

    templates['foo/bar_error'] = 'FOOBAR ERROR: {{model.msg}}';
    templates['foo/bar'] = 'YAY';

    Router.map(function () {
      this.route('foo', function () {
        this.route('bar');
      });
    });

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    App.FooBarRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return _emberMetalCore2['default'].RSVP.reject({
          msg: 'did it broke?'
        });
      }
    });

    bootApplication('/foo/bar');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'FOOBAR ERROR: did it broke?', 'foo.bar_error was entered (as opposed to something like foo/foo/bar_error)');
  });

  QUnit.test('Prioritized loading substate entry works with auto-generated index routes', function () {

    expect(2);

    templates['foo/index_loading'] = 'FOO LOADING';
    templates['foo/index'] = 'YAY';
    templates['foo'] = '{{outlet}}';

    Router.map(function () {
      this.route('foo', function () {
        this.route('bar');
      });
    });

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    var deferred = _emberMetalCore2['default'].RSVP.defer();
    App.FooIndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return deferred.promise;
      }
    });
    App.FooRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return true;
      }
    });

    bootApplication('/foo');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'FOO LOADING', 'foo.index_loading was entered');

    _emberMetalCore2['default'].run(deferred, 'resolve');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'YAY');
  });

  QUnit.test('Prioritized error substate entry works with auto-generated index routes', function () {

    expect(1);

    templates['foo/index_error'] = 'FOO ERROR: {{model.msg}}';
    templates['foo/index'] = 'YAY';
    templates['foo'] = '{{outlet}}';

    Router.map(function () {
      this.route('foo', function () {
        this.route('bar');
      });
    });

    App.ApplicationController = _emberMetalCore2['default'].Controller.extend();

    App.FooIndexRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return _emberMetalCore2['default'].RSVP.reject({
          msg: 'did it broke?'
        });
      }
    });
    App.FooRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return true;
      }
    });

    bootApplication('/foo');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'FOO ERROR: did it broke?', 'foo.index_error was entered');
  });

  QUnit.test('Rejected promises returned from ApplicationRoute transition into top-level application_error', function () {

    expect(2);

    templates['application_error'] = '<p id="toplevel-error">TOPLEVEL ERROR: {{model.msg}}</p>';

    var reject = true;
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        if (reject) {
          return _emberMetalCore2['default'].RSVP.reject({ msg: 'BAD NEWS BEARS' });
        } else {
          return {};
        }
      }
    });

    bootApplication();

    equal(_emberMetalCore2['default'].$('#toplevel-error', '#qunit-fixture').text(), 'TOPLEVEL ERROR: BAD NEWS BEARS');

    reject = false;
    _emberMetalCore2['default'].run(router, 'transitionTo', 'index');

    equal(_emberMetalCore2['default'].$('#app', '#qunit-fixture').text(), 'INDEX');
  });
}