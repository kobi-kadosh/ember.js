// require the main entry points for each of these packages
// this is so that the global exports occur properly
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember-metal');

require('ember-runtime');

require('ember-views');

require('ember-routing');

require('ember-application');

require('ember-extension-support');

require('ember-htmlbars');

require('ember-routing-htmlbars');

require('ember-routing-views');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

if (_emberMetalCore2['default'].__loader.registry['ember-template-compiler']) {
  requireModule('ember-template-compiler');
}

// do this to ensure that Ember.Test is defined properly on the global
// if it is present.
if (_emberMetalCore2['default'].__loader.registry['ember-testing']) {
  requireModule('ember-testing');
}

(0, _emberRuntimeSystemLazy_load.runLoadHooks)('Ember');

/**
@module ember
*/

_emberMetalCore2['default'].deprecate('Usage of Ember is deprecated for Internet Explorer 6 and 7, support will be removed in the next major version.', !_emberMetalEnvironment2['default'].userAgent.match(/MSIE [67]/));