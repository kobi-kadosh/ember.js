'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.instrument = instrument;

var _emberMetalInstrumentation = require('ember-metal/instrumentation');

/**
  Provides instrumentation for node managers.

  Wrap your node manager's render and re-render methods
  with this function.

  @param {Object} component Component or View instance (optional)
  @param {Function} callback The function to instrument
  @param {Object} context The context to call the function with
  @return {Object} Return value from the invoked callback
  @private
*/

function instrument(component, callback, context) {
  var instrumentName, val, details, end;
  // Only instrument if there's at least one subscriber.
  if (_emberMetalInstrumentation.subscribers.length) {
    if (component) {
      instrumentName = component.instrumentName;
    } else {
      instrumentName = 'node';
    }
    details = {};
    if (component) {
      component.instrumentDetails(details);
    }
    end = (0, _emberMetalInstrumentation._instrumentStart)('render.' + instrumentName, function viewInstrumentDetails() {
      return details;
    });
    val = callback.call(context);
    if (end) {
      end();
    }
    return val;
  } else {
    return callback.call(context);
  }
}