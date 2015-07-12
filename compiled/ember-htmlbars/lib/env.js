'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

var _htmlbarsRuntime = require('htmlbars-runtime');

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberHtmlbarsHooksSubexpr = require('ember-htmlbars/hooks/subexpr');

var _emberHtmlbarsHooksSubexpr2 = _interopRequireDefault(_emberHtmlbarsHooksSubexpr);

var _emberHtmlbarsHooksConcat = require('ember-htmlbars/hooks/concat');

var _emberHtmlbarsHooksConcat2 = _interopRequireDefault(_emberHtmlbarsHooksConcat);

var _emberHtmlbarsHooksLinkRenderNode = require('ember-htmlbars/hooks/link-render-node');

var _emberHtmlbarsHooksLinkRenderNode2 = _interopRequireDefault(_emberHtmlbarsHooksLinkRenderNode);

var _emberHtmlbarsHooksCreateFreshScope = require('ember-htmlbars/hooks/create-fresh-scope');

var _emberHtmlbarsHooksCreateFreshScope2 = _interopRequireDefault(_emberHtmlbarsHooksCreateFreshScope);

var _emberHtmlbarsHooksBindShadowScope = require('ember-htmlbars/hooks/bind-shadow-scope');

var _emberHtmlbarsHooksBindShadowScope2 = _interopRequireDefault(_emberHtmlbarsHooksBindShadowScope);

var _emberHtmlbarsHooksBindSelf = require('ember-htmlbars/hooks/bind-self');

var _emberHtmlbarsHooksBindSelf2 = _interopRequireDefault(_emberHtmlbarsHooksBindSelf);

var _emberHtmlbarsHooksBindScope = require('ember-htmlbars/hooks/bind-scope');

var _emberHtmlbarsHooksBindScope2 = _interopRequireDefault(_emberHtmlbarsHooksBindScope);

var _emberHtmlbarsHooksBindLocal = require('ember-htmlbars/hooks/bind-local');

var _emberHtmlbarsHooksBindLocal2 = _interopRequireDefault(_emberHtmlbarsHooksBindLocal);

var _emberHtmlbarsHooksUpdateSelf = require('ember-htmlbars/hooks/update-self');

var _emberHtmlbarsHooksUpdateSelf2 = _interopRequireDefault(_emberHtmlbarsHooksUpdateSelf);

var _emberHtmlbarsHooksGetRoot = require('ember-htmlbars/hooks/get-root');

var _emberHtmlbarsHooksGetRoot2 = _interopRequireDefault(_emberHtmlbarsHooksGetRoot);

var _emberHtmlbarsHooksGetChild = require('ember-htmlbars/hooks/get-child');

var _emberHtmlbarsHooksGetChild2 = _interopRequireDefault(_emberHtmlbarsHooksGetChild);

var _emberHtmlbarsHooksGetValue = require('ember-htmlbars/hooks/get-value');

var _emberHtmlbarsHooksGetValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetValue);

var _emberHtmlbarsHooksGetCellOrValue = require('ember-htmlbars/hooks/get-cell-or-value');

var _emberHtmlbarsHooksGetCellOrValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetCellOrValue);

var _emberHtmlbarsHooksCleanupRenderNode = require('ember-htmlbars/hooks/cleanup-render-node');

var _emberHtmlbarsHooksCleanupRenderNode2 = _interopRequireDefault(_emberHtmlbarsHooksCleanupRenderNode);

var _emberHtmlbarsHooksDestroyRenderNode = require('ember-htmlbars/hooks/destroy-render-node');

var _emberHtmlbarsHooksDestroyRenderNode2 = _interopRequireDefault(_emberHtmlbarsHooksDestroyRenderNode);

var _emberHtmlbarsHooksDidRenderNode = require('ember-htmlbars/hooks/did-render-node');

var _emberHtmlbarsHooksDidRenderNode2 = _interopRequireDefault(_emberHtmlbarsHooksDidRenderNode);

var _emberHtmlbarsHooksWillCleanupTree = require('ember-htmlbars/hooks/will-cleanup-tree');

var _emberHtmlbarsHooksWillCleanupTree2 = _interopRequireDefault(_emberHtmlbarsHooksWillCleanupTree);

var _emberHtmlbarsHooksDidCleanupTree = require('ember-htmlbars/hooks/did-cleanup-tree');

var _emberHtmlbarsHooksDidCleanupTree2 = _interopRequireDefault(_emberHtmlbarsHooksDidCleanupTree);

var _emberHtmlbarsHooksClassify = require('ember-htmlbars/hooks/classify');

var _emberHtmlbarsHooksClassify2 = _interopRequireDefault(_emberHtmlbarsHooksClassify);

var _emberHtmlbarsHooksComponent = require('ember-htmlbars/hooks/component');

