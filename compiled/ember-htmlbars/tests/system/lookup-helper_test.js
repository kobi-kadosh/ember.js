'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

var _emberHtmlbarsSystemLookupHelper2 = _interopRequireDefault(_emberHtmlbarsSystemLookupHelper);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberHtmlbarsHelper2 = _interopRequireDefault(_emberHtmlbarsHelper);

var _emberHtmlbarsCompatHelper = require('ember-htmlbars/compat/helper');

var _emberHtmlbarsCompatHelper2 = _interopRequireDefault(_emberHtmlbarsCompatHelper);

function generateEnv(helpers, container) {
  return {
    container: container,
    helpers: helpers ? helpers : {},
    hooks: { keywords: {} },
    knownHelpers: {}
  };
}

function generateContainer() {
  var registry = new _containerRegistry2['default']();
  var container = registry.container();

  registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);

  return container;
}

QUnit.module('ember-htmlbars: lookupHelper hook');

QUnit.test('looks for helpers in the provided `env.helpers`', function () {
  var env = generateEnv({
    'flubarb': function flubarb() {}
  });

  var actual = (0, _emberHtmlbarsSystemLookupHelper2['default'])('flubarb', null, env);

  equal(actual, env.helpers.flubarb, 'helpers are looked up on env');
});

QUnit.test('returns undefined if no container exists (and helper is not found in env)', function () {
  var env = generateEnv();
  var view = {};

  var actual = (0, _emberHtmlbarsSystemLookupHelper.findHelper)('flubarb', view, env);

  equal(actual, undefined, 'does not blow up if view does not have a container');
});

QUnit.test('does not lookup in the container if the name does not contain a dash (and helper is not found in env)', function () {
  var env = generateEnv();
  var view = {
    container: {
      lookup: function lookup() {
        ok(false, 'should not lookup in the container');
      }
    }
  };

  var actual = (0, _emberHtmlbarsSystemLookupHelper.findHelper)('flubarb', view, env);

  equal(actual, undefined, 'does not blow up if view does not have a container');
});

QUnit.test('does a lookup in the container if the name contains a dash (and helper is not found in env)', function () {
  var container = generateContainer();
  var env = generateEnv(null, container);
  var view = {
    container: container
  };

  var someName = _emberHtmlbarsHelper2['default'].extend();
  view.container._registry.register('helper:some-name', someName);

  var actual = (0, _emberHtmlbarsSystemLookupHelper2['default'])('some-name', view, env);

  ok(someName.detect(actual), 'helper is an instance of the helper class');
});

QUnit.test('does a lookup in the container if the name is found in knownHelpers', function () {
  var container = generateContainer();
  var env = generateEnv(null, container);
  var view = {
    container: container
  };

  env.knownHelpers['t'] = true;
  var t = _emberHtmlbarsHelper2['default'].extend();
  view.container._registry.register('helper:t', t);

  var actual = (0, _emberHtmlbarsSystemLookupHelper2['default'])('t', view, env);

  ok(t.detect(actual), 'helper is an instance of the helper class');
});

QUnit.test('looks up a shorthand helper in the container', function () {
  expect(2);
  var container = generateContainer();
  var env = generateEnv(null, container);
  var view = {
    container: container
  };
  var called;

  function someName() {
    called = true;
  }
  view.container._registry.register('helper:some-name', (0, _emberHtmlbarsHelper.helper)(someName));

  var actual = (0, _emberHtmlbarsSystemLookupHelper2['default'])('some-name', view, env);

  ok(actual.isHelperInstance, 'is a helper');

  actual.compute([], {});

  ok(called, 'HTMLBars compatible wrapper is wraping the provided function');
});

QUnit.test('fails with a useful error when resolving a function', function () {
  expect(2);
  var container = generateContainer();
  var env = generateEnv(null, container);
  var view = {
    container: container
  };

  function someName() {}
  view.container._registry.register('helper:some-name', someName);

  var actual;
  expectDeprecation(function () {
    actual = (0, _emberHtmlbarsSystemLookupHelper2['default'])('some-name', view, env);
  }, /helper "some-name" is a deprecated bare function helper/);
  ok(actual instanceof _emberHtmlbarsCompatHelper2['default'], 'function looks up as compat helper');
});