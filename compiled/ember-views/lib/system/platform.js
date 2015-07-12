'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

// IE 6/7 have bugs around setting names on inputs during creation.
// From http://msdn.microsoft.com/en-us/library/ie/ms536389(v=vs.85).aspx:
// "To include the NAME attribute at run time on objects created with the createElement method, use the eTag."
var canSetNameOnInputs = _emberMetalEnvironment2['default'].hasDOM && (function () {
  var div = document.createElement('div');
  var el = document.createElement('input');

  el.setAttribute('name', 'foo');
  div.appendChild(el);

  return !!div.innerHTML.match('foo');
})();
exports.canSetNameOnInputs = canSetNameOnInputs;