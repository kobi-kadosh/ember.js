'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

var objectControllerDeprecation = 'Ember.ObjectController is deprecated, ' + 'please use Ember.Controller and use `model.propertyName`.';

exports.objectControllerDeprecation = objectControllerDeprecation;
/**
@module ember
@submodule ember-runtime
*/

/**
  `Ember.ObjectController` is part of Ember's Controller layer. It is intended
  to wrap a single object, proxying unhandled attempts to `get` and `set` to the underlying
  model object, and to forward unhandled action attempts to its `target`.

  `Ember.ObjectController` derives this functionality from its superclass
  `Ember.ObjectProxy` and the `Ember.ControllerMixin` mixin.

  @class ObjectController
  @namespace Ember
  @extends Ember.ObjectProxy
  @uses Ember.ControllerMixin
  @deprecated
  @public
**/
exports['default'] = _emberRuntimeSystemObject_proxy2['default'].extend(_emberRuntimeMixinsController2['default'], {
  init: function init() {
    this._super();
    _emberMetalCore2['default'].deprecate(objectControllerDeprecation, this.isGenerated);
  }
});