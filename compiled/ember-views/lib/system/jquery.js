'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

// ES6TODO: the functions on EnumerableUtils need their own exports

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

var jQuery;

if (_emberMetalEnvironment2['default'].hasDOM) {
  // mainContext is set in `package/loader/lib/main.js` to the `this` context before entering strict mode
  jQuery = _emberMetalCore2['default'].imports && _emberMetalCore2['default'].imports.jQuery || mainContext && mainContext.jQuery; //jshint ignore:line
  if (!jQuery && typeof require === 'function') {
    jQuery = require('jquery');
  }

  _emberMetalCore2['default'].assert('Ember Views require jQuery between 1.7 and 2.1', jQuery && (jQuery().jquery.match(/^((1\.(7|8|9|10|11))|(2\.(0|1)))(\.\d+)?(pre|rc\d?)?/) || _emberMetalCore2['default'].ENV.FORCE_JQUERY));

  if (jQuery) {
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dndevents
    var dragEvents = ['dragstart', 'drag', 'dragenter', 'dragleave', 'dragover', 'drop', 'dragend'];

    // Copies the `dataTransfer` property from a browser event object onto the
    // jQuery event object for the specified events
    dragEvents.forEach(function (eventName) {
      jQuery.event.fixHooks[eventName] = {
        props: ['dataTransfer']
      };
    });
  }
}

exports['default'] = jQuery;
module.exports = exports['default'];