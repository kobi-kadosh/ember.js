'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalDictionary = require('ember-metal/dictionary');

var _emberMetalDictionary2 = _interopRequireDefault(_emberMetalDictionary);

var _emberMetalUtils = require('ember-metal/utils');

var deprecationLevels = {
  RAISE: (0, _emberMetalUtils.symbol)('RAISE'),
  LOG: (0, _emberMetalUtils.symbol)('LOG'),
  SILENCE: (0, _emberMetalUtils.symbol)('SILENCE')
};

exports.deprecationLevels = deprecationLevels;
exports['default'] = {
  defaultLevel: deprecationLevels.LOG,
  individualLevels: (0, _emberMetalDictionary2['default'])(null),
  setDefaultLevel: function setDefaultLevel(level) {
    this.defaultLevel = level;
  },
  setLevel: function setLevel(id, level) {
    this.individualLevels[id] = level;
  },
  getLevel: function getLevel(id) {
    var level = this.individualLevels[id];
    if (!level) {
      level = this.defaultLevel;
    }
    return level;
  }
};