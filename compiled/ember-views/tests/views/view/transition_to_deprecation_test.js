'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var view;

QUnit.module('views/view/transition_to_deprecation', {
  setup: function setup() {
    view = _emberViewsViewsView2['default'].create();
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(view, 'destroy');
  }
});

QUnit.test('deprecates when calling transitionTo', function () {
  expect(1);

  view = _emberViewsViewsView2['default'].create();

  expectDeprecation(function () {
    view.transitionTo('preRender');
  }, '');
});

QUnit.test('doesn\'t deprecate when calling _transitionTo', function () {
  expect(1);

  view = _emberViewsViewsView2['default'].create();
  view._transitionTo('preRender');
  ok(true);
});