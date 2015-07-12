'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.TEMPLATES

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberHtmlbarsHelper2 = _interopRequireDefault(_emberHtmlbarsHelper);

var _emberHtmlbarsCompatMakeBoundHelper = require('ember-htmlbars/compat/make-bound-helper');

var _emberHtmlbarsCompatMakeBoundHelper2 = _interopRequireDefault(_emberHtmlbarsCompatMakeBoundHelper);

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberHtmlbarsSystemMake_bound_helper = require('ember-htmlbars/system/make_bound_helper');

var _emberHtmlbarsSystemMake_bound_helper2 = _interopRequireDefault(_emberHtmlbarsSystemMake_bound_helper);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var registry, locator, application, originalLookup, originalLoggerInfo;

QUnit.module('Ember.Application Dependency Injection - default resolver', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    application = (0, _emberMetalRun_loop2['default'])(_emberApplicationSystemApplication2['default'], 'create');

    registry = application.registry;
    locator = application.__container__;
    originalLoggerInfo = _emberMetalLogger2['default'].info;
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].TEMPLATES = {};
    _emberMetalCore2['default'].lookup = originalLookup;
    (0, _emberMetalRun_loop2['default'])(application, 'destroy');
    var UserInterfaceNamespace = _emberRuntimeSystemNamespace2['default'].NAMESPACES_BY_ID['UserInterface'];
    if (UserInterfaceNamespace) {
      (0, _emberMetalRun_loop2['default'])(UserInterfaceNamespace, 'destroy');
    }

    _emberMetalLogger2['default'].info = originalLoggerInfo;
  }
});

QUnit.test('the default resolver can look things up in other namespaces', function () {
  var UserInterface = _emberMetalCore2['default'].lookup.UserInterface = _emberRuntimeSystemNamespace2['default'].create();
  UserInterface.NavigationController = _emberRuntimeControllersController2['default'].extend();

  var nav = locator.lookup('controller:userInterface/navigation');

  ok(nav instanceof UserInterface.NavigationController, 'the result should be an instance of the specified class');
});

QUnit.test('the default resolver looks up templates in Ember.TEMPLATES', function () {
  function fooTemplate() {}
  function fooBarTemplate() {}
  function fooBarBazTemplate() {}

  _emberMetalCore2['default'].TEMPLATES['foo'] = fooTemplate;
  _emberMetalCore2['default'].TEMPLATES['fooBar'] = fooBarTemplate;
  _emberMetalCore2['default'].TEMPLATES['fooBar/baz'] = fooBarBazTemplate;

  equal(locator.lookup('template:foo'), fooTemplate, 'resolves template:foo');
  equal(locator.lookup('template:fooBar'), fooBarTemplate, 'resolves template:foo_bar');
  equal(locator.lookup('template:fooBar.baz'), fooBarBazTemplate, 'resolves template:foo_bar.baz');
});

QUnit.test('the default resolver looks up basic name as no prefix', function () {
  ok(_emberRuntimeControllersController2['default'].detect(locator.lookup('controller:basic')), 'locator looksup correct controller');
});

function detectEqual(first, second, message) {
  ok(first.detect(second), message);
}

QUnit.test('the default resolver looks up arbitrary types on the namespace', function () {
  application.FooManager = _emberRuntimeSystemObject2['default'].extend({});

  detectEqual(application.FooManager, registry.resolver('manager:foo'), 'looks up FooManager on application');
});

QUnit.test('the default resolver resolves models on the namespace', function () {
  application.Post = _emberRuntimeSystemObject2['default'].extend({});

  detectEqual(application.Post, locator.lookupFactory('model:post'), 'looks up Post model on application');
});

QUnit.test('the default resolver resolves *:main on the namespace', function () {
  application.FooBar = _emberRuntimeSystemObject2['default'].extend({});

  detectEqual(application.FooBar, locator.lookupFactory('foo-bar:main'), 'looks up FooBar type without name on application');
});

