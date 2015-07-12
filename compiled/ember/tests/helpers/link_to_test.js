'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var compile = _emberHtmlbarsCompat2['default'].compile;

var Router, App, AppView, router, registry, container;
var set = _emberMetalCore2['default'].set;

function bootApplication() {
  router = container.lookup('router:main');
  _emberMetalCore2['default'].run(App, 'advanceReadiness');
}

// IE includes the host name
function normalizeUrl(url) {
  return url.replace(/https?:\/\/[^\/]+/, '');
}

function shouldNotBeActive(selector) {
  checkActive(selector, false);
}

function shouldBeActive(selector) {
  checkActive(selector, true);
}

function checkActive(selector, active) {
  var classList = _emberMetalCore2['default'].$(selector, '#qunit-fixture')[0].className;
  equal(classList.indexOf('active') > -1, active, selector + ' active should be ' + active.toString());
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

QUnit.module('The {{link-to}} helper', {
  setup: function setup() {
    _emberMetalCore2['default'].run(function () {

      sharedSetup();

      _emberMetalCore2['default'].TEMPLATES.app = compile('{{outlet}}');
      _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'about\' id=\'about-link\'}}About{{/link-to}}{{#link-to \'index\' id=\'self-link\'}}Self{{/link-to}}');
      _emberMetalCore2['default'].TEMPLATES.about = compile('<h3>About</h3>{{#link-to \'index\' id=\'home-link\'}}Home{{/link-to}}{{#link-to \'about\' id=\'self-link\'}}Self{{/link-to}}');
      _emberMetalCore2['default'].TEMPLATES.item = compile('<h3>Item</h3><p>{{model.name}}</p>{{#link-to \'index\' id=\'home-link\'}}Home{{/link-to}}');

      AppView = _emberViewsViewsView2['default'].extend({
        templateName: 'app'
      });

      registry.register('view:app', AppView);

      registry.unregister('router:main');
      registry.register('router:main', Router);
    });
  },

  teardown: sharedTeardown
});

// These two tests are designed to simulate the context of an ember-qunit/ember-test-helpers component integration test,
// so the container is available but it does not boot the entire app
QUnit.test('Using {{link-to}} does not cause an exception if it is rendered before the router has started routing', function (assert) {
  Router.map(function () {
    this.route('about');
  });

  registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);

  var component = _emberMetalCore2['default'].Component.extend({
    layout: compile('{{#link-to "about"}}Go to About{{/link-to}}'),
    container: container
  }).create();

  var router = container.lookup('router:main');
  router.setupRouter();

  _emberMetalCore2['default'].run(function () {
    component.appendTo('#qunit-fixture');
  });

  assert.strictEqual(component.$('a').length, 1, 'the link is rendered');
});

QUnit.test('Using {{link-to}} does not cause an exception if it is rendered without a router.js instance', function (assert) {
  registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);

  var component = _emberMetalCore2['default'].Component.extend({
    layout: compile('{{#link-to "nonexistent"}}Does not work.{{/link-to}}'),
    container: container
  }).create();

  _emberMetalCore2['default'].run(function () {
    component.appendTo('#qunit-fixture');
  });

  assert.strictEqual(component.$('a').length, 1, 'the link is rendered');
});

QUnit.test('The {{link-to}} helper moves into the named route', function () {
  Router.map(function (match) {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Home)', '#qunit-fixture').length, 1, 'The home template was rendered');
  equal(_emberMetalCore2['default'].$('#self-link.active', '#qunit-fixture').length, 1, 'The self-link was rendered with active class');
  equal(_emberMetalCore2['default'].$('#about-link:not(.active)', '#qunit-fixture').length, 1, 'The other link was rendered without active class');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-link', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(About)', '#qunit-fixture').length, 1, 'The about template was rendered');
  equal(_emberMetalCore2['default'].$('#self-link.active', '#qunit-fixture').length, 1, 'The self-link was rendered with active class');
  equal(_emberMetalCore2['default'].$('#home-link:not(.active)', '#qunit-fixture').length, 1, 'The other link was rendered without active class');
});

QUnit.test('The {{link-to}} helper supports URL replacement', function () {

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'about\' id=\'about-link\' replace=true}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(updateCount, 0, 'precond: setURL has not been called');
  equal(replaceCount, 0, 'precond: replaceURL has not been called');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-link', '#qunit-fixture').click();
  });

  equal(updateCount, 0, 'setURL should not be called');
  equal(replaceCount, 1, 'replaceURL should be called once');
});

QUnit.test('the {{link-to}} helper doesn\'t add an href when the tagName isn\'t \'a\'', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'about\' id=\'about-link\' tagName=\'div\'}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(_emberMetalCore2['default'].$('#about-link').attr('href'), undefined, 'there is no href attribute');
});

QUnit.test('the {{link-to}} applies a \'disabled\' class when disabled', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to "about" id="about-link" disabledWhen="shouldDisable"}}About{{/link-to}}');
  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    shouldDisable: true
  });

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(_emberMetalCore2['default'].$('#about-link.disabled', '#qunit-fixture').length, 1, 'The link is disabled when its disabledWhen is true');
});

QUnit.test('the {{link-to}} doesn\'t apply a \'disabled\' class if disabledWhen is not provided', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to "about" id="about-link"}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  ok(!_emberMetalCore2['default'].$('#about-link', '#qunit-fixture').hasClass('disabled'), 'The link is not disabled if disabledWhen not provided');
});

