'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var registry, container, view;

function aliasHelper(params, hash, options) {
  this['yield'](params);
}

QUnit.module('ember-htmlbars: block params', {
  setup: function setup() {
    (0, _emberHtmlbarsHelpers.registerHelper)('alias', aliasHelper);

    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  },

  teardown: function teardown() {
    delete _emberHtmlbarsHelpers2['default'].alias;

    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    registry = container = view = null;
  }
});

QUnit.test('should raise error if helper not available', function () {
  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#shouldfail}}{{/shouldfail}}')
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'A helper named \'shouldfail\' could not be found');
});

QUnit.test('basic block params usage', function () {
  view = _emberViewsViewsView2['default'].create({
    committer: { name: 'rwjblue' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#alias view.committer.name as |name|}}name: {{name}}, length: {{name.length}}{{/alias}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'name: rwjblue, length: 7');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('committer.name', 'krisselden');
  });

  equal(view.$().text(), 'name: krisselden, length: 10');
});

QUnit.test('nested block params shadow correctly', function () {
  view = _emberViewsViewsView2['default'].create({
    context: { name: 'ebryn' },
    committer1: { name: 'trek' },
    committer2: { name: 'machty' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}' + '{{#alias view.committer1.name as |name|}}' + '[{{name}}' + '{{#alias view.committer2.name as |name|}}' + '[{{name}}]' + '{{/alias}}' + '{{name}}]' + '{{/alias}}' + '{{name}}' + '{{#alias view.committer2.name as |name|}}' + '[{{name}}' + '{{#alias view.committer1.name as |name|}}' + '[{{name}}]' + '{{/alias}}' + '{{name}}]' + '{{/alias}}' + '{{name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ebryn[trek[machty]trek]ebryn[machty[trek]machty]ebryn');
});

QUnit.test('components can yield values', function () {
  registry.register('template:components/x-alias', (0, _emberTemplateCompilerSystemCompile2['default'])('{{yield attrs.param.name}}'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    context: { name: 'ebryn' },
    committer1: { name: 'trek' },
    committer2: { name: 'machty' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}' + '{{#x-alias param=view.committer1 as |name|}}' + '[{{name}}' + '{{#x-alias param=view.committer2 as |name|}}' + '[{{name}}]' + '{{/x-alias}}' + '{{name}}]' + '{{/x-alias}}' + '{{name}}' + '{{#x-alias param=view.committer2 as |name|}}' + '[{{name}}' + '{{#x-alias param=view.committer1 as |name|}}' + '[{{name}}]' + '{{/x-alias}}' + '{{name}}]' + '{{/x-alias}}' + '{{name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ebryn[trek[machty]trek]ebryn[machty[trek]machty]ebryn');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('committer1', { name: 'wycats' });
  });

  equal(view.$().text(), 'ebryn[wycats[machty]wycats]ebryn[machty[wycats]machty]ebryn');
});

QUnit.test('#11519 - block param infinite loop', function (assert) {
  // To trigger this case, a component must 1) consume a KeyStream and then yield that KeyStream
  // into a parent light scope.
  registry.register('template:components/block-with-yield', (0, _emberTemplateCompilerSystemCompile2['default'])('{{danger}} {{yield danger}}'));

  var component;
  registry.register('component:block-with-yield', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      component = this;
      return this._super.apply(this, arguments);
    },

    danger: 0
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#block-with-yield as |dangerBlockParam|}} {{/block-with-yield}}')
  });

  // On initial render, create streams. The bug will not have manifested yet, but at this point
  // we have created streams that create a circular invalidation.
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  // Trigger a revalidation, which will cause an infinite loop without the fix
  // in place.  Note that we do not see the infinite loop is in testing mode,
  // because a deprecation warning about re-renders is issued, which Ember
  // treats as an exception.
  (0, _emberMetalRun_loop2['default'])(function () {
    component.set('danger', 1);
  });

  assert.equal(view.$().text().trim(), '1');
});