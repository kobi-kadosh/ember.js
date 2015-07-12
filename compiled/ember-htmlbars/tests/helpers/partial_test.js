'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var trim = _emberViewsSystemJquery2['default'].trim;

var MyApp, lookup, view, registry, container;
var originalLookup = _emberMetalCore2['default'].lookup;

QUnit.module('Support for {{partial}} helper', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
    MyApp = lookup.MyApp = _emberRuntimeSystemObject2['default'].create({});
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should render other templates registered with the container', function () {
  registry.register('template:_subTemplateFromContainer', (0, _emberTemplateCompilerSystemCompile2['default'])('sub-template'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This {{partial "subTemplateFromContainer"}} is pretty great.')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'This sub-template is pretty great.');
});

QUnit.test('should render other slash-separated templates registered with the container', function () {
  registry.register('template:child/_subTemplateFromContainer', (0, _emberTemplateCompilerSystemCompile2['default'])('sub-template'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This {{partial "child/subTemplateFromContainer"}} is pretty great.')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'This sub-template is pretty great.');
});

QUnit.test('should use the current view\'s context', function () {
  registry.register('template:_person_name', (0, _emberTemplateCompilerSystemCompile2['default'])('{{firstName}} {{lastName}}'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Who is {{partial "person_name"}}?')
  });
  view.set('controller', _emberRuntimeSystemObject2['default'].create({
    firstName: 'Kris',
    lastName: 'Selden'
  }));

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'Who is Kris Selden?');
});

QUnit.test('Quoteless parameters passed to {{template}} perform a bound property lookup of the partial name', function () {
  registry.register('template:_subTemplate', (0, _emberTemplateCompilerSystemCompile2['default'])('sub-template'));
  registry.register('template:_otherTemplate', (0, _emberTemplateCompilerSystemCompile2['default'])('other-template'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This {{partial view.partialName}} is pretty {{partial nonexistent}}great.'),
    partialName: 'subTemplate'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'This sub-template is pretty great.');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('partialName', 'otherTemplate');
  });

  equal(trim(view.$().text()), 'This other-template is pretty great.');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('partialName', null);
  });

  equal(trim(view.$().text()), 'This  is pretty great.');
});