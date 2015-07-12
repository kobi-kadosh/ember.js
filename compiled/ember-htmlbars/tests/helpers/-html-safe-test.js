/* globals EmberDev */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var component, registry, container, warnings, originalWarn;

QUnit.module('ember-htmlbars: {{-html-safe}} helper', {
  setup: function setup() {
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('helper', { instantiate: false });

    warnings = [];
    originalWarn = _emberMetalCore2['default'].warn;
    _emberMetalCore2['default'].warn = function (message, test) {
      if (!test) {
        warnings.push(message);
      }
    };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
    _emberMetalCore2['default'].warn = originalWarn;
  }
});

QUnit.test('adds the attribute to the element', function () {
  component = _emberViewsViewsComponent2['default'].create({
    container: container,

    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<div style={{-html-safe "display: none;"}}></div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$('div').css('display'), 'none', 'attribute was set');
});

if (!EmberDev.runningProdBuild) {

  QUnit.test('no warnings are triggered from setting style attribute', function () {
    component = _emberViewsViewsComponent2['default'].create({
      container: container,

      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<div style={{-html-safe "display: none;"}}></div>')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(component);

    deepEqual(warnings, [], 'no warnings were triggered');
  });
}