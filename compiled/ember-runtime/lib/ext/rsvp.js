/* globals RSVP:true */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.onerrorDefault = onerrorDefault;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _rsvp = require('rsvp');

var RSVP = _interopRequireWildcard(_rsvp);

var testModuleName = 'ember-testing/test';
var Test;

var asyncStart = function asyncStart() {
  if (_emberMetalCore2['default'].Test && _emberMetalCore2['default'].Test.adapter) {
    _emberMetalCore2['default'].Test.adapter.asyncStart();
  }
};

var asyncEnd = function asyncEnd() {
  if (_emberMetalCore2['default'].Test && _emberMetalCore2['default'].Test.adapter) {
    _emberMetalCore2['default'].Test.adapter.asyncEnd();
  }
};

RSVP.configure('async', function (callback, promise) {
  var async = !_emberMetalRun_loop2['default'].currentRunLoop;

  if (_emberMetalCore2['default'].testing && async) {
    asyncStart();
  }

  _emberMetalRun_loop2['default'].backburner.schedule('actions', function () {
    if (_emberMetalCore2['default'].testing && async) {
      asyncEnd();
    }
    callback(promise);
  });
});

function onerrorDefault(e) {
  var error;

  if (e && e.errorThrown) {
    // jqXHR provides this
    error = e.errorThrown;
    if (typeof error === 'string') {
      error = new Error(error);
    }
    error.__reason_with_error_thrown__ = e;
  } else {
    error = e;
  }

  if (error && error.name !== 'TransitionAborted') {
    if (_emberMetalCore2['default'].testing) {
      // ES6TODO: remove when possible
      if (!Test && _emberMetalCore2['default'].__loader.registry[testModuleName]) {
        Test = requireModule(testModuleName)['default'];
      }

      if (Test && Test.adapter) {
        Test.adapter.exception(error);
        _emberMetalLogger2['default'].error(error.stack);
      } else {
        throw error;
      }
    } else if (_emberMetalCore2['default'].onerror) {
      _emberMetalCore2['default'].onerror(error);
    } else {
      _emberMetalLogger2['default'].error(error.stack);
    }
  }
}

RSVP.on('error', onerrorDefault);

exports['default'] = RSVP;