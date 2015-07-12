/**
@module ember-metal
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.Descriptor = Descriptor;
exports.MANDATORY_SETTER_FUNCTION = MANDATORY_SETTER_FUNCTION;
exports.DEFAULT_GETTER_FUNCTION = DEFAULT_GETTER_FUNCTION;
exports.defineProperty = defineProperty;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalProperty_events = require('ember-metal/property_events');

// ..........................................................
// DESCRIPTOR
//

/**
  Objects of this type can implement an interface to respond to requests to
  get and set. The default implementation handles simple properties.

  @class Descriptor
  @private
*/

function Descriptor() {
  this.isDescriptor = true;
}

// ..........................................................
// DEFINING PROPERTIES API
//

function MANDATORY_SETTER_FUNCTION(name) {
  return function SETTER_FUNCTION(value) {
    _emberMetalCore2['default'].assert('You must use Ember.set() to set the `' + name + '` property (of ' + this + ') to `' + value + '`.', false);
  };
}

function DEFAULT_GETTER_FUNCTION(name) {
  return function GETTER_FUNCTION() {
    var meta = this['__ember_meta__'];
    return meta && meta.values[name];
  };
}

/**
  NOTE: This is a low-level method used by other parts of the API. You almost
  never want to call this method directly. Instead you should use
  `Ember.mixin()` to define new properties.

  Defines a property on an object. This method works much like the ES5
  `Object.defineProperty()` method except that it can also accept computed
  properties and other special descriptors.

  Normally this method takes only three parameters. However if you pass an
  instance of `Descriptor` as the third param then you can pass an
  optional value as the fourth parameter. This is often more efficient than
  creating new descriptor hashes for each property.

  ## Examples

  ```javascript
  // ES5 compatible mode
  Ember.defineProperty(contact, 'firstName', {
    writable: true,
    configurable: false,
    enumerable: true,
    value: 'Charles'
  });

  // define a simple property
  Ember.defineProperty(contact, 'lastName', undefined, 'Jolley');

  // define a computed property
  Ember.defineProperty(contact, 'fullName', Ember.computed(function() {
    return this.firstName+' '+this.lastName;
  }).property('firstName', 'lastName'));
  ```

  @private
  @method defineProperty
  @for Ember
  @param {Object} obj the object to define this property on. This may be a prototype.
  @param {String} keyName the name of the property
  @param {Descriptor} [desc] an instance of `Descriptor` (typically a
    computed property) or an ES5 descriptor.
    You must provide this or `data` but not both.
  @param {*} [data] something other than a descriptor, that will
    become the explicit value of this property.
*/

function defineProperty(obj, keyName, desc, data, meta) {
  var possibleDesc, existingDesc, watching, value;

  if (!meta) {
    meta = (0, _emberMetalUtils.meta)(obj);
  }
  var watchEntry = meta.watching[keyName];
  possibleDesc = obj[keyName];
  existingDesc = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor ? possibleDesc : undefined;

  watching = watchEntry !== undefined && watchEntry > 0;

  if (existingDesc) {
    existingDesc.teardown(obj, keyName);
  }

  if (desc instanceof Descriptor) {
    value = desc;
    if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
      if (watching) {
        Object.defineProperty(obj, keyName, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: value
        });
      } else {
        obj[keyName] = value;
      }
    } else {
      obj[keyName] = value;
    }
    if (desc.setup) {
      desc.setup(obj, keyName);
    }
  } else {
    if (desc == null) {
      value = data;

      if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
        if (watching) {
          meta.values[keyName] = data;
          Object.defineProperty(obj, keyName, {
            configurable: true,
            enumerable: true,
            set: MANDATORY_SETTER_FUNCTION(keyName),
            get: DEFAULT_GETTER_FUNCTION(keyName)
          });
        } else {
          obj[keyName] = data;
        }
      } else {
        obj[keyName] = data;
      }
    } else {
      value = desc;

      // fallback to ES5
      Object.defineProperty(obj, keyName, desc);
    }
  }

  // if key is being watched, override chains that
  // were initialized with the prototype
  if (watching) {
    (0, _emberMetalProperty_events.overrideChains)(obj, keyName, meta);
  }

  // The `value` passed to the `didDefineProperty` hook is
  // either the descriptor or data, whichever was passed.
  if (obj.didDefineProperty) {
    obj.didDefineProperty(obj, keyName, value);
  }

  return this;
}