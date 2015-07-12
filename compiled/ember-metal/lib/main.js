/**
@module ember
@submodule ember-metal
*/

// BEGIN IMPORTS
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalInstrumentation = require('ember-metal/instrumentation');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalCache = require('ember-metal/cache');

var _emberMetalCache2 = _interopRequireDefault(_emberMetalCache);

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalEvents = require('ember-metal/events');

var _emberMetalObserver_set = require('ember-metal/observer_set');

var _emberMetalObserver_set2 = _interopRequireDefault(_emberMetalObserver_set);

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalMap = require('ember-metal/map');

var _emberMetalGet_properties = require('ember-metal/get_properties');

var _emberMetalGet_properties2 = _interopRequireDefault(_emberMetalGet_properties);

var _emberMetalSet_properties = require('ember-metal/set_properties');

var _emberMetalSet_properties2 = _interopRequireDefault(_emberMetalSet_properties);

var _emberMetalWatch_key = require('ember-metal/watch_key');

var _emberMetalChains = require('ember-metal/chains');

var _emberMetalWatch_path = require('ember-metal/watch_path');

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalExpand_properties = require('ember-metal/expand_properties');

var _emberMetalExpand_properties2 = _interopRequireDefault(_emberMetalExpand_properties);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalAlias = require('ember-metal/alias');

var _emberMetalAlias2 = _interopRequireDefault(_emberMetalAlias);

var _emberMetalComputed_macros = require('ember-metal/computed_macros');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalBinding = require('ember-metal/binding');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalLibraries = require('ember-metal/libraries');

var _emberMetalLibraries2 = _interopRequireDefault(_emberMetalLibraries);

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

var _emberMetalIs_empty = require('ember-metal/is_empty');

var _emberMetalIs_empty2 = _interopRequireDefault(_emberMetalIs_empty);

var _emberMetalIs_blank = require('ember-metal/is_blank');

var _emberMetalIs_blank2 = _interopRequireDefault(_emberMetalIs_blank);

var _emberMetalIs_present = require('ember-metal/is_present');

var _emberMetalIs_present2 = _interopRequireDefault(_emberMetalIs_present);

var _backburner = require('backburner');

var _backburner2 = _interopRequireDefault(_backburner);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

_emberMetalComputed.computed.empty = _emberMetalComputed_macros.empty;
_emberMetalComputed.computed.notEmpty = _emberMetalComputed_macros.notEmpty;
_emberMetalComputed.computed.none = _emberMetalComputed_macros.none;
_emberMetalComputed.computed.not = _emberMetalComputed_macros.not;
_emberMetalComputed.computed.bool = _emberMetalComputed_macros.bool;
_emberMetalComputed.computed.match = _emberMetalComputed_macros.match;
_emberMetalComputed.computed.equal = _emberMetalComputed_macros.equal;
_emberMetalComputed.computed.gt = _emberMetalComputed_macros.gt;
_emberMetalComputed.computed.gte = _emberMetalComputed_macros.gte;
_emberMetalComputed.computed.lt = _emberMetalComputed_macros.lt;
_emberMetalComputed.computed.lte = _emberMetalComputed_macros.lte;
_emberMetalComputed.computed.alias = _emberMetalAlias2['default'];
_emberMetalComputed.computed.oneWay = _emberMetalComputed_macros.oneWay;
_emberMetalComputed.computed.reads = _emberMetalComputed_macros.oneWay;
_emberMetalComputed.computed.readOnly = _emberMetalComputed_macros.readOnly;
_emberMetalComputed.computed.defaultTo = _emberMetalComputed_macros.defaultTo;
_emberMetalComputed.computed.deprecatingAlias = _emberMetalComputed_macros.deprecatingAlias;
_emberMetalComputed.computed.and = _emberMetalComputed_macros.and;
_emberMetalComputed.computed.or = _emberMetalComputed_macros.or;
_emberMetalComputed.computed.any = _emberMetalComputed_macros.any;
_emberMetalComputed.computed.collect = _emberMetalComputed_macros.collect;