QUnit.test('the {{link-to}} helper supports a custom disabledClass', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to "about" id="about-link" disabledWhen=true disabledClass="do-not-want"}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(_emberMetalCore2['default'].$('#about-link.do-not-want', '#qunit-fixture').length, 1, 'The link can apply a custom disabled class');
});

QUnit.test('the {{link-to}} helper does not respond to clicks when disabled', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to "about" id="about-link" disabledWhen=true}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-link', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(About)', '#qunit-fixture').length, 0, 'Transitioning did not occur');
});

QUnit.test('The {{link-to}} helper supports a custom activeClass', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'about\' id=\'about-link\'}}About{{/link-to}}{{#link-to \'index\' id=\'self-link\' activeClass=\'zomg-active\'}}Self{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Home)', '#qunit-fixture').length, 1, 'The home template was rendered');
  equal(_emberMetalCore2['default'].$('#self-link.zomg-active', '#qunit-fixture').length, 1, 'The self-link was rendered with active class');
  equal(_emberMetalCore2['default'].$('#about-link:not(.active)', '#qunit-fixture').length, 1, 'The other link was rendered without active class');
});

QUnit.test('The {{link-to}} helper supports leaving off .index for nested routes', function () {
  Router.map(function () {
    this.route('about', function () {
      this.route('item');
    });
  });

  _emberMetalCore2['default'].TEMPLATES.about = compile('<h1>About</h1>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['about/index'] = compile('<div id=\'index\'>Index</div>');
  _emberMetalCore2['default'].TEMPLATES['about/item'] = compile('<div id=\'item\'>{{#link-to \'about\'}}About{{/link-to}}</div>');

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/about/item');

  equal(normalizeUrl(_emberMetalCore2['default'].$('#item a', '#qunit-fixture').attr('href')), '/about');
});

