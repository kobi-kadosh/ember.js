/**
@module ember
@submodule ember-routing-views
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberRoutingViewsViewsLink = require('ember-routing-views/views/link');

var _emberRoutingViewsViewsLink2 = _interopRequireDefault(_emberRoutingViewsViewsLink);

var _emberRoutingViewsViewsOutlet = require('ember-routing-views/views/outlet');

_emberMetalCore2['default'].LinkComponent = _emberRoutingViewsViewsLink2['default'];
_emberMetalCore2['default'].OutletView = _emberRoutingViewsViewsOutlet.OutletView;
if ((0, _emberMetalFeatures2['default'])('ember-routing-core-outlet')) {
  _emberMetalCore2['default'].CoreOutletView = _emberRoutingViewsViewsOutlet.CoreOutletView;
}

exports['default'] = _emberMetalCore2['default'];
module.exports = exports['default'];