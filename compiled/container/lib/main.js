'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _containerContainer = require('container/container');

var _containerContainer2 = _interopRequireDefault(_containerContainer);

/*
Public api for the container is still in flux.
The public api, specified on the application namespace should be considered the stable api.
// @module container
  @private
*/

/*
 Flag to enable/disable model factory injections (disabled by default)
 If model factory injections are enabled, models should not be
 accessed globally (only through `container.lookupFactory('model:modelName'))`);
*/
_emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS = false;

if (_emberMetalCore2['default'].ENV && typeof _emberMetalCore2['default'].ENV.MODEL_FACTORY_INJECTIONS !== 'undefined') {
  _emberMetalCore2['default'].MODEL_FACTORY_INJECTIONS = !!_emberMetalCore2['default'].ENV.MODEL_FACTORY_INJECTIONS;
}

exports.Registry = _containerRegistry2['default'];
exports.Container = _containerContainer2['default'];