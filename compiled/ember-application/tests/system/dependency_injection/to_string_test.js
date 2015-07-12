'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// lookup, etc

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberApplicationSystemResolver = require('ember-application/system/resolver');

var _emberApplicationSystemResolver2 = _interopRequireDefault(_emberApplicationSystemResolver);

var _emberMetalUtils = require('ember-metal/utils');

var originalLookup, App, originalModelInjections;

QUnit.module('Ember.Application Dependency Injection – toString', {
  setup: function setup() {
    originalModelInjections = _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS;
    _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS = true;

    originalLookup = _emberMetalCore2['default'].lookup;

    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create();
      _emberMetalCore2['default'].lookup = {
        App: App
      };
    });

    App.Post = _emberRuntimeSystemObject2['default'].extend();
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
    (0, _emberMetalRun_loop2['default'])(App, 'destroy');
    _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS = originalModelInjections;
  }
});

QUnit.test('factories', function () {
  var PostFactory = App.__container__.lookupFactory('model:post');
  equal(PostFactory.toString(), 'App.Post', 'expecting the model to be post');
});

QUnit.test('instances', function () {
  var post = App.__container__.lookup('model:post');
  var guid = (0, _emberMetalUtils.guidFor)(post);

  equal(post.toString(), '<App.Post:' + guid + '>', 'expecting the model to be post');
});

QUnit.test('with a custom resolver', function () {
  (0, _emberMetalRun_loop2['default'])(App, 'destroy');

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create({
      Resolver: _emberApplicationSystemResolver2['default'].extend({
        makeToString: function makeToString(factory, fullName) {
          return fullName;
        }
      })
    });
  });

  App.registry.register('model:peter', _emberRuntimeSystemObject2['default'].extend());

  var peter = App.__container__.lookup('model:peter');
  var guid = (0, _emberMetalUtils.guidFor)(peter);

  equal(peter.toString(), '<model:peter:' + guid + '>', 'expecting the supermodel to be peter');
});