// END IMPORTS

// BEGIN EXPORTS
var EmberInstrumentation = _emberMetalCore2['default'].Instrumentation = {};
EmberInstrumentation.instrument = _emberMetalInstrumentation.instrument;
EmberInstrumentation.subscribe = _emberMetalInstrumentation.subscribe;
EmberInstrumentation.unsubscribe = _emberMetalInstrumentation.unsubscribe;
EmberInstrumentation.reset = _emberMetalInstrumentation.reset;

_emberMetalCore2['default'].instrument = _emberMetalInstrumentation.instrument;
_emberMetalCore2['default'].subscribe = _emberMetalInstrumentation.subscribe;

_emberMetalCore2['default']._Cache = _emberMetalCache2['default'];

_emberMetalCore2['default'].generateGuid = _emberMetalUtils.generateGuid;
_emberMetalCore2['default'].GUID_KEY = _emberMetalUtils.GUID_KEY;
_emberMetalCore2['default'].platform = {
  defineProperty: true,
  hasPropertyAccessors: true
};

_emberMetalCore2['default'].Error = _emberMetalError2['default'];
_emberMetalCore2['default'].guidFor = _emberMetalUtils.guidFor;
_emberMetalCore2['default'].META_DESC = _emberMetalUtils.META_DESC;
_emberMetalCore2['default'].EMPTY_META = _emberMetalUtils.EMPTY_META;
_emberMetalCore2['default'].meta = _emberMetalUtils.meta;
_emberMetalCore2['default'].getMeta = _emberMetalUtils.getMeta;
_emberMetalCore2['default'].setMeta = _emberMetalUtils.setMeta;
_emberMetalCore2['default'].metaPath = _emberMetalUtils.metaPath;
_emberMetalCore2['default'].inspect = _emberMetalUtils.inspect;
_emberMetalCore2['default'].tryCatchFinally = _emberMetalUtils.deprecatedTryCatchFinally;
_emberMetalCore2['default'].makeArray = _emberMetalUtils.makeArray;
_emberMetalCore2['default'].canInvoke = _emberMetalUtils.canInvoke;
_emberMetalCore2['default'].tryInvoke = _emberMetalUtils.tryInvoke;
_emberMetalCore2['default'].wrap = _emberMetalUtils.wrap;
_emberMetalCore2['default'].apply = _emberMetalUtils.apply;
_emberMetalCore2['default'].applyStr = _emberMetalUtils.applyStr;
_emberMetalCore2['default'].uuid = _emberMetalUtils.uuid;

_emberMetalCore2['default'].Logger = _emberMetalLogger2['default'];

_emberMetalCore2['default'].get = _emberMetalProperty_get.get;
_emberMetalCore2['default'].getWithDefault = _emberMetalProperty_get.getWithDefault;
_emberMetalCore2['default'].normalizeTuple = _emberMetalProperty_get.normalizeTuple;
_emberMetalCore2['default']._getPath = _emberMetalProperty_get._getPath;

_emberMetalCore2['default'].on = _emberMetalEvents.on;
_emberMetalCore2['default'].addListener = _emberMetalEvents.addListener;
_emberMetalCore2['default'].removeListener = _emberMetalEvents.removeListener;
_emberMetalCore2['default']._suspendListener = _emberMetalEvents.suspendListener;
_emberMetalCore2['default']._suspendListeners = _emberMetalEvents.suspendListeners;
_emberMetalCore2['default'].sendEvent = _emberMetalEvents.sendEvent;
_emberMetalCore2['default'].hasListeners = _emberMetalEvents.hasListeners;
_emberMetalCore2['default'].watchedEvents = _emberMetalEvents.watchedEvents;
_emberMetalCore2['default'].listenersFor = _emberMetalEvents.listenersFor;
_emberMetalCore2['default'].accumulateListeners = _emberMetalEvents.accumulateListeners;

_emberMetalCore2['default']._ObserverSet = _emberMetalObserver_set2['default'];