QUnit.test('the default resolver resolves helpers', function () {
  expect(2);

  function fooresolvertestHelper() {
    ok(true, 'found fooresolvertestHelper');
  }
  function barBazResolverTestHelper() {
    ok(true, 'found barBazResolverTestHelper');
  }
  (0, _emberHtmlbarsHelpers.registerHelper)('fooresolvertest', fooresolvertestHelper);
  (0, _emberHtmlbarsHelpers.registerHelper)('bar-baz-resolver-test', barBazResolverTestHelper);

  fooresolvertestHelper();
  barBazResolverTestHelper();
});

QUnit.test('the default resolver resolves container-registered helpers', function () {
  var shorthandHelper = (0, _emberHtmlbarsHelper.helper)(function () {});
  var helper = _emberHtmlbarsHelper2['default'].extend();

  application.register('helper:shorthand', shorthandHelper);
  application.register('helper:complete', helper);

  var lookedUpShorthandHelper = locator.lookupFactory('helper:shorthand');
  ok(lookedUpShorthandHelper.isHelperInstance, 'shorthand helper isHelper');

  var lookedUpHelper = locator.lookupFactory('helper:complete');
  ok(lookedUpHelper.isHelperFactory, 'complete helper is factory');
  ok(helper.detect(lookedUpHelper), 'looked up complete helper');
});

QUnit.test('the default resolver resolves helpers on the namespace', function () {
  var ShorthandHelper = (0, _emberHtmlbarsHelper.helper)(function () {});
  var CompleteHelper = _emberHtmlbarsHelper2['default'].extend();
  var LegacyBareFunctionHelper = function LegacyBareFunctionHelper() {};
  var LegacyHandlebarsBoundHelper = (0, _emberHtmlbarsCompatMakeBoundHelper2['default'])(function () {});
  var LegacyHTMLBarsBoundHelper = (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function () {});
  var ViewHelper = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(function () {});

  application.ShorthandHelper = ShorthandHelper;
  application.CompleteHelper = CompleteHelper;
  application.LegacyBareFunctionHelper = LegacyBareFunctionHelper;
  application.LegacyHandlebarsBoundHelper = LegacyHandlebarsBoundHelper;
  application.LegacyHtmlBarsBoundHelper = LegacyHTMLBarsBoundHelper; // Must use lowered "tml" in "HTMLBars" for resolver to find this
  application.ViewHelper = ViewHelper;

  var resolvedShorthand = registry.resolve('helper:shorthand');
  var resolvedComplete = registry.resolve('helper:complete');
  var resolvedLegacy = registry.resolve('helper:legacy-bare-function');
  var resolvedLegacyHandlebars = registry.resolve('helper:legacy-handlebars-bound');
  var resolvedLegacyHTMLBars = registry.resolve('helper:legacy-html-bars-bound');
  var resolvedView = registry.resolve('helper:view');

  equal(resolvedShorthand, ShorthandHelper, 'resolve fetches the shorthand helper factory');
  equal(resolvedComplete, CompleteHelper, 'resolve fetches the complete helper factory');
  ok(typeof resolvedLegacy === 'function', 'legacy function helper is resolved');
  equal(resolvedView, ViewHelper, 'resolves view helper');
  equal(resolvedLegacyHTMLBars, LegacyHTMLBarsBoundHelper, 'resolves legacy HTMLBars bound helper');
  equal(resolvedLegacyHandlebars, LegacyHandlebarsBoundHelper, 'resolves legacy Handlebars bound helper');
});

QUnit.test('the default resolver throws an error if the fullName to resolve is invalid', function () {
  throws(function () {
    registry.resolve(undefined);
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve(null);
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve('');
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve('');
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve(':');
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve('model');
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve('model:');
  }, TypeError, /Invalid fullName/);
  throws(function () {
    registry.resolve(':type');
  }, TypeError, /Invalid fullName/);
});

QUnit.test('the default resolver logs hits if `LOG_RESOLVER` is set', function () {
  expect(3);

  application.LOG_RESOLVER = true;
  application.ScoobyDoo = _emberRuntimeSystemObject2['default'].extend();
  application.toString = function () {
    return 'App';
  };

  _emberMetalLogger2['default'].info = function (symbol, name, padding, lookupDescription) {
    equal(symbol, '[✓]', 'proper symbol is printed when a module is found');
    equal(name, 'doo:scooby', 'proper lookup value is logged');
    equal(lookupDescription, 'App.ScoobyDoo');
  };

  registry.resolve('doo:scooby');
});

