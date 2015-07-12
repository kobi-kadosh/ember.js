'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberViewsViewsStatesDefault = require('ember-views/views/states/default');

var _emberViewsViewsStatesDefault2 = _interopRequireDefault(_emberViewsViewsStatesDefault);

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

/**
@module ember
@submodule ember-views
*/

var destroyingError = 'You can\'t call %@ on a view being destroyed';

var destroying = Object.create(_emberViewsViewsStatesDefault2['default']);

(0, _emberMetalMerge2['default'])(destroying, {
  appendChild: function appendChild() {
    throw new _emberMetalError2['default']((0, _emberRuntimeSystemString.fmt)(destroyingError, ['appendChild']));
  },
  rerender: function rerender() {
    throw new _emberMetalError2['default']((0, _emberRuntimeSystemString.fmt)(destroyingError, ['rerender']));
  },
  destroyElement: function destroyElement() {
    throw new _emberMetalError2['default']((0, _emberRuntimeSystemString.fmt)(destroyingError, ['destroyElement']));
  }
});

exports['default'] = destroying;
module.exports = exports['default'];