var _emberHtmlbarsHooksComponent2 = _interopRequireDefault(_emberHtmlbarsHooksComponent);

var _emberHtmlbarsHooksLookupHelper = require('ember-htmlbars/hooks/lookup-helper');

var _emberHtmlbarsHooksLookupHelper2 = _interopRequireDefault(_emberHtmlbarsHooksLookupHelper);

var _emberHtmlbarsHooksHasHelper = require('ember-htmlbars/hooks/has-helper');

var _emberHtmlbarsHooksHasHelper2 = _interopRequireDefault(_emberHtmlbarsHooksHasHelper);

var _emberHtmlbarsHooksInvokeHelper = require('ember-htmlbars/hooks/invoke-helper');

var _emberHtmlbarsHooksInvokeHelper2 = _interopRequireDefault(_emberHtmlbarsHooksInvokeHelper);

var _emberHtmlbarsHooksElement = require('ember-htmlbars/hooks/element');

var _emberHtmlbarsHooksElement2 = _interopRequireDefault(_emberHtmlbarsHooksElement);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberHtmlbarsKeywords = require('ember-htmlbars/keywords');

var _emberHtmlbarsKeywords2 = _interopRequireDefault(_emberHtmlbarsKeywords);

var _emberHtmlbarsSystemDomHelper = require('ember-htmlbars/system/dom-helper');

var _emberHtmlbarsSystemDomHelper2 = _interopRequireDefault(_emberHtmlbarsSystemDomHelper);

var _emberHtmlbarsKeywordsDebugger = require('ember-htmlbars/keywords/debugger');

var _emberHtmlbarsKeywordsDebugger2 = _interopRequireDefault(_emberHtmlbarsKeywordsDebugger);

var _emberHtmlbarsKeywordsWith = require('ember-htmlbars/keywords/with');

var _emberHtmlbarsKeywordsWith2 = _interopRequireDefault(_emberHtmlbarsKeywordsWith);

var _emberHtmlbarsKeywordsOutlet = require('ember-htmlbars/keywords/outlet');

var _emberHtmlbarsKeywordsOutlet2 = _interopRequireDefault(_emberHtmlbarsKeywordsOutlet);

var _emberHtmlbarsKeywordsReal_outlet = require('ember-htmlbars/keywords/real_outlet');

var _emberHtmlbarsKeywordsReal_outlet2 = _interopRequireDefault(_emberHtmlbarsKeywordsReal_outlet);

var _emberHtmlbarsKeywordsCustomized_outlet = require('ember-htmlbars/keywords/customized_outlet');

var _emberHtmlbarsKeywordsCustomized_outlet2 = _interopRequireDefault(_emberHtmlbarsKeywordsCustomized_outlet);

var _emberHtmlbarsKeywordsUnbound = require('ember-htmlbars/keywords/unbound');

var _emberHtmlbarsKeywordsUnbound2 = _interopRequireDefault(_emberHtmlbarsKeywordsUnbound);

var _emberHtmlbarsKeywordsView = require('ember-htmlbars/keywords/view');

var _emberHtmlbarsKeywordsView2 = _interopRequireDefault(_emberHtmlbarsKeywordsView);

var _emberHtmlbarsKeywordsComponent = require('ember-htmlbars/keywords/component');

var _emberHtmlbarsKeywordsComponent2 = _interopRequireDefault(_emberHtmlbarsKeywordsComponent);

var _emberHtmlbarsKeywordsPartial = require('ember-htmlbars/keywords/partial');

var _emberHtmlbarsKeywordsPartial2 = _interopRequireDefault(_emberHtmlbarsKeywordsPartial);

var _emberHtmlbarsKeywordsInput = require('ember-htmlbars/keywords/input');

var _emberHtmlbarsKeywordsInput2 = _interopRequireDefault(_emberHtmlbarsKeywordsInput);

var _emberHtmlbarsKeywordsTextarea = require('ember-htmlbars/keywords/textarea');

var _emberHtmlbarsKeywordsTextarea2 = _interopRequireDefault(_emberHtmlbarsKeywordsTextarea);

var _emberHtmlbarsKeywordsCollection = require('ember-htmlbars/keywords/collection');

var _emberHtmlbarsKeywordsCollection2 = _interopRequireDefault(_emberHtmlbarsKeywordsCollection);

var _emberHtmlbarsKeywordsTemplate = require('ember-htmlbars/keywords/template');

var _emberHtmlbarsKeywordsTemplate2 = _interopRequireDefault(_emberHtmlbarsKeywordsTemplate);

var _emberHtmlbarsKeywordsLegacyYield = require('ember-htmlbars/keywords/legacy-yield');

var _emberHtmlbarsKeywordsLegacyYield2 = _interopRequireDefault(_emberHtmlbarsKeywordsLegacyYield);