QUnit.test('The {{link-to}} helper supports currentWhen (DEPRECATED)', function () {
  expectDeprecation('Using currentWhen with {{link-to}} is deprecated in favor of `current-when`.');

  Router.map(function (match) {
    this.route('index', { path: '/' }, function () {
      this.route('about');
    });

    this.route('item');
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['index/about'] = compile('{{#link-to \'item\' id=\'other-link\' currentWhen=\'index\'}}ITEM{{/link-to}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  equal(_emberMetalCore2['default'].$('#other-link.active', '#qunit-fixture').length, 1, 'The link is active since current-when is a parent route');
});

QUnit.test('The {{link-to}} helper supports custom, nested, current-when', function () {
  Router.map(function (match) {
    this.route('index', { path: '/' }, function () {
      this.route('about');
    });

    this.route('item');
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['index/about'] = compile('{{#link-to \'item\' id=\'other-link\' current-when=\'index\'}}ITEM{{/link-to}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  equal(_emberMetalCore2['default'].$('#other-link.active', '#qunit-fixture').length, 1, 'The link is active since current-when is a parent route');
});

QUnit.test('The {{link-to}} helper does not disregard current-when when it is given explicitly for a route', function () {
  Router.map(function (match) {
    this.route('index', { path: '/' }, function () {
      this.route('about');
    });

    this.route('items', function () {
      this.route('item');
    });
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['index/about'] = compile('{{#link-to \'items\' id=\'other-link\' current-when=\'index\'}}ITEM{{/link-to}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  equal(_emberMetalCore2['default'].$('#other-link.active', '#qunit-fixture').length, 1, 'The link is active when current-when is given for explicitly for a route');
});

QUnit.test('The {{link-to}} helper supports multiple current-when routes', function () {
  Router.map(function (match) {
    this.route('index', { path: '/' }, function () {
      this.route('about');
    });
    this.route('item');
    this.route('foo');
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['index/about'] = compile('{{#link-to \'item\' id=\'link1\' current-when=\'item index\'}}ITEM{{/link-to}}');
  _emberMetalCore2['default'].TEMPLATES['item'] = compile('{{#link-to \'item\' id=\'link2\' current-when=\'item index\'}}ITEM{{/link-to}}');
  _emberMetalCore2['default'].TEMPLATES['foo'] = compile('{{#link-to \'item\' id=\'link3\' current-when=\'item index\'}}ITEM{{/link-to}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  equal(_emberMetalCore2['default'].$('#link1.active', '#qunit-fixture').length, 1, 'The link is active since current-when contains the parent route');

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/item');
  });

  equal(_emberMetalCore2['default'].$('#link2.active', '#qunit-fixture').length, 1, 'The link is active since you are on the active route');

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/foo');
  });

  equal(_emberMetalCore2['default'].$('#link3.active', '#qunit-fixture').length, 0, 'The link is not active since current-when does not contain the active route');
});

QUnit.test('The {{link-to}} helper defaults to bubbling', function () {
  _emberMetalCore2['default'].TEMPLATES.about = compile('<div {{action \'hide\'}}>{{#link-to \'about.contact\' id=\'about-contact\'}}About{{/link-to}}</div>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['about/contact'] = compile('<h1 id=\'contact\'>Contact</h1>');

  Router.map(function () {
    this.route('about', function () {
      this.route('contact');
    });
  });

  var hidden = 0;

  App.AboutRoute = _emberMetalCore2['default'].Route.extend({
    actions: {
      hide: function hide() {
        hidden++;
      }
    }
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-contact', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('#contact', '#qunit-fixture').text(), 'Contact', 'precond - the link worked');

  equal(hidden, 1, 'The link bubbles');
});

QUnit.test('The {{link-to}} helper supports bubbles=false', function () {
  _emberMetalCore2['default'].TEMPLATES.about = compile('<div {{action \'hide\'}}>{{#link-to \'about.contact\' id=\'about-contact\' bubbles=false}}About{{/link-to}}</div>{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES['about/contact'] = compile('<h1 id=\'contact\'>Contact</h1>');

  Router.map(function () {
    this.route('about', function () {
      this.route('contact');
    });
  });

  var hidden = 0;

  App.AboutRoute = _emberMetalCore2['default'].Route.extend({
    actions: {
      hide: function hide() {
        hidden++;
      }
    }
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-contact', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('#contact', '#qunit-fixture').text(), 'Contact', 'precond - the link worked');

  equal(hidden, 0, 'The link didn\'t bubble');
});

QUnit.test('The {{link-to}} helper moves into the named route with context', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  Router.map(function (match) {
    this.route('about');
    this.route('item', { path: '/item/:id' });
  });

  _emberMetalCore2['default'].TEMPLATES.about = compile('<h3>List</h3><ul>{{#each model as |person|}}<li>{{#link-to \'item\' person}}{{person.name}}{{/link-to}}</li>{{/each}}</ul>{{#link-to \'index\' id=\'home-link\'}}Home{{/link-to}}');

  App.AboutRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return _emberMetalCore2['default'].A([{ id: 'yehuda', name: 'Yehuda Katz' }, { id: 'tom', name: 'Tom Dale' }, { id: 'erik', name: 'Erik Brynroflsson' }]);
    }
  });

  App.ItemRoute = _emberMetalCore2['default'].Route.extend({
    serialize: function serialize(object) {
      return { id: object.id };
    }
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });

  equal(_emberMetalCore2['default'].$('h3:contains(List)', '#qunit-fixture').length, 1, 'The home template was rendered');
  equal(normalizeUrl(_emberMetalCore2['default'].$('#home-link').attr('href')), '/', 'The home link points back at /');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('li a:contains(Yehuda)', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Item)', '#qunit-fixture').length, 1, 'The item template was rendered');
  equal(_emberMetalCore2['default'].$('p', '#qunit-fixture').text(), 'Yehuda Katz', 'The name is correct');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#home-link').click();
  });
  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-link').click();
  });

  equal(normalizeUrl(_emberMetalCore2['default'].$('li a:contains(Yehuda)').attr('href')), '/item/yehuda');
  equal(normalizeUrl(_emberMetalCore2['default'].$('li a:contains(Tom)').attr('href')), '/item/tom');
  equal(normalizeUrl(_emberMetalCore2['default'].$('li a:contains(Erik)').attr('href')), '/item/erik');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('li a:contains(Erik)', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Item)', '#qunit-fixture').length, 1, 'The item template was rendered');
  equal(_emberMetalCore2['default'].$('p', '#qunit-fixture').text(), 'Erik Brynroflsson', 'The name is correct');
});

QUnit.test('The {{link-to}} helper binds some anchor html tag common attributes', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'index\' id=\'self-link\' title=\'title-attr\' rel=\'rel-attr\' tabindex=\'-1\'}}Self{{/link-to}}');
  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  var link = _emberMetalCore2['default'].$('#self-link', '#qunit-fixture');
  equal(link.attr('title'), 'title-attr', 'The self-link contains title attribute');
  equal(link.attr('rel'), 'rel-attr', 'The self-link contains rel attribute');
  equal(link.attr('tabindex'), '-1', 'The self-link contains tabindex attribute');
});

QUnit.test('The {{link-to}} helper supports `target` attribute', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'index\' id=\'self-link\' target=\'_blank\'}}Self{{/link-to}}');
  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  var link = _emberMetalCore2['default'].$('#self-link', '#qunit-fixture');
  equal(link.attr('target'), '_blank', 'The self-link contains `target` attribute');
});

QUnit.test('The {{link-to}} helper does not call preventDefault if `target` attribute is provided', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'index\' id=\'self-link\' target=\'_blank\'}}Self{{/link-to}}');
  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  var event = _emberMetalCore2['default'].$.Event('click');
  _emberMetalCore2['default'].$('#self-link', '#qunit-fixture').trigger(event);

  equal(event.isDefaultPrevented(), false, 'should not preventDefault when target attribute is specified');
});

QUnit.test('The {{link-to}} helper should preventDefault when `target = _self`', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{#link-to \'index\' id=\'self-link\' target=\'_self\'}}Self{{/link-to}}');
  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  var event = _emberMetalCore2['default'].$.Event('click');
  _emberMetalCore2['default'].$('#self-link', '#qunit-fixture').trigger(event);

  equal(event.isDefaultPrevented(), true, 'should preventDefault when target attribute is `_self`');
});

QUnit.test('The {{link-to}} helper should not transition if target is not equal to _self or empty', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'about\' id=\'about-link\' replace=true target=\'_blank\'}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#about-link', '#qunit-fixture').click();
  });

  notEqual(container.lookup('controller:application').get('currentRouteName'), 'about', 'link-to should not transition if target is not equal to _self or empty');
});

