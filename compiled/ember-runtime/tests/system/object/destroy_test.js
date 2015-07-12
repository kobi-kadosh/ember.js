'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalBinding = require('ember-metal/binding');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

QUnit.module('ember-runtime/system/object/destroy_test');

(0, _emberMetalTestsProps_helper.testBoth)('should schedule objects to be destroyed at the end of the run loop', function (get, set) {
  var obj = _emberRuntimeSystemObject2['default'].create();
  var meta;

  (0, _emberMetalRun_loop2['default'])(function () {
    obj.destroy();
    meta = obj['__ember_meta__'];
    ok(meta, 'meta is not destroyed immediately');
    ok(get(obj, 'isDestroying'), 'object is marked as destroying immediately');
    ok(!get(obj, 'isDestroyed'), 'object is not destroyed immediately');
  });

  meta = obj['__ember_meta__'];
  ok(!meta, 'meta is destroyed after run loop finishes');
  ok(get(obj, 'isDestroyed'), 'object is destroyed after run loop finishes');
});

if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
  // MANDATORY_SETTER moves value to meta.values
  // a destroyed object removes meta but leaves the accessor
  // that looks it up
  QUnit.test('should raise an exception when modifying watched properties on a destroyed object', function () {
    var obj = _emberRuntimeSystemObject2['default'].extend({
      fooDidChange: (0, _emberMetalMixin.observer)('foo', function () {})
    }).create({
      foo: 'bar'
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      obj.destroy();
    });

    throws(function () {
      (0, _emberMetalProperty_set.set)(obj, 'foo', 'baz');
    }, Error, 'raises an exception');
  });
}

QUnit.test('observers should not fire after an object has been destroyed', function () {
  var count = 0;
  var obj = _emberRuntimeSystemObject2['default'].extend({
    fooDidChange: (0, _emberMetalMixin.observer)('foo', function () {
      count++;
    })
  }).create();

  obj.set('foo', 'bar');

  equal(count, 1, 'observer was fired once');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_events.beginPropertyChanges)();
    obj.set('foo', 'quux');
    obj.destroy();
    (0, _emberMetalProperty_events.endPropertyChanges)();
  });

  equal(count, 1, 'observer was not called after object was destroyed');
});

QUnit.test('destroyed objects should not see each others changes during teardown but a long lived object should', function () {
  var shouldChange = 0;
  var shouldNotChange = 0;

  var objs = {};

  var A = _emberRuntimeSystemObject2['default'].extend({
    objs: objs,
    isAlive: true,
    willDestroy: function willDestroy() {
      this.set('isAlive', false);
    },
    bDidChange: (0, _emberMetalMixin.observer)('objs.b.isAlive', function () {
      shouldNotChange++;
    }),
    cDidChange: (0, _emberMetalMixin.observer)('objs.c.isAlive', function () {
      shouldNotChange++;
    })
  });

  var B = _emberRuntimeSystemObject2['default'].extend({
    objs: objs,
    isAlive: true,
    willDestroy: function willDestroy() {
      this.set('isAlive', false);
    },
    aDidChange: (0, _emberMetalMixin.observer)('objs.a.isAlive', function () {
      shouldNotChange++;
    }),
    cDidChange: (0, _emberMetalMixin.observer)('objs.c.isAlive', function () {
      shouldNotChange++;
    })
  });

  var C = _emberRuntimeSystemObject2['default'].extend({
    objs: objs,
    isAlive: true,
    willDestroy: function willDestroy() {
      this.set('isAlive', false);
    },
    aDidChange: (0, _emberMetalMixin.observer)('objs.a.isAlive', function () {
      shouldNotChange++;
    }),
    bDidChange: (0, _emberMetalMixin.observer)('objs.b.isAlive', function () {
      shouldNotChange++;
    })
  });

  var LongLivedObject = _emberRuntimeSystemObject2['default'].extend({
    objs: objs,
    isAliveDidChange: (0, _emberMetalMixin.observer)('objs.a.isAlive', function () {
      shouldChange++;
    })
  });

  objs.a = new A();

  objs.b = new B();

  objs.c = new C();

  new LongLivedObject();

  (0, _emberMetalRun_loop2['default'])(function () {
    var keys = Object.keys(objs);
    for (var i = 0, l = keys.length; i < l; i++) {
      objs[keys[i]].destroy();
    }
  });

  equal(shouldNotChange, 0, 'destroyed graph objs should not see change in willDestroy');
  equal(shouldChange, 1, 'long lived should see change in willDestroy');
});

QUnit.test('bindings should be synced when are updated in the willDestroy hook', function () {
  var bar = _emberRuntimeSystemObject2['default'].create({
    value: false,
    willDestroy: function willDestroy() {
      this.set('value', true);
    }
  });

  var foo = _emberRuntimeSystemObject2['default'].create({
    value: null,
    bar: bar
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalBinding.bind)(foo, 'value', 'bar.value');
  });

  ok(bar.get('value') === false, 'the initial value has been bound');

  (0, _emberMetalRun_loop2['default'])(function () {
    bar.destroy();
  });

  ok(foo.get('value'), 'foo is synced when the binding is updated in the willDestroy hook');
});