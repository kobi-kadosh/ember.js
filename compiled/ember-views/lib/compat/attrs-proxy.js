'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.deprecation = deprecation;

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalEvents = require('ember-metal/events');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalObserver = require('ember-metal/observer');

function deprecation(key) {
  return 'You tried to look up an attribute directly on the component. This is deprecated. Use attrs.' + key + ' instead.';
}

var MUTABLE_CELL = (0, _emberMetalUtils.symbol)('MUTABLE_CELL');

exports.MUTABLE_CELL = MUTABLE_CELL;
function isCell(val) {
  return val && val[MUTABLE_CELL];
}

function attrsWillChange(view, attrsKey) {
  var key = attrsKey.slice(6);
  view.currentState.legacyAttrWillChange(view, key);
}

function attrsDidChange(view, attrsKey) {
  var key = attrsKey.slice(6);
  view.currentState.legacyAttrDidChange(view, key);
}

var AttrsProxyMixin = {
  attrs: null,

  getAttr: function getAttr(key) {
    var attrs = this.attrs;
    if (!attrs) {
      return;
    }
    return this.getAttrFor(attrs, key);
  },

  getAttrFor: function getAttrFor(attrs, key) {
    var val = attrs[key];
    return isCell(val) ? val.value : val;
  },

  setAttr: function setAttr(key, value) {
    var attrs = this.attrs;
    var val = attrs[key];

    if (!isCell(val)) {
      throw new Error('You can\'t update attrs.' + key + ', because it\'s not mutable');
    }

    val.update(value);
  },

  willWatchProperty: function willWatchProperty(key) {
    if (this._isAngleBracket || key === 'attrs') {
      return;
    }

    var attrsKey = 'attrs.' + key;
    (0, _emberMetalObserver.addBeforeObserver)(this, attrsKey, null, attrsWillChange);
    (0, _emberMetalObserver.addObserver)(this, attrsKey, null, attrsDidChange);
  },

  didUnwatchProperty: function didUnwatchProperty(key) {
    if (this._isAngleBracket || key === 'attrs') {
      return;
    }

    var attrsKey = 'attrs.' + key;
    (0, _emberMetalObserver.removeBeforeObserver)(this, attrsKey, null, attrsWillChange);
    (0, _emberMetalObserver.removeObserver)(this, attrsKey, null, attrsDidChange);
  },

  legacyDidReceiveAttrs: (0, _emberMetalEvents.on)('didReceiveAttrs', function () {
    if (this._isAngleBracket) {
      return;
    }

    var keys = Object.keys(this.attrs);

    for (var i = 0, l = keys.length; i < l; i++) {
      // Only issue the deprecation if it wasn't already issued when
      // setting attributes initially.
      if (!(keys[i] in this)) {
        this.notifyPropertyChange(keys[i]);
      }
    }
  }),

  unknownProperty: function unknownProperty(key) {
    if (this._isAngleBracket) {
      return;
    }

    var attrs = (0, _emberMetalProperty_get.get)(this, 'attrs');

    if (attrs && key in attrs) {
      // do not deprecate accessing `this[key]` at this time.
      // add this back when we have a proper migration path
      // Ember.deprecate(deprecation(key));
      var possibleCell = (0, _emberMetalProperty_get.get)(attrs, key);

      if (possibleCell && possibleCell[MUTABLE_CELL]) {
        return possibleCell.value;
      }

      return possibleCell;
    }
  }

  //setUnknownProperty(key) {

  //}
};

AttrsProxyMixin[_emberMetalProperty_events.PROPERTY_DID_CHANGE] = function (key) {
  if (this._isAngleBracket) {
    return;
  }

  if (this.currentState) {
    this.currentState.legacyPropertyDidChange(this, key);
  }
};

exports['default'] = _emberMetalMixin.Mixin.create(AttrsProxyMixin);