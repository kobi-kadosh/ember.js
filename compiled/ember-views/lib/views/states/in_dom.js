'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalObserver = require('ember-metal/observer');

var _emberViewsViewsStatesHas_element = require('ember-views/views/states/has_element');

var _emberViewsViewsStatesHas_element2 = _interopRequireDefault(_emberViewsViewsStatesHas_element);

/**
@module ember
@submodule ember-views
*/

var inDOM = Object.create(_emberViewsViewsStatesHas_element2['default']);

(0, _emberMetalMerge2['default'])(inDOM, {
  enter: function enter(view) {
    // Register the view for event handling. This hash is used by
    // Ember.EventDispatcher to dispatch incoming events.
    if (view.tagName !== '') {
      view._register();
    }

    _emberMetalCore2['default'].runInDebug(function () {
      (0, _emberMetalObserver.addBeforeObserver)(view, 'elementId', function () {
        throw new _emberMetalError2['default']('Changing a view\'s elementId after creation is not allowed');
      });
    });
  },

  exit: function exit(view) {
    view._unregister();
  },

  appendAttr: function appendAttr(view, attrNode) {
    var childViews = view.childViews;

    if (!childViews.length) {
      childViews = view.childViews = childViews.slice();
    }
    childViews.push(attrNode);

    attrNode.parentView = view;
    view.renderer.appendAttrTo(attrNode, view.element, attrNode.attrName);

    view.propertyDidChange('childViews');

    return attrNode;
  }

});

exports['default'] = inDOM;
module.exports = exports['default'];