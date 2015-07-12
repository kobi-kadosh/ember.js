'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domHelper = require('dom-helper');

var _domHelper2 = _interopRequireDefault(_domHelper);

var HTMLBarsMorph = _domHelper2['default'].prototype.MorphClass;
var guid = 1;

function EmberMorph(DOMHelper, contextualElement) {
  this.HTMLBarsMorph$constructor(DOMHelper, contextualElement);

  this.emberView = null;
  this.emberToDestroy = null;
  this.streamUnsubscribers = null;
  this.guid = guid++;

  // A component can become dirty either because one of its
  // attributes changed, or because it was re-rendered. If any part
  // of the component's template changes through observation, it has
  // re-rendered from the perpsective of the programming model. This
  // flag is set to true whenever a component becomes dirty because
  // one of its attributes changed, which also triggers the attribute
  // update flag (didUpdateAttrs).
  this.shouldReceiveAttrs = false;
}

var proto = EmberMorph.prototype = Object.create(HTMLBarsMorph.prototype);
proto.HTMLBarsMorph$constructor = HTMLBarsMorph;
proto.HTMLBarsMorph$clear = HTMLBarsMorph.prototype.clear;

proto.addDestruction = function (toDestroy) {
  this.emberToDestroy = this.emberToDestroy || [];
  this.emberToDestroy.push(toDestroy);
};

proto.cleanup = function () {
  var view;

  if (view = this.emberView) {
    if (!view.ownerView.isDestroyingSubtree) {
      view.ownerView.isDestroyingSubtree = true;
      if (view.parentView) {
        view.parentView.removeChild(view);
      }
    }
  }

  var toDestroy = this.emberToDestroy;
  if (toDestroy) {
    for (var i = 0, l = toDestroy.length; i < l; i++) {
      toDestroy[i].destroy();
    }

    this.emberToDestroy = null;
  }
};

proto.didRender = function (env, scope) {
  env.renderedNodes[this.guid] = true;
};

exports['default'] = EmberMorph;
module.exports = exports['default'];