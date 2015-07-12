'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember-routing-htmlbars');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberRoutingViewsViewsLink = require('ember-routing-views/views/link');

var _emberRoutingViewsViewsLink2 = _interopRequireDefault(_emberRoutingViewsViewsLink);

var view;
var container;
var registry = new _emberRuntimeSystemContainer.Registry();

// These tests don't rely on the routing service, but LinkComponent makes
// some assumptions that it will exist. This small stub service ensures
// that the LinkComponent can render without raising an exception.
//
// TODO: Add tests that test actual behavior. Currently, all behavior
// is tested integration-style in the `ember` package.
registry.register('service:-routing', _emberRuntimeSystemObject2['default'].extend({
  availableRoutes: function availableRoutes() {
    return ['index'];
  },
  hasRoute: function hasRoute(name) {
    return name === 'index';
  },
  isActiveForRoute: function isActiveForRoute() {
    return true;
  },
  generateURL: function generateURL() {
    return '/';
  }
}));

registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
registry.register('component:-link-to', _emberRoutingViewsViewsLink2['default']);

QUnit.module('ember-routing-htmlbars: link-to helper', {
  setup: function setup() {
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('should be able to be inserted in DOM when the router is not present', function () {
  var template = '{{#link-to \'index\'}}Go to Index{{/link-to}}';
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Go to Index');
});

QUnit.test('re-renders when title changes', function () {
  var template = '{{link-to title routeName}}';
  view = _emberViewsViewsView2['default'].create({
    controller: {
      title: 'foo',
      routeName: 'index'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'foo');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'controller.title', 'bar');
  });

  equal(view.$().text(), 'bar');
});

QUnit.test('can read bound title', function () {
  var template = '{{link-to title routeName}}';
  view = _emberViewsViewsView2['default'].create({
    controller: {
      title: 'foo',
      routeName: 'index'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'foo');
});

QUnit.test('escaped inline form (double curlies) escapes link title', function () {
  view = _emberViewsViewsView2['default'].create({
    title: '<b>blah</b>',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{link-to view.title}}'),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 0, 'no <b> were found');
});

QUnit.test('unescaped inline form (triple curlies) does not escape link title', function () {
  view = _emberViewsViewsView2['default'].create({
    title: '<b>blah</b>',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{{link-to view.title}}}'),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 1, '<b> was found');
});

QUnit.test('unwraps controllers', function () {
  var template = '{{#link-to \'index\' view.otherController}}Text{{/link-to}}';

  view = _emberViewsViewsView2['default'].create({
    otherController: _emberRuntimeControllersController2['default'].create({
      model: 'foo'
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    container: container
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated./);

  equal(view.$().text(), 'Text');
});