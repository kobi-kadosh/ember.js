/*globals Foo:true $foo:true */

'use strict';

var _emberMetalProperty_get = require('ember-metal/property_get');

var obj;
var moduleOpts = {
  setup: function setup() {
    obj = {
      foo: {
        bar: {
          baz: { biff: 'BIFF' }
        }
      },
      foothis: {
        bar: {
          baz: { biff: 'BIFF' }
        }
      },
      falseValue: false,
      emptyString: '',
      Wuz: {
        nar: 'foo'
      }
    };

    window.Foo = {
      bar: {
        baz: { biff: 'FooBiff' }
      }
    };

    window.aProp = 'aPropy';

    window.$foo = {
      bar: {
        baz: { biff: '$FOOBIFF' }
      }
    };
  },

  teardown: function teardown() {
    obj = undefined;
    window.Foo = undefined;
    window.aProp = undefined;
    window.$foo = undefined;
  }
};

QUnit.module('Ember.get with path', moduleOpts);

// ..........................................................
// LOCAL PATHS
//

QUnit.test('[obj, foo] -> obj.foo', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foo'), obj.foo);
});

QUnit.test('[obj, foo.bar] -> obj.foo.bar', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foo.bar'), obj.foo.bar);
});

QUnit.test('[obj, foothis.bar] -> obj.foothis.bar', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'foothis.bar'), obj.foothis.bar);
});

QUnit.test('[obj, this.foo] -> obj.foo', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'this.foo'), obj.foo);
});

QUnit.test('[obj, this.foo.bar] -> obj.foo.bar', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'this.foo.bar'), obj.foo.bar);
});

QUnit.test('[obj, this.Foo.bar] -> (undefined)', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'this.Foo.bar'), undefined);
});

QUnit.test('[obj, falseValue.notDefined] -> (undefined)', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'falseValue.notDefined'), undefined);
});

QUnit.test('[obj, emptyString.length] -> 0', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'emptyString.length'), 0);
});

// ..........................................................
// GLOBAL PATHS TREATED LOCAL WITH GET
//

QUnit.test('[obj, Wuz] -> obj.Wuz', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'Wuz'), obj.Wuz);
});

QUnit.test('[obj, Wuz.nar] -> obj.Wuz.nar', function () {
  deepEqual((0, _emberMetalProperty_get.get)(obj, 'Wuz.nar'), obj.Wuz.nar);
});

QUnit.test('[obj, Foo] -> (undefined)', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'Foo'), undefined);
});

QUnit.test('[obj, Foo.bar] -> (undefined)', function () {
  equal((0, _emberMetalProperty_get.get)(obj, 'Foo.bar'), undefined);
});

// ..........................................................
// NULL TARGET
//

QUnit.test('[null, Foo] -> Foo', function () {
  equal((0, _emberMetalProperty_get.get)(null, 'Foo'), Foo);
});

QUnit.test('[null, Foo.bar] -> Foo.bar', function () {
  deepEqual((0, _emberMetalProperty_get.get)(null, 'Foo.bar'), Foo.bar);
});

QUnit.test('[null, $foo] -> $foo', function () {
  equal((0, _emberMetalProperty_get.get)(null, '$foo'), window.$foo);
});

QUnit.test('[null, aProp] -> null', function () {
  equal((0, _emberMetalProperty_get.get)(null, 'aProp'), null);
});

// ..........................................................
// NO TARGET
//

QUnit.test('[Foo] -> Foo', function () {
  deepEqual((0, _emberMetalProperty_get.get)('Foo'), Foo);
});

QUnit.test('[aProp] -> aProp', function () {
  deepEqual((0, _emberMetalProperty_get.get)('aProp'), window.aProp);
});

QUnit.test('[Foo.bar] -> Foo.bar', function () {
  deepEqual((0, _emberMetalProperty_get.get)('Foo.bar'), Foo.bar);
});