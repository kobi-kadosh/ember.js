'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberHtmlbarsHelper2 = _interopRequireDefault(_emberHtmlbarsHelper);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsSystemDiscoverKnownHelpers = require('ember-htmlbars/system/discover-known-helpers');

var _emberHtmlbarsSystemDiscoverKnownHelpers2 = _interopRequireDefault(_emberHtmlbarsSystemDiscoverKnownHelpers);

var resolver, registry, container;

QUnit.module('ember-htmlbars: discover-known-helpers', {
  setup: function setup() {
    resolver = function () {};

    registry = new _containerRegistry2['default']({ resolver: resolver });
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = null;
  }
});

QUnit.test('returns an empty hash when no helpers are known', function () {
  var result = (0, _emberHtmlbarsSystemDiscoverKnownHelpers2['default'])(container);

  deepEqual(result, {}, 'no helpers were known');
});

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-dashless-helpers')) {
  QUnit.test('includes helpers in the registry', function () {
    registry.register('helper:t', _emberHtmlbarsHelper2['default']);
    var result = (0, _emberHtmlbarsSystemDiscoverKnownHelpers2['default'])(container);
    var helpers = Object.keys(result);

    deepEqual(helpers, ['t'], 'helpers from the registry were known');
  });

  QUnit.test('includes resolved helpers', function () {
    resolver.knownForType = function () {
      return {
        'helper:f': true
      };
    };

    registry.register('helper:t', _emberHtmlbarsHelper2['default']);
    var result = (0, _emberHtmlbarsSystemDiscoverKnownHelpers2['default'])(container);
    var helpers = Object.keys(result);

    deepEqual(helpers, ['t', 'f'], 'helpers from the registry were known');
  });
} else {
  QUnit.test('returns empty object when disabled', function () {
    registry.register('helper:t', _emberHtmlbarsHelper2['default']);

    var result = (0, _emberHtmlbarsSystemDiscoverKnownHelpers2['default'])(container);
    var helpers = Object.keys(result);

    deepEqual(helpers, [], 'helpers from the registry were known');
  });
}