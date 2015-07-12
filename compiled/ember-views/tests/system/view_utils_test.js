'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var hasGetClientRects, hasGetBoundingClientRect;
var ClientRectListCtor, ClientRectCtor;

(function () {
  if (document.createRange) {
    var range = document.createRange();

    if (range.getClientRects) {
      var clientRectsList = range.getClientRects();
      hasGetClientRects = true;
      ClientRectListCtor = clientRectsList && clientRectsList.constructor;
    }

    if (range.getBoundingClientRect) {
      var clientRect = range.getBoundingClientRect();
      hasGetBoundingClientRect = true;
      ClientRectCtor = clientRect && clientRect.constructor;
    }
  }
})();

var view;

QUnit.module('ViewUtils', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
    });
  }
});

QUnit.test('getViewClientRects', function () {
  if (!hasGetClientRects || !ClientRectListCtor) {
    ok(true, 'The test environment does not support the DOM API required to run this test.');
    return;
  }

  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  ok(_emberMetalCore2['default'].ViewUtils.getViewClientRects(view) instanceof ClientRectListCtor);
});

QUnit.test('getViewBoundingClientRect', function () {
  if (!hasGetBoundingClientRect || !ClientRectCtor) {
    ok(true, 'The test environment does not support the DOM API required to run this test.');
    return;
  }

  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  ok(_emberMetalCore2['default'].ViewUtils.getViewBoundingClientRect(view) instanceof ClientRectCtor);
});