'use strict';

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalEvents = require('ember-metal/events');

QUnit.module('system/props/events_test');

QUnit.test('listener should receive event - removing should remove', function () {
  var obj = {};
  var count = 0;
  var F = function F() {
    count++;
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', F);
  equal(count, 0, 'nothing yet');

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(count, 1, 'received event');

  (0, _emberMetalEvents.removeListener)(obj, 'event!', F);

  count = 0;
  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(count, 0, 'received event');
});

QUnit.test('listeners should be inherited', function () {
  var obj = {};
  var count = 0;
  var F = function F() {
    count++;
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', F);

  var obj2 = Object.create(obj);

  equal(count, 0, 'nothing yet');

  (0, _emberMetalEvents.sendEvent)(obj2, 'event!');
  equal(count, 1, 'received event');

  (0, _emberMetalEvents.removeListener)(obj2, 'event!', F);

  count = 0;
  (0, _emberMetalEvents.sendEvent)(obj2, 'event!');
  equal(count, 0, 'did not receive event');

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(count, 1, 'should still invoke on parent');
});

QUnit.test('adding a listener more than once should only invoke once', function () {

  var obj = {};
  var count = 0;
  var F = function F() {
    count++;
  };
  (0, _emberMetalEvents.addListener)(obj, 'event!', F);
  (0, _emberMetalEvents.addListener)(obj, 'event!', F);

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(count, 1, 'should only invoke once');
});

QUnit.test('adding a listener with a target should invoke with target', function () {
  var obj = {};
  var target;

  target = {
    count: 0,
    method: function method() {
      this.count++;
    }
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', target, target.method);
  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(target.count, 1, 'should invoke');
});

QUnit.test('suspending a listener should not invoke during callback', function () {
  var obj = {};
  var target, otherTarget;

  target = {
    count: 0,
    method: function method() {
      this.count++;
    }
  };

  otherTarget = {
    count: 0,
    method: function method() {
      this.count++;
    }
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', target, target.method);
  (0, _emberMetalEvents.addListener)(obj, 'event!', otherTarget, otherTarget.method);

  function callback() {
    /*jshint validthis:true */
    equal(this, target);

    (0, _emberMetalEvents.sendEvent)(obj, 'event!');

    return 'result';
  }

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');

  equal((0, _emberMetalEvents.suspendListener)(obj, 'event!', target, target.method, callback), 'result');

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');

  equal(target.count, 2, 'should invoke');
  equal(otherTarget.count, 3, 'should invoke');
});

QUnit.test('adding a listener with string method should lookup method on event delivery', function () {
  var obj = {};
  var target;

  target = {
    count: 0,
    method: function method() {}
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', target, 'method');
  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(target.count, 0, 'should invoke but do nothing');

  target.method = function () {
    this.count++;
  };
  (0, _emberMetalEvents.sendEvent)(obj, 'event!');
  equal(target.count, 1, 'should invoke now');
});

QUnit.test('calling sendEvent with extra params should be passed to listeners', function () {

  var obj = {};
  var params = null;
  (0, _emberMetalEvents.addListener)(obj, 'event!', function () {
    params = Array.prototype.slice.call(arguments);
  });

  (0, _emberMetalEvents.sendEvent)(obj, 'event!', ['foo', 'bar']);
  deepEqual(params, ['foo', 'bar'], 'params should be saved');
});

QUnit.test('implementing sendEvent on object should invoke', function () {
  var obj = {
    sendEvent: function sendEvent(eventName, params) {
      equal(eventName, 'event!', 'eventName');
      deepEqual(params, ['foo', 'bar']);
      this.count++;
    },

    count: 0
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', obj, function () {
    this.count++;
  });

  (0, _emberMetalEvents.sendEvent)(obj, 'event!', ['foo', 'bar']);
  equal(obj.count, 2, 'should have invoked method & listener');
});

QUnit.test('hasListeners tells you if there are listeners for a given event', function () {

  var obj = {};
  var F = function F() {};
  var F2 = function F2() {};

  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), false, 'no listeners at first');

  (0, _emberMetalEvents.addListener)(obj, 'event!', F);
  (0, _emberMetalEvents.addListener)(obj, 'event!', F2);

  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), true, 'has listeners');

  (0, _emberMetalEvents.removeListener)(obj, 'event!', F);
  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), true, 'has listeners');

  (0, _emberMetalEvents.removeListener)(obj, 'event!', F2);
  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), false, 'has no more listeners');

  (0, _emberMetalEvents.addListener)(obj, 'event!', F);
  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), true, 'has listeners');
});

QUnit.test('calling removeListener without method should remove all listeners', function () {
  var obj = {};
  var F = function F() {};
  var F2 = function F2() {};

  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), false, 'no listeners at first');

  (0, _emberMetalEvents.addListener)(obj, 'event!', F);
  (0, _emberMetalEvents.addListener)(obj, 'event!', F2);

  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), true, 'has listeners');

  (0, _emberMetalEvents.removeListener)(obj, 'event!');

  equal((0, _emberMetalEvents.hasListeners)(obj, 'event!'), false, 'has no more listeners');
});

QUnit.test('while suspended, it should not be possible to add a duplicate listener', function () {
  var obj = {};
  var target;

  target = {
    count: 0,
    method: function method() {
      this.count++;
    }
  };

  (0, _emberMetalEvents.addListener)(obj, 'event!', target, target.method);

  function callback() {
    (0, _emberMetalEvents.addListener)(obj, 'event!', target, target.method);
  }

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');

  (0, _emberMetalEvents.suspendListener)(obj, 'event!', target, target.method, callback);

  equal(target.count, 1, 'should invoke');
  equal((0, _emberMetalUtils.meta)(obj).listeners['event!'].length, 3, 'a duplicate listener wasn\'t added');

  // now test suspendListeners...

  (0, _emberMetalEvents.sendEvent)(obj, 'event!');

  (0, _emberMetalEvents.suspendListeners)(obj, ['event!'], target, target.method, callback);

  equal(target.count, 2, 'should have invoked again');
  equal((0, _emberMetalUtils.meta)(obj).listeners['event!'].length, 3, 'a duplicate listener wasn\'t added');
});

QUnit.test('a listener can be added as part of a mixin', function () {
  var triggered = 0;
  var MyMixin = _emberMetalMixin.Mixin.create({
    foo1: (0, _emberMetalEvents.on)('bar', function () {
      triggered++;
    }),

    foo2: (0, _emberMetalEvents.on)('bar', function () {
      triggered++;
    })
  });

  var obj = {};
  MyMixin.apply(obj);

  (0, _emberMetalEvents.sendEvent)(obj, 'bar');
  equal(triggered, 2, 'should invoke listeners');
});

QUnit.test('a listener added as part of a mixin may be overridden', function () {

  var triggered = 0;
  var FirstMixin = _emberMetalMixin.Mixin.create({
    foo: (0, _emberMetalEvents.on)('bar', function () {
      triggered++;
    })
  });
  var SecondMixin = _emberMetalMixin.Mixin.create({
    foo: (0, _emberMetalEvents.on)('baz', function () {
      triggered++;
    })
  });

  var obj = {};
  FirstMixin.apply(obj);
  SecondMixin.apply(obj);

  (0, _emberMetalEvents.sendEvent)(obj, 'bar');
  equal(triggered, 0, 'should not invoke from overriden property');

  (0, _emberMetalEvents.sendEvent)(obj, 'baz');
  equal(triggered, 1, 'should invoke from subclass property');
});