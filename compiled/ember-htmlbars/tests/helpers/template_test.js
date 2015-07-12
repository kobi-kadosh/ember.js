'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsKeywordsTemplate = require('ember-htmlbars/keywords/template');

var trim = _emberViewsSystemJquery2['default'].trim;

var MyApp, lookup, view, registry, container;
var originalLookup = _emberMetalCore2['default'].lookup;

QUnit.module('Support for {{template}} helper', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
    MyApp = lookup.MyApp = _emberRuntimeSystemObject2['default'].create({});
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = view = null;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should render other templates via the container (DEPRECATED)', function () {
  registry.register('template:sub_template_from_container', (0, _emberTemplateCompilerSystemCompile2['default'])('sub-template'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This {{template "sub_template_from_container"}} is pretty great.')
  });

  expectDeprecation(_emberHtmlbarsKeywordsTemplate.deprecation);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'This sub-template is pretty great.');
});

QUnit.test('should use the current view\'s context (DEPRECATED)', function () {
  registry.register('template:person_name', (0, _emberTemplateCompilerSystemCompile2['default'])('{{firstName}} {{lastName}}'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Who is {{template "person_name"}}?')
  });
  view.set('controller', _emberRuntimeSystemObject2['default'].create({
    firstName: 'Kris',
    lastName: 'Selden'
  }));

  expectDeprecation(_emberHtmlbarsKeywordsTemplate.deprecation);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'Who is Kris Selden?');
});