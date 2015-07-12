"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = didRenderNode;

function didRenderNode(morph, env) {
  env.renderedNodes[morph.guid] = true;
}

module.exports = exports["default"];