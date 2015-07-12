'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = BuiltInHelperStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberHtmlbarsStreamsUtils = require('ember-htmlbars/streams/utils');

function BuiltInHelperStream(helper, params, hash, templates, env, scope, context, label) {
  this.init(label);
  this.helper = helper;
  this.params = params;
  this.templates = templates;
  this.env = env;
  this.scope = scope;
  this.hash = hash;
  this.context = context;
}

BuiltInHelperStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(BuiltInHelperStream.prototype, {
  compute: function compute() {
    // Using call and undefined is probably not needed, these are only internal
    return this.helper.call(this.context, (0, _emberHtmlbarsStreamsUtils.getArrayValues)(this.params), (0, _emberHtmlbarsStreamsUtils.getHashValues)(this.hash), this.templates, this.env, this.scope);
  }
});
module.exports = exports['default'];