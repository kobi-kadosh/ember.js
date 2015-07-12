'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesEnumerable = require('ember-runtime/tests/suites/enumerable');

var _emberRuntimeTestsSuitesArrayIndexOf = require('ember-runtime/tests/suites/array/indexOf');

var _emberRuntimeTestsSuitesArrayIndexOf2 = _interopRequireDefault(_emberRuntimeTestsSuitesArrayIndexOf);

var _emberRuntimeTestsSuitesArrayLastIndexOf = require('ember-runtime/tests/suites/array/lastIndexOf');

var _emberRuntimeTestsSuitesArrayLastIndexOf2 = _interopRequireDefault(_emberRuntimeTestsSuitesArrayLastIndexOf);

var _emberRuntimeTestsSuitesArrayObjectAt = require('ember-runtime/tests/suites/array/objectAt');

var _emberRuntimeTestsSuitesArrayObjectAt2 = _interopRequireDefault(_emberRuntimeTestsSuitesArrayObjectAt);

var ObserverClass = _emberRuntimeTestsSuitesEnumerable.ObserverClass.extend({

  observeArray: function observeArray(obj) {
    obj.addArrayObserver(this);
    return this;
  },

  stopObserveArray: function stopObserveArray(obj) {
    obj.removeArrayObserver(this);
    return this;
  },

  arrayWillChange: function arrayWillChange() {
    equal(this._before, null, 'should only call once');
    this._before = Array.prototype.slice.call(arguments);
  },

  arrayDidChange: function arrayDidChange() {
    equal(this._after, null, 'should only call once');
    this._after = Array.prototype.slice.call(arguments);
  }

});

var ArrayTests = _emberRuntimeTestsSuitesEnumerable.EnumerableTests.extend({

  observerClass: ObserverClass

});

ArrayTests.ObserverClass = ObserverClass;

ArrayTests.importModuleTests(_emberRuntimeTestsSuitesArrayIndexOf2['default']);
ArrayTests.importModuleTests(_emberRuntimeTestsSuitesArrayLastIndexOf2['default']);
ArrayTests.importModuleTests(_emberRuntimeTestsSuitesArrayObjectAt2['default']);

exports.ArrayTests = ArrayTests;
exports.ObserverClass = ObserverClass;