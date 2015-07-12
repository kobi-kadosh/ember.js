'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var originalLookup = _emberMetalCore2['default'].lookup;

var obj;
function commonSetup() {
  obj = {
    foo: {
      bar: {
        baz: { biff: 'BIFF' }
      }
    }
  };

  _emberMetalCore2['default'].lookup = {
    Foo: {
      bar: {
        baz: { biff: 'FooBiff' }
      }
    },

    $foo: {
      bar: {
        baz: { biff: '$FOOBIFF' }
      }
    }
  };
}

function commonTeardown() {
  obj = null;
  _emberMetalCore2['default'].lookup = originalLookup;
}

QUnit.module('set with path', {
  setup: commonSetup,
  teardown: commonTeardown
});

QUnit.test('[Foo, bar] -> Foo.bar', function () {
  _emberMetalCore2['default'].lookup.Foo = { toString: function toString() {
      return 'Foo';
    } }; // Behave like an Ember.Namespace

  (0, _emberMetalProperty_set.set)(_emberMetalCore2['default'].lookup.Foo, 'bar', 'baz');
  equal((0, _emberMetalProperty_get.get)(_emberMetalCore2['default'].lookup.Foo, 'bar'), 'baz');
});

// ..........................................................
//
// LOCAL PATHS

QUnit.test('[obj, foo] -> obj.foo', function () {
  (0, _emberMetalProperty_set.set)(obj, 'foo', 'BAM');
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'BAM');
});

QUnit.test('[obj, foo.bar] -> obj.foo.bar', function () {
  (0, _emberMetalProperty_set.set)(obj, 'foo.bar', 'BAM');
  equal((0, _emberMetalProperty_get.get)(obj, 'foo.bar'), 'BAM');
});

QUnit.test('[obj, this.foo] -> obj.foo', function () {
  (0, _emberMetalProperty_set.set)(obj, 'this.foo', 'BAM');
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'BAM');
});

QUnit.test('[obj, this.foo.bar] -> obj.foo.bar', function () {
  (0, _emberMetalProperty_set.set)(obj, 'this.foo.bar', 'BAM');
  equal((0, _emberMetalProperty_get.get)(obj, 'foo.bar'), 'BAM');
});

// ..........................................................
// NO TARGET
//

QUnit.test('[null, Foo.bar] -> Foo.bar', function () {
  (0, _emberMetalProperty_set.set)(null, 'Foo.bar', 'BAM');
  equal((0, _emberMetalProperty_get.get)(_emberMetalCore2['default'].lookup.Foo, 'bar'), 'BAM');
});

// ..........................................................
// DEPRECATED
//

QUnit.module('set with path - deprecated', {
  setup: commonSetup,
  teardown: commonTeardown
});

QUnit.test('[null, bla] gives a proper exception message', function () {
  expectAssertion(function () {
    (0, _emberMetalProperty_set.set)(null, 'bla', 'BAM');
  }, /You need to provide an object and key to `set`/);
});

QUnit.test('[obj, bla.bla] gives a proper exception message', function () {
  var exceptionMessage = 'Property set failed: object in path "bla" could not be found or was destroyed.';
  try {
    (0, _emberMetalProperty_set.set)(obj, 'bla.bla', 'BAM');
  } catch (ex) {
    equal(ex.message, exceptionMessage);
  }
});

QUnit.test('[obj, foo.baz.bat] -> EXCEPTION', function () {
  throws(function () {
    (0, _emberMetalProperty_set.set)(obj, 'foo.baz.bat', 'BAM');
  }, Error);
});

QUnit.test('[obj, foo.baz.bat] -> EXCEPTION', function () {
  (0, _emberMetalProperty_set.trySet)(obj, 'foo.baz.bat', 'BAM');
  ok(true, 'does not raise');
});