/**
@module ember
@submodule ember-views
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var EMPTY_ARRAY = [];

/**
  @class ClassNamesSupport
  @namespace Ember
  @private
*/
exports['default'] = _emberMetalMixin.Mixin.create({
  concatenatedProperties: ['classNames', 'classNameBindings'],

  init: function init() {
    this._super.apply(this, arguments);

    _emberMetalCore2['default'].assert('Only arrays are allowed for \'classNameBindings\'', Array.isArray(this.classNameBindings));
    this.classNameBindings = (0, _emberRuntimeSystemNative_array.A)(this.classNameBindings.slice());

    _emberMetalCore2['default'].assert('Only arrays of static class strings are allowed for \'classNames\'. For dynamic classes, use \'classNameBindings\'.', Array.isArray(this.classNames));
    this.classNames = (0, _emberRuntimeSystemNative_array.A)(this.classNames.slice());
  },

  /**
    Standard CSS class names to apply to the view's outer element. This
    property automatically inherits any class names defined by the view's
    superclasses as well.
      @property classNames
    @type Array
    @default ['ember-view']
    @public
  */
  classNames: ['ember-view'],

  /**
    A list of properties of the view to apply as class names. If the property
    is a string value, the value of that string will be applied as a class
    name.
      ```javascript
    // Applies the 'high' class to the view element
    Ember.View.extend({
      classNameBindings: ['priority']
      priority: 'high'
    });
    ```
      If the value of the property is a Boolean, the name of that property is
    added as a dasherized class name.
      ```javascript
    // Applies the 'is-urgent' class to the view element
    Ember.View.extend({
      classNameBindings: ['isUrgent']
      isUrgent: true
    });
    ```
      If you would prefer to use a custom value instead of the dasherized
    property name, you can pass a binding like this:
      ```javascript
    // Applies the 'urgent' class to the view element
    Ember.View.extend({
      classNameBindings: ['isUrgent:urgent']
      isUrgent: true
    });
    ```
      This list of properties is inherited from the view's superclasses as well.
      @property classNameBindings
    @type Array
    @default []
    @public
  */
  classNameBindings: EMPTY_ARRAY
});
module.exports = exports['default'];