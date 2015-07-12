'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberHtmlbarsCompatHelper = require('ember-htmlbars/compat/helper');

var _emberHtmlbarsCompatHandlebarsGet = require('ember-htmlbars/compat/handlebars-get');

var _emberHtmlbarsCompatHandlebarsGet2 = _interopRequireDefault(_emberHtmlbarsCompatHandlebarsGet);

var _emberHtmlbarsCompatMakeBoundHelper = require('ember-htmlbars/compat/make-bound-helper');

var _emberHtmlbarsCompatMakeBoundHelper2 = _interopRequireDefault(_emberHtmlbarsCompatMakeBoundHelper);

var _emberHtmlbarsCompatRegisterBoundHelper = require('ember-htmlbars/compat/register-bound-helper');

var _emberHtmlbarsCompatRegisterBoundHelper2 = _interopRequireDefault(_emberHtmlbarsCompatRegisterBoundHelper);

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberHtmlbarsUtilsString = require('ember-htmlbars/utils/string');

var EmberHandlebars = _emberMetalCore2['default'].Handlebars = _emberMetalCore2['default'].Handlebars || {};
EmberHandlebars.helpers = _emberHtmlbarsHelpers2['default'];
EmberHandlebars.helper = _emberHtmlbarsCompatHelper.handlebarsHelper;
EmberHandlebars.registerHelper = _emberHtmlbarsCompatHelper.registerHandlebarsCompatibleHelper;
EmberHandlebars.registerBoundHelper = _emberHtmlbarsCompatRegisterBoundHelper2['default'];
EmberHandlebars.makeBoundHelper = _emberHtmlbarsCompatMakeBoundHelper2['default'];
EmberHandlebars.get = _emberHtmlbarsCompatHandlebarsGet2['default'];
EmberHandlebars.makeViewHelper = _emberHtmlbarsSystemMakeViewHelper2['default'];

EmberHandlebars.SafeString = _emberHtmlbarsUtilsString.SafeString;
EmberHandlebars.Utils = {
  escapeExpression: _emberHtmlbarsUtilsString.escapeExpression
};

exports['default'] = EmberHandlebars;
module.exports = exports['default'];