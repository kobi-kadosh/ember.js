'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('EmberObject observer');

(0, _emberMetalTestsProps_helper.testBoth)('observer on class', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({

    count: 0,

    foo: (0, _emberMetalMixin.observer)('bar', function () {
      set(this, 'count', get(this, 'count') + 1);
    })

  });

  var obj = new MyClass();
  equal(get(obj, 'count'), 0, 'should not invoke observer immediately');

  set(obj, 'bar', 'BAZ');
  equal(get(obj, 'count'), 1, 'should invoke observer after change');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer on subclass', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({

    count: 0,

    foo: (0, _emberMetalMixin.observer)('bar', function () {
      set(this, 'count', get(this, 'count') + 1);
    })

  });

  var Subclass = MyClass.extend({
    foo: (0, _emberMetalMixin.observer)('baz', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  });

  var obj = new Subclass();
  equal(get(obj, 'count'), 0, 'should not invoke observer immediately');

  set(obj, 'bar', 'BAZ');
  equal(get(obj, 'count'), 0, 'should not invoke observer after change');

  set(obj, 'baz', 'BAZ');
  equal(get(obj, 'count'), 1, 'should invoke observer after change');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer on instance', function (get, set) {

  var obj = _emberRuntimeSystemObject2['default'].extend({
    foo: (0, _emberMetalMixin.observer)('bar', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  }).create({
    count: 0
  });

  equal(get(obj, 'count'), 0, 'should not invoke observer immediately');

  set(obj, 'bar', 'BAZ');
  equal(get(obj, 'count'), 1, 'should invoke observer after change');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer on instance overriding class', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    count: 0,

    foo: (0, _emberMetalMixin.observer)('bar', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  });

  var obj = MyClass.extend({
    foo: (0, _emberMetalMixin.observer)('baz', function () {
      // <-- change property we observe
      set(this, 'count', get(this, 'count') + 1);
    })
  }).create();

  equal(get(obj, 'count'), 0, 'should not invoke observer immediately');

  set(obj, 'bar', 'BAZ');
  equal(get(obj, 'count'), 0, 'should not invoke observer after change');

  set(obj, 'baz', 'BAZ');
  equal(get(obj, 'count'), 1, 'should invoke observer after change');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer should not fire after being destroyed', function (get, set) {

  var obj = _emberRuntimeSystemObject2['default'].extend({
    count: 0,
    foo: (0, _emberMetalMixin.observer)('bar', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  }).create();

  equal(get(obj, 'count'), 0, 'precond - should not invoke observer immediately');

  (0, _emberMetalRun_loop2['default'])(function () {
    obj.destroy();
  });

  if (_emberMetalCore2['default'].assert) {
    expectAssertion(function () {
      set(obj, 'bar', 'BAZ');
    }, 'calling set on destroyed object');
  } else {
    set(obj, 'bar', 'BAZ');
  }

  equal(get(obj, 'count'), 0, 'should not invoke observer after change');
});
// ..........................................................
// COMPLEX PROPERTIES
//

(0, _emberMetalTestsProps_helper.testBoth)('chain observer on class', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    count: 0,

    foo: (0, _emberMetalMixin.observer)('bar.baz', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  });

  var obj1 = MyClass.create({
    bar: { baz: 'biff' }
  });

  var obj2 = MyClass.create({
    bar: { baz: 'biff2' }
  });

  equal(get(obj1, 'count'), 0, 'should not invoke yet');
  equal(get(obj2, 'count'), 0, 'should not invoke yet');

  set(get(obj1, 'bar'), 'baz', 'BIFF1');
  equal(get(obj1, 'count'), 1, 'should invoke observer on obj1');
  equal(get(obj2, 'count'), 0, 'should not invoke yet');

  set(get(obj2, 'bar'), 'baz', 'BIFF2');
  equal(get(obj1, 'count'), 1, 'should not invoke again');
  equal(get(obj2, 'count'), 1, 'should invoke observer on obj2');
});

(0, _emberMetalTestsProps_helper.testBoth)('chain observer on class', function (get, set) {

  var MyClass = _emberRuntimeSystemObject2['default'].extend({
    count: 0,

    foo: (0, _emberMetalMixin.observer)('bar.baz', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  });

  var obj1 = MyClass.extend().create({
    bar: { baz: 'biff' }
  });

  var obj2 = MyClass.extend({
    foo: (0, _emberMetalMixin.observer)('bar2.baz', function () {
      set(this, 'count', get(this, 'count') + 1);
    })
  }).create({
    bar: { baz: 'biff2' },
    bar2: { baz: 'biff3' }
  });

  equal(get(obj1, 'count'), 0, 'should not invoke yet');
  equal(get(obj2, 'count'), 0, 'should not invoke yet');

  set(get(obj1, 'bar'), 'baz', 'BIFF1');
  equal(get(obj1, 'count'), 1, 'should invoke observer on obj1');
  equal(get(obj2, 'count'), 0, 'should not invoke yet');

  set(get(obj2, 'bar'), 'baz', 'BIFF2');
  equal(get(obj1, 'count'), 1, 'should not invoke again');
  equal(get(obj2, 'count'), 0, 'should not invoke yet');

  set(get(obj2, 'bar2'), 'baz', 'BIFF3');
  equal(get(obj1, 'count'), 1, 'should not invoke again');
  equal(get(obj2, 'count'), 1, 'should invoke observer on obj2');
});

(0, _emberMetalTestsProps_helper.testBoth)('chain observer on class that has a reference to an uninitialized object will finish chains that reference it', function (get, set) {
  var changed = false;

  var ChildClass = _emberRuntimeSystemObject2['default'].extend({
    parent: null,
    parentOneTwoDidChange: (0, _emberMetalMixin.observer)('parent.one.two', function () {
      changed = true;
    })
  });

  var ParentClass = _emberRuntimeSystemObject2['default'].extend({
    one: {
      two: 'old'
    },
    init: function init() {
      this.child = ChildClass.create({
        parent: this
      });
    }
  });

  var parent = new ParentClass();

  equal(changed, false, 'precond');

  parent.set('one.two', 'new');

  equal(changed, true, 'child should have been notified of change to path');
});