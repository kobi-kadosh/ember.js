'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view, parentView;

QUnit.module('ember-views: View#render hook', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(parentView);
  }
});

QUnit.test('the render hook replaces a view if present', function (assert) {
  var count = 0;
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('bob'),
    render: function render() {
      count++;
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.equal(count, 1, 'render called');
  assert.equal(view.$().html(), '<!---->', 'template not rendered');
});

QUnit.test('the render hook can push HTML into the buffer once', function (assert) {
  view = _emberViewsViewsView2['default'].create({
    render: function render(buffer) {
      buffer.push('<span>Nancy</span>');
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.equal(view.$().html(), '<span>Nancy</span>', 'buffer made DOM');
});

QUnit.test('the render hook can push HTML into the buffer on nested view', function (assert) {
  view = _emberViewsViewsView2['default'].create({
    render: function render(buffer) {
      buffer.push('<span>Nancy</span>');
    }
  });
  parentView = _emberViewsViewsView2['default'].create({
    childView: view,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.childView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(parentView);

  assert.equal(view.$().html(), '<span>Nancy</span>', 'buffer made DOM');
});

QUnit.test('the render hook can push arbitrary HTML into the buffer', function (assert) {
  view = _emberViewsViewsView2['default'].create({
    render: function render(buffer) {
      buffer.push('<span>');
      buffer.push('Nancy</span>');
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.equal(view.$().html(), '<span>Nancy</span>', 'buffer made DOM');
});

QUnit.test('the render hook can push HTML into the buffer on tagless view', function (assert) {
  view = _emberViewsViewsView2['default'].create({
    tagName: '',
    render: function render(buffer) {
      buffer.push('<span>Nancy</span>');
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.equal(_emberMetalCore2['default'].$('#qunit-fixture').html(), '<span>Nancy</span>', 'buffer made DOM');
});

QUnit.test('the render hook can push HTML into the buffer on nested tagless view', function (assert) {
  view = _emberViewsViewsView2['default'].create({
    tagName: '',
    render: function render(buffer) {
      buffer.push('<span>Nancy</span>');
    }
  });
  parentView = _emberViewsViewsView2['default'].create({
    childView: view,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.childView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(parentView);

  assert.equal(parentView.$().html(), '<span>Nancy</span>', 'buffer made DOM');
});