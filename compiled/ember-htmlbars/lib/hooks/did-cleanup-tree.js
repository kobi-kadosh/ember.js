"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = didCleanupTree;

function didCleanupTree(env) {
  var view;
  if (view = env.view) {
    view.ownerView.isDestroyingSubtree = false;
  }
}

module.exports = exports["default"];