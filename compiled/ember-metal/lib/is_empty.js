'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

/**
  Verifies that a value is `null` or an empty string, empty array,
  or empty function.

  Constrains the rules on `Ember.isNone` by returning true for empty
  string and empty arrays.

  ```javascript
  Ember.isEmpty();                // true
  Ember.isEmpty(null);            // true
  Ember.isEmpty(undefined);       // true
  Ember.isEmpty('');              // true
  Ember.isEmpty([]);              // true
  Ember.isEmpty({});              // false
  Ember.isEmpty('Adam Hawkins');  // false
  Ember.isEmpty([0,1,2]);         // false
  ```

  @method isEmpty
  @for Ember
  @param {Object} obj Value to test
  @return {Boolean}
  @public
*/
function isEmpty(obj) {
  var none = (0, _emberMetalIs_none2['default'])(obj);
  if (none) {
    return none;
  }

  if (typeof obj.size === 'number') {
    return !obj.size;
  }

  var objectType = typeof obj;

  if (objectType === 'object') {
    var size = (0, _emberMetalProperty_get.get)(obj, 'size');
    if (typeof size === 'number') {
      return !size;
    }
  }

  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  if (objectType === 'object') {
    var length = (0, _emberMetalProperty_get.get)(obj, 'length');
    if (typeof length === 'number') {
      return !length;
    }
  }

  return false;
}

exports['default'] = isEmpty;
module.exports = exports['default'];