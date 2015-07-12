'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var App;

QUnit.module('Simple Testing Setup', {
  teardown: function teardown() {
    if (App) {
      App.removeTestHelpers();
      (0, _emberViewsSystemJquery2['default'])('#ember-testing-container, #ember-testing').remove();
      (0, _emberMetalRun_loop2['default'])(App, 'destroy');
      App = null;
    }
  }
});