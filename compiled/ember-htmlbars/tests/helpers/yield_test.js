/*jshint newcap:false*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

//import { set } from "ember-metal/property_set";

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view, registry, container;

QUnit.module('ember-htmlbars: Support for {{yield}} helper', {
  setup: function setup() {
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      _emberMetalCore2['default'].TEMPLATES = {};
    });
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = view = null;
  }
});

QUnit.test('a view with a layout set renders its template where the {{yield}} helper appears', function () {
  var ViewWithLayout = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class="wrapper"><h1>{{attrs.title}}</h1>{{yield}}</div>')
  });

  view = _emberViewsViewsView2['default'].create({
    withLayout: ViewWithLayout,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.withLayout title="My Fancy Page"}}<div class="page-body">Show something interesting here</div>{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div.wrapper div.page-body').length, 1, 'page-body is embedded within wrapping my-page');
});

QUnit.test('block should work properly even when templates are not hard-coded', function () {
  registry.register('template:nester', (0, _emberTemplateCompilerSystemCompile2['default'])('<div class="wrapper"><h1>{{attrs.title}}</h1>{{yield}}</div>'));
  registry.register('template:nested', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view "with-layout" title="My Fancy Page"}}<div class="page-body">Show something interesting here</div>{{/view}}'));

  registry.register('view:with-layout', _emberViewsViewsView2['default'].extend({
    container: container,
    layoutName: 'nester'
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'nested'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div.wrapper div.page-body').length, 1, 'page-body is embedded within wrapping my-page');
});

QUnit.test('templates should yield to block, when the yield is embedded in a hierarchy of virtual views', function () {
  var TimesView = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class="times">{{#each view.index as |item|}}{{yield}}{{/each}}</div>'),
    n: null,
    index: (0, _emberMetalComputed.computed)(function () {
      var n = this.attrs.n;
      var indexArray = (0, _emberRuntimeSystemNative_array.A)();
      for (var i = 0; i < n; i++) {
        indexArray[i] = i;
      }
      return indexArray;
    })
  });

  view = _emberViewsViewsView2['default'].create({
    timesView: TimesView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="container"><div class="title">Counting to 5</div>{{#view view.timesView n=5}}<div class="times-item">Hello</div>{{/view}}</div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div#container div.times-item').length, 5, 'times-item is embedded within wrapping container 5 times, as expected');
});

QUnit.test('templates should yield to block, when the yield is embedded in a hierarchy of non-virtual views', function () {
  var NestingView = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view tagName="div" classNames="nesting"}}{{yield}}{{/view}}')
  });

  view = _emberViewsViewsView2['default'].create({
    nestingView: NestingView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="container">{{#view view.nestingView}}<div id="block">Hello</div>{{/view}}</div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div#container div.nesting div#block').length, 1, 'nesting view yields correctly even within a view hierarchy in the nesting view');
});

QUnit.test('block should not be required', function () {
  var YieldingView = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view tagName="div" classNames="yielding"}}{{yield}}{{/view}}')
  });

  view = _emberViewsViewsView2['default'].create({
    yieldingView: YieldingView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="container">{{view view.yieldingView}}</div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div#container div.yielding').length, 1, 'yielding view is rendered as expected');
});

QUnit.test('yield uses the outer context', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    boundText: 'inner',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{boundText}}</p><p>{{yield}}</p>')
  });

  view = _emberViewsViewsView2['default'].create({
    controller: { boundText: 'outer', component: component },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view component}}{{boundText}}{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div p:contains(inner) + p:contains(outer)').length, 1, 'Yield points at the right context');
});

QUnit.test('yield inside a conditional uses the outer context [DEPRECATED]', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    boundText: 'inner',
    truthy: true,
    obj: {},
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{boundText}}</p><p>{{#if truthy}}{{#with obj}}{{yield}}{{/with}}{{/if}}</p>')
  });

  view = _emberViewsViewsView2['default'].create({
    controller: { boundText: 'outer', truthy: true, obj: { component: component, truthy: true, boundText: 'insideWith' } },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with obj}}{{#if truthy}}{{#view component}}{{#if truthy}}{{boundText}}{{/if}}{{/view}}{{/if}}{{/with}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  equal(view.$('div p:contains(inner) + p:contains(insideWith)').length, 1, 'Yield points at the right context');
});

QUnit.test('outer keyword doesn\'t mask inner component property', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    item: 'inner',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{item}}</p><p>{{yield}}</p>')
  });

  view = _emberViewsViewsView2['default'].create({
    controller: { boundText: 'outer', component: component },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with boundText as |item|}}{{#view component}}{{item}}{{/view}}{{/with}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div p:contains(inner) + p:contains(outer)').length, 1, 'inner component property isn\'t masked by outer keyword');
});

QUnit.test('inner keyword doesn\'t mask yield property', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    boundText: 'inner',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with boundText as |item|}}<p>{{item}}</p><p>{{yield}}</p>{{/with}}')
  });

  view = _emberViewsViewsView2['default'].create({
    controller: { item: 'outer', component: component },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view component}}{{item}}{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div p:contains(inner) + p:contains(outer)').length, 1, 'outer property isn\'t masked by inner keyword');
});

QUnit.test('can bind a keyword to a component and use it in yield', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{attrs.content}}</p><p>{{yield}}</p>')
  });

  view = _emberViewsViewsView2['default'].create({
    controller: { boundText: 'outer', component: component },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with boundText as |item|}}{{#view component content=item}}{{item}}{{/view}}{{/with}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div p:contains(outer) + p:contains(outer)').length, 1, 'component and yield have keyword');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.boundText', 'update');
  });

  equal(view.$('div p:contains(update) + p:contains(update)').length, 1, 'keyword has correctly propagated update');
});

QUnit.test('yield view should be a virtual view', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    isParentComponent: true,

    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{yield}}')
  });

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view component}}{{view includedComponent}}{{/view}}'),
    controller: {
      component: component,
      includedComponent: _emberViewsViewsComponent2['default'].extend({
        didInsertElement: function didInsertElement() {
          var parentView = this.get('parentView');

          ok(parentView.get('isParentComponent'), 'parent view is the parent component');
        }
      })
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('yield should work for views even if parentView is null', function () {
  view = _emberViewsViewsView2['default'].create({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('Layout: {{yield}}'),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('View Content')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().text(), 'Layout: View Content');
});

QUnit.test('simple bindings inside of a yielded template should work properly when the yield is nested inside of another view', function () {
  view = _emberViewsViewsView2['default'].create({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.falsy}}{{else}}{{yield}}{{/if}}'),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.text}}'),
    text: 'ohai'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().text(), 'ohai');
});

QUnit.test('nested simple bindings inside of a yielded template should work properly when the yield is nested inside of another view', function () {
  view = _emberViewsViewsView2['default'].create({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.falsy}}{{else}}{{yield}}{{/if}}'),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.falsy}}{{else}}{{view.text}}{{/if}}'),
    text: 'ohai'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().text(), 'ohai');
});

QUnit.module('ember-htmlbars: Component {{yield}}', {
  setup: function setup() {},
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    delete _emberHtmlbarsHelpers2['default']['inner-component'];
    delete _emberHtmlbarsHelpers2['default']['outer-component'];
  }
});

QUnit.test('yield with nested components (#3220)', function () {
  var InnerComponent = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{yield}}')
  });

  (0, _emberHtmlbarsHelpers.registerHelper)('inner-component', (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(InnerComponent));

  var OuterComponent = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#inner-component}}<span>{{yield}}</span>{{/inner-component}}')
  });

  (0, _emberHtmlbarsHelpers.registerHelper)('outer-component', (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(OuterComponent));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#outer-component}}Hello world{{/outer-component}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div > span').text(), 'Hello world');
});

QUnit.test('view keyword works inside component yield', function () {
  var component = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{yield}}</p>')
  });

  view = _emberViewsViewsView2['default'].create({
    dummyText: 'hello',
    component: component,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.component}}{{view.dummyText}}{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div > p').text(), 'hello', 'view keyword inside component yield block should refer to the correct view');
});