'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsStatesDefault = require('ember-views/views/states/default');

var _emberViewsViewsStatesDefault2 = _interopRequireDefault(_emberViewsViewsStatesDefault);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

/**
@module ember
@submodule ember-views
*/

var _emberMetalProperty_get = require('ember-metal/property_get');

var _htmlbarsRuntime = require('htmlbars-runtime');

var hasElement = Object.create(_emberViewsViewsStatesDefault2['default']);

(0, _emberMetalMerge2['default'])(hasElement, {
  $: function $(view, sel) {
    var elem = view.element;
    return sel ? (0, _emberViewsSystemJquery2['default'])(sel, elem) : (0, _emberViewsSystemJquery2['default'])(elem);
  },

  getElement: function getElement(view) {
    var parent = (0, _emberMetalProperty_get.get)(view, 'parentView');
    if (parent) {
      parent = (0, _emberMetalProperty_get.get)(parent, 'element');
    }
    if (parent) {
      return view.findElementInParentElement(parent);
    }
    return (0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId'))[0];
  },

  // once the view has been inserted into the DOM, rerendering is
  // deferred to allow bindings to synchronize.
  rerender: function rerender(view) {
    view.renderer.ensureViewNotRendering(view);

    var renderNode = view._renderNode;

    renderNode.isDirty = true;
    _htmlbarsRuntime.internal.visitChildren(renderNode.childNodes, function (node) {
      if (node.state && node.state.manager) {
        node.shouldReceiveAttrs = true;
      }
      node.isDirty = true;
    });

    renderNode.ownerNode.emberView.scheduleRevalidate(renderNode, view.toString(), 'rerendering');
  },

  cleanup: function cleanup(view) {
    view.currentState.destroyElement(view);
  },

  // once the view is already in the DOM, destroying it removes it
  // from the DOM, nukes its element, and puts it back into the
  // preRender state if inDOM.

  destroyElement: function destroyElement(view) {
    view.renderer.remove(view, false);
    return view;
  },

  // Handle events from `Ember.EventDispatcher`
  handleEvent: function handleEvent(view, eventName, evt) {
    if (view.has(eventName)) {
      // Handler should be able to re-dispatch events, so we don't
      // preventDefault or stopPropagation.
      return view.trigger(eventName, evt);
    } else {
      return true; // continue event propagation
    }
  },

  invokeObserver: function invokeObserver(target, observer) {
    observer.call(target);
  }
});

exports['default'] = hasElement;
module.exports = exports['default'];