'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/run_loop/run_test');

QUnit.test('Ember.run invokes passed function, returning value', function () {
  var obj = {
    foo: function foo() {
      return [this.bar, 'FOO'];
    },
    bar: 'BAR',
    checkArgs: function checkArgs(arg1, arg2) {
      return [arg1, this.bar, arg2];
    }
  };

  equal((0, _emberMetalRun_loop2['default'])(function () {
    return 'FOO';
  }), 'FOO', 'pass function only');
  deepEqual((0, _emberMetalRun_loop2['default'])(obj, obj.foo), ['BAR', 'FOO'], 'pass obj and obj.method');
  deepEqual((0, _emberMetalRun_loop2['default'])(obj, 'foo'), ['BAR', 'FOO'], 'pass obj and "method"');
  deepEqual((0, _emberMetalRun_loop2['default'])(obj, obj.checkArgs, 'hello', 'world'), ['hello', 'BAR', 'world'], 'pass obj, obj.method, and extra arguments');
});