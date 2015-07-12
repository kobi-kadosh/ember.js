'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalInjected_property = require('ember-metal/injected_property');

var _emberMetalInjected_property2 = _interopRequireDefault(_emberMetalInjected_property);

QUnit.module('InjectedProperty');

QUnit.test('injected properties should be descriptors', function () {
  ok(new _emberMetalInjected_property2['default']() instanceof _emberMetalProperties.Descriptor);
});

QUnit.test('injected properties should be overridable', function () {
  var obj = {};
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', new _emberMetalInjected_property2['default']());

  (0, _emberMetalProperty_set.set)(obj, 'foo', 'bar');

  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'bar', 'should return the overriden value');
});

QUnit.test('getting on an object without a container should fail assertion', function () {
  var obj = {};
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', new _emberMetalInjected_property2['default']('type', 'name'));

  expectAssertion(function () {
    (0, _emberMetalProperty_get.get)(obj, 'foo');
  }, /Attempting to lookup an injected property on an object without a container, ensure that the object was instantiated via a container./);
});

QUnit.test('getting should return a lookup on the container', function () {
  expect(2);

  var obj = {
    container: {
      lookup: function lookup(key) {
        ok(true, 'should call container.lookup');
        return key;
      }
    }
  };
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', new _emberMetalInjected_property2['default']('type', 'name'));

  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'type:name', 'should return the value of container.lookup');
});

QUnit.test('omitting the lookup name should default to the property name', function () {
  var obj = {
    container: {
      lookup: function lookup(key) {
        return key;
      }
    }
  };
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', new _emberMetalInjected_property2['default']('type'));

  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'type:foo', 'should lookup the type using the property name');
});