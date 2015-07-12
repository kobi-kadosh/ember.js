/**
@module ember
@submodule ember-views
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberViewsMixinsText_support = require('ember-views/mixins/text_support');

var _emberViewsMixinsText_support2 = _interopRequireDefault(_emberViewsMixinsText_support);

/**
  The internal class used to create textarea element when the `{{textarea}}`
  helper is used.

  See [handlebars.helpers.textarea](/api/classes/Ember.Handlebars.helpers.html#method_textarea)  for usage details.

  ## Layout and LayoutName properties

  Because HTML `textarea` elements do not contain inner HTML the `layout` and
  `layoutName` properties will not be applied. See [Ember.View](/api/classes/Ember.View.html)'s
  layout section for more information.

  @class TextArea
  @namespace Ember
  @extends Ember.Component
  @uses Ember.TextSupport
  @public
*/
exports['default'] = _emberViewsViewsComponent2['default'].extend(_emberViewsMixinsText_support2['default'], {
  instrumentDisplay: '{{textarea}}',

  classNames: ['ember-text-area'],

  tagName: 'textarea',
  attributeBindings: ['rows', 'cols', 'name', 'selectionEnd', 'selectionStart', 'wrap', 'lang', 'dir', 'value'],
  rows: null,
  cols: null
});
module.exports = exports['default'];