/**
 @module ember
 @submodule ember-views
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMixin = require('ember-metal/mixin');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalComputed = require('ember-metal/computed');

/**
 @class EmptyViewSupport
 @namespace Ember
 @private
*/
exports['default'] = _emberMetalMixin.Mixin.create({
  /**
   This provides metadata about what kind of empty view class this
   collection would like if it is being instantiated from another
   system (like Handlebars)
     @private
   @property emptyViewClass
  */
  emptyViewClass: _emberViewsViewsView2['default'],

  /**
   An optional view to display if content is set to an empty array.
     @property emptyView
   @type Ember.View
   @default null
   @private
  */
  emptyView: null,

  _emptyView: (0, _emberMetalComputed.computed)('emptyView', 'attrs.emptyViewClass', 'emptyViewClass', function () {
    var emptyView = (0, _emberMetalProperty_get.get)(this, 'emptyView');
    var attrsEmptyViewClass = this.getAttr('emptyViewClass');
    var emptyViewClass = (0, _emberMetalProperty_get.get)(this, 'emptyViewClass');
    var inverse = (0, _emberMetalProperty_get.get)(this, '_itemViewInverse');
    var actualEmpty = emptyView || attrsEmptyViewClass;

    // Somehow, our previous semantics differed depending on whether the
    // `emptyViewClass` was provided on the JavaScript class or via the
    // Handlebars template.
    // In Glimmer, we disambiguate between the two by checking first (and
    // preferring) the attrs-supplied class.
    // If not present, we fall back to the class's `emptyViewClass`, but only
    // if an inverse has been provided via an `{{else}}`.
    if (inverse && actualEmpty) {
      if (actualEmpty.extend) {
        return actualEmpty.extend({ template: inverse });
      } else {
        (0, _emberMetalProperty_set.set)(actualEmpty, 'template', inverse);
      }
    } else if (inverse && emptyViewClass) {
      return emptyViewClass.extend({ template: inverse });
    }

    return actualEmpty;
  })
});
module.exports = exports['default'];