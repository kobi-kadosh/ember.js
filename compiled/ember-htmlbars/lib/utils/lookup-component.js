'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = lookupComponent;

function lookupComponent(container, tagName) {
  var componentLookup = container.lookup('component-lookup:main');

  return {
    component: componentLookup.componentFor(tagName, container),
    layout: componentLookup.layoutFor(tagName, container)
  };
}

module.exports = exports['default'];