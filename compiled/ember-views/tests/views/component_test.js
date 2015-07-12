'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemService = require('ember-runtime/system/service');

var _emberRuntimeSystemService2 = _interopRequireDefault(_emberRuntimeSystemService);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeInject = require('ember-runtime/inject');

var _emberRuntimeInject2 = _interopRequireDefault(_emberRuntimeInject);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

var a_slice = Array.prototype.slice;

var component, controller, actionCounts, sendCount, actionArguments;

QUnit.module('Ember.Component', {
  setup: function setup() {
    component = _emberViewsViewsComponent2['default'].create();
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (component) {
        component.destroy();
      }
      if (controller) {
        controller.destroy();
      }
    });
  }
});

QUnit.test('The context of an Ember.Component is itself', function () {
  strictEqual(component, component.get('context'), 'A component\'s context is itself');
});

QUnit.test('The controller (target of `action`) of an Ember.Component is itself', function () {
  strictEqual(component, component.get('controller'), 'A component\'s controller is itself');
});

QUnit.test('A templateName specified to a component is moved to the layoutName', function () {
  expectDeprecation(/Do not specify templateName on a Component, use layoutName instead/);
  component = _emberViewsViewsComponent2['default'].extend({
    templateName: 'blah-blah'
  }).create();

  equal(component.get('layoutName'), 'blah-blah', 'The layoutName now contains the templateName specified.');
});

QUnit.test('A template specified to a component is moved to the layout', function () {
  expectDeprecation(/Do not specify template on a Component, use layout instead/);
  component = _emberViewsViewsComponent2['default'].extend({
    template: 'blah-blah'
  }).create();

  equal(component.get('layout'), 'blah-blah', 'The layoutName now contains the templateName specified.');
});

QUnit.test('A template specified to a component is deprecated', function () {
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      template: 'blah-blah'
    }).create();
  }, 'Do not specify template on a Component, use layout instead.');
});

QUnit.test('A templateName specified to a component is deprecated', function () {
  expectDeprecation(function () {
    component = _emberViewsViewsComponent2['default'].extend({
      templateName: 'blah-blah'
    }).create();
  }, 'Do not specify templateName on a Component, use layoutName instead.');
});

QUnit.test('Specifying both templateName and layoutName to a component is NOT deprecated', function () {
  expectNoDeprecation();
  component = _emberViewsViewsComponent2['default'].extend({
    templateName: 'blah-blah',
    layoutName: 'hum-drum'
  }).create();

  equal((0, _emberMetalProperty_get.get)(component, 'templateName'), 'blah-blah');
  equal((0, _emberMetalProperty_get.get)(component, 'layoutName'), 'hum-drum');
});

QUnit.test('Specifying a templateName on a component with a layoutName specified in a superclass is NOT deprecated', function () {
  expectNoDeprecation();
  var Parent = _emberViewsViewsComponent2['default'].extend({
    layoutName: 'hum-drum'
  });

  component = Parent.extend({
    templateName: 'blah-blah'
  }).create();

  equal((0, _emberMetalProperty_get.get)(component, 'templateName'), 'blah-blah');
  equal((0, _emberMetalProperty_get.get)(component, 'layoutName'), 'hum-drum');
});

QUnit.module('Ember.Component - Actions', {
  setup: function setup() {
    actionCounts = {};
    sendCount = 0;
    actionArguments = null;

    controller = _emberRuntimeSystemObject2['default'].create({
      send: function send(actionName) {
        sendCount++;
        actionCounts[actionName] = actionCounts[actionName] || 0;
        actionCounts[actionName]++;
        actionArguments = a_slice.call(arguments, 1);
      }
    });

    component = _emberViewsViewsComponent2['default'].create({
      parentView: _emberViewsViewsView2['default'].create({
        controller: controller
      })
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      component.destroy();
      controller.destroy();
    });
  }
});

QUnit.test('Calling sendAction on a component without an action defined does nothing', function () {
  component.sendAction();
  equal(sendCount, 0, 'addItem action was not invoked');
});

QUnit.test('Calling sendAction on a component with an action defined calls send on the controller', function () {
  (0, _emberMetalProperty_set.set)(component, 'action', 'addItem');

  component.sendAction();

  equal(sendCount, 1, 'send was called once');
  equal(actionCounts['addItem'], 1, 'addItem event was sent once');
});

