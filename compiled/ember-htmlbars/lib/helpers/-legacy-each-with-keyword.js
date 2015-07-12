'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = legacyEachWithKeywordHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _emberViewsStreamsShould_display = require('ember-views/streams/should_display');

var _emberViewsStreamsShould_display2 = _interopRequireDefault(_emberViewsStreamsShould_display);

var _emberHtmlbarsUtilsDecodeEachKey = require('ember-htmlbars/utils/decode-each-key');

var _emberHtmlbarsUtilsDecodeEachKey2 = _interopRequireDefault(_emberHtmlbarsUtilsDecodeEachKey);

function legacyEachWithKeywordHelper(params, hash, blocks) {
  var list = params[0];
  var keyPath = hash.key;
  var legacyKeyword = hash['-legacy-keyword'];

  if ((0, _emberViewsStreamsShould_display2['default'])(list)) {
    list.forEach(function (item, i) {
      var self;
      if (legacyKeyword) {
        self = bindKeyword(self, legacyKeyword, item);
      }

      var key = (0, _emberHtmlbarsUtilsDecodeEachKey2['default'])(item, keyPath, i);
      blocks.template.yieldItem(key, [item, i], self);
    });
  } else if (blocks.inverse['yield']) {
    blocks.inverse['yield']();
  }
}

function bindKeyword(self, keyword, item) {
  return _defineProperty({
    self: self
  }, keyword, item);
}

var deprecation = 'Using the context switching form of {{each}} is deprecated. Please use the keyword form (`{{#each items as |item|}}`) instead.';
exports.deprecation = deprecation;