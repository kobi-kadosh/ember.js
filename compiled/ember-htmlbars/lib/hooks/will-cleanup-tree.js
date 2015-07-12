"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = willCleanupTree;

function willCleanupTree(env, morph, destroySelf) {
  var view = morph.emberView;
  if (destroySelf && view && view.parentView) {
    view.parentView.removeChild(view);
  }

  if (view = env.view) {
    view.ownerView.isDestroyingSubtree = true;
  }
}

module.exports = exports["default"];