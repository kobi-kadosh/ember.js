'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesArray = require('ember-runtime/tests/suites/array');

var _emberRuntimeTestsSuitesMutable_arrayInsertAt = require('ember-runtime/tests/suites/mutable_array/insertAt');

var _emberRuntimeTestsSuitesMutable_arrayInsertAt2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayInsertAt);

var _emberRuntimeTestsSuitesMutable_arrayPopObject = require('ember-runtime/tests/suites/mutable_array/popObject');

var _emberRuntimeTestsSuitesMutable_arrayPopObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayPopObject);

var _emberRuntimeTestsSuitesMutable_arrayPushObject = require('ember-runtime/tests/suites/mutable_array/pushObject');

var _emberRuntimeTestsSuitesMutable_arrayPushObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayPushObject);

var _emberRuntimeTestsSuitesMutable_arrayPushObjects = require('ember-runtime/tests/suites/mutable_array/pushObjects');

var _emberRuntimeTestsSuitesMutable_arrayPushObjects2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayPushObjects);

var _emberRuntimeTestsSuitesMutable_arrayRemoveAt = require('ember-runtime/tests/suites/mutable_array/removeAt');

var _emberRuntimeTestsSuitesMutable_arrayRemoveAt2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayRemoveAt);

var _emberRuntimeTestsSuitesMutable_arrayReplace = require('ember-runtime/tests/suites/mutable_array/replace');

var _emberRuntimeTestsSuitesMutable_arrayReplace2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayReplace);

var _emberRuntimeTestsSuitesMutable_arrayShiftObject = require('ember-runtime/tests/suites/mutable_array/shiftObject');

var _emberRuntimeTestsSuitesMutable_arrayShiftObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayShiftObject);

var _emberRuntimeTestsSuitesMutable_arrayUnshiftObject = require('ember-runtime/tests/suites/mutable_array/unshiftObject');

var _emberRuntimeTestsSuitesMutable_arrayUnshiftObject2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayUnshiftObject);

var _emberRuntimeTestsSuitesMutable_arrayReverseObjects = require('ember-runtime/tests/suites/mutable_array/reverseObjects');

var _emberRuntimeTestsSuitesMutable_arrayReverseObjects2 = _interopRequireDefault(_emberRuntimeTestsSuitesMutable_arrayReverseObjects);

var MutableArrayTests = _emberRuntimeTestsSuitesArray.ArrayTests.extend();
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayInsertAt2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayPopObject2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayPushObject2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayPushObjects2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayRemoveAt2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayReplace2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayShiftObject2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayUnshiftObject2['default']);
MutableArrayTests.importModuleTests(_emberRuntimeTestsSuitesMutable_arrayReverseObjects2['default']);

exports['default'] = MutableArrayTests;
module.exports = exports['default'];