QUnit.test('The {{link-to}} helper accepts string/numeric arguments', function () {
  Router.map(function () {
    this.route('filter', { path: '/filters/:filter' });
    this.route('post', { path: '/post/:post_id' });
    this.route('repo', { path: '/repo/:owner/:name' });
  });

  App.FilterController = _emberMetalCore2['default'].Controller.extend({
    filter: 'unpopular',
    repo: _emberMetalCore2['default'].Object.create({ owner: 'ember', name: 'ember.js' }),
    post_id: 123
  });
  _emberMetalCore2['default'].TEMPLATES.filter = compile('<p>{{filter}}</p>{{#link-to "filter" "unpopular" id="link"}}Unpopular{{/link-to}}{{#link-to "filter" filter id="path-link"}}Unpopular{{/link-to}}{{#link-to "post" post_id id="post-path-link"}}Post{{/link-to}}{{#link-to "post" 123 id="post-number-link"}}Post{{/link-to}}{{#link-to "repo" repo id="repo-object-link"}}Repo{{/link-to}}');

  _emberMetalCore2['default'].TEMPLATES.index = compile(' ');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/filters/popular');
  });

  equal(normalizeUrl(_emberMetalCore2['default'].$('#link', '#qunit-fixture').attr('href')), '/filters/unpopular');
  equal(normalizeUrl(_emberMetalCore2['default'].$('#path-link', '#qunit-fixture').attr('href')), '/filters/unpopular');
  equal(normalizeUrl(_emberMetalCore2['default'].$('#post-path-link', '#qunit-fixture').attr('href')), '/post/123');
  equal(normalizeUrl(_emberMetalCore2['default'].$('#post-number-link', '#qunit-fixture').attr('href')), '/post/123');
  equal(normalizeUrl(_emberMetalCore2['default'].$('#repo-object-link', '#qunit-fixture').attr('href')), '/repo/ember/ember.js');
});

QUnit.test('Issue 4201 - Shorthand for route.index shouldn\'t throw errors about context arguments', function () {
  expect(2);
  Router.map(function () {
    this.route('lobby', function () {
      this.route('index', { path: ':lobby_id' });
      this.route('list');
    });
  });

  App.LobbyIndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model(params) {
      equal(params.lobby_id, 'foobar');
      return params.lobby_id;
    }
  });

  _emberMetalCore2['default'].TEMPLATES['lobby/index'] = compile('{{#link-to \'lobby\' \'foobar\' id=\'lobby-link\'}}Lobby{{/link-to}}');
  _emberMetalCore2['default'].TEMPLATES.index = compile('');
  _emberMetalCore2['default'].TEMPLATES['lobby/list'] = compile('{{#link-to \'lobby\' \'foobar\' id=\'lobby-link\'}}Lobby{{/link-to}}');
  bootApplication();
  _emberMetalCore2['default'].run(router, 'handleURL', '/lobby/list');
  _emberMetalCore2['default'].run(_emberMetalCore2['default'].$('#lobby-link'), 'click');
  shouldBeActive('#lobby-link');
});

QUnit.test('The {{link-to}} helper unwraps controllers', function () {

  if ((0, _emberMetalFeatures2['default'])('ember-routing-transitioning-classes')) {
    expect(5);
  } else {
    expect(6);
  }

  Router.map(function () {
    this.route('filter', { path: '/filters/:filter' });
  });

  var indexObject = { filter: 'popular' };

  App.FilterRoute = _emberMetalCore2['default'].Route.extend({
    model: function model(params) {
      return indexObject;
    },

    serialize: function serialize(passedObject) {
      equal(passedObject, indexObject, 'The unwrapped object is passed');
      return { filter: 'popular' };
    }
  });

  App.IndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return indexObject;
    }
  });

  _emberMetalCore2['default'].TEMPLATES.filter = compile('<p>{{model.filter}}</p>');
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to "filter" this id="link"}}Filter{{/link-to}}');

  expectDeprecation(function () {
    bootApplication();
  }, /Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated./);

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  _emberMetalCore2['default'].$('#link', '#qunit-fixture').trigger('click');
});

QUnit.test('The {{link-to}} helper doesn\'t change view context', function () {
  App.IndexView = _emberViewsViewsView2['default'].extend({
    elementId: 'index',
    name: 'test',
    isTrue: true
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{view.name}}-{{#link-to \'index\' id=\'self-link\'}}Link: {{view.name}}-{{#if view.isTrue}}{{view.name}}{{/if}}{{/link-to}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(_emberMetalCore2['default'].$('#index', '#qunit-fixture').text(), 'test-Link: test-test', 'accesses correct view');
});

QUnit.test('Quoteless route param performs property lookup', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' id=\'string-link\'}}string{{/link-to}}{{#link-to foo id=\'path-link\'}}path{{/link-to}}{{#link-to view.foo id=\'view-link\'}}{{view.foo}}{{/link-to}}');

  function assertEquality(href) {
    equal(normalizeUrl(_emberMetalCore2['default'].$('#string-link', '#qunit-fixture').attr('href')), '/');
    equal(normalizeUrl(_emberMetalCore2['default'].$('#path-link', '#qunit-fixture').attr('href')), href);
    equal(normalizeUrl(_emberMetalCore2['default'].$('#view-link', '#qunit-fixture').attr('href')), href);
  }

  App.IndexView = _emberViewsViewsView2['default'].extend({
    foo: 'index',
    elementId: 'index-view'
  });

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    foo: 'index'
  });

  App.Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  assertEquality('/');

  var controller = container.lookup('controller:index');
  var view = _emberViewsViewsView2['default'].views['index-view'];
  _emberMetalCore2['default'].run(function () {
    controller.set('foo', 'about');
    view.set('foo', 'about');
  });

  assertEquality('/about');
});

