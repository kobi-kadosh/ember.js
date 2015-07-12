'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsStatesDefault = require('ember-views/views/states/default');

var _emberViewsViewsStatesDefault2 = _interopRequireDefault(_emberViewsViewsStatesDefault);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

/**
@module ember
@submodule ember-views
*/

var preRender = Object.create(_emberViewsViewsStatesDefault2['default']);

(0, _emberMetalMerge2['default'])(preRender, {
  legacyAttrWillChange: function legacyAttrWillChange(view, key) {},
  legacyAttrDidChange: function legacyAttrDidChange(view, key) {},
  legacyPropertyDidChange: function legacyPropertyDidChange(view, key) {}
});

exports['default'] = preRender;
module.exports = exports['default'];