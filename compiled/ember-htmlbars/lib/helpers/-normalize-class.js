'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = normalizeClass;

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberMetalPath_cache = require('ember-metal/path_cache');

/*
  This private helper is used by ComponentNode to convert the classNameBindings
  microsyntax into a class name.

  When a component or view is created, we normalize class name bindings into a
  series of attribute nodes that use this helper.

  @private
*/

function normalizeClass(params, hash) {
  var _params = _slicedToArray(params, 2);

  var propName = _params[0];
  var value = _params[1];
  var activeClass = hash.activeClass;
  var inactiveClass = hash.inactiveClass;

  // When using the colon syntax, evaluate the truthiness or falsiness
  // of the value to determine which className to return
  if (activeClass || inactiveClass) {
    if (!!value) {
      return activeClass;
    } else {
      return inactiveClass;
    }

    // If value is a Boolean and true, return the dasherized property
    // name.
  } else if (value === true) {
    // Only apply to last segment in the path
    if (propName && (0, _emberMetalPath_cache.isPath)(propName)) {
      var segments = propName.split('.');
      propName = segments[segments.length - 1];
    }

    return (0, _emberRuntimeSystemString.dasherize)(propName);

    // If the value is not false, undefined, or null, return the current
    // value of the property.
  } else if (value !== false && value != null) {
    return value;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
  } else {
    return null;
  }
}

module.exports = exports['default'];