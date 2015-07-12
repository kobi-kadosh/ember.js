'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = legacyEachWithControllerHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberHtmlbarsUtilsNormalizeSelf = require('ember-htmlbars/utils/normalize-self');

var _emberHtmlbarsUtilsNormalizeSelf2 = _interopRequireDefault(_emberHtmlbarsUtilsNormalizeSelf);

var _emberHtmlbarsUtilsDecodeEachKey = require('ember-htmlbars/utils/decode-each-key');

var _emberHtmlbarsUtilsDecodeEachKey2 = _interopRequireDefault(_emberHtmlbarsUtilsDecodeEachKey);

function legacyEachWithControllerHelper(params, hash, blocks) {
  var list = params[0];
  var keyPath = hash.key;

  // TODO: Correct falsy semantics
  if (!list || (0, _emberMetalProperty_get.get)(list, 'length') === 0) {
    if (blocks.inverse['yield']) {
      blocks.inverse['yield']();
    }
    return;
  }

  list.forEach(function (item, i) {
    var self;

    if (blocks.template.arity === 0) {
      _emberMetalCore2['default'].deprecate(deprecation);
      self = (0, _emberHtmlbarsUtilsNormalizeSelf2['default'])(item);
      self = bindController(self, true);
    }

    var key = (0, _emberHtmlbarsUtilsDecodeEachKey2['default'])(item, keyPath, i);
    blocks.template.yieldItem(key, [item, i], self);
  });
}

function bindController(controller, isSelf) {
  return {
    controller: controller,
    hasBoundController: true,
    self: controller ? controller : undefined
  };
}

var deprecation = 'Using the context switching form of {{each}} is deprecated. Please use the keyword form (`{{#each items as |item|}}`) instead.';
exports.deprecation = deprecation;