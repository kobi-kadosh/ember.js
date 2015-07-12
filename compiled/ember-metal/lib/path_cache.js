'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isGlobal = isGlobal;
exports.isGlobalPath = isGlobalPath;
exports.hasThis = hasThis;
exports.isPath = isPath;
exports.getFirstKey = getFirstKey;
exports.getTailPath = getTailPath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCache = require('ember-metal/cache');

var _emberMetalCache2 = _interopRequireDefault(_emberMetalCache);

var IS_GLOBAL = /^[A-Z$]/;
var IS_GLOBAL_PATH = /^[A-Z$].*[\.]/;
var HAS_THIS = 'this.';

var isGlobalCache = new _emberMetalCache2['default'](1000, function (key) {
  return IS_GLOBAL.test(key);
});

var isGlobalPathCache = new _emberMetalCache2['default'](1000, function (key) {
  return IS_GLOBAL_PATH.test(key);
});

var hasThisCache = new _emberMetalCache2['default'](1000, function (key) {
  return key.lastIndexOf(HAS_THIS, 0) === 0;
});

var firstDotIndexCache = new _emberMetalCache2['default'](1000, function (key) {
  return key.indexOf('.');
});

var firstKeyCache = new _emberMetalCache2['default'](1000, function (path) {
  var index = firstDotIndexCache.get(path);
  if (index === -1) {
    return path;
  } else {
    return path.slice(0, index);
  }
});

var tailPathCache = new _emberMetalCache2['default'](1000, function (path) {
  var index = firstDotIndexCache.get(path);
  if (index !== -1) {
    return path.slice(index + 1);
  }
});

var caches = {
  isGlobalCache: isGlobalCache,
  isGlobalPathCache: isGlobalPathCache,
  hasThisCache: hasThisCache,
  firstDotIndexCache: firstDotIndexCache,
  firstKeyCache: firstKeyCache,
  tailPathCache: tailPathCache
};

exports.caches = caches;

function isGlobal(path) {
  return isGlobalCache.get(path);
}

function isGlobalPath(path) {
  return isGlobalPathCache.get(path);
}

function hasThis(path) {
  return hasThisCache.get(path);
}

function isPath(path) {
  return firstDotIndexCache.get(path) !== -1;
}

function getFirstKey(path) {
  return firstKeyCache.get(path);
}

function getTailPath(path) {
  return tailPathCache.get(path);
}