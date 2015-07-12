'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view;

QUnit.module('View action handling', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
    });
  }
});

QUnit.test('Action can be handled by a function on actions object', function () {
  expect(1);
  view = _emberViewsViewsView2['default'].extend({
    actions: {
      poke: function poke() {
        ok(true, 'poked');
      }
    }
  }).create();
  view.send('poke');
});

QUnit.test('A handled action can be bubbled to the target for continued processing', function () {
  expect(2);
  view = _emberViewsViewsView2['default'].extend({
    actions: {
      poke: function poke() {
        ok(true, 'poked 1');
        return true;
      }
    },
    target: _emberRuntimeControllersController2['default'].extend({
      actions: {
        poke: function poke() {
          ok(true, 'poked 2');
        }
      }
    }).create()
  }).create();
  view.send('poke');
});

QUnit.test('Action can be handled by a superclass\' actions object', function () {
  expect(4);

  var SuperView = _emberViewsViewsView2['default'].extend({
    actions: {
      foo: function foo() {
        ok(true, 'foo');
      },
      bar: function bar(msg) {
        equal(msg, 'HELLO');
      }
    }
  });

  var BarViewMixin = _emberMetalMixin.Mixin.create({
    actions: {
      bar: function bar(msg) {
        equal(msg, 'HELLO');
        this._super(msg);
      }
    }
  });

  var IndexView = SuperView.extend(BarViewMixin, {
    actions: {
      baz: function baz() {
        ok(true, 'baz');
      }
    }
  });

  view = IndexView.create();
  view.send('foo');
  view.send('bar', 'HELLO');
  view.send('baz');
});

QUnit.test('Actions cannot be provided at create time', function () {
  expectAssertion(function () {
    view = _emberViewsViewsView2['default'].create({
      actions: {
        foo: function foo() {
          ok(true, 'foo');
        }
      }
    });
  });
  // but should be OK on an object that doesn't mix in Ember.ActionHandler
  _emberRuntimeSystemObject2['default'].create({
    actions: ['foo']
  });
});