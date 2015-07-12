'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTestingTest = require('ember-testing/test');

var _emberTestingTest2 = _interopRequireDefault(_emberTestingTest);

var _emberTestingAdaptersAdapter = require('ember-testing/adapters/adapter');

var _emberTestingAdaptersAdapter2 = _interopRequireDefault(_emberTestingAdaptersAdapter);

var _emberTestingAdaptersQunit = require('ember-testing/adapters/qunit');

var _emberTestingAdaptersQunit2 = _interopRequireDefault(_emberTestingAdaptersQunit);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var App, originalAdapter;

QUnit.module('ember-testing Adapters', {
  setup: function setup() {
    originalAdapter = _emberTestingTest2['default'].adapter;
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(App, App.destroy);
    App.removeTestHelpers();
    App = null;

    _emberTestingTest2['default'].adapter = originalAdapter;
  }
});

QUnit.test('Setting a test adapter manually', function () {
  expect(1);
  var CustomAdapter;

  CustomAdapter = _emberTestingAdaptersAdapter2['default'].extend({
    asyncStart: function asyncStart() {
      ok(true, 'Correct adapter was used');
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    _emberTestingTest2['default'].adapter = CustomAdapter.create();
    App.setupForTesting();
  });

  _emberTestingTest2['default'].adapter.asyncStart();
});

QUnit.test('QUnitAdapter is used by default', function () {
  expect(1);

  _emberTestingTest2['default'].adapter = null;

  (0, _emberMetalRun_loop2['default'])(function () {
    App = _emberApplicationSystemApplication2['default'].create();
    App.setupForTesting();
  });

  ok(_emberTestingTest2['default'].adapter instanceof _emberTestingAdaptersQunit2['default']);
});