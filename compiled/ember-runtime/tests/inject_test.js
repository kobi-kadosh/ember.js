/* global EmberDev */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalInjected_property = require('ember-metal/injected_property');

var _emberMetalInjected_property2 = _interopRequireDefault(_emberMetalInjected_property);

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('inject');

QUnit.test('calling `inject` directly should error', function () {
  expectAssertion(function () {
    (0, _emberRuntimeInject2['default'])('foo');
  }, /Injected properties must be created through helpers/);
});

if (!EmberDev.runningProdBuild) {
  // this check is done via an assertion which is stripped from
  // production builds
  QUnit.test('injection type validation is run when first looked up', function () {
    expect(1);

    (0, _emberRuntimeInject.createInjectionHelper)('foo', function () {
      ok(true, 'should call validation method');
    });

    var registry = new _emberRuntimeSystemContainer.Registry();
    var container = registry.container();

    var AnObject = _emberRuntimeSystemObject2['default'].extend({
      container: container,
      bar: _emberRuntimeInject2['default'].foo(),
      baz: _emberRuntimeInject2['default'].foo()
    });

    registry.register('foo:main', AnObject);
    container.lookupFactory('foo:main');
  });
}

QUnit.test('attempting to inject a nonexistent container key should error', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();
  var AnObject = _emberRuntimeSystemObject2['default'].extend({
    container: container,
    foo: new _emberMetalInjected_property2['default']('bar', 'baz')
  });

  registry.register('foo:main', AnObject);

  throws(function () {
    container.lookup('foo:main');
  }, /Attempting to inject an unknown injection: `bar:baz`/);
});

QUnit.test('factories should return a list of lazy injection full names', function () {
  var AnObject = _emberRuntimeSystemObject2['default'].extend({
    foo: new _emberMetalInjected_property2['default']('foo', 'bar'),
    bar: new _emberMetalInjected_property2['default']('quux')
  });

  deepEqual(AnObject._lazyInjections(), { 'foo': 'foo:bar', 'bar': 'quux:bar' }, 'should return injected container keys');
});