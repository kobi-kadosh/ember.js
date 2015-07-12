'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addObserver = addObserver;
exports.observersFor = observersFor;
exports.removeObserver = removeObserver;
exports.addBeforeObserver = addBeforeObserver;
exports._suspendBeforeObserver = _suspendBeforeObserver;
exports._suspendObserver = _suspendObserver;
exports._suspendBeforeObservers = _suspendBeforeObservers;
exports._suspendObservers = _suspendObservers;
exports.beforeObserversFor = beforeObserversFor;
exports.removeBeforeObserver = removeBeforeObserver;

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalEvents = require('ember-metal/events');

/**
@module ember-metal
*/

var AFTER_OBSERVERS = ':change';
var BEFORE_OBSERVERS = ':before';

function changeEvent(keyName) {
  return keyName + AFTER_OBSERVERS;
}

function beforeEvent(keyName) {
  return keyName + BEFORE_OBSERVERS;
}

/**
  @method addObserver
  @for Ember
  @param obj
  @param {String} _path
  @param {Object|Function} target
  @param {Function|String} [method]
  @public
*/

function addObserver(obj, _path, target, method) {
  (0, _emberMetalEvents.addListener)(obj, changeEvent(_path), target, method);
  (0, _emberMetalWatching.watch)(obj, _path);

  return this;
}

function observersFor(obj, path) {
  return (0, _emberMetalEvents.listenersFor)(obj, changeEvent(path));
}

/**
  @method removeObserver
  @for Ember
  @param obj
  @param {String} path
  @param {Object|Function} target
  @param {Function|String} [method]
  @public
*/

function removeObserver(obj, path, target, method) {
  (0, _emberMetalWatching.unwatch)(obj, path);
  (0, _emberMetalEvents.removeListener)(obj, changeEvent(path), target, method);

  return this;
}

/**
  @method addBeforeObserver
  @for Ember
  @param obj
  @param {String} path
  @param {Object|Function} target
  @param {Function|String} [method]
  @private
*/

function addBeforeObserver(obj, path, target, method) {
  (0, _emberMetalEvents.addListener)(obj, beforeEvent(path), target, method);
  (0, _emberMetalWatching.watch)(obj, path);

  return this;
}

// Suspend observer during callback.
//
// This should only be used by the target of the observer
// while it is setting the observed path.

function _suspendBeforeObserver(obj, path, target, method, callback) {
  return (0, _emberMetalEvents.suspendListener)(obj, beforeEvent(path), target, method, callback);
}

function _suspendObserver(obj, path, target, method, callback) {
  return (0, _emberMetalEvents.suspendListener)(obj, changeEvent(path), target, method, callback);
}

function _suspendBeforeObservers(obj, paths, target, method, callback) {
  var events = paths.map(beforeEvent);
  return (0, _emberMetalEvents.suspendListeners)(obj, events, target, method, callback);
}

function _suspendObservers(obj, paths, target, method, callback) {
  var events = paths.map(changeEvent);
  return (0, _emberMetalEvents.suspendListeners)(obj, events, target, method, callback);
}

function beforeObserversFor(obj, path) {
  return (0, _emberMetalEvents.listenersFor)(obj, beforeEvent(path));
}

/**
  @method removeBeforeObserver
  @for Ember
  @param obj
  @param {String} path
  @param {Object|Function} target
  @param {Function|String} [method]
  @private
*/

function removeBeforeObserver(obj, path, target, method) {
  (0, _emberMetalWatching.unwatch)(obj, path);
  (0, _emberMetalEvents.removeListener)(obj, beforeEvent(path), target, method);

  return this;
}