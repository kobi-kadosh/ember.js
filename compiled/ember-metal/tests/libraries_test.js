/* globals EmberDev */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalLibraries = require('ember-metal/libraries');

var _emberMetalLibraries2 = _interopRequireDefault(_emberMetalLibraries);

var libs, registry;

QUnit.module('Libraries registry', {
  setup: function setup() {
    libs = new _emberMetalLibraries2['default']();
    registry = libs._registry;
  },

  teardown: function teardown() {
    libs = null;
    registry = null;
  }
});

QUnit.test('core libraries come before other libraries', function () {
  expect(2);

  libs.register('my-lib', '2.0.0a');
  libs.registerCoreLibrary('DS', '1.0.0-beta.2');

  equal(registry[0].name, 'DS');
  equal(registry[1].name, 'my-lib');
});

QUnit.test('only the first registration of a library is stored', function () {
  expect(3);

  libs.register('magic', 1.23);
  libs.register('magic', 2.23);

  equal(registry[0].name, 'magic');
  equal(registry[0].version, 1.23);
  equal(registry.length, 1);
});

if ((0, _emberMetalFeatures2['default'])('ember-libraries-isregistered')) {
  QUnit.test('isRegistered returns correct value', function () {
    expect(3);

    equal(libs.isRegistered('magic'), false);

    libs.register('magic', 1.23);
    equal(libs.isRegistered('magic'), true);

    libs.deRegister('magic');
    equal(libs.isRegistered('magic'), false);
  });
}

QUnit.test('attempting to register a library that is already registered warns you', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  expect(1);

  var oldWarn = _emberMetalCore2['default'].warn;
  libs.register('magic', 1.23);

  _emberMetalCore2['default'].warn = function (msg, test) {
    if (!test) {
      equal(msg, 'Library "magic" is already registered with Ember.');
    }
  };

  // Should warn us
  libs.register('magic', 2.23);

  _emberMetalCore2['default'].warn = oldWarn;
});

QUnit.test('libraries can be de-registered', function () {
  expect(2);

  libs.register('lib1', '1.0.0b');
  libs.register('lib2', '1.0.0b');
  libs.register('lib3', '1.0.0b');

  libs.deRegister('lib1');
  libs.deRegister('lib3');

  equal(registry[0].name, 'lib2');
  equal(registry.length, 1);
});

QUnit.test('Libraries#each allows us to loop through each registered library (but is deprecated)', function () {
  expect(5);

  var items = [{ name: 'lib1', version: '1.0.0' }, { name: 'lib2', version: '2.0.0' }];

  for (var i = 0, l = items.length; i < l; i++) {
    libs.register(items[i].name, items[i].version);
  }

  expectDeprecation(function () {
    libs.each(function (name, version) {
      var expectedLib = items.shift();
      equal(expectedLib.name, name);
      equal(expectedLib.version, version);
    });
  }, 'Using Ember.libraries.each() is deprecated. Access to a list of registered libraries is currently a private API. If you are not knowingly accessing this method, your out-of-date Ember Inspector may be doing so.');
});