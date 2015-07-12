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

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  QUnit.module('ember-htmlbars: boolean attribute', {
    teardown: function teardown() {
      if (view) {
        (0, _emberMetalRun_loop2['default'])(view, view.destroy);
      }
    }
  });

  QUnit.test('disabled property can be set true', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { isDisabled: true },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input disabled={{isDisabled}}>')
    });
    appendView(view);

    equal(view.element.firstChild.hasAttribute('disabled'), true, 'attribute is output');
    equal(view.element.firstChild.disabled, true, 'boolean property is set true');
  });

  QUnit.test('disabled property can be set false with a blank string', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { isDisabled: '' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input disabled={{isDisabled}}>')
    });
    appendView(view);

    equal(view.element.firstChild.hasAttribute('disabled'), false, 'attribute is not output');
    equal(view.element.firstChild.disabled, false, 'boolean property is set false');
  });

  QUnit.test('disabled property can be set false', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { isDisabled: false },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input disabled={{isDisabled}}>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<input>', 'attribute is not output');
    equal(view.element.firstChild.disabled, false, 'boolean property is set false');
  });

  QUnit.test('disabled property can be set true with a string', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { isDisabled: 'oh, no a string' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input disabled={{isDisabled}}>')
    });
    appendView(view);

    equal(view.element.firstChild.hasAttribute('disabled'), true, 'attribute is output');
    equal(view.element.firstChild.disabled, true, 'boolean property is set true');
  });

  QUnit.test('disabled attribute turns a value to a string', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { isDisabled: false },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input disabled=\'{{isDisabled}}\'>')
    });
    appendView(view);

    equal(view.element.firstChild.hasAttribute('disabled'), true, 'attribute is output');
    equal(view.element.firstChild.disabled, true, 'boolean property is set true');
  });

  QUnit.test('disabled attribute preserves a blank string value', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { isDisabled: '' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input disabled=\'{{isDisabled}}\'>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<input>', 'attribute is not output');
    equal(view.element.firstChild.disabled, false, 'boolean property is set false');
  });
}
// jscs:enable validateIndentation