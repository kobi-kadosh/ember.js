'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberTemplateCompiler = require('ember-template-compiler');

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberHtmlbarsSystemMake_bound_helper = require('ember-htmlbars/system/make_bound_helper');

var _emberHtmlbarsSystemMake_bound_helper2 = _interopRequireDefault(_emberHtmlbarsSystemMake_bound_helper);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpersIf_unless = require('ember-htmlbars/helpers/if_unless');

var _emberHtmlbarsHelpersWith = require('ember-htmlbars/helpers/with');

var _emberHtmlbarsHelpersWith2 = _interopRequireDefault(_emberHtmlbarsHelpersWith);

var _emberHtmlbarsHelpersLoc = require('ember-htmlbars/helpers/loc');

var _emberHtmlbarsHelpersLoc2 = _interopRequireDefault(_emberHtmlbarsHelpersLoc);

var _emberHtmlbarsHelpersLog = require('ember-htmlbars/helpers/log');

var _emberHtmlbarsHelpersLog2 = _interopRequireDefault(_emberHtmlbarsHelpersLog);

var _emberHtmlbarsHelpersEach = require('ember-htmlbars/helpers/each');

var _emberHtmlbarsHelpersEach2 = _interopRequireDefault(_emberHtmlbarsHelpersEach);

var _emberHtmlbarsHelpersEachIn = require('ember-htmlbars/helpers/each-in');

var _emberHtmlbarsHelpersEachIn2 = _interopRequireDefault(_emberHtmlbarsHelpersEachIn);

var _emberHtmlbarsHelpersBindAttrClass = require('ember-htmlbars/helpers/-bind-attr-class');

var _emberHtmlbarsHelpersBindAttrClass2 = _interopRequireDefault(_emberHtmlbarsHelpersBindAttrClass);

var _emberHtmlbarsHelpersNormalizeClass = require('ember-htmlbars/helpers/-normalize-class');

var _emberHtmlbarsHelpersNormalizeClass2 = _interopRequireDefault(_emberHtmlbarsHelpersNormalizeClass);

var _emberHtmlbarsHelpersConcat = require('ember-htmlbars/helpers/-concat');

var _emberHtmlbarsHelpersConcat2 = _interopRequireDefault(_emberHtmlbarsHelpersConcat);

var _emberHtmlbarsHelpersJoinClasses = require('ember-htmlbars/helpers/-join-classes');

var _emberHtmlbarsHelpersJoinClasses2 = _interopRequireDefault(_emberHtmlbarsHelpersJoinClasses);

var _emberHtmlbarsHelpersLegacyEachWithController = require('ember-htmlbars/helpers/-legacy-each-with-controller');

var _emberHtmlbarsHelpersLegacyEachWithController2 = _interopRequireDefault(_emberHtmlbarsHelpersLegacyEachWithController);

var _emberHtmlbarsHelpersLegacyEachWithKeyword = require('ember-htmlbars/helpers/-legacy-each-with-keyword');

var _emberHtmlbarsHelpersLegacyEachWithKeyword2 = _interopRequireDefault(_emberHtmlbarsHelpersLegacyEachWithKeyword);

var _emberHtmlbarsHelpersGet = require('ember-htmlbars/helpers/-get');

var _emberHtmlbarsHelpersGet2 = _interopRequireDefault(_emberHtmlbarsHelpersGet);

var _emberHtmlbarsHelpersHtmlSafe = require('ember-htmlbars/helpers/-html-safe');

var _emberHtmlbarsHelpersHtmlSafe2 = _interopRequireDefault(_emberHtmlbarsHelpersHtmlSafe);

var _emberHtmlbarsSystemDomHelper = require('ember-htmlbars/system/dom-helper');

var _emberHtmlbarsSystemDomHelper2 = _interopRequireDefault(_emberHtmlbarsSystemDomHelper);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberHtmlbarsHelper2 = _interopRequireDefault(_emberHtmlbarsHelper);

// importing adds template bootstrapping
// initializer to enable embedded templates

require('ember-htmlbars/system/bootstrap');

// importing ember-htmlbars/compat updates the
// Ember.Handlebars global if htmlbars is enabled

require('ember-htmlbars/compat');

(0, _emberHtmlbarsHelpers.registerHelper)('if', _emberHtmlbarsHelpersIf_unless.ifHelper);
(0, _emberHtmlbarsHelpers.registerHelper)('unless', _emberHtmlbarsHelpersIf_unless.unlessHelper);
(0, _emberHtmlbarsHelpers.registerHelper)('with', _emberHtmlbarsHelpersWith2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('loc', _emberHtmlbarsHelpersLoc2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('log', _emberHtmlbarsHelpersLog2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('each', _emberHtmlbarsHelpersEach2['default']);
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-each-in')) {
  (0, _emberHtmlbarsHelpers.registerHelper)('each-in', _emberHtmlbarsHelpersEachIn2['default']);
}
(0, _emberHtmlbarsHelpers.registerHelper)('-bind-attr-class', _emberHtmlbarsHelpersBindAttrClass2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('-normalize-class', _emberHtmlbarsHelpersNormalizeClass2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('concat', _emberHtmlbarsHelpersConcat2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('-join-classes', _emberHtmlbarsHelpersJoinClasses2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('-legacy-each-with-controller', _emberHtmlbarsHelpersLegacyEachWithController2['default']);
(0, _emberHtmlbarsHelpers.registerHelper)('-legacy-each-with-keyword', _emberHtmlbarsHelpersLegacyEachWithKeyword2['default']);
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-get-helper')) {
  (0, _emberHtmlbarsHelpers.registerHelper)('-get', _emberHtmlbarsHelpersGet2['default']);
}
(0, _emberHtmlbarsHelpers.registerHelper)('-html-safe', _emberHtmlbarsHelpersHtmlSafe2['default']);

_emberMetalCore2['default'].HTMLBars = {
  _registerHelper: _emberHtmlbarsHelpers.registerHelper,
  template: _emberTemplateCompiler.template,
  compile: _emberTemplateCompiler.compile,
  precompile: _emberTemplateCompiler.precompile,
  makeViewHelper: _emberHtmlbarsSystemMakeViewHelper2['default'],
  makeBoundHelper: _emberHtmlbarsSystemMake_bound_helper2['default'],
  registerPlugin: _emberTemplateCompiler.registerPlugin,
  DOMHelper: _emberHtmlbarsSystemDomHelper2['default']
};

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-helper')) {
  _emberHtmlbarsHelper2['default'].helper = _emberHtmlbarsHelper.helper;
  _emberMetalCore2['default'].Helper = _emberHtmlbarsHelper2['default'];
}