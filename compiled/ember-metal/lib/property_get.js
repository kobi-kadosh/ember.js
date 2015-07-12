/**
@module ember-metal
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.get = get;
exports.normalizeTuple = normalizeTuple;
exports._getPath = _getPath;
exports.getWithDefault = getWithDefault;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalPath_cache = require('ember-metal/path_cache');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

var FIRST_KEY = /^([^\.]+)/;

var INTERCEPT_GET = (0, _emberMetalUtils.symbol)('INTERCEPT_GET');
exports.INTERCEPT_GET = INTERCEPT_GET;
var UNHANDLED_GET = (0, _emberMetalUtils.symbol)('UNHANDLED_GET');

exports.UNHANDLED_GET = UNHANDLED_GET;
// ..........................................................
// GET AND SET
//
// If we are on a platform that supports accessors we can use those.
// Otherwise simulate accessors by looking up the property directly on the
// object.

/**
  Gets the value of a property on an object. If the property is computed,
  the function will be invoked. If the property is not defined but the
  object implements the `unknownProperty` method then that will be invoked.

  If you plan to run on IE8 and older browsers then you should use this
  method anytime you want to retrieve a property on an object that you don't
  know for sure is private. (Properties beginning with an underscore '_'
  are considered private.)

  On all newer browsers, you only need to use this method to retrieve
  properties if the property might not be defined on the object and you want
  to respect the `unknownProperty` handler. Otherwise you can ignore this
  method.

  Note that if the object itself is `undefined`, this method will throw
  an error.

  @method get
  @for Ember
  @param {Object} obj The object to retrieve from.
  @param {String} keyName The property key to retrieve
  @return {Object} the property value or `null`.
  @public
*/

function get(obj, keyName) {
  // Helpers that operate with 'this' within an #each
  if (keyName === '') {
    return obj;
  }

  if (!keyName && 'string' === typeof obj) {
    keyName = obj;
    obj = _emberMetalCore2['default'].lookup;
  }

  _emberMetalCore2['default'].assert('Cannot call get with ' + keyName + ' key.', !!keyName);
  _emberMetalCore2['default'].assert('Cannot call get with \'' + keyName + '\' on an undefined object.', obj !== undefined);

  if ((0, _emberMetalIs_none2['default'])(obj)) {
    return _getPath(obj, keyName);
  }

  if (obj && typeof obj[INTERCEPT_GET] === 'function') {
    var result = obj[INTERCEPT_GET](obj, keyName);
    if (result !== UNHANDLED_GET) {
      return result;
    }
  }

  var meta = obj['__ember_meta__'];
  var possibleDesc = obj[keyName];
  var desc = possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor ? possibleDesc : undefined;
  var ret;

  if (desc === undefined && (0, _emberMetalPath_cache.isPath)(keyName)) {
    return _getPath(obj, keyName);
  }

  if (desc) {
    return desc.get(obj, keyName);
  } else {
    if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
      if (meta && meta.watching[keyName] > 0) {
        ret = meta.values[keyName];
      } else {
        ret = obj[keyName];
      }
    } else {
      ret = obj[keyName];
    }

    if (ret === undefined && 'object' === typeof obj && !(keyName in obj) && 'function' === typeof obj.unknownProperty) {
      return obj.unknownProperty(keyName);
    }

    return ret;
  }
}

/**
  Normalizes a target/path pair to reflect that actual target/path that should
  be observed, etc. This takes into account passing in global property
  paths (i.e. a path beginning with a capital letter not defined on the
  target).

  @private
  @method normalizeTuple
  @for Ember
  @param {Object} target The current target. May be `null`.
  @param {String} path A path on the target or a global property path.
  @return {Array} a temporary array with the normalized target/path pair.
*/

function normalizeTuple(target, path) {
  var hasThis = (0, _emberMetalPath_cache.hasThis)(path);
  var isGlobal = !hasThis && (0, _emberMetalPath_cache.isGlobal)(path);
  var key;

  if (!target && !isGlobal) {
    return [undefined, ''];
  }

  if (hasThis) {
    path = path.slice(5);
  }

  if (!target || isGlobal) {
    target = _emberMetalCore2['default'].lookup;
  }

  if (isGlobal && (0, _emberMetalPath_cache.isPath)(path)) {
    key = path.match(FIRST_KEY)[0];
    target = get(target, key);
    path = path.slice(key.length + 1);
  }

  // must return some kind of path to be valid else other things will break.
  validateIsPath(path);

  return [target, path];
}

function validateIsPath(path) {
  if (!path || path.length === 0) {
    throw new _emberMetalError2['default']('Object in path ' + path + ' could not be found or was destroyed.');
  }
}

function _getPath(root, path) {
  var hasThis, parts, tuple, idx, len;

  // detect complicated paths and normalize them
  hasThis = (0, _emberMetalPath_cache.hasThis)(path);

  if (!root || hasThis) {
    tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
    tuple.length = 0;
  }

  parts = path.split('.');
  len = parts.length;
  for (idx = 0; root != null && idx < len; idx++) {
    root = get(root, parts[idx], true);
    if (root && root.isDestroyed) {
      return undefined;
    }
  }
  return root;
}

function getWithDefault(root, key, defaultValue) {
  var value = get(root, key);

  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

exports['default'] = get;