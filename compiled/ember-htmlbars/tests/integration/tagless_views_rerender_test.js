'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view;
var compile = _emberHtmlbarsCompat2['default'].compile;

QUnit.module('ember-htmlbars: tagless views should be able to add/remove child views', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('can insert new child views after initial tagless view rendering', function () {
  view = _emberViewsViewsView2['default'].create({
    shouldShow: false,
    array: _emberMetalCore2['default'].A([1]),

    template: compile('{{#if view.shouldShow}}{{#each view.array as |item|}}{{item}}{{/each}}{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('shouldShow', true);
  });

  equal(view.$().text(), '1');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('array').pushObject(2);
  });

  equal(view.$().text(), '12');
});

QUnit.test('can remove child views after initial tagless view rendering', function () {
  view = _emberViewsViewsView2['default'].create({
    shouldShow: false,
    array: _emberMetalCore2['default'].A([]),

    template: compile('{{#if view.shouldShow}}{{#each view.array as |item|}}{{item}}{{/each}}{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('shouldShow', true);
    view.get('array').pushObject(1);
  });

  equal(view.$().text(), '1');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('array').removeObject(1);
  });

  equal(view.$().text(), '');
});