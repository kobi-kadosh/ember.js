'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

var parentView, childView;

QUnit.module('tests/views/view/child_views_tests.js', {
  setup: function setup() {
    childView = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('ber')
    });

    parentView = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Em{{view view.childView}}'),
      childView: childView
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      parentView.destroy();
      childView.destroy();
    });
  }
});

// no parent element, buffer, no element
// parent element

// no parent element, no buffer, no element
QUnit.test('should render an inserted child view when the child is inserted before a DOM element is created', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.append();
  });

  equal(parentView.$().text(), 'Ember', 'renders the child view after the parent view');
});

QUnit.test('should not duplicate childViews when rerendering', function () {

  var InnerView = _emberViewsViewsView2['default'].extend();
  var InnerView2 = _emberViewsViewsView2['default'].extend();

  var MiddleView = _emberViewsViewsView2['default'].extend({
    innerViewClass: InnerView,
    innerView2Class: InnerView2,
    template: (0, _emberTemplateCompiler.compile)('{{view view.innerViewClass}}{{view view.innerView2Class}}')
  });

  var outerView = _emberViewsViewsView2['default'].create({
    middleViewClass: MiddleView,
    template: (0, _emberTemplateCompiler.compile)('{{view view.middleViewClass viewName="middle"}}')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    outerView.append();
  });

  equal(outerView.get('middle.childViews.length'), 2, 'precond middle has 2 child views rendered to buffer');

  (0, _emberMetalRun_loop2['default'])(function () {
    outerView.middle.rerender();
  });

  equal(outerView.get('middle.childViews.length'), 2, 'middle has 2 child views rendered to buffer');

  (0, _emberMetalRun_loop2['default'])(function () {
    outerView.destroy();
  });
});