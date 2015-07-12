'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberHtmlbarsSystemRenderEnv = require('ember-htmlbars/system/render-env');

var _emberHtmlbarsSystemRenderEnv2 = _interopRequireDefault(_emberHtmlbarsSystemRenderEnv);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var registry, container, view, components;

function commonSetup() {
  registry = new _containerRegistry2['default']();
  container = registry.container();
  registry.optionsForType('component', { singleton: false });
  registry.optionsForType('view', { singleton: false });
  registry.optionsForType('template', { instantiate: false });
  registry.optionsForType('helper', { instantiate: false });
  registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
}

function commonTeardown() {
  (0, _emberRuntimeTestsUtils.runDestroy)(container);
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  registry = container = view = null;
}

function appendViewFor(template) {
  var hash = arguments[1] === undefined ? {} : arguments[1];

  var view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    container: container
  }).create(hash);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  return view;
}

function constructComponent(label) {
  return _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this.label = label;
      components[label] = this;
      this._super.apply(this, arguments);
    }
  });
}

function extractEnv(component) {
  return component._renderNode.lastResult.env;
}

QUnit.module('ember-htmlbars: RenderEnv', {
  setup: function setup() {
    commonSetup();
  },

  teardown: function teardown() {
    commonTeardown();
  }
});

QUnit.test('non-block component test', function () {
  components = {};

  registry.register('component:non-block', constructComponent('nonblock'));
  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout'));

  view = appendViewFor('{{non-block}}');

  ok(view.env instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: View environment should be an instance of RenderEnv');
  ok(extractEnv(components.nonblock) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: {{#non-block}} environment should be an instance of RenderEnv');

  (0, _emberMetalRun_loop2['default'])(components.nonblock, 'rerender');

  ok(view.env instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: View environment should be an instance of RenderEnv');
  ok(extractEnv(components.nonblock) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: {{#non-block}} environment should be an instance of RenderEnv');
});

QUnit.test('block component test', function () {
  components = {};

  registry.register('component:block-component', constructComponent('block'));
  registry.register('template:components/block-component', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout {{yield}}'));

  view = appendViewFor('{{#block-component}}content{{/block-component}}');

  ok(view.env instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: View environment should be an instance of RenderEnv');
  ok(extractEnv(components.block) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: {{#block-component}} environment should be an instance of RenderEnv');

  (0, _emberMetalRun_loop2['default'])(components.block, 'rerender');

  ok(view.env instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: View environment should be an instance of RenderEnv');
  ok(extractEnv(components.block) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: {{#block-component}} environment should be an instance of RenderEnv');
});

QUnit.test('block component with child component test', function () {
  components = {};

  registry.register('component:block-component', constructComponent('block'));
  registry.register('component:child-component', constructComponent('child'));

  registry.register('template:components/block-component', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout {{yield}}'));
  registry.register('template:components/child-component', (0, _emberTemplateCompilerSystemCompile2['default'])('Child Component'));

  view = appendViewFor('{{#block-component}}{{child-component}}{{/block-component}}');

  ok(view.env instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: View environment should be an instance of RenderEnv');
  ok(extractEnv(components.block) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: {{#block-component}} environment should be an instance of RenderEnv');
  ok(extractEnv(components.child) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'initial render: {{child-component}} environment should be an instance of RenderEnv');

  (0, _emberMetalRun_loop2['default'])(components.block, 'rerender');

  ok(view.env instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: View environment should be an instance of RenderEnv');
  ok(extractEnv(components.block) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: {{#block-component}} environment should be an instance of RenderEnv');
  ok(extractEnv(components.child) instanceof _emberHtmlbarsSystemRenderEnv2['default'], 'rerender: {{child-component}} environment should be an instance of RenderEnv');
});