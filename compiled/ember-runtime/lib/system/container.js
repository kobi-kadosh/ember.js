'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_set = require('ember-metal/property_set');

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _containerContainer = require('container/container');

var _containerContainer2 = _interopRequireDefault(_containerContainer);

_containerRegistry2['default'].set = _emberMetalProperty_set.set;
_containerContainer2['default'].set = _emberMetalProperty_set.set;

exports.Registry = _containerRegistry2['default'];
exports.Container = _containerContainer2['default'];