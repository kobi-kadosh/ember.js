'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = subscribe;

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function subscribe(node, env, scope, stream) {
  if (!(0, _emberMetalStreamsUtils.isStream)(stream)) {
    return;
  }
  var component = scope.component;
  var unsubscribers = node.streamUnsubscribers = node.streamUnsubscribers || [];

  unsubscribers.push(stream.subscribe(function () {
    node.isDirty = true;

    // Whenever a render node directly inside a component becomes
    // dirty, we want to invoke the willRenderElement and
    // didRenderElement lifecycle hooks. From the perspective of the
    // programming model, whenever anything in the DOM changes, a
    // "re-render" has occured.
    if (component && component._renderNode) {
      component._renderNode.isDirty = true;
    }

    if (node.state.manager) {
      node.shouldReceiveAttrs = true;
    }

    node.ownerNode.emberView.scheduleRevalidate(node, (0, _emberMetalStreamsUtils.labelFor)(stream));
  }));
}

module.exports = exports['default'];