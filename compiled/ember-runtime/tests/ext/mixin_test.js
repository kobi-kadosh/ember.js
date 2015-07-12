'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalBinding = require('ember-metal/binding');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/mixin/binding_test');

QUnit.test('Defining a property ending in Binding should setup binding when applied', function () {

  var MyMixin = _emberMetalMixin.Mixin.create({
    fooBinding: 'bar.baz'
  });

  var obj = { bar: { baz: 'BIFF' } };

  (0, _emberMetalRun_loop2['default'])(function () {
    MyMixin.apply(obj);
  });

  ok((0, _emberMetalProperty_get.get)(obj, 'fooBinding') instanceof _emberMetalBinding.Binding, 'should be a binding object');
  equal((0, _emberMetalProperty_get.get)(obj, 'foo'), 'BIFF', 'binding should be created and synced');
});

QUnit.test('Defining a property ending in Binding should apply to prototype children', function () {
  var MyMixin, obj, obj2;

  (0, _emberMetalRun_loop2['default'])(function () {
    MyMixin = _emberMetalMixin.Mixin.create({
      fooBinding: 'bar.baz'
    });
  });

  obj = { bar: { baz: 'BIFF' } };

  (0, _emberMetalRun_loop2['default'])(function () {
    MyMixin.apply(obj);
  });

  obj2 = Object.create(obj);
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)((0, _emberMetalProperty_get.get)(obj2, 'bar'), 'baz', 'BARG');
  });

  ok((0, _emberMetalProperty_get.get)(obj2, 'fooBinding') instanceof _emberMetalBinding.Binding, 'should be a binding object');
  equal((0, _emberMetalProperty_get.get)(obj2, 'foo'), 'BARG', 'binding should be created and synced');
});