'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

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

  QUnit.module('ember-htmlbars: svg attribute', {
    teardown: function teardown() {
      if (view) {
        (0, _emberMetalRun_loop2['default'])(view, view.destroy);
      }
    }
  });

  QUnit.test('unquoted viewBox property is output', function () {
    var viewBoxString = '0 0 100 100';
    view = _emberViewsViewsView2['default'].create({
      context: { viewBoxString: viewBoxString },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<svg viewBox={{viewBoxString}}></svg>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<svg viewBox="' + viewBoxString + '"></svg>', 'attribute is output');

    _emberMetalCore2['default'].run(view, view.set, 'context.viewBoxString', null);
    equal(view.element.getAttribute('svg'), null, 'attribute is removed');
  });

  QUnit.test('quoted viewBox property is output', function () {
    var viewBoxString = '0 0 100 100';
    view = _emberViewsViewsView2['default'].create({
      context: { viewBoxString: viewBoxString },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<svg viewBox=\'{{viewBoxString}}\'></svg>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<svg viewBox="' + viewBoxString + '"></svg>', 'attribute is output');
  });

  QUnit.test('quoted viewBox property is concat', function () {
    var viewBoxString = '100 100';
    view = _emberViewsViewsView2['default'].create({
      context: { viewBoxString: viewBoxString },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<svg viewBox=\'0 0 {{viewBoxString}}\'></svg>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<svg viewBox="0 0 ' + viewBoxString + '"></svg>', 'attribute is output');

    var newViewBoxString = '200 200';
    _emberMetalCore2['default'].run(view, view.set, 'context.viewBoxString', newViewBoxString);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<svg viewBox="0 0 ' + newViewBoxString + '"></svg>', 'attribute is output');
  });

  QUnit.test('class is output', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { color: 'blue' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<svg class=\'{{color}} tall\'></svg>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<svg class="blue tall"></svg>', 'attribute is output');

    _emberMetalCore2['default'].run(view, view.set, 'context.color', 'red');

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<svg class="red tall"></svg>', 'attribute is output');
  });
}
// jscs:enable validateIndentation