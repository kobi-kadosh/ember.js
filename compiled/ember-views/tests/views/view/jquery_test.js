'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;
QUnit.module('EmberView#$', {
  setup: function setup() {
    view = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<span></span>')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('returns undefined if no element', function () {
  var view = _emberViewsViewsView2['default'].create();
  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should have no element');
  equal(view.$(), undefined, 'should return undefined');
  equal(view.$('span'), undefined, 'should undefined if filter passed');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('returns jQuery object selecting element if provided', function () {
  ok((0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should have element');

  var jquery = view.$();
  equal(jquery.length, 1, 'view.$() should have one element');
  equal(jquery[0], (0, _emberMetalProperty_get.get)(view, 'element'), 'element should be element');
});

QUnit.test('returns jQuery object selecting element inside element if provided', function () {
  ok((0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should have element');

  var jquery = view.$('span');
  equal(jquery.length, 1, 'view.$() should have one element');
  equal(jquery[0].parentNode, (0, _emberMetalProperty_get.get)(view, 'element'), 'element should be in element');
});

QUnit.test('returns empty jQuery object if filter passed that does not match item in parent', function () {
  ok((0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should have element');

  var jquery = view.$('body'); // would normally work if not scoped to view
  equal(jquery.length, 0, 'view.$(body) should have no elements');
});

QUnit.test('asserts for tagless views', function () {
  var view = _emberViewsViewsView2['default'].create({
    tagName: ''
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  expectAssertion(function () {
    view.$();
  }, /You cannot access this.\$\(\) on a component with `tagName: \'\'` specified/);

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});