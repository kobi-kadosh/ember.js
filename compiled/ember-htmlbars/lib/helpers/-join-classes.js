/*
  this private helper is used to join and compact a list of class names

  @private
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = joinClasses;

function joinClasses(classNames) {
  var result = [];

  for (var i = 0, l = classNames.length; i < l; i++) {
    var className = classNames[i];
    if (className) {
      result.push(className);
    }
  }

  return result.join(' ');
}

module.exports = exports['default'];