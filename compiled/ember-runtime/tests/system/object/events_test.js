'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeMixinsEvented = require('ember-runtime/mixins/evented');

var _emberRuntimeMixinsEvented2 = _interopRequireDefault(_emberRuntimeMixinsEvented);

QUnit.module('Object events');

QUnit.test('a listener can be added to an object', function () {
  var count = 0;
  var F = function F() {
    count++;
  };

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();

  obj.on('event!', F);
  obj.trigger('event!');

  equal(count, 1, 'the event was triggered');

  obj.trigger('event!');

  equal(count, 2, 'the event was triggered');
});

QUnit.test('a listener can be added and removed automatically the first time it is triggered', function () {
  var count = 0;
  var F = function F() {
    count++;
  };

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();

  obj.one('event!', F);
  obj.trigger('event!');

  equal(count, 1, 'the event was triggered');

  obj.trigger('event!');

  equal(count, 1, 'the event was not triggered again');
});

QUnit.test('triggering an event can have arguments', function () {
  var self, args;

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();

  obj.on('event!', function () {
    args = [].slice.call(arguments);
    self = this;
  });

  obj.trigger('event!', 'foo', 'bar');

  deepEqual(args, ['foo', 'bar']);
  equal(self, obj);
});

QUnit.test('a listener can be added and removed automatically and have arguments', function () {
  var self, args;
  var count = 0;

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();

  obj.one('event!', function () {
    args = [].slice.call(arguments);
    self = this;
    count++;
  });

  obj.trigger('event!', 'foo', 'bar');

  deepEqual(args, ['foo', 'bar']);
  equal(self, obj);
  equal(count, 1, 'the event is triggered once');

  obj.trigger('event!', 'baz', 'bat');

  deepEqual(args, ['foo', 'bar']);
  equal(count, 1, 'the event was not triggered again');
  equal(self, obj);
});

QUnit.test('binding an event can specify a different target', function () {
  var self, args;

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();
  var target = {};

  obj.on('event!', target, function () {
    args = [].slice.call(arguments);
    self = this;
  });

  obj.trigger('event!', 'foo', 'bar');

  deepEqual(args, ['foo', 'bar']);
  equal(self, target);
});

QUnit.test('a listener registered with one can take method as string and can be added with different target', function () {
  var count = 0;
  var target = {};
  target.fn = function () {
    count++;
  };

  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();

  obj.one('event!', target, 'fn');
  obj.trigger('event!');

  equal(count, 1, 'the event was triggered');

  obj.trigger('event!');

  equal(count, 1, 'the event was not triggered again');
});

QUnit.test('a listener registered with one can be removed with off', function () {
  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default'], {
    F: function F() {}
  }).create();
  var F = function F() {};

  obj.one('event!', F);
  obj.one('event!', obj, 'F');

  equal(obj.has('event!'), true, 'has events');

  obj.off('event!', F);
  obj.off('event!', obj, 'F');

  equal(obj.has('event!'), false, 'has no more events');
});

QUnit.test('adding and removing listeners should be chainable', function () {
  var obj = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsEvented2['default']).create();
  var F = function F() {};

  var ret = obj.on('event!', F);
  equal(ret, obj, '#on returns self');

  ret = obj.off('event!', F);
  equal(ret, obj, '#off returns self');

  ret = obj.one('event!', F);
  equal(ret, obj, '#one returns self');
});