QUnit.test('Calling sendAction on a component with a function calls the function', function () {
  expect(1);
  (0, _emberMetalProperty_set.set)(component, 'action', function () {
    ok(true, 'function is called');
  });

  component.sendAction();
});

QUnit.test('Calling sendAction on a component with a function calls the function with arguments', function () {
  expect(1);
  var argument = {};
  (0, _emberMetalProperty_set.set)(component, 'action', function (actualArgument) {
    equal(actualArgument, argument, 'argument is passed');
  });

  component.sendAction('action', argument);
});

QUnit.test('Calling sendAction on a component with a mut attr calls the function with arguments', function () {
  var mut = _defineProperty({
    value: 'didStartPlaying'
  }, _emberViewsCompatAttrsProxy.MUTABLE_CELL, true);
  (0, _emberMetalProperty_set.set)(component, 'playing', null);
  (0, _emberMetalProperty_set.set)(component, 'attrs', { playing: mut });

  component.sendAction('playing');

  equal(sendCount, 1, 'send was called once');
  equal(actionCounts['didStartPlaying'], 1, 'named action was sent');
});

QUnit.test('Calling sendAction with a named action uses the component\'s property as the action name', function () {
  (0, _emberMetalProperty_set.set)(component, 'playing', 'didStartPlaying');
  (0, _emberMetalProperty_set.set)(component, 'action', 'didDoSomeBusiness');

  component.sendAction('playing');

  equal(sendCount, 1, 'send was called once');
  equal(actionCounts['didStartPlaying'], 1, 'named action was sent');

  component.sendAction('playing');

  equal(sendCount, 2, 'send was called twice');
  equal(actionCounts['didStartPlaying'], 2, 'named action was sent');

  component.sendAction();

  equal(sendCount, 3, 'send was called three times');
  equal(actionCounts['didDoSomeBusiness'], 1, 'default action was sent');
});

QUnit.test('Calling sendAction when the action name is not a string raises an exception', function () {
  (0, _emberMetalProperty_set.set)(component, 'action', {});
  (0, _emberMetalProperty_set.set)(component, 'playing', {});

  expectAssertion(function () {
    component.sendAction();
  });

  expectAssertion(function () {
    component.sendAction('playing');
  });
});

QUnit.test('Calling sendAction on a component with a context', function () {
  (0, _emberMetalProperty_set.set)(component, 'playing', 'didStartPlaying');

  var testContext = { song: 'She Broke My Ember' };

  component.sendAction('playing', testContext);

  deepEqual(actionArguments, [testContext], 'context was sent with the action');
});

QUnit.test('Calling sendAction on a component with multiple parameters', function () {
  (0, _emberMetalProperty_set.set)(component, 'playing', 'didStartPlaying');

  var firstContext = { song: 'She Broke My Ember' };
  var secondContext = { song: 'My Achey Breaky Ember' };

  component.sendAction('playing', firstContext, secondContext);

  deepEqual(actionArguments, [firstContext, secondContext], 'arguments were sent to the action');
});

QUnit.module('Ember.Component - injected properties');

QUnit.test('services can be injected into components', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('component:application', _emberViewsViewsComponent2['default'].extend({
    profilerService: _emberRuntimeInject2['default'].service('profiler')
  }));

  registry.register('service:profiler', _emberRuntimeSystemService2['default'].extend());

  var appComponent = container.lookup('component:application');
  var profilerService = container.lookup('service:profiler');

  equal(profilerService, appComponent.get('profilerService'), 'service.profiler is injected');
});

QUnit.module('Ember.Component - subscribed and sent actions trigger errors');

QUnit.test('something', function () {
  expect(2);

  var appComponent = _emberViewsViewsComponent2['default'].extend({
    actions: {
      foo: function foo(message) {
        equal('bar', message);
      }
    }
  }).create();

  appComponent.send('foo', 'bar');

  throws(function () {
    appComponent.send('baz', 'bar');
  }, /had no action handler for: baz/, 'asdf');
});

QUnit.test('component with target', function () {
  expect(2);

  var target = {
    send: function send(message, payload) {
      equal('foo', message);
      equal('baz', payload);
    }
  };

  var appComponent = _emberViewsViewsComponent2['default'].create({
    target: target
  });

  appComponent.send('foo', 'baz');
});