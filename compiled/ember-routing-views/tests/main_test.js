'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRoutingViews = require('ember-routing-views');

var _emberRoutingViews2 = _interopRequireDefault(_emberRoutingViews);

QUnit.module('ember-routing-views');

QUnit.test('exports correctly', function () {
  ok(_emberRoutingViews2['default'].LinkComponent, 'LinkComponent is exported correctly');
  ok(_emberRoutingViews2['default'].OutletView, 'OutletView is exported correctly');
});