QUnit.test('link-to with null/undefined dynamic parameters are put in a loading state', function () {

  expect(19);

  var oldWarn = _emberMetalCore2['default'].Logger.warn;
  var warnCalled = false;
  _emberMetalCore2['default'].Logger.warn = function () {
    warnCalled = true;
  };
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to destinationRoute routeContext loadingClass=\'i-am-loading\' id=\'context-link\'}}string{{/link-to}}{{#link-to secondRoute loadingClass=\'i-am-loading\' id=\'static-link\'}}string{{/link-to}}');

  var thing = _emberMetalCore2['default'].Object.create({ id: 123 });

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    destinationRoute: null,
    routeContext: null
  });

  App.AboutRoute = _emberMetalCore2['default'].Route.extend({
    activate: function activate() {
      ok(true, 'About was entered');
    }
  });

  App.Router.map(function () {
    this.route('thing', { path: '/thing/:thing_id' });
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  function assertLinkStatus($link, url) {
    if (url) {
      equal(normalizeUrl($link.attr('href')), url, 'loaded link-to has expected href');
      ok(!$link.hasClass('i-am-loading'), 'loaded linkComponent has no loadingClass');
    } else {
      equal(normalizeUrl($link.attr('href')), '#', 'unloaded link-to has href=\'#\'');
      ok($link.hasClass('i-am-loading'), 'loading linkComponent has loadingClass');
    }
  }

  var $contextLink = _emberMetalCore2['default'].$('#context-link', '#qunit-fixture');
  var $staticLink = _emberMetalCore2['default'].$('#static-link', '#qunit-fixture');
  var controller = container.lookup('controller:index');

  assertLinkStatus($contextLink);
  assertLinkStatus($staticLink);

  _emberMetalCore2['default'].run(function () {
    warnCalled = false;
    $contextLink.click();
    ok(warnCalled, 'Logger.warn was called from clicking loading link');
  });

  // Set the destinationRoute (context is still null).
  _emberMetalCore2['default'].run(controller, 'set', 'destinationRoute', 'thing');
  assertLinkStatus($contextLink);

  // Set the routeContext to an id
  _emberMetalCore2['default'].run(controller, 'set', 'routeContext', '456');
  assertLinkStatus($contextLink, '/thing/456');

  // Test that 0 isn't interpreted as falsy.
  _emberMetalCore2['default'].run(controller, 'set', 'routeContext', 0);
  assertLinkStatus($contextLink, '/thing/0');

  // Set the routeContext to an object
  _emberMetalCore2['default'].run(controller, 'set', 'routeContext', thing);
  assertLinkStatus($contextLink, '/thing/123');

  // Set the destinationRoute back to null.
  _emberMetalCore2['default'].run(controller, 'set', 'destinationRoute', null);
  assertLinkStatus($contextLink);

  _emberMetalCore2['default'].run(function () {
    warnCalled = false;
    $staticLink.click();
    ok(warnCalled, 'Logger.warn was called from clicking loading link');
  });

  _emberMetalCore2['default'].run(controller, 'set', 'secondRoute', 'about');
  assertLinkStatus($staticLink, '/about');

  // Click the now-active link
  _emberMetalCore2['default'].run($staticLink, 'click');

  _emberMetalCore2['default'].Logger.warn = oldWarn;
});

QUnit.test('The {{link-to}} helper refreshes href element when one of params changes', function () {
  Router.map(function () {
    this.route('post', { path: '/posts/:post_id' });
  });

  var post = _emberMetalCore2['default'].Object.create({ id: '1' });
  var secondPost = _emberMetalCore2['default'].Object.create({ id: '2' });

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to "post" post id="post"}}post{{/link-to}}');

  App.IndexController = _emberMetalCore2['default'].Controller.extend();
  var indexController = container.lookup('controller:index');

  _emberMetalCore2['default'].run(function () {
    indexController.set('post', post);
  });

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });

  equal(normalizeUrl(_emberMetalCore2['default'].$('#post', '#qunit-fixture').attr('href')), '/posts/1', 'precond - Link has rendered href attr properly');

  _emberMetalCore2['default'].run(function () {
    indexController.set('post', secondPost);
  });

  equal(_emberMetalCore2['default'].$('#post', '#qunit-fixture').attr('href'), '/posts/2', 'href attr was updated after one of the params had been changed');

  _emberMetalCore2['default'].run(function () {
    indexController.set('post', null);
  });

  equal(_emberMetalCore2['default'].$('#post', '#qunit-fixture').attr('href'), '#', 'href attr becomes # when one of the arguments in nullified');
});

