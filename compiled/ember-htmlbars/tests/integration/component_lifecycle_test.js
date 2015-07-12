'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var registry, container, view;
var hooks;

QUnit.module('component - lifecycle hooks', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);

    hooks = [];
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;
  }
});

function pushHook(view, type, arg) {
  hooks.push(hook(view, type, arg));
}

function hook(view, type, arg) {
  return { type: type, view: view, arg: arg };
}

QUnit.test('lifecycle hooks are invoked in a predictable order', function () {
  var components = {};

  function component(label) {
    return _emberViewsViewsComponent2['default'].extend({
      init: function init() {
        this.label = label;
        components[label] = this;
        this._super.apply(this, arguments);
      },

      didInitAttrs: function didInitAttrs(options) {
        pushHook(label, 'didInitAttrs', options);
      },

      didUpdateAttrs: function didUpdateAttrs(options) {
        pushHook(label, 'didUpdateAttrs', options);
      },

      willUpdate: function willUpdate(options) {
        pushHook(label, 'willUpdate', options);
      },

      didReceiveAttrs: function didReceiveAttrs(options) {
        pushHook(label, 'didReceiveAttrs', options);
      },

      willRender: function willRender() {
        pushHook(label, 'willRender');
      },

      didRender: function didRender() {
        pushHook(label, 'didRender');
      },

      didInsertElement: function didInsertElement() {
        pushHook(label, 'didInsertElement');
      },

      didUpdate: function didUpdate(options) {
        pushHook(label, 'didUpdate', options);
      }
    });
  }

  registry.register('component:the-top', component('top'));
  registry.register('component:the-middle', component('middle'));
  registry.register('component:the-bottom', component('bottom'));

  registry.register('template:components/the-top', (0, _emberTemplateCompilerSystemCompile2['default'])('Twitter: {{attrs.twitter}} {{the-middle name="Tom Dale"}}'));
  registry.register('template:components/the-middle', (0, _emberTemplateCompilerSystemCompile2['default'])('Name: {{attrs.name}} {{the-bottom website="tomdale.net"}}'));
  registry.register('template:components/the-bottom', (0, _emberTemplateCompilerSystemCompile2['default'])('Website: {{attrs.website}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{the-top twitter=(readonly view.twitter)}}'),
    twitter: '@tomdale',
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(component, 'The component was inserted');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Twitter: @tomdale Name: Tom Dale Website: tomdale.net');

  var topAttrs = { twitter: '@tomdale' };
  var middleAttrs = { name: 'Tom Dale' };
  var bottomAttrs = { website: 'tomdale.net' };

  deepEqual(hooks, [hook('top', 'didInitAttrs', { attrs: topAttrs }), hook('top', 'didReceiveAttrs', { newAttrs: topAttrs }), hook('top', 'willRender'), hook('middle', 'didInitAttrs', { attrs: middleAttrs }), hook('middle', 'didReceiveAttrs', { newAttrs: middleAttrs }), hook('middle', 'willRender'), hook('bottom', 'didInitAttrs', { attrs: bottomAttrs }), hook('bottom', 'didReceiveAttrs', { newAttrs: bottomAttrs }), hook('bottom', 'willRender'), hook('bottom', 'didInsertElement'), hook('bottom', 'didRender'), hook('middle', 'didInsertElement'), hook('middle', 'didRender'), hook('top', 'didInsertElement'), hook('top', 'didRender')]);

  hooks = [];

  (0, _emberMetalRun_loop2['default'])(function () {
    components.bottom.rerender();
  });

  deepEqual(hooks, [hook('bottom', 'willUpdate'), hook('bottom', 'willRender'), hook('bottom', 'didUpdate'), hook('bottom', 'didRender')]);

  hooks = [];

  (0, _emberMetalRun_loop2['default'])(function () {
    components.middle.rerender();
  });

  bottomAttrs = { oldAttrs: { website: 'tomdale.net' }, newAttrs: { website: 'tomdale.net' } };

  deepEqual(hooks, [hook('middle', 'willUpdate'), hook('middle', 'willRender'), hook('bottom', 'didUpdateAttrs', bottomAttrs), hook('bottom', 'didReceiveAttrs', bottomAttrs), hook('bottom', 'willUpdate'), hook('bottom', 'willRender'), hook('bottom', 'didUpdate'), hook('bottom', 'didRender'), hook('middle', 'didUpdate'), hook('middle', 'didRender')]);

  hooks = [];

  (0, _emberMetalRun_loop2['default'])(function () {
    components.top.rerender();
  });

  middleAttrs = { oldAttrs: { name: 'Tom Dale' }, newAttrs: { name: 'Tom Dale' } };

  deepEqual(hooks, [hook('top', 'willUpdate'), hook('top', 'willRender'), hook('middle', 'didUpdateAttrs', middleAttrs), hook('middle', 'didReceiveAttrs', middleAttrs), hook('middle', 'willUpdate'), hook('middle', 'willRender'), hook('bottom', 'didUpdateAttrs', bottomAttrs), hook('bottom', 'didReceiveAttrs', bottomAttrs), hook('bottom', 'willUpdate'), hook('bottom', 'willRender'), hook('bottom', 'didUpdate'), hook('bottom', 'didRender'), hook('middle', 'didUpdate'), hook('middle', 'didRender'), hook('top', 'didUpdate'), hook('top', 'didRender')]);

  hooks = [];

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('twitter', '@hipstertomdale');
  });

  // Because the `twitter` attr is only used by the topmost component,
  // and not passed down, we do not expect to see lifecycle hooks
  // called for child components. If the `didReceiveAttrs` hook used
  // the new attribute to rerender itself imperatively, that would result
  // in lifecycle hooks being invoked for the child.

  deepEqual(hooks, [hook('top', 'didUpdateAttrs', { oldAttrs: { twitter: '@tomdale' }, newAttrs: { twitter: '@hipstertomdale' } }), hook('top', 'didReceiveAttrs', { oldAttrs: { twitter: '@tomdale' }, newAttrs: { twitter: '@hipstertomdale' } }), hook('top', 'willUpdate'), hook('top', 'willRender'), hook('top', 'didUpdate'), hook('top', 'didRender')]);
});

