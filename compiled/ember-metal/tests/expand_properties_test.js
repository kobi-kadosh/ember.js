'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalExpand_properties = require('ember-metal/expand_properties');

var _emberMetalExpand_properties2 = _interopRequireDefault(_emberMetalExpand_properties);

var foundProperties = [];

function addProperty(property) {
  foundProperties.push(property);
}

QUnit.module('Property Brace Expansion Test', {
  setup: function setup() {
    foundProperties = [];
  }
});

QUnit.test('Properties without expansions are unaffected', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('a', addProperty);
  (0, _emberMetalExpand_properties2['default'])('a.b', addProperty);
  (0, _emberMetalExpand_properties2['default'])('a.b.@each', addProperty);

  deepEqual(['a', 'a.b', 'a.b.@each'].sort(), foundProperties.sort());
});

QUnit.test('A single expansion at the end expands properly', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('a.b.{c,d}', addProperty);

  deepEqual(['a.b.c', 'a.b.d'].sort(), foundProperties.sort());
});

QUnit.test('A property with only a brace expansion expands correctly', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('{a,b,c}', addProperty);

  var expected = ['a', 'b', 'c'];
  deepEqual(expected.sort(), foundProperties.sort());
});

QUnit.test('Expansions with single properties only expand once', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('a.b.{c}.d.{e}', addProperty);

  deepEqual(['a.b.c.d.e'], foundProperties);
});

QUnit.test('A single brace expansion expands correctly', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('a.{b,c,d}.e', addProperty);

  var expected = ['a.b.e', 'a.c.e', 'a.d.e'];
  deepEqual(expected.sort(), foundProperties.sort());
});

QUnit.test('Multiple brace expansions work correctly', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('{a,b,c}.d.{e,f}.g', addProperty);

  var expected = ['a.d.e.g', 'a.d.f.g', 'b.d.e.g', 'b.d.f.g', 'c.d.e.g', 'c.d.f.g'];
  deepEqual(expected.sort(), foundProperties.sort());
});

QUnit.test('A property with only brace expansions expands correctly', function () {
  expect(1);

  (0, _emberMetalExpand_properties2['default'])('{a,b,c}.{d}.{e,f}', addProperty);

  var expected = ['a.d.e', 'a.d.f', 'b.d.e', 'b.d.f', 'c.d.e', 'c.d.f'];
  deepEqual(expected.sort(), foundProperties.sort());
});