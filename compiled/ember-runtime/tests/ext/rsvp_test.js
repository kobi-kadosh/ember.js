/* global Promise:true */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeExtRsvp = require('ember-runtime/ext/rsvp');

var _emberRuntimeExtRsvp2 = _interopRequireDefault(_emberRuntimeExtRsvp);

QUnit.module('Ember.RSVP');

QUnit.test('Ensure that errors thrown from within a promise are sent to the console', function () {
  var error = new Error('Error thrown in a promise for testing purposes.');

  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      new _emberRuntimeExtRsvp2['default'].Promise(function (resolve, reject) {
        throw error;
      });
    });
    ok(false, 'expected assertion to be thrown');
  } catch (e) {
    equal(e, error, 'error was re-thrown');
  }
});

var asyncStarted = 0;
var asyncEnded = 0;
var Promise = _emberRuntimeExtRsvp2['default'].Promise;

var EmberTest;
var EmberTesting;

QUnit.module('Deferred RSVP\'s async + Testing', {
  setup: function setup() {
    EmberTest = _emberMetalCore2['default'].Test;
    EmberTesting = _emberMetalCore2['default'].testing;

    _emberMetalCore2['default'].Test = {
      adapter: {
        asyncStart: function asyncStart() {
          asyncStarted++;
          QUnit.stop();
        },
        asyncEnd: function asyncEnd() {
          asyncEnded++;
          QUnit.start();
        }
      }
    };
  },
  teardown: function teardown() {
    asyncStarted = 0;
    asyncEnded = 0;

    _emberMetalCore2['default'].testing = EmberTesting;
    _emberMetalCore2['default'].Test = EmberTest;
  }
});

QUnit.test('given `Ember.testing = true`, correctly informs the test suite about async steps', function () {
  expect(19);

  ok(!_emberMetalRun_loop2['default'].currentRunLoop, 'expect no run-loop');

  _emberMetalCore2['default'].testing = true;

  equal(asyncStarted, 0);
  equal(asyncEnded, 0);

  var user = Promise.resolve({
    name: 'tomster'
  });

  equal(asyncStarted, 0);
  equal(asyncEnded, 0);

  user.then(function (user) {
    equal(asyncStarted, 1);
    equal(asyncEnded, 1);

    equal(user.name, 'tomster');

    return Promise.resolve(1).then(function () {
      equal(asyncStarted, 1);
      equal(asyncEnded, 1);
    });
  }).then(function () {
    equal(asyncStarted, 1);
    equal(asyncEnded, 1);

    return new Promise(function (resolve) {
      QUnit.stop(); // raw async, we must inform the test framework manually
      setTimeout(function () {
        QUnit.start(); // raw async, we must inform the test framework manually

        equal(asyncStarted, 1);
        equal(asyncEnded, 1);

        resolve({
          name: 'async tomster'
        });

        equal(asyncStarted, 2);
        equal(asyncEnded, 1);
      }, 0);
    });
  }).then(function (user) {
    equal(user.name, 'async tomster');
    equal(asyncStarted, 2);
    equal(asyncEnded, 2);
  });
});

QUnit.test('TransitionAborted errors are not re-thrown', function () {
  expect(1);
  var fakeTransitionAbort = { name: 'TransitionAborted' };

  (0, _emberMetalRun_loop2['default'])(_emberRuntimeExtRsvp2['default'], 'reject', fakeTransitionAbort);

  ok(true, 'did not throw an error when dealing with TransitionAborted');
});

QUnit.test('rejections like jqXHR which have errorThrown property work', function () {
  expect(2);

  var wasEmberTesting = _emberMetalCore2['default'].testing;
  var wasOnError = _emberMetalCore2['default'].onerror;

  try {
    _emberMetalCore2['default'].testing = false;
    _emberMetalCore2['default'].onerror = function (error) {
      equal(error, actualError, 'expected the real error on the jqXHR');
      equal(error.__reason_with_error_thrown__, jqXHR, 'also retains a helpful reference to the rejection reason');
    };

    var actualError = new Error('OMG what really happened');
    var jqXHR = {
      errorThrown: actualError
    };

    (0, _emberMetalRun_loop2['default'])(_emberRuntimeExtRsvp2['default'], 'reject', jqXHR);
  } finally {
    _emberMetalCore2['default'].onerror = wasOnError;
    _emberMetalCore2['default'].testing = wasEmberTesting;
  }
});

QUnit.test('rejections where the errorThrown is a string should wrap the sting in an error object', function () {
  expect(2);

  var wasEmberTesting = _emberMetalCore2['default'].testing;
  var wasOnError = _emberMetalCore2['default'].onerror;

  try {
    _emberMetalCore2['default'].testing = false;
    _emberMetalCore2['default'].onerror = function (error) {
      equal(error.message, actualError, 'expected the real error on the jqXHR');
      equal(error.__reason_with_error_thrown__, jqXHR, 'also retains a helpful reference to the rejection reason');
    };

    var actualError = 'OMG what really happened';
    var jqXHR = {
      errorThrown: actualError
    };

    (0, _emberMetalRun_loop2['default'])(_emberRuntimeExtRsvp2['default'], 'reject', jqXHR);
  } finally {
    _emberMetalCore2['default'].onerror = wasOnError;
    _emberMetalCore2['default'].testing = wasEmberTesting;
  }
});