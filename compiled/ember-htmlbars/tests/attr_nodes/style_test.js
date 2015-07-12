/* globals EmberDev */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsUtilsString = require('ember-htmlbars/utils/string');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsMorphsAttrMorph = require('ember-htmlbars/morphs/attr-morph');

var view, originalWarn, warnings;

QUnit.module('ember-htmlbars: style attribute', {
  setup: function setup() {
    warnings = [];
    originalWarn = _emberMetalCore2['default'].warn;
    _emberMetalCore2['default'].warn = function (message, test) {
      if (!test) {
        warnings.push(message);
      }
    };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].warn = originalWarn;
  }
});

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  if (!EmberDev.runningProdBuild) {
    QUnit.test('specifying `<div style={{userValue}}></div>` generates a warning', function () {
      view = _emberViewsViewsView2['default'].create({
        userValue: 'width: 42px',
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div style={{view.userValue}}></div>')
      });

      (0, _emberRuntimeTestsUtils.runAppend)(view);

      deepEqual(warnings, [_emberHtmlbarsMorphsAttrMorph.styleWarning]);
    });

    QUnit.test('specifying `attributeBindings: ["style"]` generates a warning', function () {
      view = _emberViewsViewsView2['default'].create({
        userValue: 'width: 42px',
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div style={{view.userValue}}></div>')
      });

      (0, _emberRuntimeTestsUtils.runAppend)(view);

      deepEqual(warnings, [_emberHtmlbarsMorphsAttrMorph.styleWarning]);
    });
  }

  QUnit.test('specifying `<div style={{{userValue}}}></div>` works properly without a warning', function () {
    view = _emberViewsViewsView2['default'].create({
      userValue: 'width: 42px',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div style={{{view.userValue}}}></div>')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    deepEqual(warnings, []);
  });

  QUnit.test('specifying `<div style={{userValue}}></div>` works properly with a SafeString', function () {
    view = _emberViewsViewsView2['default'].create({
      userValue: new _emberHtmlbarsUtilsString.SafeString('width: 42px'),
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div style={{view.userValue}}></div>')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    deepEqual(warnings, []);
  });
}
// jscs:enable validateIndentation