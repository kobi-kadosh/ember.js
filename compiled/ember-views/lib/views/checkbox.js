'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

/**
@module ember
@submodule ember-views
*/

/**
  The internal class used to create text inputs when the `{{input}}`
  helper is used with `type` of `checkbox`.

  See [handlebars.helpers.input](/api/classes/Ember.Handlebars.helpers.html#method_input)  for usage details.

  ## Direct manipulation of `checked`

  The `checked` attribute of an `Ember.Checkbox` object should always be set
  through the Ember object or by interacting with its rendered element
  representation via the mouse, keyboard, or touch. Updating the value of the
  checkbox via jQuery will result in the checked value of the object and its
  element losing synchronization.

  ## Layout and LayoutName properties

  Because HTML `input` elements are self closing `layout` and `layoutName`
  properties will not be applied. See [Ember.View](/api/classes/Ember.View.html)'s
  layout section for more information.

  @class Checkbox
  @namespace Ember
  @extends Ember.Component
  @public
*/
exports['default'] = _emberViewsViewsComponent2['default'].extend({
  instrumentDisplay: '{{input type="checkbox"}}',

  classNames: ['ember-checkbox'],

  tagName: 'input',

  attributeBindings: ['type', 'checked', 'indeterminate', 'disabled', 'tabindex', 'name', 'autofocus', 'required', 'form'],

  type: 'checkbox',
  checked: false,
  disabled: false,
  indeterminate: false,

  init: function init() {
    this._super.apply(this, arguments);
    this.on('change', this, this._updateElementValue);
  },

  didInsertElement: function didInsertElement() {
    this._super.apply(this, arguments);
    (0, _emberMetalProperty_get.get)(this, 'element').indeterminate = !!(0, _emberMetalProperty_get.get)(this, 'indeterminate');
  },

  _updateElementValue: function _updateElementValue() {
    (0, _emberMetalProperty_set.set)(this, 'checked', this.$().prop('checked'));
  }
});
module.exports = exports['default'];