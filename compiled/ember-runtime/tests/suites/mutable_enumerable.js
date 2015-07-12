'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesEnumerable = require('ember-runtime/tests/suites/enumerable');

var _emberRuntimeTestsSuitesMutable_enumerableAddObject = require('ember-runtime/tests/suites/mutable_enumerable/addObject');

var _emberRuntimeTestsSuitesMutable_enumerableAddObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_enumerableAddObject);

var _emberRuntimeTestsSuitesMutable_enumerableRemoveObject = require('ember-runtime/tests/suites/mutable_enumerable/removeObject');

var _emberRuntimeTestsSuitesMutable_enumerableRemoveObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_enumerableRemoveObject);

var _emberRuntimeTestsSuitesMutable_enumerableRemoveObjects = require('ember-runtime/tests/suites/mutable_enumerable/removeObjects');

var _emberRuntimeTestsSuitesMutable_enumerableRemoveObjects2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_enumerableRemoveObjects);

var MutableEnumerableTests = _emberRuntimeTestsSuitesEnumerable.EnumerableTests.extend();
MutableEnumerableTests.importModuleTests(_emberRuntimeTestsSuitesMutable_enumerableAddObject2['default']);
MutableEnumerableTests.importModuleTests(_emberRuntimeTestsSuitesMutable_enumerableRemoveObject2['default']);
MutableEnumerableTests.importModuleTests(_emberRuntimeTestsSuitesMutable_enumerableRemoveObjects2['default']);

exports['default'] = MutableEnumerableTests;
module.exports = exports['default'];