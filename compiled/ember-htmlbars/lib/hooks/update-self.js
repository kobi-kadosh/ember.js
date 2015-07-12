/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = updateSelf;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberHtmlbarsUtilsUpdateScope = require('ember-htmlbars/utils/update-scope');

var _emberHtmlbarsUtilsUpdateScope2 = _interopRequireDefault(_emberHtmlbarsUtilsUpdateScope);

function updateSelf(env, scope, _self) {
  var self = _self;

  if (self && self.hasBoundController) {
    var controller = self.controller;

    self = self.self;

    (0, _emberHtmlbarsUtilsUpdateScope2['default'])(scope.locals, 'controller', controller || self);
  }

  _emberMetalCore2['default'].assert('BUG: scope.attrs and self.isView should not both be true', !(scope.attrs && self.isView));

  if (self && self.isView) {
    scope.view = self;
    (0, _emberHtmlbarsUtilsUpdateScope2['default'])(scope.locals, 'view', self, null);
    (0, _emberHtmlbarsUtilsUpdateScope2['default'])(scope, 'self', (0, _emberMetalProperty_get.get)(self, 'context'), null, true);
    return;
  }

  (0, _emberHtmlbarsUtilsUpdateScope2['default'])(scope, 'self', self, null);
}

module.exports = exports['default'];