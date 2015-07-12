'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('system/object/detect');

QUnit.test('detect detects classes correctly', function () {

  var A = _emberRuntimeSystemObject2['default'].extend();
  var B = A.extend();
  var C = A.extend();

  ok(_emberRuntimeSystemObject2['default'].detect(_emberRuntimeSystemObject2['default']), 'EmberObject is an EmberObject class');
  ok(_emberRuntimeSystemObject2['default'].detect(A), 'A is an EmberObject class');
  ok(_emberRuntimeSystemObject2['default'].detect(B), 'B is an EmberObject class');
  ok(_emberRuntimeSystemObject2['default'].detect(C), 'C is an EmberObject class');

  ok(!A.detect(_emberRuntimeSystemObject2['default']), 'EmberObject is not an A class');
  ok(A.detect(A), 'A is an A class');
  ok(A.detect(B), 'B is an A class');
  ok(A.detect(C), 'C is an A class');

  ok(!B.detect(_emberRuntimeSystemObject2['default']), 'EmberObject is not a B class');
  ok(!B.detect(A), 'A is not a B class');
  ok(B.detect(B), 'B is a B class');
  ok(!B.detect(C), 'C is not a B class');

  ok(!C.detect(_emberRuntimeSystemObject2['default']), 'EmberObject is not a C class');
  ok(!C.detect(A), 'A is not a C class');
  ok(!C.detect(B), 'B is not a C class');
  ok(C.detect(C), 'C is a C class');
});