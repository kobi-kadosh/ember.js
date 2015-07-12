'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var EmberApplication = _emberApplicationSystemApplication2['default'];

var originalLookup = _emberMetalCore2['default'].lookup;
var registry, locator, lookup, application, originalModelInjections;

QUnit.module('Ember.Application Dependency Injection', {
  setup: function setup() {
    originalModelInjections = _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS;
    _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS = true;

    application = (0, _emberMetalRun_loop2['default'])(EmberApplication, 'create');

    application.Person = _emberRuntimeSystemObject2['default'].extend({});
    application.Orange = _emberRuntimeSystemObject2['default'].extend({});
    application.Email = _emberRuntimeSystemObject2['default'].extend({});
    application.User = _emberRuntimeSystemObject2['default'].extend({});
    application.PostIndexController = _emberRuntimeSystemObject2['default'].extend({});

    application.register('model:person', application.Person, { singleton: false });
    application.register('model:user', application.User, { singleton: false });
    application.register('fruit:favorite', application.Orange);
    application.register('communication:main', application.Email, { singleton: false });
    application.register('controller:postIndex', application.PostIndexController, { singleton: true });

    registry = application.registry;
    locator = application.__container__;

    lookup = _emberMetalCore2['default'].lookup = {};
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(application, 'destroy');
    application = locator = null;
    _emberMetalCore2['default'].lookup = originalLookup;
    _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS = originalModelInjections;
  }
});

QUnit.test('container lookup is normalized', function () {
  var dotNotationController = locator.lookup('controller:post.index');
  var camelCaseController = locator.lookup('controller:postIndex');

  ok(dotNotationController instanceof application.PostIndexController);
  ok(camelCaseController instanceof application.PostIndexController);

  equal(dotNotationController, camelCaseController);
});

QUnit.test('registered entities can be looked up later', function () {
  equal(registry.resolve('model:person'), application.Person);
  equal(registry.resolve('model:user'), application.User);
  equal(registry.resolve('fruit:favorite'), application.Orange);
  equal(registry.resolve('communication:main'), application.Email);
  equal(registry.resolve('controller:postIndex'), application.PostIndexController);

  equal(locator.lookup('fruit:favorite'), locator.lookup('fruit:favorite'), 'singleton lookup worked');
  ok(locator.lookup('model:user') !== locator.lookup('model:user'), 'non-singleton lookup worked');
});

QUnit.test('injections', function () {
  application.inject('model', 'fruit', 'fruit:favorite');
  application.inject('model:user', 'communication', 'communication:main');

  var user = locator.lookup('model:user');
  var person = locator.lookup('model:person');
  var fruit = locator.lookup('fruit:favorite');

  equal(user.get('fruit'), fruit);
  equal(person.get('fruit'), fruit);

  ok(application.Email.detectInstance(user.get('communication')));
});