QUnit.test('passing values through attrs causes lifecycle hooks to fire if the attribute values have changed', function () {
  var components = {};

  function component(label) {
    return _emberViewsViewsComponent2['default'].extend({
      init: function init() {
        this.label = label;
        components[label] = this;
        this._super.apply(this, arguments);
      },

      didInitAttrs: function didInitAttrs(options) {
        pushHook(label, 'didInitAttrs', options);
      },

      didUpdateAttrs: function didUpdateAttrs(options) {
        pushHook(label, 'didUpdateAttrs', options);
      },

      willUpdate: function willUpdate(options) {
        pushHook(label, 'willUpdate', options);
      },

      didReceiveAttrs: function didReceiveAttrs(options) {
        pushHook(label, 'didReceiveAttrs', options);
      },

      willRender: function willRender() {
        pushHook(label, 'willRender');
      },

      didRender: function didRender() {
        pushHook(label, 'didRender');
      },

      didInsertElement: function didInsertElement() {
        pushHook(label, 'didInsertElement');
      },

      didUpdate: function didUpdate(options) {
        pushHook(label, 'didUpdate', options);
      }
    });
  }

  registry.register('component:the-top', component('top'));
  registry.register('component:the-middle', component('middle'));
  registry.register('component:the-bottom', component('bottom'));

  registry.register('template:components/the-top', (0, _emberTemplateCompilerSystemCompile2['default'])('Top: {{the-middle twitterTop=(readonly attrs.twitter)}}'));
  registry.register('template:components/the-middle', (0, _emberTemplateCompilerSystemCompile2['default'])('Middle: {{the-bottom twitterMiddle=(readonly attrs.twitterTop)}}'));
  registry.register('template:components/the-bottom', (0, _emberTemplateCompilerSystemCompile2['default'])('Bottom: {{attrs.twitterMiddle}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{the-top twitter=(readonly view.twitter)}}'),
    twitter: '@tomdale',
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(component, 'The component was inserted');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Top: Middle: Bottom: @tomdale');

  var topAttrs = { twitter: '@tomdale' };
  var middleAttrs = { twitterTop: '@tomdale' };
  var bottomAttrs = { twitterMiddle: '@tomdale' };

  deepEqual(hooks, [hook('top', 'didInitAttrs', { attrs: topAttrs }), hook('top', 'didReceiveAttrs', { newAttrs: topAttrs }), hook('top', 'willRender'), hook('middle', 'didInitAttrs', { attrs: middleAttrs }), hook('middle', 'didReceiveAttrs', { newAttrs: middleAttrs }), hook('middle', 'willRender'), hook('bottom', 'didInitAttrs', { attrs: bottomAttrs }), hook('bottom', 'didReceiveAttrs', { newAttrs: bottomAttrs }), hook('bottom', 'willRender'), hook('bottom', 'didInsertElement'), hook('bottom', 'didRender'), hook('middle', 'didInsertElement'), hook('middle', 'didRender'), hook('top', 'didInsertElement'), hook('top', 'didRender')]);

  hooks = [];

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('twitter', '@hipstertomdale');
  });

  // Because the `twitter` attr is used by the all of the components,
  // the lifecycle hooks are invoked for all components.

  topAttrs = { oldAttrs: { twitter: '@tomdale' }, newAttrs: { twitter: '@hipstertomdale' } };
  middleAttrs = { oldAttrs: { twitterTop: '@tomdale' }, newAttrs: { twitterTop: '@hipstertomdale' } };
  bottomAttrs = { oldAttrs: { twitterMiddle: '@tomdale' }, newAttrs: { twitterMiddle: '@hipstertomdale' } };

  deepEqual(hooks, [hook('top', 'didUpdateAttrs', topAttrs), hook('top', 'didReceiveAttrs', topAttrs), hook('top', 'willUpdate'), hook('top', 'willRender'), hook('middle', 'didUpdateAttrs', middleAttrs), hook('middle', 'didReceiveAttrs', middleAttrs), hook('middle', 'willUpdate'), hook('middle', 'willRender'), hook('bottom', 'didUpdateAttrs', bottomAttrs), hook('bottom', 'didReceiveAttrs', bottomAttrs), hook('bottom', 'willUpdate'), hook('bottom', 'willRender'), hook('bottom', 'didUpdate'), hook('bottom', 'didRender'), hook('middle', 'didUpdate'), hook('middle', 'didRender'), hook('top', 'didUpdate'), hook('top', 'didRender')]);

  hooks = [];

  // In this case, because the attrs are passed down, all child components are invoked.

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  topAttrs = { oldAttrs: { twitter: '@hipstertomdale' }, newAttrs: { twitter: '@hipstertomdale' } };
  middleAttrs = { oldAttrs: { twitterTop: '@hipstertomdale' }, newAttrs: { twitterTop: '@hipstertomdale' } };
  bottomAttrs = { oldAttrs: { twitterMiddle: '@hipstertomdale' }, newAttrs: { twitterMiddle: '@hipstertomdale' } };

  deepEqual(hooks, [hook('top', 'didUpdateAttrs', topAttrs), hook('top', 'didReceiveAttrs', topAttrs), hook('top', 'willUpdate'), hook('top', 'willRender'), hook('middle', 'didUpdateAttrs', middleAttrs), hook('middle', 'didReceiveAttrs', middleAttrs), hook('middle', 'willUpdate'), hook('middle', 'willRender'), hook('bottom', 'didUpdateAttrs', bottomAttrs), hook('bottom', 'didReceiveAttrs', bottomAttrs), hook('bottom', 'willUpdate'), hook('bottom', 'willRender'), hook('bottom', 'didUpdate'), hook('bottom', 'didRender'), hook('middle', 'didUpdate'), hook('middle', 'didRender'), hook('top', 'didUpdate'), hook('top', 'didRender')]);
});

QUnit.test('changing a component\'s displayed properties inside didInsertElement() is deprecated', function (assert) {
  var component = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{handle}}'),
    handle: '@wycats',
    container: container,

    didInsertElement: function didInsertElement() {
      this.set('handle', '@tomdale');
    }
  }).create();

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /modified inside the didInsertElement hook/);

  assert.strictEqual(component.$().text(), '@tomdale');

  (0, _emberMetalRun_loop2['default'])(function () {
    component.destroy();
  });
});

// TODO: Write a test that involves deep mutability: the component plucks something
// from inside the attrs hash out into state and passes it as attrs into a child
// component. The hooks should run correctly.