'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsEnv = require('ember-htmlbars/env');

var _emberHtmlbarsEnv2 = _interopRequireDefault(_emberHtmlbarsEnv);

var _htmlbarsTestHelpers = require('htmlbars-test-helpers');

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

QUnit.module('ember-htmlbars: main');

QUnit.test('HTMLBars is present and can be executed', function () {
  var template = (0, _emberTemplateCompilerSystemCompile2['default'])('ohai');

  var env = (0, _emberMetalMerge2['default'])({ dom: _emberHtmlbarsEnv.domHelper }, _emberHtmlbarsEnv2['default']);

  var output = template.render({}, env, { contextualElement: document.body }).fragment;
  (0, _htmlbarsTestHelpers.equalHTML)(output, 'ohai');
});