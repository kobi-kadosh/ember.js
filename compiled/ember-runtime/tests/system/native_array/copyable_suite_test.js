'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeTestsSuitesCopyable = require('ember-runtime/tests/suites/copyable');

var _emberRuntimeTestsSuitesCopyable2 = _interopRequireDefault(_emberRuntimeTestsSuitesCopyable);

_emberRuntimeTestsSuitesCopyable2['default'].extend({
  name: 'NativeArray Copyable',

  newObject: function newObject() {
    return _emberMetalCore2['default'].A([(0, _emberMetalUtils.generateGuid)()]);
  },

  isEqual: function isEqual(a, b) {
    if (!(a instanceof Array)) {
      return false;
    }

    if (!(b instanceof Array)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    return a[0] === b[0];
  },

  shouldBeFreezable: false
}).run();

QUnit.module('NativeArray Copyable');

QUnit.test('deep copy is respected', function () {
  var array = _emberMetalCore2['default'].A([{ id: 1 }, { id: 2 }, { id: 3 }]);

  var copiedArray = array.copy(true);

  deepEqual(copiedArray, array, 'copied array is equivalent');
  ok(copiedArray[0] !== array[0], 'objects inside should be unique');
});