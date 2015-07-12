'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.lookup

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberHtmlbarsCompatHandlebarsGet = require('ember-htmlbars/compat/handlebars-get');

var _emberHtmlbarsCompatHandlebarsGet2 = _interopRequireDefault(_emberHtmlbarsCompatHandlebarsGet);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsCompatHelper = require('ember-htmlbars/compat/helper');

var _emberHtmlbarsCompatHelper2 = _interopRequireDefault(_emberHtmlbarsCompatHelper);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var compile = _emberHtmlbarsCompat2['default'].compile;

var originalLookup = _emberMetalCore2['default'].lookup;
var TemplateTests, registry, container, lookup, view;

QUnit.module('ember-htmlbars: compat - Ember.Handlebars.get', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;

    _emberMetalCore2['default'].lookup = lookup = originalLookup;
    TemplateTests = null;
  }
});

QUnit.test('it can lookup a path from the current context', function () {
  expect(1);

  registry.register('helper:handlebars-get', new _emberHtmlbarsCompatHelper2['default'](function (path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function () {
      equal((0, _emberHtmlbarsCompatHandlebarsGet2['default'])(context, path, options), 'bar');
    });
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{handlebars-get "foo"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('it can lookup a path from the current keywords', function () {
  expect(1);

  registry.register('helper:handlebars-get', new _emberHtmlbarsCompatHelper2['default'](function (path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function () {
      equal((0, _emberHtmlbarsCompatHandlebarsGet2['default'])(context, path, options), 'bar');
    });
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{#with foo as |bar|}}{{handlebars-get "bar"}}{{/with}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('it can lookup a path from globals', function () {
  expect(1);

  lookup.Blammo = { foo: 'blah' };

  registry.register('helper:handlebars-get', new _emberHtmlbarsCompatHelper2['default'](function (path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function () {
      equal((0, _emberHtmlbarsCompatHandlebarsGet2['default'])(context, path, options), lookup.Blammo.foo);
    });
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {},
    template: compile('{{handlebars-get "Blammo.foo"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('it raises a deprecation warning on use', function () {
  expect(1);

  registry.register('helper:handlebars-get', new _emberHtmlbarsCompatHelper2['default'](function (path, options) {
    var context = options.contexts && options.contexts[0] || this;

    expectDeprecation(function () {
      (0, _emberHtmlbarsCompatHandlebarsGet2['default'])(context, path, options);
    }, 'Usage of Ember.Handlebars.get is deprecated, use a Component or Ember.Handlebars.makeBoundHelper instead.');
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{handlebars-get "foo"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});