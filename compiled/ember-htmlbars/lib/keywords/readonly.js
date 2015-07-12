'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = readonly;

var _emberHtmlbarsKeywordsMut = require('ember-htmlbars/keywords/mut');

function readonly(morph, env, scope, originalParams, hash, template, inverse) {
  // If `morph` is `null` the keyword is being invoked as a subexpression.
  if (morph === null) {
    var stream = originalParams[0];
    if (stream && stream[_emberHtmlbarsKeywordsMut.MUTABLE_REFERENCE]) {
      return stream.sourceDep.dependee;
    }
    return stream;
  }

  return true;
}

module.exports = exports['default'];