/**
@module ember
@submodule ember-routing
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// ES6TODO: Cleanup modules with side-effects below

require('ember-routing/ext/run_loop');

require('ember-routing/ext/controller');

var _emberRoutingLocationApi = require('ember-routing/location/api');

var _emberRoutingLocationApi2 = _interopRequireDefault(_emberRoutingLocationApi);

var _emberRoutingLocationNone_location = require('ember-routing/location/none_location');

var _emberRoutingLocationNone_location2 = _interopRequireDefault(_emberRoutingLocationNone_location);

var _emberRoutingLocationHash_location = require('ember-routing/location/hash_location');

var _emberRoutingLocationHash_location2 = _interopRequireDefault(_emberRoutingLocationHash_location);

var _emberRoutingLocationHistory_location = require('ember-routing/location/history_location');

var _emberRoutingLocationHistory_location2 = _interopRequireDefault(_emberRoutingLocationHistory_location);

var _emberRoutingLocationAuto_location = require('ember-routing/location/auto_location');

var _emberRoutingLocationAuto_location2 = _interopRequireDefault(_emberRoutingLocationAuto_location);

var _emberRoutingSystemGenerate_controller = require('ember-routing/system/generate_controller');

var _emberRoutingSystemGenerate_controller2 = _interopRequireDefault(_emberRoutingSystemGenerate_controller);

var _emberRoutingSystemController_for = require('ember-routing/system/controller_for');

var _emberRoutingSystemController_for2 = _interopRequireDefault(_emberRoutingSystemController_for);

var _emberRoutingSystemDsl = require('ember-routing/system/dsl');

var _emberRoutingSystemDsl2 = _interopRequireDefault(_emberRoutingSystemDsl);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

require('ember-routing/initializers/routing-service');

_emberMetalCore2['default'].Location = _emberRoutingLocationApi2['default'];
_emberMetalCore2['default'].AutoLocation = _emberRoutingLocationAuto_location2['default'];
_emberMetalCore2['default'].HashLocation = _emberRoutingLocationHash_location2['default'];
_emberMetalCore2['default'].HistoryLocation = _emberRoutingLocationHistory_location2['default'];
_emberMetalCore2['default'].NoneLocation = _emberRoutingLocationNone_location2['default'];

_emberMetalCore2['default'].controllerFor = _emberRoutingSystemController_for2['default'];
_emberMetalCore2['default'].generateControllerFactory = _emberRoutingSystemGenerate_controller.generateControllerFactory;
_emberMetalCore2['default'].generateController = _emberRoutingSystemGenerate_controller2['default'];
_emberMetalCore2['default'].RouterDSL = _emberRoutingSystemDsl2['default'];
_emberMetalCore2['default'].Router = _emberRoutingSystemRouter2['default'];
_emberMetalCore2['default'].Route = _emberRoutingSystemRoute2['default'];

exports['default'] = _emberMetalCore2['default'];
module.exports = exports['default'];