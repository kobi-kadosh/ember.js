'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberRoutingViewsViewsOutlet = require('ember-routing-views/views/outlet');

var _emberRoutingLocationHash_location = require('ember-routing/location/hash_location');

var _emberRoutingLocationHash_location2 = _interopRequireDefault(_emberRoutingLocationHash_location);

function resolverFor(namespace) {
  return function (fullName) {
    var nameParts = fullName.split(':');
    var type = nameParts[0];
    var name = nameParts[1];

    if (type === 'template') {
      var templateName = (0, _emberRuntimeSystemString.decamelize)(name);
      if (_emberMetalCore2['default'].TEMPLATES[templateName]) {
        return _emberMetalCore2['default'].TEMPLATES[templateName];
      }
    }

    var className = (0, _emberRuntimeSystemString.classify)(name) + (0, _emberRuntimeSystemString.classify)(type);
    var factory = (0, _emberMetalProperty_get.get)(namespace, className);

    if (factory) {
      return factory;
    }
  };
}

function buildRegistry(namespace) {
  var registry = new _containerRegistry2['default']();

  registry.set = _emberMetalProperty_set.set;
  registry.resolver = resolverFor(namespace);
  registry.optionsForType('view', { singleton: false });
  registry.optionsForType('template', { instantiate: false });
  registry.register('application:main', namespace, { instantiate: false });
  registry.injection('router:main', 'namespace', 'application:main');

  registry.register('location:hash', _emberRoutingLocationHash_location2['default']);

  registry.register('controller:basic', _emberRuntimeControllersController2['default'], { instantiate: false });
  registry.register('controller:object', _emberRuntimeControllersObject_controller2['default'], { instantiate: false });
  registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'], { instantiate: false });

  registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
  registry.register('view:-outlet', _emberRoutingViewsViewsOutlet.OutletView);
  registry.register('view:core-outlet', _emberRoutingViewsViewsOutlet.CoreOutletView);
  registry.register('router:main', _emberRoutingSystemRouter2['default'].extend());

  registry.typeInjection('route', 'router', 'router:main');

  return registry;
}

exports.resolverFor = resolverFor;
exports.buildRegistry = buildRegistry;