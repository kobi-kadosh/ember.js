/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = logHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

/**
  `log` allows you to output the value of variables in the current rendering
  context. `log` also accepts primitive types such as strings or numbers.
  ```handlebars
  {{log "myVariable:" myVariable }}
  ```
  @method log
  @for Ember.Handlebars.helpers
  @param {*} values
  @public
*/

function logHelper(values) {
  _emberMetalLogger2['default'].log.apply(null, values);
}

module.exports = exports['default'];