QUnit.test('The {{link-to}} helper\'s bound parameter functionality works as expected in conjunction with an ObjectProxy/Controller', function () {
  expectDeprecation(_emberRuntimeControllersObject_controller.objectControllerDeprecation);

  Router.map(function () {
    this.route('post', { path: '/posts/:post_id' });
  });

  var post = _emberMetalCore2['default'].Object.create({ id: '1' });
  var secondPost = _emberMetalCore2['default'].Object.create({ id: '2' });

  _emberMetalCore2['default'].TEMPLATES = {
    index: compile(' '),
    post: compile('{{#link-to "post" this id="self-link"}}selflink{{/link-to}}')
  };

  App.PostController = _emberMetalCore2['default'].ObjectController.extend();
  var postController = container.lookup('controller:post');

  bootApplication();

  _emberMetalCore2['default'].run(router, 'transitionTo', 'post', post);

  var $link = _emberMetalCore2['default'].$('#self-link', '#qunit-fixture');
  equal(normalizeUrl($link.attr('href')), '/posts/1', 'self link renders post 1');

  _emberMetalCore2['default'].run(postController, 'set', 'model', secondPost);

  equal(normalizeUrl($link.attr('href')), '/posts/2', 'self link updated to post 2');
});

QUnit.test('The {{link-to}} helper is active when a route is active', function () {
  Router.map(function () {
    this.route('about', function () {
      this.route('item');
    });
  });

  _emberMetalCore2['default'].TEMPLATES.about = compile('<div id=\'about\'>{{#link-to \'about\' id=\'about-link\'}}About{{/link-to}} {{#link-to \'about.item\' id=\'item-link\'}}Item{{/link-to}} {{outlet}}</div>');
  _emberMetalCore2['default'].TEMPLATES['about/item'] = compile(' ');
  _emberMetalCore2['default'].TEMPLATES['about/index'] = compile(' ');

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/about');

  equal(_emberMetalCore2['default'].$('#about-link.active', '#qunit-fixture').length, 1, 'The about route link is active');
  equal(_emberMetalCore2['default'].$('#item-link.active', '#qunit-fixture').length, 0, 'The item route link is inactive');

  _emberMetalCore2['default'].run(router, 'handleURL', '/about/item');

  equal(_emberMetalCore2['default'].$('#about-link.active', '#qunit-fixture').length, 1, 'The about route link is active');
  equal(_emberMetalCore2['default'].$('#item-link.active', '#qunit-fixture').length, 1, 'The item route link is active');
});

QUnit.test('The {{link-to}} helper works in an #each\'d array of string route names', function () {
  Router.map(function () {
    this.route('foo');
    this.route('bar');
    this.route('rar');
  });

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    routeNames: _emberMetalCore2['default'].A(['foo', 'bar', 'rar']),
    route1: 'bar',
    route2: 'foo'
  });

  _emberMetalCore2['default'].TEMPLATES = {
    index: compile('{{#each routeNames as |routeName|}}{{#link-to routeName}}{{routeName}}{{/link-to}}{{/each}}{{#each routeNames as |r|}}{{#link-to r}}{{r}}{{/link-to}}{{/each}}{{#link-to route1}}a{{/link-to}}{{#link-to route2}}b{{/link-to}}')
  };

  bootApplication();

  function linksEqual($links, expected) {
    equal($links.length, expected.length, 'Has correct number of links');

    var idx;
    for (idx = 0; idx < $links.length; idx++) {
      var href = _emberMetalCore2['default'].$($links[idx]).attr('href');
      // Old IE includes the whole hostname as well
      equal(href.slice(-expected[idx].length), expected[idx], 'Expected link to be \'' + expected[idx] + '\', but was \'' + href + '\'');
    }
  }

  linksEqual(_emberMetalCore2['default'].$('a', '#qunit-fixture'), ['/foo', '/bar', '/rar', '/foo', '/bar', '/rar', '/bar', '/foo']);

  var indexController = container.lookup('controller:index');
  _emberMetalCore2['default'].run(indexController, 'set', 'route1', 'rar');

  linksEqual(_emberMetalCore2['default'].$('a', '#qunit-fixture'), ['/foo', '/bar', '/rar', '/foo', '/bar', '/rar', '/rar', '/foo']);

  _emberMetalCore2['default'].run(indexController.routeNames, 'shiftObject');

  linksEqual(_emberMetalCore2['default'].$('a', '#qunit-fixture'), ['/bar', '/rar', '/bar', '/rar', '/rar', '/foo']);
});

