/**
@module ember
@submodule ember-routing-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsKeywords = require('ember-htmlbars/keywords');

var _emberRoutingHtmlbarsHelpersQueryParams = require('ember-routing-htmlbars/helpers/query-params');

var _emberRoutingHtmlbarsKeywordsAction = require('ember-routing-htmlbars/keywords/action');

var _emberRoutingHtmlbarsKeywordsAction2 = _interopRequireDefault(_emberRoutingHtmlbarsKeywordsAction);

var _emberRoutingHtmlbarsKeywordsElementAction = require('ember-routing-htmlbars/keywords/element-action');

var _emberRoutingHtmlbarsKeywordsElementAction2 = _interopRequireDefault(_emberRoutingHtmlbarsKeywordsElementAction);

var _emberRoutingHtmlbarsKeywordsLinkTo = require('ember-routing-htmlbars/keywords/link-to');

var _emberRoutingHtmlbarsKeywordsLinkTo2 = _interopRequireDefault(_emberRoutingHtmlbarsKeywordsLinkTo);

var _emberRoutingHtmlbarsKeywordsRender = require('ember-routing-htmlbars/keywords/render');

var _emberRoutingHtmlbarsKeywordsRender2 = _interopRequireDefault(_emberRoutingHtmlbarsKeywordsRender);

(0, _emberHtmlbarsHelpers.registerHelper)('query-params', _emberRoutingHtmlbarsHelpersQueryParams.queryParamsHelper);

(0, _emberHtmlbarsKeywords.registerKeyword)('action', _emberRoutingHtmlbarsKeywordsAction2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('@element_action', _emberRoutingHtmlbarsKeywordsElementAction2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('link-to', _emberRoutingHtmlbarsKeywordsLinkTo2['default']);
(0, _emberHtmlbarsKeywords.registerKeyword)('render', _emberRoutingHtmlbarsKeywordsRender2['default']);

exports['default'] = _emberMetalCore2['default'];
module.exports = exports['default'];