var _emberHtmlbarsKeywordsMut = require('ember-htmlbars/keywords/mut');

var _emberHtmlbarsKeywordsMut2 = _interopRequireDefault(_emberHtmlbarsKeywordsMut);

var _emberHtmlbarsKeywordsEach = require('ember-htmlbars/keywords/each');

var _emberHtmlbarsKeywordsEach2 = _interopRequireDefault(_emberHtmlbarsKeywordsEach);

var _emberHtmlbarsKeywordsReadonly = require('ember-htmlbars/keywords/readonly');

var _emberHtmlbarsKeywordsReadonly2 = _interopRequireDefault(_emberHtmlbarsKeywordsReadonly);

var _emberHtmlbarsKeywordsGet = require('ember-htmlbars/keywords/get');

var _emberHtmlbarsKeywordsGet2 = _interopRequireDefault(_emberHtmlbarsKeywordsGet);

var emberHooks = (0, _emberMetalMerge2['default'])({}, _htmlbarsRuntime.hooks);
emberHooks.keywords = _emberHtmlbarsKeywords2['default'];

(0, _emberMetalMerge2['default'])(emberHooks, {
  linkRenderNode: _emberHtmlbarsHooksLinkRenderNode2['default'],
  createFreshScope: _emberHtmlbarsHooksCreateFreshScope2['default'],
  bindShadowScope: _emberHtmlbarsHooksBindShadowScope2['default'],
  bindSelf: _emberHtmlbarsHooksBindSelf2['default'],
  bindScope: _emberHtmlbarsHooksBindScope2['default'],
  bindLocal: _emberHtmlbarsHooksBindLocal2['default'],
  updateSelf: _emberHtmlbarsHooksUpdateSelf2['default'],
  getRoot: _emberHtmlbarsHooksGetRoot2['default'],
  getChild: _emberHtmlbarsHooksGetChild2['default'],
  getValue: _emberHtmlbarsHooksGetValue2['default'],
  getCellOrValue: _emberHtmlbarsHooksGetCellOrValue2['default'],
  subexpr: _emberHtmlbarsHooksSubexpr2['default'],
  concat: _emberHtmlbarsHooksConcat2['default'],
  cleanupRenderNode: _emberHtmlbarsHooksCleanupRenderNode2['default'],
  destroyRenderNode: _emberHtmlbarsHooksDestroyRenderNode2['default'],
  willCleanupTree: _emberHtmlbarsHooksWillCleanupTree2['default'],
  didCleanupTree: _emberHtmlbarsHooksDidCleanupTree2['default'],
  didRenderNode: _emberHtmlbarsHooksDidRenderNode2['default'],
  classify: _emberHtmlbarsHooksClassify2['default'],
  component: _emberHtmlbarsHooksComponent2['default'],
  lookupHelper: _emberHtmlbarsHooksLookupHelper2['default'],
  hasHelper: _emberHtmlbarsHooksHasHelper2['default'],
  invokeHelper: _emberHtmlbarsHooksInvokeHelper2['default'],
  element: _emberHtmlbarsHooksElement2['default']
});

(0, _emberHtmlbarsKeywords.registerKeyword)('debugger', _emberHtmlbarsKeywordsDebugger2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('with', _emberHtmlbarsKeywordsWith2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('outlet', _emberHtmlbarsKeywordsOutlet2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('@real_outlet', _emberHtmlbarsKeywordsReal_outlet2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('@customized_outlet', _emberHtmlbarsKeywordsCustomized_outlet2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('unbound', _emberHtmlbarsKeywordsUnbound2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('view', _emberHtmlbarsKeywordsView2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('component', _emberHtmlbarsKeywordsComponent2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('partial', _emberHtmlbarsKeywordsPartial2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('template', _emberHtmlbarsKeywordsTemplate2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('input', _emberHtmlbarsKeywordsInput2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('textarea', _emberHtmlbarsKeywordsTextarea2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('collection', _emberHtmlbarsKeywordsCollection2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('legacy-yield', _emberHtmlbarsKeywordsLegacyYield2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('mut', _emberHtmlbarsKeywordsMut2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('@mut', _emberHtmlbarsKeywordsMut.privateMut);
(0, _emberHtmlbarsKeywords.registerKeyword)('each', _emberHtmlbarsKeywordsEach2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('readonly', _emberHtmlbarsKeywordsReadonly2['default']);
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-get-helper')) {
  (0, _emberHtmlbarsKeywords.registerKeyword)('get', _emberHtmlbarsKeywordsGet2['default']);
}

exports['default'] = {
  hooks: emberHooks,
  helpers: _emberHtmlbarsHelpers2['default'],
  useFragmentCache: true
};

var domHelper = _emberMetalEnvironment2['default'].hasDOM ? new _emberHtmlbarsSystemDomHelper2['default']() : null;

exports.domHelper = domHelper;