QUnit.test('The non-block form {{link-to}} helper moves into the named route', function () {
  expect(3);
  Router.map(function (match) {
    this.route('contact');
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{link-to \'Contact us\' \'contact\' id=\'contact-link\'}}{{#link-to \'index\' id=\'self-link\'}}Self{{/link-to}}');
  _emberMetalCore2['default'].TEMPLATES.contact = compile('<h3>Contact</h3>{{link-to \'Home\' \'index\' id=\'home-link\'}}{{link-to \'Self\' \'contact\' id=\'self-link\'}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#contact-link', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Contact)', '#qunit-fixture').length, 1, 'The contact template was rendered');
  equal(_emberMetalCore2['default'].$('#self-link.active', '#qunit-fixture').length, 1, 'The self-link was rendered with active class');
  equal(_emberMetalCore2['default'].$('#home-link:not(.active)', '#qunit-fixture').length, 1, 'The other link was rendered without active class');
});

QUnit.test('The non-block form {{link-to}} helper updates the link text when it is a binding', function () {
  expect(8);
  Router.map(function (match) {
    this.route('contact');
  });

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    contactName: 'Jane'
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3>{{link-to contactName \'contact\' id=\'contact-link\'}}{{#link-to \'index\' id=\'self-link\'}}Self{{/link-to}}');
  _emberMetalCore2['default'].TEMPLATES.contact = compile('<h3>Contact</h3>{{link-to \'Home\' \'index\' id=\'home-link\'}}{{link-to \'Self\' \'contact\' id=\'self-link\'}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/');
  });
  var controller = container.lookup('controller:index');

  equal(_emberMetalCore2['default'].$('#contact-link:contains(Jane)', '#qunit-fixture').length, 1, 'The link title is correctly resolved');

  _emberMetalCore2['default'].run(function () {
    controller.set('contactName', 'Joe');
  });
  equal(_emberMetalCore2['default'].$('#contact-link:contains(Joe)', '#qunit-fixture').length, 1, 'The link title is correctly updated when the bound property changes');

  _emberMetalCore2['default'].run(function () {
    controller.set('contactName', 'Robert');
  });
  equal(_emberMetalCore2['default'].$('#contact-link:contains(Robert)', '#qunit-fixture').length, 1, 'The link title is correctly updated when the bound property changes a second time');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#contact-link', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Contact)', '#qunit-fixture').length, 1, 'The contact template was rendered');
  equal(_emberMetalCore2['default'].$('#self-link.active', '#qunit-fixture').length, 1, 'The self-link was rendered with active class');
  equal(_emberMetalCore2['default'].$('#home-link:not(.active)', '#qunit-fixture').length, 1, 'The other link was rendered without active class');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#home-link', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Home)', '#qunit-fixture').length, 1, 'The index template was rendered');
  equal(_emberMetalCore2['default'].$('#contact-link:contains(Robert)', '#qunit-fixture').length, 1, 'The link title is correctly updated when the route changes');
});

QUnit.test('The non-block form {{link-to}} helper moves into the named route with context', function () {
  expect(6);
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  Router.map(function (match) {
    this.route('item', { path: '/item/:id' });
  });

  App.IndexRoute = _emberMetalCore2['default'].Route.extend({
    model: function model() {
      return _emberMetalCore2['default'].A([{ id: 'yehuda', name: 'Yehuda Katz' }, { id: 'tom', name: 'Tom Dale' }, { id: 'erik', name: 'Erik Brynroflsson' }]);
    }
  });

  App.ItemRoute = _emberMetalCore2['default'].Route.extend({
    serialize: function serialize(object) {
      return { id: object.id };
    }
  });

  _emberMetalCore2['default'].TEMPLATES.index = compile('<h3>Home</h3><ul>{{#each controller as |person|}}<li>{{link-to person.name \'item\' person}}</li>{{/each}}</ul>');
  _emberMetalCore2['default'].TEMPLATES.item = compile('<h3>Item</h3><p>{{model.name}}</p>{{#link-to \'index\' id=\'home-link\'}}Home{{/link-to}}');

  bootApplication();

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('li a:contains(Yehuda)', '#qunit-fixture').click();
  });

  equal(_emberMetalCore2['default'].$('h3:contains(Item)', '#qunit-fixture').length, 1, 'The item template was rendered');
  equal(_emberMetalCore2['default'].$('p', '#qunit-fixture').text(), 'Yehuda Katz', 'The name is correct');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#home-link').click();
  });

  equal(normalizeUrl(_emberMetalCore2['default'].$('li a:contains(Yehuda)').attr('href')), '/item/yehuda');
  equal(normalizeUrl(_emberMetalCore2['default'].$('li a:contains(Tom)').attr('href')), '/item/tom');
  equal(normalizeUrl(_emberMetalCore2['default'].$('li a:contains(Erik)').attr('href')), '/item/erik');
});

QUnit.test('The non-block form {{link-to}} performs property lookup', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{link-to \'string\' \'index\' id=\'string-link\'}}{{link-to path foo id=\'path-link\'}}{{link-to view.foo view.foo id=\'view-link\'}}');

  function assertEquality(href) {
    equal(normalizeUrl(_emberMetalCore2['default'].$('#string-link', '#qunit-fixture').attr('href')), '/');
    equal(normalizeUrl(_emberMetalCore2['default'].$('#path-link', '#qunit-fixture').attr('href')), href);
    equal(normalizeUrl(_emberMetalCore2['default'].$('#view-link', '#qunit-fixture').attr('href')), href);
  }

  App.IndexView = _emberViewsViewsView2['default'].extend({
    foo: 'index',
    elementId: 'index-view'
  });

  App.IndexController = _emberMetalCore2['default'].Controller.extend({
    foo: 'index'
  });

  App.Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  assertEquality('/');

  var controller = container.lookup('controller:index');
  var view = _emberViewsViewsView2['default'].views['index-view'];
  _emberMetalCore2['default'].run(function () {
    controller.set('foo', 'about');
    view.set('foo', 'about');
  });

  assertEquality('/about');
});

QUnit.test('The non-block form {{link-to}} protects against XSS', function () {
  _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to display \'index\' id=\'link\'}}');

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
    display: 'blahzorz'
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  var controller = container.lookup('controller:application');

  equal(_emberMetalCore2['default'].$('#link', '#qunit-fixture').text(), 'blahzorz');
  _emberMetalCore2['default'].run(function () {
    controller.set('display', '<b>BLAMMO</b>');
  });

  equal(_emberMetalCore2['default'].$('#link', '#qunit-fixture').text(), '<b>BLAMMO</b>');
  equal(_emberMetalCore2['default'].$('b', '#qunit-fixture').length, 0);
});

QUnit.test('the {{link-to}} helper calls preventDefault', function () {
  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  var event = _emberMetalCore2['default'].$.Event('click');
  _emberMetalCore2['default'].$('#about-link', '#qunit-fixture').trigger(event);

  equal(event.isDefaultPrevented(), true, 'should preventDefault');
});

