'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var originalLookup, lookup;

QUnit.module('system/object/toString', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    lookup = _emberMetalCore2['default'].lookup = {};
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('toString() returns the same value if called twice', function () {
  var Foo = _emberRuntimeSystemNamespace2['default'].create();
  Foo.toString = function () {
    return 'Foo';
  };

  Foo.Bar = _emberRuntimeSystemObject2['default'].extend();

  equal(Foo.Bar.toString(), 'Foo.Bar');
  equal(Foo.Bar.toString(), 'Foo.Bar');

  var obj = Foo.Bar.create();

  equal(obj.toString(), '<Foo.Bar:' + (0, _emberMetalUtils.guidFor)(obj) + '>');
  equal(obj.toString(), '<Foo.Bar:' + (0, _emberMetalUtils.guidFor)(obj) + '>');

  equal(Foo.Bar.toString(), 'Foo.Bar');
});

QUnit.test('toString on a class returns a useful value when nested in a namespace', function () {
  var obj;

  var Foo = _emberRuntimeSystemNamespace2['default'].create();
  Foo.toString = function () {
    return 'Foo';
  };

  Foo.Bar = _emberRuntimeSystemObject2['default'].extend();
  equal(Foo.Bar.toString(), 'Foo.Bar');

  obj = Foo.Bar.create();
  equal(obj.toString(), '<Foo.Bar:' + (0, _emberMetalUtils.guidFor)(obj) + '>');

  Foo.Baz = Foo.Bar.extend();
  equal(Foo.Baz.toString(), 'Foo.Baz');

  obj = Foo.Baz.create();
  equal(obj.toString(), '<Foo.Baz:' + (0, _emberMetalUtils.guidFor)(obj) + '>');

  obj = Foo.Bar.create();
  equal(obj.toString(), '<Foo.Bar:' + (0, _emberMetalUtils.guidFor)(obj) + '>');
});

QUnit.test('toString on a namespace finds the namespace in Ember.lookup', function () {
  var Foo = lookup.Foo = _emberRuntimeSystemNamespace2['default'].create();

  equal(Foo.toString(), 'Foo');
});

QUnit.test('toString on a namespace finds the namespace in Ember.lookup', function () {
  var Foo = lookup.Foo = _emberRuntimeSystemNamespace2['default'].create();
  var obj;

  Foo.Bar = _emberRuntimeSystemObject2['default'].extend();

  equal(Foo.Bar.toString(), 'Foo.Bar');

  obj = Foo.Bar.create();
  equal(obj.toString(), '<Foo.Bar:' + (0, _emberMetalUtils.guidFor)(obj) + '>');
});

QUnit.test('toString on a namespace falls back to modulePrefix, if defined', function () {
  var Foo = _emberRuntimeSystemNamespace2['default'].create({ modulePrefix: 'foo' });

  equal(Foo.toString(), 'foo');
});

QUnit.test('toString includes toStringExtension if defined', function () {
  var Foo = _emberRuntimeSystemObject2['default'].extend({
    toStringExtension: function toStringExtension() {
      return 'fooey';
    }
  });
  var foo = Foo.create();
  var Bar = _emberRuntimeSystemObject2['default'].extend({});
  var bar = Bar.create();

  // simulate these classes being defined on a Namespace
  Foo[_emberMetalUtils.GUID_KEY + '_name'] = 'Foo';
  Bar[_emberMetalUtils.GUID_KEY + '_name'] = 'Bar';

  equal(bar.toString(), '<Bar:' + (0, _emberMetalUtils.guidFor)(bar) + '>', 'does not include toStringExtension part');
  equal(foo.toString(), '<Foo:' + (0, _emberMetalUtils.guidFor)(foo) + ':fooey>', 'Includes toStringExtension result');
});