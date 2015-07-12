'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

// used by unit tests to test both accessor mode and non-accessor mode
var testBoth = function testBoth(testname, callback) {

  function emberget(x, y) {
    return (0, _emberMetalProperty_get.get)(x, y);
  }
  function emberset(x, y, z) {
    return (0, _emberMetalProperty_set.set)(x, y, z);
  }
  function aget(x, y) {
    return x[y];
  }
  function aset(x, y, z) {
    return x[y] = z;
  }

  QUnit.test(testname + ' using getFromEmberMetal()/Ember.set()', function () {
    callback(emberget, emberset);
  });

  QUnit.test(testname + ' using accessors', function () {
    if (_emberMetalCore2['default'].USES_ACCESSORS) {
      callback(aget, aset);
    } else {
      ok('SKIPPING ACCESSORS');
    }
  });
};

var testWithDefault = function testWithDefault(testname, callback) {
  function emberget(x, y) {
    return (0, _emberMetalProperty_get.get)(x, y);
  }
  function embergetwithdefault(x, y, z) {
    return (0, _emberMetalProperty_get.getWithDefault)(x, y, z);
  }
  function getwithdefault(x, y, z) {
    return x.getWithDefault(y, z);
  }
  function emberset(x, y, z) {
    return (0, _emberMetalProperty_set.set)(x, y, z);
  }
  function aget(x, y) {
    return x[y];
  }
  function aset(x, y, z) {
    return x[y] = z;
  }

  QUnit.test(testname + ' using obj.get()', function () {
    callback(emberget, emberset);
  });

  QUnit.test(testname + ' using obj.getWithDefault()', function () {
    callback(getwithdefault, emberset);
  });

  QUnit.test(testname + ' using getFromEmberMetal()', function () {
    callback(emberget, emberset);
  });

  QUnit.test(testname + ' using Ember.getWithDefault()', function () {
    callback(embergetwithdefault, emberset);
  });

  QUnit.test(testname + ' using accessors', function () {
    if (_emberMetalCore2['default'].USES_ACCESSORS) {
      callback(aget, aset);
    } else {
      ok('SKIPPING ACCESSORS');
    }
  });
};

exports.testWithDefault = testWithDefault;
exports.testBoth = testBoth;