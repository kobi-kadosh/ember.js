'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalEvents = require('ember-metal/events');

/*
  this.observerSet = {
    [senderGuid]: { // variable name: `keySet`
      [keyName]: listIndex
    }
  },
  this.observers = [
    {
      sender: obj,
      keyName: keyName,
      eventName: eventName,
      listeners: [
        [target, method, flags]
      ]
    },
    ...
  ]
*/
exports['default'] = ObserverSet;

function ObserverSet() {
  this.clear();
}

ObserverSet.prototype.add = function (sender, keyName, eventName) {
  var observerSet = this.observerSet;
  var observers = this.observers;
  var senderGuid = (0, _emberMetalUtils.guidFor)(sender);
  var keySet = observerSet[senderGuid];
  var index;

  if (!keySet) {
    observerSet[senderGuid] = keySet = {};
  }
  index = keySet[keyName];
  if (index === undefined) {
    index = observers.push({
      sender: sender,
      keyName: keyName,
      eventName: eventName,
      listeners: []
    }) - 1;
    keySet[keyName] = index;
  }
  return observers[index].listeners;
};

ObserverSet.prototype.flush = function () {
  var observers = this.observers;
  var i, len, observer, sender;
  this.clear();
  for (i = 0, len = observers.length; i < len; ++i) {
    observer = observers[i];
    sender = observer.sender;
    if (sender.isDestroying || sender.isDestroyed) {
      continue;
    }
    (0, _emberMetalEvents.sendEvent)(sender, observer.eventName, [sender, observer.keyName], observer.listeners);
  }
};

ObserverSet.prototype.clear = function () {
  this.observerSet = {};
  this.observers = [];
};
module.exports = exports['default'];