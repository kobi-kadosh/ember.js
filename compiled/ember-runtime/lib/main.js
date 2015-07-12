/**
@module ember
@submodule ember-runtime
*/

// BEGIN IMPORTS
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetal = require('ember-metal');

var _emberMetal2 = _interopRequireDefault(_emberMetal);

var _emberRuntimeCore = require('ember-runtime/core');

var _emberRuntimeCompare = require('ember-runtime/compare');

var _emberRuntimeCompare2 = _interopRequireDefault(_emberRuntimeCompare);

var _emberRuntimeCopy = require('ember-runtime/copy');

var _emberRuntimeCopy2 = _interopRequireDefault(_emberRuntimeCopy);

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemTracked_array = require('ember-runtime/system/tracked_array');

var _emberRuntimeSystemTracked_array2 = _interopRequireDefault(_emberRuntimeSystemTracked_array);

var _emberRuntimeSystemSubarray = require('ember-runtime/system/subarray');

var _emberRuntimeSystemSubarray2 = _interopRequireDefault(_emberRuntimeSystemSubarray);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

var _emberRuntimeSystemCore_object = require('ember-runtime/system/core_object');

var _emberRuntimeSystemCore_object2 = _interopRequireDefault(_emberRuntimeSystemCore_object);

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberRuntimeSystemNative_array2 = _interopRequireDefault(_emberRuntimeSystemNative_array);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemString2 = _interopRequireDefault(_emberRuntimeSystemString);

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

var _emberRuntimeMixinsArray = require('ember-runtime/mixins/array');

var _emberRuntimeMixinsArray2 = _interopRequireDefault(_emberRuntimeMixinsArray);

var _emberRuntimeMixinsComparable = require('ember-runtime/mixins/comparable');

var _emberRuntimeMixinsComparable2 = _interopRequireDefault(_emberRuntimeMixinsComparable);

var _emberRuntimeMixinsCopyable = require('ember-runtime/mixins/copyable');

var _emberRuntimeMixinsCopyable2 = _interopRequireDefault(_emberRuntimeMixinsCopyable);

var _emberRuntimeMixinsEnumerable = require('ember-runtime/mixins/enumerable');

var _emberRuntimeMixinsEnumerable2 = _interopRequireDefault(_emberRuntimeMixinsEnumerable);

var _emberRuntimeMixinsFreezable = require('ember-runtime/mixins/freezable');

var _emberRuntimeMixinsProxy = require('ember-runtime/mixins/-proxy');

var _emberRuntimeMixinsProxy2 = _interopRequireDefault(_emberRuntimeMixinsProxy);

var _emberRuntimeMixinsObservable = require('ember-runtime/mixins/observable');

var _emberRuntimeMixinsObservable2 = _interopRequireDefault(_emberRuntimeMixinsObservable);

var _emberRuntimeMixinsAction_handler = require('ember-runtime/mixins/action_handler');

var _emberRuntimeMixinsAction_handler2 = _interopRequireDefault(_emberRuntimeMixinsAction_handler);

var _emberRuntimeMixinsMutable_enumerable = require('ember-runtime/mixins/mutable_enumerable');

var _emberRuntimeMixinsMutable_enumerable2 = _interopRequireDefault(_emberRuntimeMixinsMutable_enumerable);

var _emberRuntimeMixinsMutable_array = require('ember-runtime/mixins/mutable_array');

var _emberRuntimeMixinsMutable_array2 = _interopRequireDefault(_emberRuntimeMixinsMutable_array);

var _emberRuntimeMixinsTarget_action_support = require('ember-runtime/mixins/target_action_support');

var _emberRuntimeMixinsTarget_action_support2 = _interopRequireDefault(_emberRuntimeMixinsTarget_action_support);

var _emberRuntimeMixinsEvented = require('ember-runtime/mixins/evented');

var _emberRuntimeMixinsEvented2 = _interopRequireDefault(_emberRuntimeMixinsEvented);

var _emberRuntimeMixinsPromise_proxy = require('ember-runtime/mixins/promise_proxy');

var _emberRuntimeMixinsPromise_proxy2 = _interopRequireDefault(_emberRuntimeMixinsPromise_proxy);

var _emberRuntimeMixinsSortable = require('ember-runtime/mixins/sortable');

var _emberRuntimeMixinsSortable2 = _interopRequireDefault(_emberRuntimeMixinsSortable);

var _emberRuntimeComputedReduce_computed_macros = require('ember-runtime/computed/reduce_computed_macros');

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberRuntimeExtRsvp = require('ember-runtime/ext/rsvp');

var _emberRuntimeExtRsvp2 = _interopRequireDefault(_emberRuntimeExtRsvp);

// just for side effect of extending Ember.RSVP

require('ember-runtime/ext/string');

// just for side effect of extending String.prototype

require('ember-runtime/ext/function');

// just for side effect of extending Function.prototype

var _emberRuntimeUtils = require('ember-runtime/utils');

// END IMPORTS

