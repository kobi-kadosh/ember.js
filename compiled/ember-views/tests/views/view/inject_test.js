'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

QUnit.module('EmberView - injected properties');

QUnit.test('services can be injected into views', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('view:application', _emberViewsViewsView2['default'].extend({
    profilerService: _emberRuntimeInject2['default'].service('profiler')
  }));

  registry.register('service:profiler', _emberRuntimeSystemService2['default'].extend());

  var appView = container.lookup('view:application');
  var profilerService = container.lookup('service:profiler');

  equal(profilerService, appView.get('profilerService'), 'service.profiler is injected');
});