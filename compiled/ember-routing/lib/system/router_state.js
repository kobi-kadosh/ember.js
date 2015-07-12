'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_empty = require('ember-metal/is_empty');

var _emberMetalIs_empty2 = _interopRequireDefault(_emberMetalIs_empty);

var _emberMetalKeys = require('ember-metal/keys');

var _emberMetalKeys2 = _interopRequireDefault(_emberMetalKeys);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var RouterState = _emberRuntimeSystemObject2['default'].extend({
  emberRouter: null,
  routerJs: null,
  routerJsState: null,

  isActiveIntent: function isActiveIntent(routeName, models, queryParams, queryParamsMustMatch) {
    var state = this.routerJsState;
    if (!this.routerJs.isActiveIntent(routeName, models, null, state)) {
      return false;
    }

    var emptyQueryParams = (0, _emberMetalIs_empty2['default'])((0, _emberMetalKeys2['default'])(queryParams));

    if (queryParamsMustMatch && !emptyQueryParams) {
      var visibleQueryParams = {};
      (0, _emberMetalMerge2['default'])(visibleQueryParams, queryParams);

      this.emberRouter._prepareQueryParams(routeName, models, visibleQueryParams);
      return shallowEqual(visibleQueryParams, state.queryParams);
    }

    return true;
  }
});

function shallowEqual(a, b) {
  var k;
  for (k in a) {
    if (a.hasOwnProperty(k) && a[k] !== b[k]) {
      return false;
    }
  }
  for (k in b) {
    if (b.hasOwnProperty(k) && a[k] !== b[k]) {
      return false;
    }
  }
  return true;
}

exports['default'] = RouterState;
module.exports = exports['default'];