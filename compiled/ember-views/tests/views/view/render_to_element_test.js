'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var View, view;

QUnit.module('EmberView - renderToElement()', {
  setup: function setup() {
    View = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>hello world</h1> goodbye world')
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (!view.isDestroyed) {
        view.destroy();
      }
    });
  }
});

QUnit.test('should render into and return a body element', function () {
  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  var element;

  (0, _emberMetalRun_loop2['default'])(function () {
    element = view.renderToElement();
  });

  equal(element.tagName, 'BODY', 'returns a body element');
  equal(element.firstChild.tagName, 'DIV', 'renders the view div');
  equal(element.firstChild.firstChild.tagName, 'H1', 'renders the view div');
  equal(element.firstChild.firstChild.nextSibling.nodeValue, ' goodbye world', 'renders the text node');
});

QUnit.test('should create and render into an element with a provided tagName', function () {
  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  var element;

  (0, _emberMetalRun_loop2['default'])(function () {
    element = view.renderToElement('div');
  });

  equal(element.tagName, 'DIV', 'returns a body element');
  equal(element.firstChild.tagName, 'DIV', 'renders the view div');
  equal(element.firstChild.firstChild.tagName, 'H1', 'renders the view div');
  equal(element.firstChild.firstChild.nextSibling.nodeValue, ' goodbye world', 'renders the text node');
});