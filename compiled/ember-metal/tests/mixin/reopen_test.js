'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_get2 = _interopRequireDefault(_emberMetalProperty_get);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalMixin2 = _interopRequireDefault(_emberMetalMixin);

QUnit.module('Ember.Mixin#reopen');

QUnit.test('using reopen() to add more properties to a simple', function () {
  var MixinA = _emberMetalMixin2['default'].create({ foo: 'FOO', baz: 'BAZ' });
  MixinA.reopen({ bar: 'BAR', foo: 'FOO2' });
  var obj = {};
  MixinA.apply(obj);

  equal((0, _emberMetalProperty_get2['default'])(obj, 'foo'), 'FOO2', 'mixin() should override');
  equal((0, _emberMetalProperty_get2['default'])(obj, 'baz'), 'BAZ', 'preserve MixinA props');
  equal((0, _emberMetalProperty_get2['default'])(obj, 'bar'), 'BAR', 'include MixinB props');
});

QUnit.test('using reopen() and calling _super where there is not a super function does not cause infinite recursion', function () {
  var Taco = _emberRuntimeSystemObject2['default'].extend({
    createBreakfast: function createBreakfast() {
      // There is no original createBreakfast function.
      // Calling the wrapped _super function here
      // used to end in an infinite call loop
      this._super.apply(this, arguments);
      return 'Breakfast!';
    }
  });

  Taco.reopen({
    createBreakfast: function createBreakfast() {
      return this._super.apply(this, arguments);
    }
  });

  var taco = Taco.create();

  var result;
  (0, _emberMetalRun_loop2['default'])(function () {
    try {
      result = taco.createBreakfast();
    } catch (e) {
      result = 'Your breakfast was interrupted by an infinite stack error.';
    }
  });

  equal(result, 'Breakfast!');
});