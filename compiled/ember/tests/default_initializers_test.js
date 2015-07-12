'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberViewsViewsText_field = require('ember-views/views/text_field');

var _emberViewsViewsText_field2 = _interopRequireDefault(_emberViewsViewsText_field);

var _emberViewsViewsCheckbox = require('ember-views/views/checkbox');

var _emberViewsViewsCheckbox2 = _interopRequireDefault(_emberViewsViewsCheckbox);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var App;

QUnit.module('Default Registry', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create({
        rootElement: '#qunit-fixture'
      });

      App.deferReadiness();
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(App, 'destroy');
  }
});

QUnit.test('Default objects are registered', function (assert) {
  App.instanceInitializer({
    name: 'test',
    initialize: function initialize(instance) {
      var registry = instance.registry;

      assert.strictEqual(registry.resolve('component:-text-field'), _emberViewsViewsText_field2['default'], 'TextField was registered');
      assert.strictEqual(registry.resolve('component:-checkbox'), _emberViewsViewsCheckbox2['default'], 'Checkbox was registered');
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    App.advanceReadiness();
  });
});