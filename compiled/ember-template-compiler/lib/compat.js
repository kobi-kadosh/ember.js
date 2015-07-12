'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerCompatPrecompile = require('ember-template-compiler/compat/precompile');

var _emberTemplateCompilerCompatPrecompile2 = _interopRequireDefault(_emberTemplateCompilerCompatPrecompile);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberTemplateCompilerSystemTemplate = require('ember-template-compiler/system/template');

var _emberTemplateCompilerSystemTemplate2 = _interopRequireDefault(_emberTemplateCompilerSystemTemplate);

var EmberHandlebars = _emberMetalCore2['default'].Handlebars = _emberMetalCore2['default'].Handlebars || {};

EmberHandlebars.precompile = _emberTemplateCompilerCompatPrecompile2['default'];
EmberHandlebars.compile = _emberTemplateCompilerSystemCompile2['default'];
EmberHandlebars.template = _emberTemplateCompilerSystemTemplate2['default'];