'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('strict mode tests');

QUnit.test('__superWrapper does not throw errors in strict mode', function () {
  var Foo = _emberRuntimeSystemObject2['default'].extend({
    blah: function blah() {
      return 'foo';
    }
  });

  var Bar = Foo.extend({
    blah: function blah() {
      return 'bar';
    },

    callBlah: function callBlah() {
      var blah = this.blah;

      return blah();
    }
  });

  var bar = Bar.create();

  equal(bar.callBlah(), 'bar', 'can call local function without call/apply');
});