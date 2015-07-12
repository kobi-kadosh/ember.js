'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalEvents = require('ember-metal/events');

var view, registry, container;

QUnit.module('ember-views: attrs-proxy', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('works with properties setup in root of view', function () {
  registry.register('view:foo', _emberViewsViewsView2['default'].extend({
    bar: 'qux',

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.bar}}')
  }));

  view = _emberViewsViewsView2['default'].extend({
    container: registry.container(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "foo" bar="baz"}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'baz', 'value specified in the template is used');
});

QUnit.test('works with undefined attributes', function () {
  // TODO: attrs
  // expectDeprecation();

  var childView;
  registry.register('view:foo', _emberViewsViewsView2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);

      childView = this;
    },

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bar}}')
  }));

  view = _emberViewsViewsView2['default'].extend({
    container: registry.container(),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "foo" bar=undefined}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'precond - value is used');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(childView, 'bar', 'stuff');
  });

  equal((0, _emberMetalProperty_get.get)(view, 'bar'), undefined, 'value is updated upstream');
});

QUnit.test('an observer on an attribute in the root of the component is fired when attrs are set', function () {
  expect(2);

  registry.register('view:foo', _emberViewsViewsView2['default'].extend({
    observerFiredCount: 0,

    barObserver: (0, _emberMetalEvents.on)('init', (0, _emberMetalMixin.observer)('bar', function () {
      var count = (0, _emberMetalProperty_get.get)(this, 'observerFiredCount');

      (0, _emberMetalProperty_set.set)(this, 'observerFiredCount', count + 1);
    })),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.bar}} - {{view.observerFiredCount}}')
  }));

  view = _emberViewsViewsView2['default'].extend({
    container: registry.container(),
    baz: 'baz',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "foo" bar=view.baz}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'baz - 1', 'observer is fired on initial set');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'baz', 'qux');
  });

  equal(view.$().text(), 'qux - 2', 'observer is fired on update');
});