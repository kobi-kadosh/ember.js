'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalGet_properties = require('ember-metal/get_properties');

var _emberMetalGet_properties2 = _interopRequireDefault(_emberMetalGet_properties);

QUnit.module('Ember.getProperties');

QUnit.test('can retrieve a hash of properties from an object via an argument list or array of property names', function () {
  var obj = {
    firstName: 'Steve',
    lastName: 'Jobs',
    companyName: 'Apple, Inc.'
  };

  deepEqual((0, _emberMetalGet_properties2['default'])(obj, 'firstName', 'lastName'), { firstName: 'Steve', lastName: 'Jobs' });
  deepEqual((0, _emberMetalGet_properties2['default'])(obj, 'firstName', 'lastName'), { firstName: 'Steve', lastName: 'Jobs' });
  deepEqual((0, _emberMetalGet_properties2['default'])(obj, 'lastName'), { lastName: 'Jobs' });
  deepEqual((0, _emberMetalGet_properties2['default'])(obj), {});
  deepEqual((0, _emberMetalGet_properties2['default'])(obj, ['firstName', 'lastName']), { firstName: 'Steve', lastName: 'Jobs' });
  deepEqual((0, _emberMetalGet_properties2['default'])(obj, ['firstName']), { firstName: 'Steve' });
  deepEqual((0, _emberMetalGet_properties2['default'])(obj, []), {});
});