_emberMetalCore2['default'].propertyWillChange = _emberMetalProperty_events.propertyWillChange;
_emberMetalCore2['default'].propertyDidChange = _emberMetalProperty_events.propertyDidChange;
_emberMetalCore2['default'].overrideChains = _emberMetalProperty_events.overrideChains;
_emberMetalCore2['default'].beginPropertyChanges = _emberMetalProperty_events.beginPropertyChanges;
_emberMetalCore2['default'].endPropertyChanges = _emberMetalProperty_events.endPropertyChanges;
_emberMetalCore2['default'].changeProperties = _emberMetalProperty_events.changeProperties;

_emberMetalCore2['default'].defineProperty = _emberMetalProperties.defineProperty;

_emberMetalCore2['default'].set = _emberMetalProperty_set.set;
_emberMetalCore2['default'].trySet = _emberMetalProperty_set.trySet;

_emberMetalCore2['default'].OrderedSet = _emberMetalMap.OrderedSet;
_emberMetalCore2['default'].Map = _emberMetalMap.Map;
_emberMetalCore2['default'].MapWithDefault = _emberMetalMap.MapWithDefault;

_emberMetalCore2['default'].getProperties = _emberMetalGet_properties2['default'];
_emberMetalCore2['default'].setProperties = _emberMetalSet_properties2['default'];

_emberMetalCore2['default'].watchKey = _emberMetalWatch_key.watchKey;
_emberMetalCore2['default'].unwatchKey = _emberMetalWatch_key.unwatchKey;

_emberMetalCore2['default'].flushPendingChains = _emberMetalChains.flushPendingChains;
_emberMetalCore2['default'].removeChainWatcher = _emberMetalChains.removeChainWatcher;
_emberMetalCore2['default']._ChainNode = _emberMetalChains.ChainNode;
_emberMetalCore2['default'].finishChains = _emberMetalChains.finishChains;

_emberMetalCore2['default'].watchPath = _emberMetalWatch_path.watchPath;
_emberMetalCore2['default'].unwatchPath = _emberMetalWatch_path.unwatchPath;

_emberMetalCore2['default'].watch = _emberMetalWatching.watch;
_emberMetalCore2['default'].isWatching = _emberMetalWatching.isWatching;
_emberMetalCore2['default'].unwatch = _emberMetalWatching.unwatch;
_emberMetalCore2['default'].rewatch = _emberMetalWatching.rewatch;
_emberMetalCore2['default'].destroy = _emberMetalWatching.destroy;

_emberMetalCore2['default'].expandProperties = _emberMetalExpand_properties2['default'];

_emberMetalCore2['default'].ComputedProperty = _emberMetalComputed.ComputedProperty;
_emberMetalCore2['default'].computed = _emberMetalComputed.computed;
_emberMetalCore2['default'].cacheFor = _emberMetalComputed.cacheFor;

_emberMetalCore2['default'].addObserver = _emberMetalObserver.addObserver;
_emberMetalCore2['default'].observersFor = _emberMetalObserver.observersFor;
_emberMetalCore2['default'].removeObserver = _emberMetalObserver.removeObserver;
_emberMetalCore2['default'].addBeforeObserver = _emberMetalObserver.addBeforeObserver;
_emberMetalCore2['default']._suspendBeforeObserver = _emberMetalObserver._suspendBeforeObserver;
_emberMetalCore2['default']._suspendBeforeObservers = _emberMetalObserver._suspendBeforeObservers;
_emberMetalCore2['default']._suspendObserver = _emberMetalObserver._suspendObserver;
_emberMetalCore2['default']._suspendObservers = _emberMetalObserver._suspendObservers;
_emberMetalCore2['default'].beforeObserversFor = _emberMetalObserver.beforeObserversFor;
_emberMetalCore2['default'].removeBeforeObserver = _emberMetalObserver.removeBeforeObserver;

