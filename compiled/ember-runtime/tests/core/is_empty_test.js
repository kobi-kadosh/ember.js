'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalIs_empty = require('ember-metal/is_empty');

var _emberMetalIs_empty2 = _interopRequireDefault(_emberMetalIs_empty);

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

QUnit.module('Ember.isEmpty');

QUnit.test('Ember.isEmpty', function () {
  var arrayProxy = _emberRuntimeSystemArray_proxy2['default'].create({ content: _emberMetalCore2['default'].A() });

  equal(true, (0, _emberMetalIs_empty2['default'])(arrayProxy), 'for an ArrayProxy that has empty content');
});