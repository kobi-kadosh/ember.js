'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalSet_properties = require('ember-metal/set_properties');

var _emberMetalSet_properties2 = _interopRequireDefault(_emberMetalSet_properties);

QUnit.module('Ember.setProperties');

QUnit.test('supports setting multiple attributes at once', function () {
  deepEqual((0, _emberMetalSet_properties2['default'])(null, null), null, 'noop for null properties and null object');
  deepEqual((0, _emberMetalSet_properties2['default'])(undefined, undefined), undefined, 'noop for undefined properties and undefined object');

  deepEqual((0, _emberMetalSet_properties2['default'])({}), undefined, 'noop for no properties');
  deepEqual((0, _emberMetalSet_properties2['default'])({}, undefined), undefined, 'noop for undefined');
  deepEqual((0, _emberMetalSet_properties2['default'])({}, null), null, 'noop for null');
  deepEqual((0, _emberMetalSet_properties2['default'])({}, NaN), NaN, 'noop for NaN');
  deepEqual((0, _emberMetalSet_properties2['default'])({}, {}), {}, 'meh');

  deepEqual((0, _emberMetalSet_properties2['default'])({}, { foo: 1 }), { foo: 1 }, 'Set a single property');

  deepEqual((0, _emberMetalSet_properties2['default'])({}, { foo: 1, bar: 1 }), { foo: 1, bar: 1 }, 'Set multiple properties');

  deepEqual((0, _emberMetalSet_properties2['default'])({ foo: 2, baz: 2 }, { foo: 1 }), { foo: 1 }, 'Set one of multiple properties');

  deepEqual((0, _emberMetalSet_properties2['default'])({ foo: 2, baz: 2 }, { bar: 2 }), {
    bar: 2
  }, 'Set an additional, previously unset property');
});