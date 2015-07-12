'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsCompatHelper = require('ember-htmlbars/compat/helper');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberHtmlbarsCompatHelper2 = _interopRequireDefault(_emberHtmlbarsCompatHelper);

var view, registry, container;

QUnit.module('ember-htmlbars: compat - Handlebars compatible helpers', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    delete _emberHtmlbarsHelpers2['default'].test;
    delete _emberHtmlbarsHelpers2['default']['view-helper'];
  }
});

QUnit.test('wraps provided function so that original path params are provided to the helper', function () {
  expect(2);

  function someHelper(param1, param2, options) {
    equal(param1, 'blammo');
    equal(param2, 'blazzico');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test "blammo" "blazzico"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('combines `env` and `options` for the wrapped helper', function () {
  expect(1);

  function someHelper(options) {
    equal(options.data.view, view);
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('combines `env` and `options` for the wrapped helper', function () {
  expect(1);

  function someHelper(options) {
    equal(options.data.view, view);
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('has the correct options.data.view within a components layout', function () {
  expect(1);
  var component;

  registry.register('component:foo-bar', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      component = this;
    }
  }));

  registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('{{my-thing}}'));
  registry.register('helper:my-thing', new _emberHtmlbarsCompatHelper2['default'](function (options) {
    equal(options.data.view, component, 'passed in view should match the current component');
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{foo-bar}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('adds `hash` into options `options` for the wrapped helper', function () {
  expect(1);

  function someHelper(options) {
    equal(options.hash.bestFriend, 'Jacquie');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test bestFriend="Jacquie"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('bound `hash` params are provided with their original paths', function () {
  expect(1);

  function someHelper(options) {
    equal(options.hash.bestFriend, 'value');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'Jacquie'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test bestFriend=value}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('bound ordered params are provided with their original paths', function () {
  expect(2);

  function someHelper(param1, param2, options) {
    equal(param1, 'first');
    equal(param2, 'second');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      first: 'blammo',
      second: 'blazzico'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test first second}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('allows unbound usage within an element', function () {
  expect(4);

  function someHelper(param1, param2, options) {
    equal(param1, 'blammo');
    equal(param2, 'blazzico');

    return 'class=\'foo\'';
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{test "blammo" "blazzico"}}>Bar</div>')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo').length, 1, 'class attribute was added by helper');
});

QUnit.test('registering a helper created from `Ember.Handlebars.makeViewHelper` does not double wrap the helper', function () {
  expect(1);

  var ViewHelperComponent = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('woot!')
  });

  var helper = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(ViewHelperComponent);
  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('view-helper', helper);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view-helper}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'woot!');
});

QUnit.test('makes helpful assertion when called with invalid arguments', function () {
  expect(1);

  var ViewHelperComponent = _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('woot!')
  });

  ViewHelperComponent.toString = function () {
    return 'Some Random Class';
  };

  var helper = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(ViewHelperComponent);
  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('view-helper', helper);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view-helper "hello"}}')
  }).create();

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'You can only pass attributes (such as name=value) not bare values to a helper for a View found in \'Some Random Class\'');
});

QUnit.test('does not add `options.fn` if no block was specified', function () {
  expect(1);

  function someHelper(options) {
    ok(!options.fn, '`options.fn` is not present when block is not specified');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('does not return helper result if block was specified', function () {
  expect(1);

  function someHelper(options) {
    return 'asdf';
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#test}}lkj;{{/test}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');
});

QUnit.test('allows usage of the template fn', function () {
  expect(1);

  function someHelper(options) {
    options.fn();
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#test}}{{value}}{{/test}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'foo');
});

QUnit.test('allows usage of the template inverse', function () {
  expect(1);

  function someHelper(options) {
    options.inverse();
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#test}}Nothing to see here.{{else}}{{value}}{{/test}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'foo');
});

QUnit.test('ordered param types are added to options.types', function () {
  expect(3);

  function someHelper(param1, param2, param3, options) {
    equal(options.types[0], 'NUMBER');
    equal(options.types[1], 'ID');
    equal(options.types[2], 'STRING');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      first: 'blammo',
      second: 'blazzico'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test 1 two "3"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('`hash` params are to options.hashTypes', function () {
  expect(3);

  function someHelper(options) {
    equal(options.hashTypes.string, 'STRING');
    equal(options.hashTypes.number, 'NUMBER');
    equal(options.hashTypes.id, 'ID');
  }

  (0, _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'Jacquie'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test string="foo" number=42 id=someBoundThing}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});