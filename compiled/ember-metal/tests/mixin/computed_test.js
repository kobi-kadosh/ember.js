'use strict';

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperties = require('ember-metal/properties');

function K() {
  return this;
}

QUnit.module('Mixin Computed Properties');

QUnit.test('overriding computed properties', function () {
  var MixinA, MixinB, MixinC, MixinD;
  var obj;

  MixinA = _emberMetalMixin.Mixin.create({
    aProp: (0, _emberMetalComputed.computed)(function () {
      return 'A';
    })
  });

  MixinB = _emberMetalMixin.Mixin.create(MixinA, {
    aProp: (0, _emberMetalComputed.computed)(function () {
      return this._super.apply(this, arguments) + 'B';
    })
  });

  MixinC = _emberMetalMixin.Mixin.create(MixinA, {
    aProp: (0, _emberMetalComputed.computed)(function () {
      return this._super.apply(this, arguments) + 'C';
    })
  });

  MixinD = _emberMetalMixin.Mixin.create({
    aProp: (0, _emberMetalComputed.computed)(function () {
      return this._super.apply(this, arguments) + 'D';
    })
  });

  obj = {};
  MixinB.apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'aProp'), 'AB', 'should expose super for B');

  obj = {};
  MixinC.apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'aProp'), 'AC', 'should expose super for C');

  obj = {};

  MixinA.apply(obj);
  MixinD.apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'aProp'), 'AD', 'should define super for D');

  obj = {};
  (0, _emberMetalProperties.defineProperty)(obj, 'aProp', (0, _emberMetalComputed.computed)(function (key) {
    return 'obj';
  }));
  MixinD.apply(obj);
  equal((0, _emberMetalProperty_get.get)(obj, 'aProp'), 'objD', 'should preserve original computed property');
});

QUnit.test('calling set on overridden computed properties', function () {
  var SuperMixin, SubMixin;
  var obj;

  var superGetOccurred = false;
  var superSetOccurred = false;

  SuperMixin = _emberMetalMixin.Mixin.create({
    aProp: (0, _emberMetalComputed.computed)({
      get: function get(key) {
        superGetOccurred = true;
      },
      set: function set(key, value) {
        superSetOccurred = true;
      }
    })
  });

  SubMixin = _emberMetalMixin.Mixin.create(SuperMixin, {
    aProp: (0, _emberMetalComputed.computed)({
      get: function get(key) {
        return this._super.apply(this, arguments);
      },
      set: function set(key, value) {
        return this._super.apply(this, arguments);
      }
    })
  });

  obj = {};
  SubMixin.apply(obj);

  (0, _emberMetalProperty_set.set)(obj, 'aProp', 'set thyself');
  ok(superSetOccurred, 'should pass set to _super');

  superSetOccurred = false; // reset the set assertion

  obj = {};
  SubMixin.apply(obj);

  (0, _emberMetalProperty_get.get)(obj, 'aProp');
  ok(superGetOccurred, 'should pass get to _super');

  (0, _emberMetalProperty_set.set)(obj, 'aProp', 'set thyself');
  ok(superSetOccurred, 'should pass set to _super after getting');
});

QUnit.test('setter behavior works properly when overriding computed properties', function () {
  var obj = {};

  var MixinA = _emberMetalMixin.Mixin.create({
    cpWithSetter2: (0, _emberMetalComputed.computed)(K),
    cpWithSetter3: (0, _emberMetalComputed.computed)(K),
    cpWithoutSetter: (0, _emberMetalComputed.computed)(K)
  });

  var cpWasCalled = false;

  var MixinB = _emberMetalMixin.Mixin.create({
    cpWithSetter2: (0, _emberMetalComputed.computed)({
      get: K,
      set: function set(k, v) {
        cpWasCalled = true;
      }
    }),

    cpWithSetter3: (0, _emberMetalComputed.computed)({
      get: K,
      set: function set(k, v) {
        cpWasCalled = true;
      }
    }),

    cpWithoutSetter: (0, _emberMetalComputed.computed)(function (k) {
      cpWasCalled = true;
    })
  });

  MixinA.apply(obj);
  MixinB.apply(obj);

  (0, _emberMetalProperty_set.set)(obj, 'cpWithSetter2', 'test');
  ok(cpWasCalled, 'The computed property setter was called when defined with two args');
  cpWasCalled = false;

  (0, _emberMetalProperty_set.set)(obj, 'cpWithSetter3', 'test');
  ok(cpWasCalled, 'The computed property setter was called when defined with three args');
  cpWasCalled = false;

  (0, _emberMetalProperty_set.set)(obj, 'cpWithoutSetter', 'test');
  equal((0, _emberMetalProperty_get.get)(obj, 'cpWithoutSetter'), 'test', 'The default setter was called, the value is correct');
  ok(!cpWasCalled, 'The default setter was called, not the CP itself');
});