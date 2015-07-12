'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var compile = _emberHtmlbarsCompat2['default'].compile;

var Router, App, router, registry, container;
var set = _emberMetalCore2['default'].set;

var aboutDefer, otherDefer;

function basicEagerURLUpdateTest(setTagName) {
  expect(6);

  if (setTagName) {
    _emberMetalCore2['default'].TEMPLATES.application = compile('{{outlet}}{{link-to \'Index\' \'index\' id=\'index-link\'}}{{link-to \'About\' \'about\' id=\'about-link\' tagName=\'span\'}}');
  }

  bootApplication();
  equal(updateCount, 0);
  _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#about-link'), 'click');

  // URL should be eagerly updated now
  equal(updateCount, 1);
  equal(router.get('location.path'), '/about');

  // Resolve the promise.
  _emberMetalCore2['default'].run(aboutDefer, 'resolve');
  equal(router.get('location.path'), '/about');

  // Shouldn't have called update url again.
  equal(updateCount, 1);
  equal(router.get('location.path'), '/about');
}

function bootApplication() {
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

var updateCount, replaceCount;

function sharedSetup() {
  App = _emberMetalCore2['default'].Application.create({
    name: 'App',
    rootElement: '#qunit-fixture'
  });

  App.deferReadiness();

  updateCount = replaceCount = 0;
  App.Router.reopen({
    location: _emberMetalCore2['default'].NoneLocation.create({
      setURL: function setURL(path) {
        updateCount++;
        set(this, 'path', path);
      },

      replaceURL: function replaceURL(path) {
        replaceCount++;
        set(this, 'path', path);
      }
    })
  });

  Router = App.Router;
  registry = App.registry;
  container = App.__container__;
}

function sharedTeardown() {
  _emberMetalCore2['default'].run(function () {
    App.destroy();
  });
  _emberMetalCore2['default'].TEMPLATES = {};
}
if ((0, _emberMetalFeatures2['default'])('ember-routing-transitioning-classes')) {
  QUnit.module('The {{link-to}} helper: .transitioning-in .transitioning-out CSS classes', {
    setup: function setup() {
      _emberMetalCore2['default'].run(function () {
        sharedSetup();

        registry.unregister('router:main');
        registry.register('router:main', Router);

        Router.map(function () {
          this.route('about');
          this.route('other');
        });

        App.AboutRoute = _emberMetalCore2['default'].Route.extend({
          model: function model() {
            aboutDefer = _emberMetalCore2['default'].RSVP.defer();
            return aboutDefer.promise;
          }
        });

        App.OtherRoute = _emberMetalCore2['default'].Route.extend({
          model: function model() {
            otherDefer = _emberMetalCore2['default'].RSVP.defer();
            return otherDefer.promise;
          }
        });

        _emberMetalCore2['default'].TEMPLATES.application = compile('{{outlet}}{{link-to \'Index\' \'index\' id=\'index-link\'}}{{link-to \'About\' \'about\' id=\'about-link\'}}{{link-to \'Other\' \'other\' id=\'other-link\'}}');
      });
    },

    teardown: function teardown() {
      sharedTeardown();
      aboutDefer = null;
    }
  });

  QUnit.test('while a transition is underway', function () {
    expect(18);
    bootApplication();

    function assertHasClass(className) {
      var i = 1;
      while (i < arguments.length) {
        var $a = arguments[i];
        var shouldHaveClass = arguments[i + 1];
        equal($a.hasClass(className), shouldHaveClass, $a.attr('id') + ' should ' + (shouldHaveClass ? '' : 'not ') + 'have class ' + className);
        i += 2;
      }
    }

    var $index = _emberMetalCore2['default'].$('#index-link');
    var $about = _emberMetalCore2['default'].$('#about-link');
    var $other = _emberMetalCore2['default'].$('#other-link');

    _emberMetalCore2['default'].run($about, 'click');

    assertHasClass('active', $index, true, $about, false, $other, false);
    assertHasClass('ember-transitioning-in', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-out', $index, true, $about, false, $other, false);

    _emberMetalCore2['default'].run(aboutDefer, 'resolve');

    assertHasClass('active', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-in', $index, false, $about, false, $other, false);
    assertHasClass('ember-transitioning-out', $index, false, $about, false, $other, false);
  });

  QUnit.test('while a transition is underway with nested link-to\'s', function () {
    expect(54);

    Router.map(function () {
      this.route('parent-route', function () {
        this.route('about');
        this.route('other');
      });
    });

    App.ParentRouteAboutRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        aboutDefer = _emberMetalCore2['default'].RSVP.defer();
        return aboutDefer.promise;
      }
    });

    App.ParentRouteOtherRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        otherDefer = _emberMetalCore2['default'].RSVP.defer();
        return otherDefer.promise;
      }
    });

    _emberMetalCore2['default'].TEMPLATES.application = compile('\n      {{outlet}}\n      {{#link-to \'index\' tagName=\'li\'}}\n        {{link-to \'Index\' \'index\' id=\'index-link\'}}\n      {{/link-to}}\n      {{#link-to \'parent-route.about\' tagName=\'li\'}}\n        {{link-to \'About\' \'parent-route.about\' id=\'about-link\'}}\n      {{/link-to}}\n      {{#link-to \'parent-route.other\' tagName=\'li\'}}\n        {{link-to \'Other\' \'parent-route.other\' id=\'other-link\'}}\n      {{/link-to}}\n    ');

    bootApplication();

    function assertHasClass(className) {
      var i = 1;
      while (i < arguments.length) {
        var $a = arguments[i];
        var shouldHaveClass = arguments[i + 1];
        equal($a.hasClass(className), shouldHaveClass, $a.attr('id') + ' should ' + (shouldHaveClass ? '' : 'not ') + 'have class ' + className);
        i += 2;
      }
    }

    var $index = _emberMetalCore2['default'].$('#index-link');
    var $about = _emberMetalCore2['default'].$('#about-link');
    var $other = _emberMetalCore2['default'].$('#other-link');

    _emberMetalCore2['default'].run($about, 'click');

    assertHasClass('active', $index, true, $about, false, $other, false);
    assertHasClass('ember-transitioning-in', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-out', $index, true, $about, false, $other, false);

    _emberMetalCore2['default'].run(aboutDefer, 'resolve');

    assertHasClass('active', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-in', $index, false, $about, false, $other, false);
    assertHasClass('ember-transitioning-out', $index, false, $about, false, $other, false);

    _emberMetalCore2['default'].run($other, 'click');

    assertHasClass('active', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-in', $index, false, $about, false, $other, true);
    assertHasClass('ember-transitioning-out', $index, false, $about, true, $other, false);

    _emberMetalCore2['default'].run(otherDefer, 'resolve');

    assertHasClass('active', $index, false, $about, false, $other, true);
    assertHasClass('ember-transitioning-in', $index, false, $about, false, $other, false);
    assertHasClass('ember-transitioning-out', $index, false, $about, false, $other, false);

    _emberMetalCore2['default'].run($about, 'click');

    assertHasClass('active', $index, false, $about, false, $other, true);
    assertHasClass('ember-transitioning-in', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-out', $index, false, $about, false, $other, true);

    _emberMetalCore2['default'].run(aboutDefer, 'resolve');

    assertHasClass('active', $index, false, $about, true, $other, false);
    assertHasClass('ember-transitioning-in', $index, false, $about, false, $other, false);
    assertHasClass('ember-transitioning-out', $index, false, $about, false, $other, false);
  });
} else {
  QUnit.module('The {{link-to}} helper: eager URL updating', {
    setup: function setup() {
      _emberMetalCore2['default'].run(function () {
        sharedSetup();

        registry.unregister('router:main');
        registry.register('router:main', Router);

        Router.map(function () {
          this.route('about');
        });

        App.AboutRoute = _emberMetalCore2['default'].Route.extend({
          model: function model() {
            aboutDefer = _emberMetalCore2['default'].RSVP.defer();
            return aboutDefer.promise;
          }
        });

        _emberMetalCore2['default'].TEMPLATES.application = compile('{{outlet}}{{link-to \'Index\' \'index\' id=\'index-link\'}}{{link-to \'About\' \'about\' id=\'about-link\'}}');
      });
    },

    teardown: function teardown() {
      sharedTeardown();
      aboutDefer = null;
    }
  });

  QUnit.test('invoking a link-to with a slow promise eager updates url', function () {
    basicEagerURLUpdateTest(false);
  });

  QUnit.test('when link-to eagerly updates url, the path it provides does NOT include the rootURL', function () {
    expect(2);

    // HistoryLocation is the only Location class that will cause rootURL to be
    // prepended to link-to href's right now
    var HistoryTestLocation = _emberMetalCore2['default'].HistoryLocation.extend({
      location: {
        hash: '',
        hostname: 'emberjs.com',
        href: 'http://emberjs.com/app/',
        pathname: '/app/',
        protocol: 'http:',
        port: '',
        search: ''
      },

      // Don't actually touch the URL
      replaceState: function replaceState(path) {},
      pushState: function pushState(path) {},

      setURL: function setURL(path) {
        set(this, 'path', path);
      },

      replaceURL: function replaceURL(path) {
        set(this, 'path', path);
      }
    });

    registry.register('location:historyTest', HistoryTestLocation);

    Router.reopen({
      location: 'historyTest',
      rootURL: '/app/'
    });

    bootApplication();

    // href should have rootURL prepended
    equal(_emberMetalCore2['default'].$('#about-link').attr('href'), '/app/about');

    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#about-link'), 'click');

    // Actual path provided to Location class should NOT have rootURL
    equal(router.get('location.path'), '/about');
  });

  QUnit.test('non `a` tags also eagerly update URL', function () {
    basicEagerURLUpdateTest(true);
  });

  QUnit.test('invoking a link-to with a promise that rejects on the run loop doesn\'t update url', function () {
    App.AboutRoute = _emberMetalCore2['default'].Route.extend({
      model: function model() {
        return _emberMetalCore2['default'].RSVP.reject();
      }
    });

    bootApplication();
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#about-link'), 'click');

    // Shouldn't have called update url.
    equal(updateCount, 0);
    equal(router.get('location.path'), '', 'url was not updated');
  });

  QUnit.test('invoking a link-to whose transition gets aborted in will transition doesn\'t update the url', function () {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      actions: {
        willTransition: function willTransition(transition) {
          ok(true, 'aborting transition');
          transition.abort();
        }
      }
    });

    bootApplication();
    _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#about-link'), 'click');

    // Shouldn't have called update url.
    equal(updateCount, 0);
    equal(router.get('location.path'), '', 'url was not updated');
  });
}