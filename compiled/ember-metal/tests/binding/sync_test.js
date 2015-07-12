'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalBinding = require('ember-metal/binding');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperties = require('ember-metal/properties');

QUnit.module('system/binding/sync_test.js');

(0, _emberMetalTestsProps_helper.testBoth)('bindings should not sync twice in a single run loop', function (get, set) {
  var a, b, setValue;
  var setCalled = 0;
  var getCalled = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    a = {};

    (0, _emberMetalProperties.defineProperty)(a, 'foo', (0, _emberMetalComputed.computed)({
      get: function get(key) {
        getCalled++;
        return setValue;
      },
      set: function set(key, value) {
        setCalled++;
        setValue = value;
        return value;
      }
    }).volatile());

    b = {
      a: a
    };
    (0, _emberMetalBinding.bind)(b, 'foo', 'a.foo');
  });

  // reset after initial binding synchronization
  getCalled = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    set(a, 'foo', 'trollface');
  });

  equal(get(b, 'foo'), 'trollface', 'the binding should sync');
  equal(setCalled, 1, 'Set should only be called once');
  equal(getCalled, 1, 'Get should only be called once');
});

(0, _emberMetalTestsProps_helper.testBoth)('bindings should not infinite loop if computed properties return objects', function (get, set) {
  var a, b;
  var getCalled = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    a = {};

    (0, _emberMetalProperties.defineProperty)(a, 'foo', (0, _emberMetalComputed.computed)(function () {
      getCalled++;
      if (getCalled > 1000) {
        throw 'infinite loop detected';
      }
      return ['foo', 'bar'];
    }));

    b = {
      a: a
    };
    (0, _emberMetalBinding.bind)(b, 'foo', 'a.foo');
  });

  deepEqual(get(b, 'foo'), ['foo', 'bar'], 'the binding should sync');
  equal(getCalled, 1, 'Get should only be called once');
});

(0, _emberMetalTestsProps_helper.testBoth)('bindings should do the right thing when observers trigger bindings in the opposite direction', function (get, set) {
  var a, b, c;

  (0, _emberMetalRun_loop2['default'])(function () {
    a = {
      foo: 'trololol'
    };

    b = {
      a: a
    };
    (0, _emberMetalBinding.bind)(b, 'foo', 'a.foo');

    c = {
      a: a
    };
    (0, _emberMetalBinding.bind)(c, 'foo', 'a.foo');
  });

  (0, _emberMetalObserver.addObserver)(b, 'foo', function () {
    set(c, 'foo', 'what is going on');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    set(a, 'foo', 'trollface');
  });

  equal(get(a, 'foo'), 'what is going on');
});

(0, _emberMetalTestsProps_helper.testBoth)('bindings should not try to sync destroyed objects', function (get, set) {
  var a, b;

  (0, _emberMetalRun_loop2['default'])(function () {
    a = {
      foo: 'trololol'
    };

    b = {
      a: a
    };
    (0, _emberMetalBinding.bind)(b, 'foo', 'a.foo');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    set(a, 'foo', 'trollface');
    set(b, 'isDestroyed', true);
    ok(true, 'should not raise');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    a = {
      foo: 'trololol'
    };

    b = {
      a: a
    };
    (0, _emberMetalBinding.bind)(b, 'foo', 'a.foo');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    set(b, 'foo', 'trollface');
    set(a, 'isDestroyed', true);
    ok(true, 'should not raise');
  });
});