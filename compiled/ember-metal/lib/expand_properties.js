'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = expandProperties;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

/**
@module ember
@submodule ember-metal
*/

var SPLIT_REGEX = /\{|\}/;

/**
  Expands `pattern`, invoking `callback` for each expansion.

  The only pattern supported is brace-expansion, anything else will be passed
  once to `callback` directly.

  Example

  ```js
  function echo(arg){ console.log(arg); }

  Ember.expandProperties('foo.bar', echo);              //=> 'foo.bar'
  Ember.expandProperties('{foo,bar}', echo);            //=> 'foo', 'bar'
  Ember.expandProperties('foo.{bar,baz}', echo);        //=> 'foo.bar', 'foo.baz'
  Ember.expandProperties('{foo,bar}.baz', echo);        //=> 'foo.baz', 'bar.baz'
  Ember.expandProperties('foo.{bar,baz}.@each', echo)   //=> 'foo.bar.@each', 'foo.baz.@each'
  Ember.expandProperties('{foo,bar}.{spam,eggs}', echo) //=> 'foo.spam', 'foo.eggs', 'bar.spam', 'bar.eggs'
  Ember.expandProperties('{foo}.bar.{baz}')             //=> 'foo.bar.baz'
  ```

  @method
  @private
  @param {String} pattern The property pattern to expand.
  @param {Function} callback The callback to invoke.  It is invoked once per
  expansion, and is passed the expansion.
*/

function expandProperties(pattern, callback) {
  if (pattern.indexOf(' ') > -1) {
    throw new _emberMetalError2['default']('Brace expanded properties cannot contain spaces, e.g. \'user.{firstName, lastName}\' should be \'user.{firstName,lastName}\'');
  }

  if ('string' === typeof pattern) {
    var parts = pattern.split(SPLIT_REGEX);
    var properties = [parts];

    parts.forEach(function (part, index) {
      if (part.indexOf(',') >= 0) {
        properties = duplicateAndReplace(properties, part.split(','), index);
      }
    });

    properties.forEach(function (property) {
      callback(property.join(''));
    });
  } else {
    callback(pattern);
  }
}

function duplicateAndReplace(properties, currentParts, index) {
  var all = [];

  properties.forEach(function (property) {
    currentParts.forEach(function (part) {
      var current = property.slice(0);
      current[index] = part;
      all.push(current);
    });
  });

  return all;
}
module.exports = exports['default'];