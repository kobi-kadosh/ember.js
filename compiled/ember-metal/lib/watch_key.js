'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.watchKey = watchKey;
exports.unwatchKey = unwatchKey;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalProperties = require('ember-metal/properties');

function watchKey(obj, keyName, meta) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && Array.isArray(obj)) {
    return;
  }

  var m = meta || (0, _emberMetalUtils.meta)(obj);
  var watching = m.watching;

  // activate watching first time
  if (!watching[keyName]) {
    watching[keyName] = 1;

    var possibleDesc = obj[keyName];
    var desc = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor ? possibleDesc : undefined;
    if (desc && desc.willWatch) {
      desc.willWatch(obj, keyName);
    }

    if ('function' === typeof obj.willWatchProperty) {
      obj.willWatchProperty(keyName);
    }

    if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
      handleMandatorySetter(m, obj, keyName);
    }
  } else {
    watching[keyName] = (watching[keyName] || 0) + 1;
  }
}

if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
  var handleMandatorySetter = function handleMandatorySetter(m, obj, keyName) {
    var descriptor = Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(obj, keyName);
    var configurable = descriptor ? descriptor.configurable : true;
    var isWritable = descriptor ? descriptor.writable : true;
    var hasValue = descriptor ? 'value' in descriptor : true;
    var possibleDesc = descriptor && descriptor.value;
    var isDescriptor = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor;

    if (isDescriptor) {
      return;
    }

    // this x in Y deopts, so keeping it in this function is better;
    if (configurable && isWritable && hasValue && keyName in obj) {
      m.values[keyName] = obj[keyName];
      Object.defineProperty(obj, keyName, {
        configurable: true,
        enumerable: Object.prototype.propertyIsEnumerable.call(obj, keyName),
        set: (0, _emberMetalProperties.MANDATORY_SETTER_FUNCTION)(keyName),
        get: (0, _emberMetalProperties.DEFAULT_GETTER_FUNCTION)(keyName)
      });
    }
  };
}

// This is super annoying, but required until
// https://github.com/babel/babel/issues/906 is resolved
; // jshint ignore:line

function unwatchKey(obj, keyName, meta) {
  var m = meta || (0, _emberMetalUtils.meta)(obj);
  var watching = m.watching;

  if (watching[keyName] === 1) {
    watching[keyName] = 0;

    var possibleDesc = obj[keyName];
    var desc = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor ? possibleDesc : undefined;
    if (desc && desc.didUnwatch) {
      desc.didUnwatch(obj, keyName);
    }

    if ('function' === typeof obj.didUnwatchProperty) {
      obj.didUnwatchProperty(keyName);
    }

    if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
      if (!desc && keyName in obj) {
        Object.defineProperty(obj, keyName, {
          configurable: true,
          enumerable: Object.prototype.propertyIsEnumerable.call(obj, keyName),
          set: function set(val) {
            // redefine to set as enumerable
            Object.defineProperty(obj, keyName, {
              configurable: true,
              writable: true,
              enumerable: true,
              value: val
            });
            delete m.values[keyName];
          },
          get: (0, _emberMetalProperties.DEFAULT_GETTER_FUNCTION)(keyName)
        });
      }
    }
  } else if (watching[keyName] > 1) {
    watching[keyName]--;
  }
}