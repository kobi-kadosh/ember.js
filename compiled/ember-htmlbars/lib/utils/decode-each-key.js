'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = decodeEachKey;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalUtils = require('ember-metal/utils');

function identity(item) {
  var key = undefined;
  var type = typeof item;

  if (type === 'string' || type === 'number') {
    key = item;
  } else {
    key = (0, _emberMetalUtils.guidFor)(item);
  }

  return key;
}

function decodeEachKey(item, keyPath, index) {
  var key, deprecatedSpecialKey;

  switch (keyPath) {
    case '@index':
      key = index;
      break;
    case '@guid':
      deprecatedSpecialKey = '@guid';
      key = (0, _emberMetalUtils.guidFor)(item);
      break;
    case '@item':
      deprecatedSpecialKey = '@item';
      key = item;
      break;
    case '@identity':
      key = identity(item);
      break;
    default:
      if (keyPath) {
        key = (0, _emberMetalProperty_get.get)(item, keyPath);
      } else {
        key = identity(item);
      }
  }

  if (typeof key === 'number') {
    key = String(key);
  }

  _emberMetalCore2['default'].deprecate('Using \'' + deprecatedSpecialKey + '\' with the {{each}} helper, is deprecated. Switch to \'@identity\' or remove \'key=\' from your template.', !deprecatedSpecialKey);

  return key;
}

module.exports = exports['default'];