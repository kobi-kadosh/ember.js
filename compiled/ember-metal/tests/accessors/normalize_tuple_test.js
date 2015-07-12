/*globals Foo:true, $foo:true */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var obj;
var moduleOpts = {
  setup: function setup() {
    obj = {
      foo: {
        bar: {
          baz: {}
        }
      }
    };

    window.Foo = {
      bar: {
        baz: {}
      }
    };

    window.$foo = {
      bar: {
        baz: {}
      }
    };
  },

  teardown: function teardown() {
    obj = undefined;
    window.Foo = undefined;
    window.$foo = undefined;
  }
};

QUnit.module('normalizeTuple', moduleOpts);

// ..........................................................
// LOCAL PATHS
//

QUnit.test('[obj, foo] -> [obj, foo]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'foo'), [obj, 'foo']);
});

QUnit.test('[obj, *] -> [obj, *]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, '*'), [obj, '*']);
});

QUnit.test('[obj, foo.bar] -> [obj, foo.bar]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'foo.bar'), [obj, 'foo.bar']);
});

QUnit.test('[obj, foo.*] -> [obj, foo.*]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'foo.*'), [obj, 'foo.*']);
});

QUnit.test('[obj, foo.*.baz] -> [obj, foo.*.baz]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'foo.*.baz'), [obj, 'foo.*.baz']);
});

QUnit.test('[obj, this.foo] -> [obj, foo]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'this.foo'), [obj, 'foo']);
});

QUnit.test('[obj, this.foo.bar] -> [obj, foo.bar]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'this.foo.bar'), [obj, 'foo.bar']);
});

QUnit.test('[obj, this.Foo.bar] -> [obj, Foo.bar]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'this.Foo.bar'), [obj, 'Foo.bar']);
});

// ..........................................................
// GLOBAL PATHS
//

QUnit.test('[obj, Foo] -> [Ember.lookup, Foo]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'Foo'), [_emberMetalCore2['default'].lookup, 'Foo']);
});

QUnit.test('[obj, Foo.bar] -> [Foo, bar]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, 'Foo.bar'), [Foo, 'bar']);
});

QUnit.test('[obj, $foo.bar.baz] -> [$foo, bar.baz]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(obj, '$foo.bar.baz'), [$foo, 'bar.baz']);
});

// ..........................................................
// NO TARGET
//

QUnit.test('[null, Foo] -> [Ember.lookup, Foo]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(null, 'Foo'), [_emberMetalCore2['default'].lookup, 'Foo']);
});

QUnit.test('[null, Foo.bar] -> [Foo, bar]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(null, 'Foo.bar'), [Foo, 'bar']);
});

QUnit.test('[null, foo] -> [undefined, \'\']', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(null, 'foo'), [undefined, '']);
});

QUnit.test('[null, foo.bar] -> [undefined, \'\']', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(null, 'foo'), [undefined, '']);
});

QUnit.test('[null, $foo] -> [Ember.lookup, $foo]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(null, '$foo'), [_emberMetalCore2['default'].lookup, '$foo']);
});

QUnit.test('[null, $foo.bar] -> [$foo, bar]', function () {
  deepEqual((0, _emberMetalProperty_get.normalizeTuple)(null, '$foo.bar'), [$foo, 'bar']);
});