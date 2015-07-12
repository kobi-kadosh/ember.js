'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.cloneStates = cloneStates;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberViewsViewsStatesDefault = require('ember-views/views/states/default');

var _emberViewsViewsStatesDefault2 = _interopRequireDefault(_emberViewsViewsStatesDefault);

var _emberViewsViewsStatesPre_render = require('ember-views/views/states/pre_render');

var _emberViewsViewsStatesPre_render2 = _interopRequireDefault(_emberViewsViewsStatesPre_render);

var _emberViewsViewsStatesHas_element = require('ember-views/views/states/has_element');

var _emberViewsViewsStatesHas_element2 = _interopRequireDefault(_emberViewsViewsStatesHas_element);

var _emberViewsViewsStatesIn_dom = require('ember-views/views/states/in_dom');

var _emberViewsViewsStatesIn_dom2 = _interopRequireDefault(_emberViewsViewsStatesIn_dom);

var _emberViewsViewsStatesDestroying = require('ember-views/views/states/destroying');

var _emberViewsViewsStatesDestroying2 = _interopRequireDefault(_emberViewsViewsStatesDestroying);

function cloneStates(from) {
  var into = {};

  into._default = {};
  into.preRender = Object.create(into._default);
  into.destroying = Object.create(into._default);
  into.hasElement = Object.create(into._default);
  into.inDOM = Object.create(into.hasElement);

  for (var stateName in from) {
    if (!from.hasOwnProperty(stateName)) {
      continue;
    }
    (0, _emberMetalMerge2['default'])(into[stateName], from[stateName]);
  }

  return into;
}

var states = {
  _default: _emberViewsViewsStatesDefault2['default'],
  preRender: _emberViewsViewsStatesPre_render2['default'],
  inDOM: _emberViewsViewsStatesIn_dom2['default'],
  hasElement: _emberViewsViewsStatesHas_element2['default'],
  destroying: _emberViewsViewsStatesDestroying2['default']
};
exports.states = states;