'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setProperties;

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalProperty_set = require('ember-metal/property_set');

/**
  Set a list of properties on an object. These properties are set inside
  a single `beginPropertyChanges` and `endPropertyChanges` batch, so
  observers will be buffered.

  ```javascript
  var anObject = Ember.Object.create();

  anObject.setProperties({
    firstName: 'Stanley',
    lastName: 'Stuart',
    age: 21
  });
  ```

  @method setProperties
  @param obj
  @param {Object} properties
  @return properties
  @public
*/

function setProperties(obj, properties) {
  if (!properties || typeof properties !== 'object') {
    return properties;
  }
  (0, _emberMetalProperty_events.changeProperties)(function () {
    var props = Object.keys(properties);
    var propertyName;

    for (var i = 0, l = props.length; i < l; i++) {
      propertyName = props[i];

      (0, _emberMetalProperty_set.set)(obj, propertyName, properties[propertyName]);
    }
  });
  return properties;
}

module.exports = exports['default'];