QUnit.test('the {{link-to}} helper does not call preventDefault if `preventDefault=false` is passed as an option', function () {
  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'about\' id=\'about-link\' preventDefault=false}}About{{/link-to}}');

  Router.map(function () {
    this.route('about');
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  var event = _emberMetalCore2['default'].$.Event('click');
  _emberMetalCore2['default'].$('#about-link', '#qunit-fixture').trigger(event);

  equal(event.isDefaultPrevented(), false, 'should not preventDefault');
});

QUnit.test('the {{link-to}} helper does not throw an error if its route has exited', function () {
  expect(0);

  _emberMetalCore2['default'].TEMPLATES.application = compile('{{#link-to \'index\' id=\'home-link\'}}Home{{/link-to}}{{#link-to \'post\' defaultPost id=\'default-post-link\'}}Default Post{{/link-to}}{{#if currentPost}}{{#link-to \'post\' id=\'post-link\'}}Post{{/link-to}}{{/if}}');

  App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
    needs: ['post'],
    currentPost: _emberMetalCore2['default'].computed.alias('controllers.post.model')
  });

  App.PostController = _emberMetalCore2['default'].Controller.extend({
    model: { id: 1 }
  });

  Router.map(function () {
    this.route('post', { path: 'post/:post_id' });
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/');

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#default-post-link', '#qunit-fixture').click();
  });

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#home-link', '#qunit-fixture').click();
  });
});

QUnit.test('{{link-to}} active property respects changing parent route context', function () {
  _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to \'OMG\' \'things\' \'omg\' id=\'omg-link\'}} ' + '{{link-to \'LOL\' \'things\' \'lol\' id=\'lol-link\'}} ');

  Router.map(function () {
    this.route('things', { path: '/things/:name' }, function () {
      this.route('other');
    });
  });

  bootApplication();

  _emberMetalCore2['default'].run(router, 'handleURL', '/things/omg');
  shouldBeActive('#omg-link');
  shouldNotBeActive('#lol-link');

  _emberMetalCore2['default'].run(router, 'handleURL', '/things/omg/other');
  shouldBeActive('#omg-link');
  shouldNotBeActive('#lol-link');
});

QUnit.test('{{link-to}} populates href with default query param values even without query-params object', function () {
  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });
  } else {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/', 'link has right href');
});

QUnit.test('{{link-to}} populates href with default query param values with empty query-params object', function () {
  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });
  } else {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' (query-params) id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/', 'link has right href');
});

QUnit.test('{{link-to}} populates href with supplied query param values', function () {
  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });
  } else {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' (query-params foo=\'456\') id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/?foo=456', 'link has right href');
});

QUnit.test('{{link-to}} populates href with partially supplied query param values', function () {
  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        },
        bar: {
          defaultValue: 'yes'
        }
      }
    });
  } else {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123',
      bar: 'yes'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' (query-params foo=\'456\') id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/?foo=456', 'link has right href');
});

QUnit.test('{{link-to}} populates href with partially supplied query param values, but omits if value is default value', function () {
  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        }
      }
    });
  } else {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo'],
      foo: '123'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' (query-params foo=\'123\') id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/', 'link has right href');
});

QUnit.test('{{link-to}} populates href with fully supplied query param values', function () {
  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.IndexRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        },
        bar: {
          defaultValue: 'yes'
        }
      }
    });
  } else {
    App.IndexController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo', 'bar'],
      foo: '123',
      bar: 'yes'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.index = compile('{{#link-to \'index\' (query-params foo=\'456\' bar=\'NAW\') id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/?bar=NAW&foo=456', 'link has right href');
});

QUnit.test('{{link-to}} with only query-params and a block updates when route changes', function () {
  Router.map(function () {
    this.route('about');
  });

  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        },
        bar: {
          defaultValue: 'yes'
        }
      }
    });
  } else {
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo', 'bar'],
      foo: '123',
      bar: 'yes'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.application = compile('{{#link-to (query-params foo=\'456\' bar=\'NAW\') id=\'the-link\'}}Index{{/link-to}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/?bar=NAW&foo=456', 'link has right href');

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/about?bar=NAW&foo=456', 'link has right href');
});

QUnit.test('Block-less {{link-to}} with only query-params updates when route changes', function () {
  Router.map(function () {
    this.route('about');
  });

  if ((0, _emberMetalFeatures2['default'])('ember-routing-route-configured-query-params')) {
    App.ApplicationRoute = _emberMetalCore2['default'].Route.extend({
      queryParams: {
        foo: {
          defaultValue: '123'
        },
        bar: {
          defaultValue: 'yes'
        }
      }
    });
  } else {
    App.ApplicationController = _emberMetalCore2['default'].Controller.extend({
      queryParams: ['foo', 'bar'],
      foo: '123',
      bar: 'yes'
    });
  }

  _emberMetalCore2['default'].TEMPLATES.application = compile('{{link-to "Index" (query-params foo=\'456\' bar=\'NAW\') id=\'the-link\'}}');
  bootApplication();
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/?bar=NAW&foo=456', 'link has right href');

  _emberMetalCore2['default'].run(function () {
    router.handleURL('/about');
  });
  equal(_emberMetalCore2['default'].$('#the-link').attr('href'), '/about?bar=NAW&foo=456', 'link has right href');
});