_emberMetalCore2['default'].IS_BINDING = _emberMetalMixin.IS_BINDING;
_emberMetalCore2['default'].required = _emberMetalMixin.required;
_emberMetalCore2['default'].aliasMethod = _emberMetalMixin.aliasMethod;
_emberMetalCore2['default'].observer = _emberMetalMixin.observer;
_emberMetalCore2['default'].immediateObserver = _emberMetalMixin.immediateObserver;
_emberMetalCore2['default'].beforeObserver = _emberMetalMixin.beforeObserver;
_emberMetalCore2['default'].mixin = _emberMetalMixin.mixin;
_emberMetalCore2['default'].Mixin = _emberMetalMixin.Mixin;

_emberMetalCore2['default'].oneWay = _emberMetalBinding.oneWay;
_emberMetalCore2['default'].bind = _emberMetalBinding.bind;
_emberMetalCore2['default'].Binding = _emberMetalBinding.Binding;
_emberMetalCore2['default'].isGlobalPath = _emberMetalBinding.isGlobalPath;

_emberMetalCore2['default'].run = _emberMetalRun_loop2['default'];

/**
@class Backburner
@for Ember
@private
*/
_emberMetalCore2['default'].Backburner = _backburner2['default'];
// this is the new go forward, once Ember Data updates to using `_Backburner` we
// can remove the non-underscored version.
_emberMetalCore2['default']._Backburner = _backburner2['default'];

_emberMetalCore2['default'].libraries = new _emberMetalLibraries2['default']();
_emberMetalCore2['default'].libraries.registerCoreLibrary('Ember', _emberMetalCore2['default'].VERSION);

_emberMetalCore2['default'].isNone = _emberMetalIs_none2['default'];
_emberMetalCore2['default'].isEmpty = _emberMetalIs_empty2['default'];
_emberMetalCore2['default'].isBlank = _emberMetalIs_blank2['default'];
_emberMetalCore2['default'].isPresent = _emberMetalIs_present2['default'];

_emberMetalCore2['default'].merge = _emberMetalMerge2['default'];

if ((0, _emberMetalFeatures2['default'])('ember-metal-stream')) {
  _emberMetalCore2['default'].stream = {
    Stream: _emberMetalStreamsStream2['default'],

    isStream: _emberMetalStreamsUtils.isStream,
    subscribe: _emberMetalStreamsUtils.subscribe,
    unsubscribe: _emberMetalStreamsUtils.unsubscribe,
    read: _emberMetalStreamsUtils.read,
    readHash: _emberMetalStreamsUtils.readHash,
    readArray: _emberMetalStreamsUtils.readArray,
    scanArray: _emberMetalStreamsUtils.scanArray,
    scanHash: _emberMetalStreamsUtils.scanHash,
    concat: _emberMetalStreamsUtils.concat,
    chain: _emberMetalStreamsUtils.chain
  };
}

_emberMetalCore2['default'].FEATURES = _emberMetalFeatures.FEATURES;
_emberMetalCore2['default'].FEATURES.isEnabled = _emberMetalFeatures2['default'];

/**
  A function may be assigned to `Ember.onerror` to be called when Ember
  internals encounter an error. This is useful for specialized error handling
  and reporting code.

  ```javascript
  Ember.onerror = function(error) {
    Em.$.ajax('/report-error', 'POST', {
      stack: error.stack,
      otherInformation: 'whatever app state you want to provide'
    });
  };
  ```

  Internally, `Ember.onerror` is used as Backburner's error handler.

  @event onerror
  @for Ember
  @param {Exception} error the error object
  @public
*/
_emberMetalCore2['default'].onerror = null;
// END EXPORTS

// do this for side-effects of updating Ember.assert, warn, etc when
// ember-debug is present
if (_emberMetalCore2['default'].__loader.registry['ember-debug']) {
  requireModule('ember-debug');
}

_emberMetalCore2['default'].create = _emberMetalCore2['default'].deprecateFunc('Ember.create is deprecated in favor of Object.create', Object.create);
_emberMetalCore2['default'].keys = _emberMetalCore2['default'].deprecateFunc('Ember.keys is deprecated in favor of Object.keys', Object.keys);

exports['default'] = _emberMetalCore2['default'];
module.exports = exports['default'];