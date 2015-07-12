'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isPresent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_blank = require('ember-metal/is_blank');

var _emberMetalIs_blank2 = _interopRequireDefault(_emberMetalIs_blank);

/**
  A value is present if it not `isBlank`.

  ```javascript
  Ember.isPresent();                // false
  Ember.isPresent(null);            // false
  Ember.isPresent(undefined);       // false
  Ember.isPresent(false);           // false
  Ember.isPresent('');              // false
  Ember.isPresent([]);              // false
  Ember.isPresent('\n\t');          // false
  Ember.isPresent('  ');            // false
  Ember.isPresent({});              // true
  Ember.isPresent('\n\t Hello');    // true
  Ember.isPresent('Hello world');   // true
  Ember.isPresent([1,2,3]);         // true
  ```

  @method isPresent
  @for Ember
  @param {Object} obj Value to test
  @return {Boolean}
  @since 1.8.0
  @public
*/

function isPresent(obj) {
  return !(0, _emberMetalIs_blank2['default'])(obj);
}

module.exports = exports['default'];