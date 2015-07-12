'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = CompatHelperStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

function CompatHelperStream(helper, params, hash, templates, env, scope, label) {
  this.init(label);
  this.helper = helper.helperFunction;
  this.params = params;
  this.templates = templates;
  this.env = env;
  this.scope = scope;
  this.hash = hash;
}

CompatHelperStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(CompatHelperStream.prototype, {
  compute: function compute() {
    // Using call and undefined is probably not needed, these are only internal
    return this.helper.call(undefined, this.params, this.hash, this.templates, this.env, this.scope);
  }
});
module.exports = exports['default'];