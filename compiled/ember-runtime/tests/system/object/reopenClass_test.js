'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('system/object/reopenClass');

QUnit.test('adds new properties to subclass', function () {

  var Subclass = _emberRuntimeSystemObject2['default'].extend();
  Subclass.reopenClass({
    foo: function foo() {
      return 'FOO';
    },
    bar: 'BAR'
  });

  equal(Subclass.foo(), 'FOO', 'Adds method');
  equal((0, _emberMetalProperty_get.get)(Subclass, 'bar'), 'BAR', 'Adds property');
});

QUnit.test('class properties inherited by subclasses', function () {

  var Subclass = _emberRuntimeSystemObject2['default'].extend();
  Subclass.reopenClass({
    foo: function foo() {
      return 'FOO';
    },
    bar: 'BAR'
  });

  var SubSub = Subclass.extend();

  equal(SubSub.foo(), 'FOO', 'Adds method');
  equal((0, _emberMetalProperty_get.get)(SubSub, 'bar'), 'BAR', 'Adds property');
});