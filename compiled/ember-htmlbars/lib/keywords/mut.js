'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = mut;
exports.privateMut = privateMut;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalStreamsProxyStream = require('ember-metal/streams/proxy-stream');

var _emberMetalStreamsProxyStream2 = _interopRequireDefault(_emberMetalStreamsProxyStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

var _emberRoutingHtmlbarsKeywordsClosureAction = require('ember-routing-htmlbars/keywords/closure-action');

var MUTABLE_REFERENCE = (0, _emberMetalUtils.symbol)('MUTABLE_REFERENCE');

exports.MUTABLE_REFERENCE = MUTABLE_REFERENCE;

function mut(morph, env, scope, originalParams, hash, template, inverse) {
  // If `morph` is `null` the keyword is being invoked as a subexpression.
  if (morph === null) {
    var valueStream = originalParams[0];
    return mutParam(env.hooks.getValue, valueStream);
  }

  return true;
}

function privateMut(morph, env, scope, originalParams, hash, template, inverse) {
  // If `morph` is `null` the keyword is being invoked as a subexpression.
  if (morph === null) {
    var valueStream = originalParams[0];
    return mutParam(env.hooks.getValue, valueStream, true);
  }

  return true;
}

function mutParam(read, stream, internal) {
  if (internal) {
    if (!(0, _emberMetalStreamsUtils.isStream)(stream)) {
      (function () {
        var literal = stream;
        stream = new _emberMetalStreamsStream2['default'](function () {
          return literal;
        }, '(literal ' + literal + ')');
        stream.setValue = function (newValue) {
          literal = newValue;
          stream.notify();
        };
      })();
    }
  } else {
    _emberMetalCore2['default'].assert('You can only pass a path to mut', (0, _emberMetalStreamsUtils.isStream)(stream));
  }

  if (stream[MUTABLE_REFERENCE]) {
    return stream;
  }

  return new MutStream(stream);
}

function MutStream(stream) {
  this.init('(mut ' + stream.label + ')');
  this.path = stream.path;
  this.sourceDep = this.addMutableDependency(stream);
  this[MUTABLE_REFERENCE] = true;
}

MutStream.prototype = Object.create(_emberMetalStreamsProxyStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(MutStream.prototype, _defineProperty({
  cell: function cell() {
    var source = this;
    var value = source.value();

    if (value && value[_emberRoutingHtmlbarsKeywordsClosureAction.ACTION]) {
      return value;
    }

    var val = {
      value: value,
      update: function update(val) {
        source.setValue(val);
      }
    };

    val[_emberViewsCompatAttrsProxy.MUTABLE_CELL] = true;
    return val;
  }
}, _emberRoutingHtmlbarsKeywordsClosureAction.INVOKE, function (val) {
  this.setValue(val);
}));