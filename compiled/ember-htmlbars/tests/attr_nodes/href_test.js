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

  QUnit.module('ember-htmlbars: href attribute', {
    teardown: function teardown() {
      if (view) {
        (0, _emberMetalRun_loop2['default'])(view, view.destroy);
      }
    }
  });

  QUnit.test('href is set', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { url: 'http://example.com' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href={{url}}></a>')
    });
    appendView(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<a href="http://example.com"></a>', 'attribute is output');
  });
}
// jscs:enable validateIndentation