QUnit.test('the default resolver logs misses if `LOG_RESOLVER` is set', function () {
  expect(3);

  application.LOG_RESOLVER = true;
  application.toString = function () {
    return 'App';
  };

  _emberMetalLogger2['default'].info = function (symbol, name, padding, lookupDescription) {
    equal(symbol, '[ ]', 'proper symbol is printed when a module is not found');
    equal(name, 'doo:scooby', 'proper lookup value is logged');
    equal(lookupDescription, 'App.ScoobyDoo');
  };

  registry.resolve('doo:scooby');
});

QUnit.test('doesn\'t log without LOG_RESOLVER', function () {
  var infoCount = 0;

  application.ScoobyDoo = _emberRuntimeSystemObject2['default'].extend();

  _emberMetalLogger2['default'].info = function (symbol, name) {
    infoCount = infoCount + 1;
  };

  registry.resolve('doo:scooby');
  registry.resolve('doo:scrappy');
  equal(infoCount, 0, 'Logger.info should not be called if LOG_RESOLVER is not set');
});

QUnit.test('lookup description', function () {
  application.toString = function () {
    return 'App';
  };

  equal(registry.describe('controller:foo'), 'App.FooController', 'Type gets appended at the end');
  equal(registry.describe('controller:foo.bar'), 'App.FooBarController', 'dots are removed');
  equal(registry.describe('model:foo'), 'App.Foo', 'models don\'t get appended at the end');
});

QUnit.test('assertion for routes without isRouteFactory property', function () {
  application.FooRoute = _emberViewsViewsComponent2['default'].extend();

  expectAssertion(function () {
    registry.resolve('route:foo');
  }, /to resolve to an Ember.Route/, 'Should assert');
});

QUnit.test('no assertion for routes that extend from Ember.Route', function () {
  expect(0);
  application.FooRoute = _emberRoutingSystemRoute2['default'].extend();
  registry.resolve('route:foo');
});

QUnit.test('deprecation warning for service factories without isServiceFactory property', function () {
  expectDeprecation(/service factories must have an `isServiceFactory` property/);
  application.FooService = _emberRuntimeSystemObject2['default'].extend();
  registry.resolve('service:foo');
});

QUnit.test('no deprecation warning for service factories that extend from Ember.Service', function () {
  expectNoDeprecation();
  application.FooService = _emberRuntimeSystemService2['default'].extend();
  registry.resolve('service:foo');
});

QUnit.test('deprecation warning for view factories without isViewFactory property', function () {
  expectDeprecation(/view factories must have an `isViewFactory` property/);
  application.FooView = _emberRuntimeSystemObject2['default'].extend();
  registry.resolve('view:foo');
});

QUnit.test('no deprecation warning for view factories that extend from Ember.View', function () {
  expectNoDeprecation();
  application.FooView = _emberViewsViewsView2['default'].extend();
  registry.resolve('view:foo');
});

QUnit.test('deprecation warning for component factories without isComponentFactory property', function () {
  expectDeprecation(/component factories must have an `isComponentFactory` property/);
  application.FooComponent = _emberViewsViewsView2['default'].extend();
  registry.resolve('component:foo');
});

QUnit.test('no deprecation warning for component factories that extend from Ember.Component', function () {
  expectNoDeprecation();
  application.FooView = _emberViewsViewsComponent2['default'].extend();
  registry.resolve('component:foo');
});

QUnit.test('knownForType returns each item for a given type found', function () {
  application.FooBarHelper = 'foo';
  application.BazQuxHelper = 'bar';

  var found = registry.resolver.knownForType('helper');

  deepEqual(found, {
    'helper:foo-bar': true,
    'helper:baz-qux': true
  });
});

QUnit.test('knownForType is not required to be present on the resolver', function () {
  delete registry.resolver.__resolver__.knownForType;

  registry.resolver.knownForType('helper', function () {});

  ok(true, 'does not error');
});