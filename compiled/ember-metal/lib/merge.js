/**
  Merge the contents of two objects together into the first object.

  ```javascript
  Ember.merge({first: 'Tom'}, {last: 'Dale'}); // {first: 'Tom', last: 'Dale'}
  var a = {first: 'Yehuda'};
  var b = {last: 'Katz'};
  Ember.merge(a, b); // a == {first: 'Yehuda', last: 'Katz'}, b == {last: 'Katz'}
  ```

  @method merge
  @for Ember
  @param {Object} original The object to merge into
  @param {Object} updates The object to copy properties from
  @return {Object}
  @private
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = merge;
exports.assign = assign;

function merge(original, updates) {
  if (!updates || typeof updates !== 'object') {
    return original;
  }

  var props = Object.keys(updates);
  var prop;
  var length = props.length;

  for (var i = 0; i < length; i++) {
    prop = props[i];
    original[prop] = updates[prop];
  }

  return original;
}

function assign(original) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  for (var i = 0, l = args.length; i < l; i++) {
    var arg = args[i];
    if (!arg) {
      continue;
    }

    var updates = Object.keys(arg);

    for (var _i = 0, _l = updates.length; _i < _l; _i++) {
      var prop = updates[_i];
      original[prop] = arg[prop];
    }
  }

  return original;
}