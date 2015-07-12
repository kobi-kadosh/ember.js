/**
@module ember
@submodule ember-routing
*/

/**

  Finds a controller instance.

  @for Ember
  @method controllerFor
  @private
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = controllerFor;

function controllerFor(container, controllerName, lookupOptions) {
  return container.lookup("controller:" + controllerName, lookupOptions);
}

module.exports = exports["default"];