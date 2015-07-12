'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemApplication = require('ember-runtime/system/application');

var _emberRuntimeSystemApplication2 = _interopRequireDefault(_emberRuntimeSystemApplication);

QUnit.module('Ember.Application');

QUnit.test('Ember.Application should be a subclass of Ember.Namespace', function () {

  ok(_emberRuntimeSystemNamespace2['default'].detect(_emberRuntimeSystemApplication2['default']), 'Ember.Application subclass of Ember.Namespace');
});