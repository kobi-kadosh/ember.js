'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isBlank;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_empty = require('ember-metal/is_empty');

var _emberMetalIs_empty2 = _interopRequireDefault(_emberMetalIs_empty);

/**
  A value is blank if it is empty or a whitespace string.

  ```javascript
  Ember.isBlank();                // true
  Ember.isBlank(null);            // true
  Ember.isBlank(undefined);       // true
  Ember.isBlank('');              // true
  Ember.isBlank([]);              // true
  Ember.isBlank('\n\t');          // true
  Ember.isBlank('  ');            // true
  Ember.isBlank({});              // false
  Ember.isBlank('\n\t Hello');    // false
  Ember.isBlank('Hello world');   // false
  Ember.isBlank([1,2,3]);         // false
  ```

  @method isBlank
  @for Ember
  @param {Object} obj Value to test
  @return {Boolean}
  @since 1.5.0
  @public
*/

function isBlank(obj) {
  return (0, _emberMetalIs_empty2['default'])(obj) || typeof obj === 'string' && obj.match(/\S/) === null;
}

module.exports = exports['default'];