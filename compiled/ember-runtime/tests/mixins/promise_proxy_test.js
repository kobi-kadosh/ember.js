'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

var _emberRuntimeMixinsPromise_proxy = require('ember-runtime/mixins/promise_proxy');

var _emberRuntimeMixinsPromise_proxy2 = _interopRequireDefault(_emberRuntimeMixinsPromise_proxy);

var _emberRuntimeExtRsvp = require('ember-runtime/ext/rsvp');

var _emberRuntimeExtRsvp2 = _interopRequireDefault(_emberRuntimeExtRsvp);

var _rsvp = require('rsvp');

var RSVP = _interopRequireWildcard(_rsvp);

var ObjectPromiseProxy;

QUnit.test('present on ember namespace', function () {
  ok(_emberRuntimeMixinsPromise_proxy2['default'], 'expected PromiseProxyMixin to exist');
});

QUnit.module('Ember.PromiseProxy - ObjectProxy', {
  setup: function setup() {
    ObjectPromiseProxy = _emberRuntimeSystemObject_proxy2['default'].extend(_emberRuntimeMixinsPromise_proxy2['default']);
  }
});

QUnit.test('no promise, invoking then should raise', function () {
  var proxy = ObjectPromiseProxy.create();

  throws(function () {
    proxy.then(function () {
      return this;
    }, function () {
      return this;
    });
  }, new RegExp('PromiseProxy\'s promise must be set'));
});

QUnit.test('fulfillment', function () {
  var value = {
    firstName: 'stef',
    lastName: 'penner'
  };

  var deferred = RSVP.defer();

  var proxy = ObjectPromiseProxy.create({
    promise: deferred.promise
  });

  var didFulfillCount = 0;
  var didRejectCount = 0;

  proxy.then(function () {
    didFulfillCount++;
  }, function () {
    didRejectCount++;
  });

  equal((0, _emberMetalProperty_get.get)(proxy, 'content'), undefined, 'expects the proxy to have no content');
  equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), undefined, 'expects the proxy to have no reason');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), true, 'expects the proxy to indicate that it is loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), false, 'expects the proxy to indicate that it is not settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');

  equal(didFulfillCount, 0, 'should not yet have been fulfilled');
  equal(didRejectCount, 0, 'should not yet have been rejected');

  (0, _emberMetalRun_loop2['default'])(deferred, 'resolve', value);

  equal(didFulfillCount, 1, 'should have been fulfilled');
  equal(didRejectCount, 0, 'should not have been rejected');

  equal((0, _emberMetalProperty_get.get)(proxy, 'content'), value, 'expects the proxy to have content');
  equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), undefined, 'expects the proxy to still have no reason');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), false, 'expects the proxy to indicate that it is no longer loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), true, 'expects the proxy to indicate that it is settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), true, 'expects the proxy to indicate that it is fulfilled');

  (0, _emberMetalRun_loop2['default'])(deferred, 'resolve', value);

  equal(didFulfillCount, 1, 'should still have been only fulfilled once');
  equal(didRejectCount, 0, 'should still not have been rejected');

  (0, _emberMetalRun_loop2['default'])(deferred, 'reject', value);

  equal(didFulfillCount, 1, 'should still have been only fulfilled once');
  equal(didRejectCount, 0, 'should still not have been rejected');

  equal((0, _emberMetalProperty_get.get)(proxy, 'content'), value, 'expects the proxy to have still have same content');
  equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), undefined, 'expects the proxy still to have no reason');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), false, 'expects the proxy to indicate that it is no longer loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), true, 'expects the proxy to indicate that it is settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), true, 'expects the proxy to indicate that it is fulfilled');

  // rest of the promise semantics are tested in directly in RSVP
});

QUnit.test('rejection', function () {
  var reason = new Error('failure');
  var deferred = RSVP.defer();
  var proxy = ObjectPromiseProxy.create({
    promise: deferred.promise
  });

  var didFulfillCount = 0;
  var didRejectCount = 0;

  proxy.then(function () {
    didFulfillCount++;
  }, function () {
    didRejectCount++;
  });

  equal((0, _emberMetalProperty_get.get)(proxy, 'content'), undefined, 'expects the proxy to have no content');
  equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), undefined, 'expects the proxy to have no reason');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), true, 'expects the proxy to indicate that it is loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), false, 'expects the proxy to indicate that it is not settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');

  equal(didFulfillCount, 0, 'should not yet have been fulfilled');
  equal(didRejectCount, 0, 'should not yet have been rejected');

  (0, _emberMetalRun_loop2['default'])(deferred, 'reject', reason);

  equal(didFulfillCount, 0, 'should not yet have been fulfilled');
  equal(didRejectCount, 1, 'should have been rejected');

  equal((0, _emberMetalProperty_get.get)(proxy, 'content'), undefined, 'expects the proxy to have no content');
  equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), reason, 'expects the proxy to have a reason');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), false, 'expects the proxy to indicate that it is not longer loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), true, 'expects the proxy to indicate that it is settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), true, 'expects the proxy to indicate that it is  rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');

  (0, _emberMetalRun_loop2['default'])(deferred, 'reject', reason);

  equal(didFulfillCount, 0, 'should stll not yet have been fulfilled');
  equal(didRejectCount, 1, 'should still remain rejected');

  (0, _emberMetalRun_loop2['default'])(deferred, 'resolve', 1);

  equal(didFulfillCount, 0, 'should stll not yet have been fulfilled');
  equal(didRejectCount, 1, 'should still remain rejected');

  equal((0, _emberMetalProperty_get.get)(proxy, 'content'), undefined, 'expects the proxy to have no content');
  equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), reason, 'expects the proxy to have a reason');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), false, 'expects the proxy to indicate that it is not longer loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), true, 'expects the proxy to indicate that it is settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), true, 'expects the proxy to indicate that it is  rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');
});

