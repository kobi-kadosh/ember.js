'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var _emberRuntimeTestsSuitesCopyableCopy = require('ember-runtime/tests/suites/copyable/copy');

var _emberRuntimeTestsSuitesCopyableCopy2 = _interopRequireDefault(_emberRuntimeTestsSuitesCopyableCopy);

var _emberRuntimeTestsSuitesCopyableFrozenCopy = require('ember-runtime/tests/suites/copyable/frozenCopy');

var _emberRuntimeTestsSuitesCopyableFrozenCopy2 = _interopRequireDefault(_emberRuntimeTestsSuitesCopyableFrozenCopy);

var CopyableTests = _emberRuntimeTestsSuitesSuite.Suite.extend({

  /*
    __Required.__ You must implement this method to apply this mixin.
      Must be able to create a new object for testing.
      @returns {Object} object
  */
  newObject: null,

  /*
    __Required.__ You must implement this method to apply this mixin.
      Compares the two passed in objects.  Returns true if the two objects
    are logically equivalent.
      @param {Object} a
      First object
      @param {Object} b
      Second object
      @returns {Boolean}
  */
  isEqual: null,

  /*
    Set this to true if you expect the objects you test to be freezable.
    The suite will verify that your objects actually match this.  (i.e. if
    you say you can't test freezable it will verify that your objects really
    aren't freezable.)
      @type Boolean
  */
  shouldBeFreezable: false

});

CopyableTests.importModuleTests(_emberRuntimeTestsSuitesCopyableCopy2['default']);
CopyableTests.importModuleTests(_emberRuntimeTestsSuitesCopyableFrozenCopy2['default']);

exports['default'] = CopyableTests;
module.exports = exports['default'];