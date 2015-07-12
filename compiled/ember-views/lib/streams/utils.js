'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.readViewFactory = readViewFactory;
exports.readComponentFactory = readComponentFactory;
exports.readUnwrappedModel = readUnwrappedModel;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalPath_cache = require('ember-metal/path_cache');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

function readViewFactory(object, container) {
  var value = (0, _emberMetalStreamsUtils.read)(object);
  var viewClass;

  if (typeof value === 'string') {
    if ((0, _emberMetalPath_cache.isGlobal)(value)) {
      viewClass = (0, _emberMetalProperty_get.get)(null, value);
      _emberMetalCore2['default'].deprecate('Resolved the view "' + value + '" on the global context. Pass a view name to be looked up on the container instead, such as {{view "select"}}.', !viewClass, { url: 'http://emberjs.com/guides/deprecations/#toc_global-lookup-of-views' });
    } else {
      _emberMetalCore2['default'].assert('View requires a container to resolve views not passed in through the context', !!container);
      viewClass = container.lookupFactory('view:' + value);
    }
  } else {
    viewClass = value;
  }

  _emberMetalCore2['default'].assert((0, _emberRuntimeSystemString.fmt)(value + ' must be a subclass or an instance of Ember.View, not %@', [viewClass]), (function (viewClass) {
    return viewClass && (viewClass.isViewFactory || viewClass.isView || viewClass.isComponentFactory || viewClass.isComponent);
  })(viewClass));

  return viewClass;
}

function readComponentFactory(nameOrStream, container) {
  var name = (0, _emberMetalStreamsUtils.read)(nameOrStream);
  var componentLookup = container.lookup('component-lookup:main');
  _emberMetalCore2['default'].assert('Could not find \'component-lookup:main\' on the provided container,' + ' which is necessary for performing component lookups', componentLookup);

  return componentLookup.lookupFactory(name, container);
}

function readUnwrappedModel(object) {
  if ((0, _emberMetalStreamsUtils.isStream)(object)) {
    var result = object.value();

    // If the path is exactly `controller` then we don't unwrap it.
    if (object.label !== 'controller') {
      while (_emberRuntimeMixinsController2['default'].detect(result)) {
        result = (0, _emberMetalProperty_get.get)(result, 'model');
      }
    }

    return result;
  } else {
    return object;
  }
}