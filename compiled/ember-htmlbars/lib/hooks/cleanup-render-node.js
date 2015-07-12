/**
@module ember
@submodule ember-htmlbars
*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = cleanupRenderNode;

function cleanupRenderNode(renderNode) {
  if (renderNode.cleanup) {
    renderNode.cleanup();
  }
}

module.exports = exports["default"];