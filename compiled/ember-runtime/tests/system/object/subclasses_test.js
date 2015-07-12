'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('system/object/subclasses');

QUnit.test('chains should copy forward to subclasses when prototype created', function () {
  var ObjectWithChains, objWithChains, SubWithChains, SubSub, subSub;
  (0, _emberMetalRun_loop2['default'])(function () {
    ObjectWithChains = _emberRuntimeSystemObject2['default'].extend({
      obj: {
        a: 'a',
        hi: 'hi'
      },
      aBinding: 'obj.a' // add chain
    });
    // realize prototype
    objWithChains = ObjectWithChains.create();
    // should not copy chains from parent yet
    SubWithChains = ObjectWithChains.extend({
      hiBinding: 'obj.hi', // add chain
      hello: (0, _emberMetalComputed.computed)(function () {
        return this.get('obj.hi') + ' world';
      }).property('hi'), // observe chain
      greetingBinding: 'hello'
    });
    SubSub = SubWithChains.extend();
    // should realize prototypes and copy forward chains
    subSub = SubSub.create();
  });
  equal(subSub.get('greeting'), 'hi world');
  (0, _emberMetalRun_loop2['default'])(function () {
    objWithChains.set('obj.hi', 'hello');
  });
  equal(subSub.get('greeting'), 'hello world');
});