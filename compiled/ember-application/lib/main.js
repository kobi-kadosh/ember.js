'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

/**
@module ember
@submodule ember-application
*/

var _emberApplicationSystemResolver = require('ember-application/system/resolver');

var _emberApplicationSystemResolver2 = _interopRequireDefault(_emberApplicationSystemResolver);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

require('ember-application/ext/controller');

// side effect of extending ControllerMixin

_emberMetalCore2['default'].Application = _emberApplicationSystemApplication2['default'];
_emberMetalCore2['default'].Resolver = _emberApplicationSystemResolver.Resolver;
_emberMetalCore2['default'].DefaultResolver = _emberApplicationSystemResolver2['default'];

(0, _emberRuntimeSystemLazy_load.runLoadHooks)('Ember.Application', _emberApplicationSystemApplication2['default']);