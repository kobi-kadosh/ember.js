/*jshint newcap:false*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.deprecate

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalMixin = require('ember-metal/mixin');

/**
 @module ember
 @submodule ember-views
*/

// The `morph` and `outerHTML` properties are internal only
// and not observable.

/**
 @class _Metamorph
 @namespace Ember
 @private
*/
var _Metamorph = _emberMetalMixin.Mixin.create({
  tagName: '',
  __metamorphType: 'Ember._Metamorph',

  instrumentName: 'metamorph',

  init: function init() {
    this._super.apply(this, arguments);
    _emberMetalCore2['default'].deprecate('Supplying a tagName to Metamorph views is unreliable and is deprecated.' + ' You may be setting the tagName on a Handlebars helper that creates a Metamorph.', !this.tagName);

    _emberMetalCore2['default'].deprecate('Using ' + this.__metamorphType + ' is deprecated.');
  }
});

exports._Metamorph = _Metamorph;
/**
 @class _MetamorphView
 @namespace Ember
 @extends Ember.View
 @uses Ember._Metamorph
 @private
*/
exports['default'] = _emberViewsViewsView2['default'].extend(_Metamorph, {
  __metamorphType: 'Ember._MetamorphView'
});