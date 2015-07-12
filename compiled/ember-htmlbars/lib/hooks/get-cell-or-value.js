'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getCellOrValue;

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberHtmlbarsKeywordsMut = require('ember-htmlbars/keywords/mut');

function getCellOrValue(ref) {
  if (ref && ref[_emberHtmlbarsKeywordsMut.MUTABLE_REFERENCE]) {
    // reify the mutable reference into a mutable cell
    return ref.cell();
  }

  // get the value out of the reference
  return (0, _emberMetalStreamsUtils.read)(ref);
}

module.exports = exports['default'];