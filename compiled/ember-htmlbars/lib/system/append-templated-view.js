/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = appendTemplatedView;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

function appendTemplatedView(parentView, morph, viewClassOrInstance, props) {
  var viewProto;
  if (_emberViewsViewsView2['default'].detectInstance(viewClassOrInstance)) {
    viewProto = viewClassOrInstance;
  } else {
    viewProto = viewClassOrInstance.proto();
  }

  _emberMetalCore2['default'].assert('You cannot provide a template block if you also specified a templateName', !props.template || !(0, _emberMetalProperty_get.get)(props, 'templateName') && !(0, _emberMetalProperty_get.get)(viewProto, 'templateName'));

  // We only want to override the `_context` computed property if there is
  // no specified controller. See View#_context for more information.

  var noControllerInProto = !viewProto.controller;
  if (viewProto.controller && viewProto.controller.isDescriptor) {
    noControllerInProto = true;
  }
  if (noControllerInProto && !viewProto.controllerBinding && !props.controller && !props.controllerBinding) {
    props._context = (0, _emberMetalProperty_get.get)(parentView, 'context'); // TODO: is this right?!
  }

  props._morph = morph;

  return parentView.appendChild(viewClassOrInstance, props);
}

module.exports = exports['default'];