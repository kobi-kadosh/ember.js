'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.set = set;
exports.trySet = trySet;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalPath_cache = require('ember-metal/path_cache');

var _emberMetalUtils = require('ember-metal/utils');

var INTERCEPT_SET = (0, _emberMetalUtils.symbol)('INTERCEPT_SET');
exports.INTERCEPT_SET = INTERCEPT_SET;
var UNHANDLED_SET = (0, _emberMetalUtils.symbol)('UNHANDLED_SET');

exports.UNHANDLED_SET = UNHANDLED_SET;
/**
  Sets the value of a property on an object, respecting computed properties
  and notifying observers and other listeners of the change. If the
  property is not defined but the object implements the `setUnknownProperty`
  method then that will be invoked as well.

  @method set
  @for Ember
  @param {Object} obj The object to modify.
  @param {String} keyName The property key to set
  @param {Object} value The value to set
  @return {Object} the passed value.
  @public
*/

function set(obj, keyName, value, tolerant) {
  if (typeof obj === 'string') {
    _emberMetalCore2['default'].assert('Path \'' + obj + '\' must be global if no obj is given.', (0, _emberMetalPath_cache.isGlobalPath)(obj));
    value = keyName;
    keyName = obj;
    obj = _emberMetalCore2['default'].lookup;
  }

  _emberMetalCore2['default'].assert('Cannot call set with \'' + keyName + '\' key.', !!keyName);

  if (obj === _emberMetalCore2['default'].lookup) {
    return setPath(obj, keyName, value, tolerant);
  }

  // This path exists purely to implement backwards-compatible
  // effects (specifically, setting a property on a view may
  // invoke a mutator on `attrs`).
  if (obj && typeof obj[INTERCEPT_SET] === 'function') {
    var result = obj[INTERCEPT_SET](obj, keyName, value, tolerant);
    if (result !== UNHANDLED_SET) {
      return result;
    }
  }

  var meta, possibleDesc, desc;
  if (obj) {
    meta = obj['__ember_meta__'];
    possibleDesc = obj[keyName];
    desc = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor ? possibleDesc : undefined;
  }

  var isUnknown, currentValue;
  if ((!obj || desc === undefined) && (0, _emberMetalPath_cache.isPath)(keyName)) {
    return setPath(obj, keyName, value, tolerant);
  }

  _emberMetalCore2['default'].assert('You need to provide an object and key to `set`.', !!obj && keyName !== undefined);
  _emberMetalCore2['default'].assert('calling set on destroyed object', !obj.isDestroyed);

  if (desc) {
    desc.set(obj, keyName, value);
  } else {

    if (obj !== null && value !== undefined && typeof obj === 'object' && obj[keyName] === value) {
      return value;
    }

    isUnknown = 'object' === typeof obj && !(keyName in obj);

    // setUnknownProperty is called if `obj` is an object,
    // the property does not already exist, and the
    // `setUnknownProperty` method exists on the object
    if (isUnknown && 'function' === typeof obj.setUnknownProperty) {
      obj.setUnknownProperty(keyName, value);
    } else if (meta && meta.watching[keyName] > 0) {
      if (meta.proto !== obj) {
        if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
          currentValue = meta.values[keyName];
        } else {
          currentValue = obj[keyName];
        }
      }
      // only trigger a change if the value has changed
      if (value !== currentValue) {
        (0, _emberMetalProperty_events.propertyWillChange)(obj, keyName);
        if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
          if (currentValue === undefined && !(keyName in obj) || !Object.prototype.propertyIsEnumerable.call(obj, keyName)) {
            (0, _emberMetalProperties.defineProperty)(obj, keyName, null, value); // setup mandatory setter
          } else {
            meta.values[keyName] = value;
          }
        } else {
          obj[keyName] = value;
        }
        (0, _emberMetalProperty_events.propertyDidChange)(obj, keyName);
      }
    } else {
      obj[keyName] = value;
      if (obj[_emberMetalProperty_events.PROPERTY_DID_CHANGE]) {
        obj[_emberMetalProperty_events.PROPERTY_DID_CHANGE](keyName);
      }
    }
  }
  return value;
}

function setPath(root, path, value, tolerant) {
  var keyName;

  // get the last part of the path
  keyName = path.slice(path.lastIndexOf('.') + 1);

  // get the first part of the part
  path = path === keyName ? keyName : path.slice(0, path.length - (keyName.length + 1));

  // unless the path is this, look up the first part to
  // get the root
  if (path !== 'this') {
    root = (0, _emberMetalProperty_get._getPath)(root, path);
  }

  if (!keyName || keyName.length === 0) {
    throw new _emberMetalError2['default']('Property set failed: You passed an empty path');
  }

  if (!root) {
    if (tolerant) {
      return;
    } else {
      throw new _emberMetalError2['default']('Property set failed: object in path "' + path + '" could not be found or was destroyed.');
    }
  }

  return set(root, keyName, value);
}

/**
  Error-tolerant form of `Ember.set`. Will not blow up if any part of the
  chain is `undefined`, `null`, or destroyed.

  This is primarily used when syncing bindings, which may try to update after
  an object has been destroyed.

  @method trySet
  @for Ember
  @param {Object} root The object to modify.
  @param {String} path The property path to set
  @param {Object} value The value to set
  @public
*/

function trySet(root, path, value) {
  return set(root, path, value, true);
}