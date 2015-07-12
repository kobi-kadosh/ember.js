'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  init: function init() {
    this.cache = {};
  },
  has: function has(bucketKey) {
    return bucketKey in this.cache;
  },
  stash: function stash(bucketKey, key, value) {
    var bucket = this.cache[bucketKey];
    if (!bucket) {
      bucket = this.cache[bucketKey] = {};
    }
    bucket[key] = value;
  },
  lookup: function lookup(bucketKey, prop, defaultValue) {
    var cache = this.cache;
    if (!(bucketKey in cache)) {
      return defaultValue;
    }
    var bucket = cache[bucketKey];
    if (prop in bucket) {
      return bucket[prop];
    } else {
      return defaultValue;
    }
  },
  cache: null
});
module.exports = exports['default'];