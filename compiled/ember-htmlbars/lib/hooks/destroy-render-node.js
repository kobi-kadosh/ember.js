/**
@module ember
@submodule ember-htmlbars
*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = destroyRenderNode;

function destroyRenderNode(renderNode) {
  if (renderNode.emberView) {
    renderNode.emberView.destroy();
  }

  var streamUnsubscribers = renderNode.streamUnsubscribers;
  if (streamUnsubscribers) {
    for (var i = 0, l = streamUnsubscribers.length; i < l; i++) {
      streamUnsubscribers[i]();
    }
  }
}

module.exports = exports["default"];