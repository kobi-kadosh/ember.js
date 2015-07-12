'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberTemplateCompilerSystemTemplate = require('ember-template-compiler/system/template');

var _emberTemplateCompilerSystemTemplate2 = _interopRequireDefault(_emberTemplateCompilerSystemTemplate);

QUnit.module('ember-htmlbars: template');

QUnit.test('sets `isTop` on the provided function', function () {
  function test() {}

  var result = (0, _emberTemplateCompilerSystemTemplate2['default'])(test);

  equal(result.isTop, true, 'sets isTop on the provided function');
});

QUnit.test('sets `isMethod` on the provided function', function () {
  function test() {}

  var result = (0, _emberTemplateCompilerSystemTemplate2['default'])(test);

  equal(result.isMethod, false, 'sets isMethod on the provided function');
});