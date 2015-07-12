'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view, registry, container;

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-component-generation')) {
  QUnit.module('ember-htmlbars: component hook', {
    setup: function setup() {
      registry = new _containerRegistry2['default']();
      container = registry.container();

      registry.optionsForType('template', { instantiate: false });
      registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
    },

    teardown: function teardown() {
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
      (0, _emberRuntimeTestsUtils.runDestroy)(container);
      registry = container = view = null;
    }
  });

  QUnit.test('component is looked up from the container', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie!'));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<foo-bar />')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'yippie!', 'component was looked up and rendered');
  });

  QUnit.test('asserts if component is not found', function () {
    view = _emberViewsViewsView2['default'].create({
      container: container,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<foo-bar />')
    });

    expectAssertion(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, /Could not find component named "foo-bar" \(no component or template with that name was found\)/);
  });
}