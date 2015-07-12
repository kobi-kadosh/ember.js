'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = conditional;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

function conditional(test, consequent, alternate) {
  if ((0, _emberMetalStreamsUtils.isStream)(test)) {
    return new ConditionalStream(test, consequent, alternate);
  } else {
    if (test) {
      return consequent;
    } else {
      return alternate;
    }
  }
}

function ConditionalStream(test, consequent, alternate) {
  this.init();

  this.oldTestResult = undefined;
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
}

ConditionalStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

ConditionalStream.prototype.compute = function () {
  var oldTestResult = this.oldTestResult;
  var newTestResult = !!(0, _emberMetalStreamsUtils.read)(this.test);

  if (newTestResult !== oldTestResult) {
    switch (oldTestResult) {
      case true:
        (0, _emberMetalStreamsUtils.unsubscribe)(this.consequent, this.notify, this);break;
      case false:
        (0, _emberMetalStreamsUtils.unsubscribe)(this.alternate, this.notify, this);break;
      case undefined:
        (0, _emberMetalStreamsUtils.subscribe)(this.test, this.notify, this);
    }

    switch (newTestResult) {
      case true:
        (0, _emberMetalStreamsUtils.subscribe)(this.consequent, this.notify, this);break;
      case false:
        (0, _emberMetalStreamsUtils.subscribe)(this.alternate, this.notify, this);
    }

    this.oldTestResult = newTestResult;
  }

  return newTestResult ? (0, _emberMetalStreamsUtils.read)(this.consequent) : (0, _emberMetalStreamsUtils.read)(this.alternate);
};
module.exports = exports['default'];