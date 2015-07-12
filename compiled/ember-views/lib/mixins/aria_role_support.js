/**
 @module ember
 @submodule ember-views
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberMetalMixin = require('ember-metal/mixin');

/**
 @class AriaRoleSupport
 @namespace Ember
 @private
*/
exports['default'] = _emberMetalMixin.Mixin.create({
  attributeBindings: ['ariaRole:role'],

  /**
   The WAI-ARIA role of the control represented by this view. For example, a
   button may have a role of type 'button', or a pane may have a role of
   type 'alertdialog'. This property is used by assistive software to help
   visually challenged users navigate rich web applications.
     The full list of valid WAI-ARIA roles is available at:
   [http://www.w3.org/TR/wai-aria/roles#roles_categorization](http://www.w3.org/TR/wai-aria/roles#roles_categorization)
     @property ariaRole
   @type String
   @default null
   @public
  */
  ariaRole: null
});
module.exports = exports['default'];