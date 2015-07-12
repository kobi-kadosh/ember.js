/**
@module ember-metal
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isWatching = isWatching;
exports.unwatch = unwatch;
exports.destroy = destroy;

var _emberMetalChains = require('ember-metal/chains');

var _emberMetalWatch_key = require('ember-metal/watch_key');

var _emberMetalWatch_path = require('ember-metal/watch_path');

var _emberMetalPath_cache = require('ember-metal/path_cache');

/**
  Starts watching a property on an object. Whenever the property changes,
  invokes `Ember.propertyWillChange` and `Ember.propertyDidChange`. This is the
  primitive used by observers and dependent keys; usually you will never call
  this method directly but instead use higher level methods like
  `Ember.addObserver()`

  @private
  @method watch
  @for Ember
  @param obj
  @param {String} _keyPath
*/
function watch(obj, _keyPath, m) {
  // can't watch length on Array - it is special...
  if (_keyPath === 'length' && Array.isArray(obj)) {
    return;
  }

  if (!(0, _emberMetalPath_cache.isPath)(_keyPath)) {
    (0, _emberMetalWatch_key.watchKey)(obj, _keyPath, m);
  } else {
    (0, _emberMetalWatch_path.watchPath)(obj, _keyPath, m);
  }
}

exports.watch = watch;

function isWatching(obj, key) {
  var meta = obj['__ember_meta__'];
  return (meta && meta.watching[key]) > 0;
}

watch.flushPending = _emberMetalChains.flushPendingChains;

function unwatch(obj, _keyPath, m) {
  // can't watch length on Array - it is special...
  if (_keyPath === 'length' && Array.isArray(obj)) {
    return;
  }

  if (!(0, _emberMetalPath_cache.isPath)(_keyPath)) {
    (0, _emberMetalWatch_key.unwatchKey)(obj, _keyPath, m);
  } else {
    (0, _emberMetalWatch_path.unwatchPath)(obj, _keyPath, m);
  }
}

var NODE_STACK = [];

/**
  Tears down the meta on an object so that it can be garbage collected.
  Multiple calls will have no effect.

  @method destroy
  @for Ember
  @param {Object} obj  the object to destroy
  @return {void}
  @private
*/

function destroy(obj) {
  var meta = obj['__ember_meta__'];
  var node, nodes, key, nodeObject;

  if (meta) {
    obj['__ember_meta__'] = null;
    // remove chainWatchers to remove circular references that would prevent GC
    node = meta.chains;
    if (node) {
      NODE_STACK.push(node);
      // process tree
      while (NODE_STACK.length > 0) {
        node = NODE_STACK.pop();
        // push children
        nodes = node._chains;
        if (nodes) {
          for (key in nodes) {
            if (nodes[key] !== undefined) {
              NODE_STACK.push(nodes[key]);
            }
          }
        }
        // remove chainWatcher in node object
        if (node._watching) {
          nodeObject = node._object;
          if (nodeObject) {
            (0, _emberMetalChains.removeChainWatcher)(nodeObject, node._key, node);
          }
        }
      }
    }
  }
}