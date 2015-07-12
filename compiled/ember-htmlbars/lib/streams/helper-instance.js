'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = HelperInstanceStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberHtmlbarsStreamsUtils = require('ember-htmlbars/streams/utils');

function HelperInstanceStream(helper, params, hash, label) {
  this.init(label);
  this.helper = helper;
  this.params = params;
  this.hash = hash;
  this.linkable = true;
}

HelperInstanceStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(HelperInstanceStream.prototype, {
  compute: function compute() {
    return this.helper.compute((0, _emberHtmlbarsStreamsUtils.getArrayValues)(this.params), (0, _emberHtmlbarsStreamsUtils.getHashValues)(this.hash));
  }
});
module.exports = exports['default'];