'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('system/core_object/reopen');

QUnit.test('adds new properties to subclass instance', function () {

  var Subclass = _emberRuntimeSystemObject2['default'].extend();
  Subclass.reopen({
    foo: function foo() {
      return 'FOO';
    },
    bar: 'BAR'
  });

  equal(new Subclass().foo(), 'FOO', 'Adds method');
  equal((0, _emberMetalProperty_get.get)(new Subclass(), 'bar'), 'BAR', 'Adds property');
});

QUnit.test('reopened properties inherited by subclasses', function () {

  var Subclass = _emberRuntimeSystemObject2['default'].extend();
  var SubSub = Subclass.extend();

  Subclass.reopen({
    foo: function foo() {
      return 'FOO';
    },
    bar: 'BAR'
  });

  equal(new SubSub().foo(), 'FOO', 'Adds method');
  equal((0, _emberMetalProperty_get.get)(new SubSub(), 'bar'), 'BAR', 'Adds property');
});

QUnit.test('allows reopening already instantiated classes', function () {
  var Subclass = _emberRuntimeSystemObject2['default'].extend();

  Subclass.create();

  Subclass.reopen({
    trololol: true
  });

  equal(Subclass.create().get('trololol'), true, 'reopen works');
});