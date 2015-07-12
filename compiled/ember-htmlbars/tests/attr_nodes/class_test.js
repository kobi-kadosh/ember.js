'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _htmlbarsTestHelpers = require('htmlbars-test-helpers');

var view;

function appendView(view) {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });
}

var isInlineIfEnabled = false;
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-inline-if-helper')) {
  isInlineIfEnabled = true;
}

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  QUnit.module('ember-htmlbars: class attribute', {
    teardown: function teardown() {
      if (view) {
        (0, _emberMetalRun_loop2['default'])(view, view.destroy);
      }
    }
  });

  QUnit.test('class renders before didInsertElement', function () {
    var matchingElement;
    view = _emberViewsViewsView2['default'].create({
      didInsertElement: function didInsertElement() {
        matchingElement = this.$('div.blue');
      },
      context: { color: 'blue' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class={{color}}>Hi!</div>')
    });
    appendView(view);

    equal(view.element.firstChild.className, 'blue', 'attribute is output');
    equal(matchingElement.length, 1, 'element is in the DOM when didInsertElement');
  });

  QUnit.test('class property can contain multiple classes', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { classes: 'large blue' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class={{classes}}></div>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div class="large blue"></div>', 'attribute is output');
    ok(view.$('.large')[0], 'first class found');
    ok(view.$('.blue')[0], 'second class found');
  });

  QUnit.test('class property is removed when updated with a null value', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { 'class': 'large' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class={{class}}></div>')
    });
    appendView(view);

    equal(view.element.firstChild.className, 'large', 'attribute is output');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.class', null);

    equal(view.element.firstChild.className, '', 'attribute is removed');
  });

  QUnit.test('class attribute concats bound values', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { size: 'large', color: 'blue' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class=\'{{size}} {{color}} round\'></div>')
    });
    appendView(view);

    strictEqual(view.element.firstChild.className, 'large blue round', 'classes are set');
  });

  if (isInlineIfEnabled) {

    QUnit.test('class attribute accepts nested helpers, and updates', function () {
      view = _emberViewsViewsView2['default'].create({
        context: {
          size: 'large',
          hasColor: true,
          hasShape: false,
          shape: 'round'
        },
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class=\'{{if true size}} {{if hasColor \'blue\'}} {{if hasShape shape \'no-shape\'}}\'></div>')
      });
      appendView(view);

      strictEqual(view.element.firstChild.className, 'large blue no-shape', 'classes are set');

      (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.hasColor', false);
      (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.hasShape', true);

      strictEqual(view.element.firstChild.className, 'large  round', 'classes are updated');
    });
  }

  QUnit.test('class attribute can accept multiple classes from a single value, and update', function () {
    view = _emberViewsViewsView2['default'].create({
      context: {
        size: 'large small'
      },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class=\'{{size}}\'></div>')
    });
    appendView(view);

    strictEqual(view.element.firstChild.className, 'large small', 'classes are set');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.size', 'medium');

    strictEqual(view.element.firstChild.className, 'medium', 'classes are updated');
  });

  QUnit.test('class attribute can grok concatted classes, and update', function () {
    view = _emberViewsViewsView2['default'].create({
      context: {
        size: 'large',
        prefix: 'pre-pre pre',
        postfix: 'post'
      },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class=\'btn-{{size}} {{prefix}}-{{postfix}}    whoop\'></div>')
    });
    appendView(view);

    strictEqual(view.element.firstChild.className, 'btn-large pre-pre pre-post    whoop', 'classes are set');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.prefix', '');

    strictEqual(view.element.firstChild.className, 'btn-large -post    whoop', 'classes are updated');
  });

  QUnit.test('class attribute stays in order', function () {
    view = _emberViewsViewsView2['default'].create({
      context: {
        showA: 'a',
        showB: 'b'
      },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class=\'r {{showB}} {{showA}} c\'></div>')
    });
    appendView(view);

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.showB', false);
    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.showB', 'b');

    strictEqual(view.element.firstChild.className, 'r b a c', 'classes are in the right order');
  });
}
// jscs:enable validateIndentation