'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  invalidName: function invalidName(name) {
    if (!_emberHtmlbarsSystemLookupHelper.CONTAINS_DASH_CACHE.get(name)) {
      _emberMetalCore2['default'].assert('You cannot use \'' + name + '\' as a component name. Component names must contain a hyphen.');
      return true;
    }
  },

  lookupFactory: function lookupFactory(name, container) {

    container = container || this.container;

    var fullName = 'component:' + name;
    var templateFullName = 'template:components/' + name;
    var templateRegistered = container && container._registry.has(templateFullName);

    if (templateRegistered) {
      container._registry.injection(fullName, 'layout', templateFullName);
    }

    var Component = container.lookupFactory(fullName);

    // Only treat as a component if either the component
    // or a template has been registered.
    if (templateRegistered || Component) {
      if (!Component) {
        container._registry.register(fullName, _emberMetalCore2['default'].Component);
        Component = container.lookupFactory(fullName);
      }
      return Component;
    }
  },

  componentFor: function componentFor(name, container) {
    if (this.invalidName(name)) {
      return;
    }

    var fullName = 'component:' + name;
    return container.lookupFactory(fullName);
  },

  layoutFor: function layoutFor(name, container) {
    if (this.invalidName(name)) {
      return;
    }

    var templateFullName = 'template:components/' + name;
    return container.lookup(templateFullName);
  }
});
module.exports = exports['default'];