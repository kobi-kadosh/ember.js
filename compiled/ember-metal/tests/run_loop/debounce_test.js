'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var originalDebounce = _emberMetalRun_loop2['default'].backburner.debounce;
var wasCalled = false;
QUnit.module('Ember.run.debounce', {
  setup: function setup() {
    _emberMetalRun_loop2['default'].backburner.debounce = function () {
      wasCalled = true;
    };
  },
  teardown: function teardown() {
    _emberMetalRun_loop2['default'].backburner.debounce = originalDebounce;
  }
});

QUnit.test('Ember.run.debounce uses Backburner.debounce', function () {
  _emberMetalRun_loop2['default'].debounce(function () {});
  ok(wasCalled, 'Ember.run.debounce used');
});