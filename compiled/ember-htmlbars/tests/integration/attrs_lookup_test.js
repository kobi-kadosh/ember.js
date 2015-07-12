'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var registry, container, view;

QUnit.module('component - attrs lookup', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;
  }
});

QUnit.test('should be able to lookup attrs without `attrs.` - template access', function () {
  registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('{{first}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{foo-bar first="first attr"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'first attr');
});

QUnit.test('should be able to lookup attrs without `attrs.` - component access', function () {
  var component;

  registry.register('component:foo-bar', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      component = this;
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{foo-bar first="first attr"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(component.get('first'), 'first attr');
});

QUnit.test('should be able to modify a provided attr into local state #11571 / #11559', function () {
  var component;

  registry.register('component:foo-bar', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      component = this;
    },

    didReceiveAttrs: function didReceiveAttrs() {
      this.set('first', this.getAttr('first').toUpperCase());
    }
  }));
  registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('{{first}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{foo-bar first="first attr"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'FIRST ATTR', 'template lookup uses local state');
  equal(component.get('first'), 'FIRST ATTR', 'component lookup uses local state');
});