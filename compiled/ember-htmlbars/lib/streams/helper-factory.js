'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = HelperFactoryStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberHtmlbarsStreamsUtils = require('ember-htmlbars/streams/utils');

function HelperFactoryStream(helperFactory, params, hash, label) {
  this.init(label);
  this.helperFactory = helperFactory;
  this.params = params;
  this.hash = hash;
  this.linkable = true;
  this.helper = null;
}

HelperFactoryStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

(0, _emberMetalMerge2['default'])(HelperFactoryStream.prototype, {
  compute: function compute() {
    if (!this.helper) {
      this.helper = this.helperFactory.create({ _stream: this });
    }
    return this.helper.compute((0, _emberHtmlbarsStreamsUtils.getArrayValues)(this.params), (0, _emberHtmlbarsStreamsUtils.getHashValues)(this.hash));
  },
  deactivate: function deactivate() {
    this.super$deactivate();
    if (this.helper) {
      this.helper.destroy();
      this.helper = null;
    }
  },
  super$deactivate: HelperFactoryStream.prototype.deactivate
});
module.exports = exports['default'];