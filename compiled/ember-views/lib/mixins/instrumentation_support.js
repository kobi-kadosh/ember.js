/**
@module ember
@submodule ember-views
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_get = require('ember-metal/property_get');

/**
  @class InstrumentationSupport
  @namespace Ember
  @public
*/
var InstrumentationSupport = _emberMetalMixin.Mixin.create({
  /**
    Used to identify this view during debugging
      @property instrumentDisplay
    @type String
    @public
  */
  instrumentDisplay: (0, _emberMetalComputed.computed)(function () {
    if (this.helperName) {
      return '{{' + this.helperName + '}}';
    }
  }),

  instrumentName: 'view',

  instrumentDetails: function instrumentDetails(hash) {
    hash.template = (0, _emberMetalProperty_get.get)(this, 'templateName');
    this._super(hash);
  }
});

exports['default'] = InstrumentationSupport;
module.exports = exports['default'];