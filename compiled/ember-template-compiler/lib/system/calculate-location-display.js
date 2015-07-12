'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = calculateLocationDisplay;

function calculateLocationDisplay(moduleName, _loc) {
  var loc = _loc || {};

  var _ref = loc.start || {};

  var column = _ref.column;
  var line = _ref.line;

  var moduleInfo = '';
  if (moduleName) {
    moduleInfo += '\'' + moduleName + '\' ';
  }

  if (line !== undefined && column !== undefined) {
    if (moduleName) {
      // only prepend @ if the moduleName was present
      moduleInfo += '@ ';
    }
    moduleInfo += 'L' + line + ':C' + column;
  }

  if (moduleInfo) {
    moduleInfo = '(' + moduleInfo + ') ';
  }

  return moduleInfo;
}

module.exports = exports['default'];