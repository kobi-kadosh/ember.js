'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalDictionary = require('ember-metal/dictionary');

var _emberMetalDictionary2 = _interopRequireDefault(_emberMetalDictionary);

exports['default'] = Cache;

function Cache(limit, func) {
  this.store = (0, _emberMetalDictionary2['default'])(null);
  this.size = 0;
  this.misses = 0;
  this.hits = 0;
  this.limit = limit;
  this.func = func;
}

var UNDEFINED = function UNDEFINED() {};

Cache.prototype = {
  set: function set(key, value) {
    if (this.limit > this.size) {
      this.size++;
      if (value === undefined) {
        this.store[key] = UNDEFINED;
      } else {
        this.store[key] = value;
      }
    }

    return value;
  },

  get: function get(key) {
    var value = this.store[key];

    if (value === undefined) {
      this.misses++;
      value = this.set(key, this.func(key));
    } else if (value === UNDEFINED) {
      this.hits++;
      value = undefined;
    } else {
      this.hits++;
      // nothing to translate
    }

    return value;
  },

  purge: function purge() {
    this.store = (0, _emberMetalDictionary2['default'])(null);
    this.size = 0;
    this.hits = 0;
    this.misses = 0;
  }
};
module.exports = exports['default'];