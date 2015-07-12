'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('invoke');

suite.test('invoke should call on each object that implements', function () {
  var cnt, ary, obj;

  function F(amt) {
    cnt += amt === undefined ? 1 : amt;
  }
  cnt = 0;
  ary = [{ foo: F }, _emberRuntimeSystemObject2['default'].create({ foo: F }),

  // NOTE: does not impl foo - invoke should just skip
  _emberRuntimeSystemObject2['default'].create({ bar: F }), { foo: F }];

  obj = this.newObject(ary);
  obj.invoke('foo');
  equal(cnt, 3, 'should have invoked 3 times');

  cnt = 0;
  obj.invoke('foo', 2);
  equal(cnt, 6, 'should have invoked 3 times, passing param');
});

exports['default'] = suite;
module.exports = exports['default'];