'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetal = require('ember-metal');

var _emberMetal2 = _interopRequireDefault(_emberMetal);

var _emberTemplateCompilerSystemPrecompile = require('ember-template-compiler/system/precompile');

var _emberTemplateCompilerSystemPrecompile2 = _interopRequireDefault(_emberTemplateCompilerSystemPrecompile);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberTemplateCompilerSystemTemplate = require('ember-template-compiler/system/template');

var _emberTemplateCompilerSystemTemplate2 = _interopRequireDefault(_emberTemplateCompilerSystemTemplate);

var _emberTemplateCompilerPlugins = require('ember-template-compiler/plugins');

var _emberTemplateCompilerPluginsTransformEachInToBlockParams = require('ember-template-compiler/plugins/transform-each-in-to-block-params');

var _emberTemplateCompilerPluginsTransformEachInToBlockParams2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformEachInToBlockParams);

var _emberTemplateCompilerPluginsTransformWithAsToHash = require('ember-template-compiler/plugins/transform-with-as-to-hash');

var _emberTemplateCompilerPluginsTransformWithAsToHash2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformWithAsToHash);

var _emberTemplateCompilerPluginsTransformBindAttrToAttributes = require('ember-template-compiler/plugins/transform-bind-attr-to-attributes');

var _emberTemplateCompilerPluginsTransformBindAttrToAttributes2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformBindAttrToAttributes);

var _emberTemplateCompilerPluginsTransformEachIntoCollection = require('ember-template-compiler/plugins/transform-each-into-collection');

var _emberTemplateCompilerPluginsTransformEachIntoCollection2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformEachIntoCollection);

var _emberTemplateCompilerPluginsTransformSingleArgEach = require('ember-template-compiler/plugins/transform-single-arg-each');

var _emberTemplateCompilerPluginsTransformSingleArgEach2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformSingleArgEach);

var _emberTemplateCompilerPluginsTransformOldBindingSyntax = require('ember-template-compiler/plugins/transform-old-binding-syntax');

var _emberTemplateCompilerPluginsTransformOldBindingSyntax2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformOldBindingSyntax);

var _emberTemplateCompilerPluginsTransformOldClassBindingSyntax = require('ember-template-compiler/plugins/transform-old-class-binding-syntax');

var _emberTemplateCompilerPluginsTransformOldClassBindingSyntax2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformOldClassBindingSyntax);

var _emberTemplateCompilerPluginsTransformItemClass = require('ember-template-compiler/plugins/transform-item-class');

var _emberTemplateCompilerPluginsTransformItemClass2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformItemClass);

var _emberTemplateCompilerPluginsTransformComponentAttrsIntoMut = require('ember-template-compiler/plugins/transform-component-attrs-into-mut');

var _emberTemplateCompilerPluginsTransformComponentAttrsIntoMut2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformComponentAttrsIntoMut);

var _emberTemplateCompilerPluginsTransformComponentCurlyToReadonly = require('ember-template-compiler/plugins/transform-component-curly-to-readonly');

var _emberTemplateCompilerPluginsTransformComponentCurlyToReadonly2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformComponentCurlyToReadonly);

var _emberTemplateCompilerPluginsTransformAngleBracketComponents = require('ember-template-compiler/plugins/transform-angle-bracket-components');

var _emberTemplateCompilerPluginsTransformAngleBracketComponents2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformAngleBracketComponents);

var _emberTemplateCompilerPluginsTransformInputOnToOnEvent = require('ember-template-compiler/plugins/transform-input-on-to-onEvent');

var _emberTemplateCompilerPluginsTransformInputOnToOnEvent2 = _interopRequireDefault(_emberTemplateCompilerPluginsTransformInputOnToOnEvent);

var _emberTemplateCompilerPluginsDeprecateViewAndControllerPaths = require('ember-template-compiler/plugins/deprecate-view-and-controller-paths');

var _emberTemplateCompilerPluginsDeprecateViewAndControllerPaths2 = _interopRequireDefault(_emberTemplateCompilerPluginsDeprecateViewAndControllerPaths);

var _emberTemplateCompilerPluginsDeprecateViewHelper = require('ember-template-compiler/plugins/deprecate-view-helper');

var _emberTemplateCompilerPluginsDeprecateViewHelper2 = _interopRequireDefault(_emberTemplateCompilerPluginsDeprecateViewHelper);

// used for adding Ember.Handlebars.compile for backwards compat

require('ember-template-compiler/compat');

(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformWithAsToHash2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformEachInToBlockParams2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformBindAttrToAttributes2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformSingleArgEach2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformEachIntoCollection2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformOldBindingSyntax2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformOldClassBindingSyntax2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformItemClass2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformComponentAttrsIntoMut2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformComponentCurlyToReadonly2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformAngleBracketComponents2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsTransformInputOnToOnEvent2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsDeprecateViewAndControllerPaths2['default']);
(0, _emberTemplateCompilerPlugins.registerPlugin)('ast', _emberTemplateCompilerPluginsDeprecateViewHelper2['default']);

exports._Ember = _emberMetal2['default'];
exports.precompile = _emberTemplateCompilerSystemPrecompile2['default'];
exports.compile = _emberTemplateCompilerSystemCompile2['default'];
exports.template = _emberTemplateCompilerSystemTemplate2['default'];
exports.registerPlugin = _emberTemplateCompilerPlugins.registerPlugin;