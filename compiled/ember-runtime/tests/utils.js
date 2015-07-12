'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

function runAppend(view) {
  (0, _emberMetalRun_loop2['default'])(view, 'appendTo', '#qunit-fixture');
}

function runDestroy(destroyed) {
  if (destroyed) {
    (0, _emberMetalRun_loop2['default'])(destroyed, 'destroy');
  }
}

exports.runAppend = runAppend;
exports.runDestroy = runDestroy;