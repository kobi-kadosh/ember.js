/**
@module ember
@submodule ember-runtime
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeMixinsFreezable = require('ember-runtime/mixins/freezable');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

/**
  Implements some standard methods for copying an object. Add this mixin to
  any object you create that can create a copy of itself. This mixin is
  added automatically to the built-in array.

  You should generally implement the `copy()` method to return a copy of the
  receiver.

  Note that `frozenCopy()` will only work if you also implement
  `Ember.Freezable`.

  @class Copyable
  @namespace Ember
  @since Ember 0.9
  @private
*/
exports['default'] = _emberMetalMixin.Mixin.create({
  /**
    __Required.__ You must implement this method to apply this mixin.
      Override to return a copy of the receiver. Default implementation raises
    an exception.
      @method copy
    @param {Boolean} deep if `true`, a deep copy of the object should be made
    @return {Object} copy of receiver
    @private
  */
  copy: null,

  /**
    If the object implements `Ember.Freezable`, then this will return a new
    copy if the object is not frozen and the receiver if the object is frozen.
      Raises an exception if you try to call this method on a object that does
    not support freezing.
      You should use this method whenever you want a copy of a freezable object
    since a freezable object can simply return itself without actually
    consuming more memory.
      @method frozenCopy
    @return {Object} copy of receiver or receiver
    @private
  */
  frozenCopy: function frozenCopy() {
    if (_emberRuntimeMixinsFreezable.Freezable && _emberRuntimeMixinsFreezable.Freezable.detect(this)) {
      return (0, _emberMetalProperty_get.get)(this, 'isFrozen') ? this : this.copy().freeze();
    } else {
      throw new _emberMetalError2['default']((0, _emberRuntimeSystemString.fmt)('%@ does not support freezing', [this]));
    }
  }
});
module.exports = exports['default'];