QUnit.test('unhandled rejects still propagate to RSVP.on(\'error\', ...) ', function () {
  expect(1);

  RSVP.on('error', onerror);
  RSVP.off('error', _emberRuntimeExtRsvp.onerrorDefault);

  var expectedReason = new Error('failure');
  var deferred = RSVP.defer();

  var proxy = ObjectPromiseProxy.create({
    promise: deferred.promise
  });

  proxy.get('promise');

  function onerror(reason) {
    equal(reason, expectedReason, 'expected reason');
  }

  RSVP.on('error', onerror);
  RSVP.off('error', _emberRuntimeExtRsvp.onerrorDefault);

  (0, _emberMetalRun_loop2['default'])(deferred, 'reject', expectedReason);

  RSVP.on('error', _emberRuntimeExtRsvp.onerrorDefault);
  RSVP.off('error', onerror);

  (0, _emberMetalRun_loop2['default'])(deferred, 'reject', expectedReason);

  RSVP.on('error', _emberRuntimeExtRsvp.onerrorDefault);
  RSVP.off('error', onerror);
});

QUnit.test('should work with promise inheritance', function () {
  function PromiseSubclass() {
    RSVP.Promise.apply(this, arguments);
  }

  PromiseSubclass.prototype = Object.create(RSVP.Promise.prototype);
  PromiseSubclass.prototype.constructor = PromiseSubclass;
  PromiseSubclass.cast = RSVP.Promise.cast;

  var proxy = ObjectPromiseProxy.create({
    promise: new PromiseSubclass(function () {})
  });

  ok(proxy.then() instanceof PromiseSubclass, 'promise proxy respected inheritance');
});

QUnit.test('should reset isFulfilled and isRejected when promise is reset', function () {
  var deferred = _emberRuntimeExtRsvp2['default'].defer();

  var proxy = ObjectPromiseProxy.create({
    promise: deferred.promise
  });

  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), true, 'expects the proxy to indicate that it is loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), false, 'expects the proxy to indicate that it is not settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');

  (0, _emberMetalRun_loop2['default'])(deferred, 'resolve');

  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), false, 'expects the proxy to indicate that it is no longer loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), true, 'expects the proxy to indicate that it is settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), true, 'expects the proxy to indicate that it is fulfilled');

  var anotherDeferred = _emberRuntimeExtRsvp2['default'].defer();
  proxy.set('promise', anotherDeferred.promise);

  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), true, 'expects the proxy to indicate that it is loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), false, 'expects the proxy to indicate that it is not settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), false, 'expects the proxy to indicate that it is not rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');

  (0, _emberMetalRun_loop2['default'])(anotherDeferred, 'reject');

  equal((0, _emberMetalProperty_get.get)(proxy, 'isPending'), false, 'expects the proxy to indicate that it is not longer loading');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isSettled'), true, 'expects the proxy to indicate that it is settled');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isRejected'), true, 'expects the proxy to indicate that it is  rejected');
  equal((0, _emberMetalProperty_get.get)(proxy, 'isFulfilled'), false, 'expects the proxy to indicate that it is not fulfilled');
});

QUnit.test('should have content when isFulfilled is set', function () {
  var deferred = _emberRuntimeExtRsvp2['default'].defer();

  var proxy = ObjectPromiseProxy.create({
    promise: deferred.promise
  });

  proxy.addObserver('isFulfilled', function () {
    equal((0, _emberMetalProperty_get.get)(proxy, 'content'), true);
  });

  (0, _emberMetalRun_loop2['default'])(deferred, 'resolve', true);
});

QUnit.test('should have reason when isRejected is set', function () {
  var error = new Error('Y U REJECT?!?');
  var deferred = _emberRuntimeExtRsvp2['default'].defer();

  var proxy = ObjectPromiseProxy.create({
    promise: deferred.promise
  });

  proxy.addObserver('isRejected', function () {
    equal((0, _emberMetalProperty_get.get)(proxy, 'reason'), error);
  });

  try {
    (0, _emberMetalRun_loop2['default'])(deferred, 'reject', error);
  } catch (e) {
    equal(e, error);
  }
});