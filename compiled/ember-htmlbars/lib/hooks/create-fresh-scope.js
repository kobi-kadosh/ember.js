"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createFreshScope;

function createFreshScope() {
  return {
    self: null,
    blocks: {},
    component: null,
    view: null,
    attrs: null,
    locals: {},
    localPresent: {}
  };
}

module.exports = exports["default"];