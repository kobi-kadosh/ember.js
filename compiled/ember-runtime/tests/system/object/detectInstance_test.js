'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('system/object/detectInstance');

QUnit.test('detectInstance detects instances correctly', function () {

  var A = _emberRuntimeSystemObject2['default'].extend();
  var B = A.extend();
  var C = A.extend();

  var o = _emberRuntimeSystemObject2['default'].create();
  var a = A.create();
  var b = B.create();
  var c = C.create();

  ok(_emberRuntimeSystemObject2['default'].detectInstance(o), 'o is an instance of EmberObject');
  ok(_emberRuntimeSystemObject2['default'].detectInstance(a), 'a is an instance of EmberObject');
  ok(_emberRuntimeSystemObject2['default'].detectInstance(b), 'b is an instance of EmberObject');
  ok(_emberRuntimeSystemObject2['default'].detectInstance(c), 'c is an instance of EmberObject');

  ok(!A.detectInstance(o), 'o is not an instance of A');
  ok(A.detectInstance(a), 'a is an instance of A');
  ok(A.detectInstance(b), 'b is an instance of A');
  ok(A.detectInstance(c), 'c is an instance of A');

  ok(!B.detectInstance(o), 'o is not an instance of B');
  ok(!B.detectInstance(a), 'a is not an instance of B');
  ok(B.detectInstance(b), 'b is an instance of B');
  ok(!B.detectInstance(c), 'c is not an instance of B');

  ok(!C.detectInstance(o), 'o is not an instance of C');
  ok(!C.detectInstance(a), 'a is not an instance of C');
  ok(!C.detectInstance(b), 'b is not an instance of C');
  ok(C.detectInstance(c), 'c is an instance of C');
});