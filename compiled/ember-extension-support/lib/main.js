/**
@module ember
@submodule ember-extension-support
*/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberExtensionSupportData_adapter = require('ember-extension-support/data_adapter');

var _emberExtensionSupportData_adapter2 = _interopRequireDefault(_emberExtensionSupportData_adapter);

var _emberExtensionSupportContainer_debug_adapter = require('ember-extension-support/container_debug_adapter');

var _emberExtensionSupportContainer_debug_adapter2 = _interopRequireDefault(_emberExtensionSupportContainer_debug_adapter);

_emberMetalCore2['default'].DataAdapter = _emberExtensionSupportData_adapter2['default'];
_emberMetalCore2['default'].ContainerDebugAdapter = _emberExtensionSupportContainer_debug_adapter2['default'];