// BEGIN EXPORTS
_emberMetal2['default'].compare = _emberRuntimeCompare2['default'];
_emberMetal2['default'].copy = _emberRuntimeCopy2['default'];
_emberMetal2['default'].isEqual = _emberRuntimeCore.isEqual;

_emberMetal2['default'].inject = _emberRuntimeInject2['default'];

_emberMetal2['default'].Array = _emberRuntimeMixinsArray2['default'];

_emberMetal2['default'].Comparable = _emberRuntimeMixinsComparable2['default'];
_emberMetal2['default'].Copyable = _emberRuntimeMixinsCopyable2['default'];

_emberMetal2['default'].SortableMixin = _emberRuntimeMixinsSortable2['default'];

_emberMetal2['default'].Freezable = _emberRuntimeMixinsFreezable.Freezable;
_emberMetal2['default'].FROZEN_ERROR = _emberRuntimeMixinsFreezable.FROZEN_ERROR;

_emberMetal2['default'].MutableEnumerable = _emberRuntimeMixinsMutable_enumerable2['default'];
_emberMetal2['default'].MutableArray = _emberRuntimeMixinsMutable_array2['default'];

_emberMetal2['default'].TargetActionSupport = _emberRuntimeMixinsTarget_action_support2['default'];
_emberMetal2['default'].Evented = _emberRuntimeMixinsEvented2['default'];

_emberMetal2['default'].PromiseProxyMixin = _emberRuntimeMixinsPromise_proxy2['default'];

_emberMetal2['default'].Observable = _emberRuntimeMixinsObservable2['default'];

_emberMetal2['default'].typeOf = _emberRuntimeUtils.typeOf;
_emberMetal2['default'].isArray = Array.isArray;

// ES6TODO: this seems a less than ideal way/place to add properties to Ember.computed
var EmComputed = _emberMetal2['default'].computed;

EmComputed.sum = _emberRuntimeComputedReduce_computed_macros.sum;
EmComputed.min = _emberRuntimeComputedReduce_computed_macros.min;
EmComputed.max = _emberRuntimeComputedReduce_computed_macros.max;
EmComputed.map = _emberRuntimeComputedReduce_computed_macros.map;
EmComputed.sort = _emberRuntimeComputedReduce_computed_macros.sort;
EmComputed.setDiff = _emberRuntimeComputedReduce_computed_macros.setDiff;
EmComputed.mapBy = _emberRuntimeComputedReduce_computed_macros.mapBy;
EmComputed.filter = _emberRuntimeComputedReduce_computed_macros.filter;
EmComputed.filterBy = _emberRuntimeComputedReduce_computed_macros.filterBy;
EmComputed.uniq = _emberRuntimeComputedReduce_computed_macros.uniq;
EmComputed.union = _emberRuntimeComputedReduce_computed_macros.union;
EmComputed.intersect = _emberRuntimeComputedReduce_computed_macros.intersect;

_emberMetal2['default'].String = _emberRuntimeSystemString2['default'];
_emberMetal2['default'].Object = _emberRuntimeSystemObject2['default'];
_emberMetal2['default'].TrackedArray = _emberRuntimeSystemTracked_array2['default'];
_emberMetal2['default'].SubArray = _emberRuntimeSystemSubarray2['default'];
_emberMetal2['default'].Container = _emberRuntimeSystemContainer.Container;
_emberMetal2['default'].Registry = _emberRuntimeSystemContainer.Registry;
_emberMetal2['default'].Namespace = _emberRuntimeSystemNamespace2['default'];
_emberMetal2['default'].Enumerable = _emberRuntimeMixinsEnumerable2['default'];
_emberMetal2['default'].ArrayProxy = _emberRuntimeSystemArray_proxy2['default'];
_emberMetal2['default'].ObjectProxy = _emberRuntimeSystemObject_proxy2['default'];
_emberMetal2['default'].ActionHandler = _emberRuntimeMixinsAction_handler2['default'];
_emberMetal2['default'].CoreObject = _emberRuntimeSystemCore_object2['default'];
_emberMetal2['default'].NativeArray = _emberRuntimeSystemNative_array2['default'];
// ES6TODO: Currently we must rely on the global from ember-metal/core to avoid circular deps
// Ember.A = A;
_emberMetal2['default'].onLoad = _emberRuntimeSystemLazy_load.onLoad;
_emberMetal2['default'].runLoadHooks = _emberRuntimeSystemLazy_load.runLoadHooks;

_emberMetal2['default'].ArrayController = _emberRuntimeControllersArray_controller2['default'];
_emberMetal2['default'].ObjectController = _emberRuntimeControllersObject_controller2['default'];
_emberMetal2['default'].Controller = _emberRuntimeControllersController2['default'];
_emberMetal2['default'].ControllerMixin = _emberRuntimeMixinsController2['default'];

_emberMetal2['default'].Service = _emberRuntimeSystemService2['default'];

_emberMetal2['default']._ProxyMixin = _emberRuntimeMixinsProxy2['default'];

_emberMetal2['default'].RSVP = _emberRuntimeExtRsvp2['default'];
// END EXPORTS

exports['default'] = _emberMetal2['default'];
module.exports = exports['default'];