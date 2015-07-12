'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var originalLookup, lookup;

QUnit.module('Namespace', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].BOOTED = false;

    lookup = _emberMetalCore2['default'].lookup = {};
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].BOOTED = false;

    for (var prop in lookup) {
      if (lookup[prop]) {
        (0, _emberMetalRun_loop2['default'])(lookup[prop], 'destroy');
      }
    }

    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('Namespace should be a subclass of EmberObject', function () {
  ok(_emberRuntimeSystemObject2['default'].detect(_emberRuntimeSystemNamespace2['default']));
});

QUnit.test('Namespace should be duck typed', function () {
  ok((0, _emberMetalProperty_get.get)(_emberRuntimeSystemNamespace2['default'].create(), 'isNamespace'), 'isNamespace property is true');
});

QUnit.test('Namespace is found and named', function () {
  var nsA = lookup.NamespaceA = _emberRuntimeSystemNamespace2['default'].create();
  equal(nsA.toString(), 'NamespaceA', 'namespaces should have a name if they are on lookup');

  var nsB = lookup.NamespaceB = _emberRuntimeSystemNamespace2['default'].create();
  equal(nsB.toString(), 'NamespaceB', 'namespaces work if created after the first namespace processing pass');
});

QUnit.test('Classes under an Namespace are properly named', function () {
  var nsA = lookup.NamespaceA = _emberRuntimeSystemNamespace2['default'].create();
  nsA.Foo = _emberRuntimeSystemObject2['default'].extend();
  equal(nsA.Foo.toString(), 'NamespaceA.Foo', 'Classes pick up their parent namespace');

  nsA.Bar = _emberRuntimeSystemObject2['default'].extend();
  equal(nsA.Bar.toString(), 'NamespaceA.Bar', 'New Classes get the naming treatment too');

  var nsB = lookup.NamespaceB = _emberRuntimeSystemNamespace2['default'].create();
  nsB.Foo = _emberRuntimeSystemObject2['default'].extend();
  equal(nsB.Foo.toString(), 'NamespaceB.Foo', 'Classes in new namespaces get the naming treatment');
});

//test("Classes under Ember are properly named", function() {
//  // ES6TODO: This test does not work reliably when running independent package build with Broccoli config.
//  Ember.TestObject = EmberObject.extend({});
//  equal(Ember.TestObject.toString(), "Ember.TestObject", "class under Ember is given a string representation");
//});

QUnit.test('Lowercase namespaces are no longer supported', function () {
  var nsC = lookup.namespaceC = _emberRuntimeSystemNamespace2['default'].create();
  equal(nsC.toString(), undefined);
});

QUnit.test('A namespace can be assigned a custom name', function () {
  var nsA = _emberRuntimeSystemNamespace2['default'].create({
    name: 'NamespaceA'
  });

  var nsB = lookup.NamespaceB = _emberRuntimeSystemNamespace2['default'].create({
    name: 'CustomNamespaceB'
  });

  nsA.Foo = _emberRuntimeSystemObject2['default'].extend();
  nsB.Foo = _emberRuntimeSystemObject2['default'].extend();

  equal(nsA.Foo.toString(), 'NamespaceA.Foo', 'The namespace\'s name is used when the namespace is not in the lookup object');
  equal(nsB.Foo.toString(), 'CustomNamespaceB.Foo', 'The namespace\'s name is used when the namespace is in the lookup object');
});

QUnit.test('Calling namespace.nameClasses() eagerly names all classes', function () {
  _emberMetalCore2['default'].BOOTED = true;

  var namespace = lookup.NS = _emberRuntimeSystemNamespace2['default'].create();

  namespace.ClassA = _emberRuntimeSystemObject2['default'].extend();
  namespace.ClassB = _emberRuntimeSystemObject2['default'].extend();

  _emberRuntimeSystemNamespace2['default'].processAll();

  equal(namespace.ClassA.toString(), 'NS.ClassA');
  equal(namespace.ClassB.toString(), 'NS.ClassB');
});

QUnit.test('A namespace can be looked up by its name', function () {
  var NS = lookup.NS = _emberRuntimeSystemNamespace2['default'].create();
  var UI = lookup.UI = _emberRuntimeSystemNamespace2['default'].create();
  var CF = lookup.CF = _emberRuntimeSystemNamespace2['default'].create();

  equal(_emberRuntimeSystemNamespace2['default'].byName('NS'), NS);
  equal(_emberRuntimeSystemNamespace2['default'].byName('UI'), UI);
  equal(_emberRuntimeSystemNamespace2['default'].byName('CF'), CF);
});

QUnit.test('A nested namespace can be looked up by its name', function () {
  var UI = lookup.UI = _emberRuntimeSystemNamespace2['default'].create();
  UI.Nav = _emberRuntimeSystemNamespace2['default'].create();

  equal(_emberRuntimeSystemNamespace2['default'].byName('UI.Nav'), UI.Nav);
});

QUnit.test('Destroying a namespace before caching lookup removes it from the list of namespaces', function () {
  var CF = lookup.CF = _emberRuntimeSystemNamespace2['default'].create();

  (0, _emberMetalRun_loop2['default'])(CF, 'destroy');
  equal(_emberRuntimeSystemNamespace2['default'].byName('CF'), undefined, 'namespace can not be found after destroyed');
});

QUnit.test('Destroying a namespace after looking up removes it from the list of namespaces', function () {
  var CF = lookup.CF = _emberRuntimeSystemNamespace2['default'].create();

  equal(_emberRuntimeSystemNamespace2['default'].byName('CF'), CF, 'precondition - namespace can be looked up by name');

  (0, _emberMetalRun_loop2['default'])(CF, 'destroy');
  equal(_emberRuntimeSystemNamespace2['default'].byName('CF'), undefined, 'namespace can not be found after destroyed');
});