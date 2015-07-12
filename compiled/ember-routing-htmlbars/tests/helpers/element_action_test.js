'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// A, FEATURES, assert

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberViewsSystemAction_manager = require('ember-views/system/action_manager');

var _emberViewsSystemAction_manager2 = _interopRequireDefault(_emberViewsSystemAction_manager);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberRoutingHtmlbarsKeywordsElementAction = require('ember-routing-htmlbars/keywords/element-action');

var _emberHtmlbarsHelpersEach = require('ember-htmlbars/helpers/each');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var dispatcher, view;
var originalRegisterAction = _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction;

QUnit.module('ember-routing-htmlbars: action helper', {
  setup: function setup() {
    dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
    dispatcher.setup();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(dispatcher);

    _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = originalRegisterAction;
  }
});

QUnit.test('should output a data attribute with a guid', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit"}}>edit</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('a').attr('data-ember-action').match(/\d+/), 'A data-ember-action attribute with a guid was added');
});

QUnit.test('should by default register a click event', function () {
  var registeredEventName;

  _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = function (_ref) {
    var eventName = _ref.eventName;

    registeredEventName = eventName;
  };

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit"}}>edit</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(registeredEventName, 'click', 'The click event was properly registered');
});

QUnit.test('should allow alternative events to be handled', function () {
  var registeredEventName;

  _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = function (_ref2) {
    var eventName = _ref2.eventName;

    registeredEventName = eventName;
  };

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit" on="mouseUp"}}>edit</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(registeredEventName, 'mouseUp', 'The alternative mouseUp event was properly registered');
});

QUnit.test('should by default target the view\'s controller', function () {
  var registeredTarget;
  var controller = {};

  _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = function (_ref3) {
    var node = _ref3.node;

    registeredTarget = node.state.target;
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit"}}>edit</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(registeredTarget, controller, 'The controller was registered as the target');
});

QUnit.test('Inside a yield, the target points at the original target', function () {
  var watted = false;

  var component = _emberViewsViewsComponent2['default'].extend({
    boundText: 'inner',
    truthy: true,
    obj: {},
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<div>{{boundText}}</div><div>{{#if truthy}}{{yield}}{{/if}}</div>')
  });

  view = _emberViewsViewsView2['default'].create({
    controller: {
      boundText: 'outer',
      truthy: true,
      wat: function wat() {
        watted = true;
      },
      component: component
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if truthy}}{{#view component}}{{#if truthy}}<div {{action "wat"}} class="wat">{{boundText}}</div>{{/if}}{{/view}}{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.$('.wat').click();
  });

  equal(watted, true, 'The action was called on the right context');
});

QUnit.test('should target the current controller inside an {{each}} loop [DEPRECATED]', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var registeredTarget;

  _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = function (_ref4) {
    var node = _ref4.node;

    registeredTarget = node.state.target;
  };

  var itemController = _emberRuntimeControllersController2['default'].create();

  var ArrayController = _emberRuntimeControllersArray_controller2['default'].extend({
    itemController: 'stub',
    controllerAt: function controllerAt(idx, object) {
      return itemController;
    }
  });

  var controller = ArrayController.create({
    model: _emberMetalCore2['default'].A([1])
  });

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each controller}}<button {{action "editTodo"}}>Edit</button>{{/each}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, _emberHtmlbarsHelpersEach.deprecation);

  equal(registeredTarget, itemController, 'the item controller is the target of action');
});

QUnit.test('should target the with-controller inside an {{#with controller=\'person\'}} [DEPRECATED]', function () {
  var registeredTarget;

  _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = function (_ref5) {
    var node = _ref5.node;

    registeredTarget = node.state.target;
  };

  var PersonController = _emberRuntimeControllersController2['default'].extend();
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();
  var parentController = _emberRuntimeSystemObject2['default'].create({
    container: container
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.person controller="person"}}<div {{action "editTodo"}}></div>{{/with}}'),
    person: _emberRuntimeSystemObject2['default'].create(),
    controller: parentController
  });

  registry.register('controller:person', PersonController);

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  ok(registeredTarget instanceof PersonController, 'the with-controller is the target of action');
});

QUnit.skip('should target the with-controller inside an {{each}} in a {{#with controller=\'person\'}} [DEPRECATED]', function () {
  expectDeprecation(_emberHtmlbarsHelpersEach.deprecation);
  expectDeprecation('Using the context switching form of `{{with}}` is deprecated. Please use the keyword form (`{{with foo as bar}}`) instead.');
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);

  var eventsCalled = [];

  var PeopleController = _emberRuntimeControllersArray_controller2['default'].extend({
    actions: {
      robert: function robert() {
        eventsCalled.push('robert');
      },
      brian: function brian() {
        eventsCalled.push('brian');
      }
    }
  });

  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();
  var parentController = _emberRuntimeSystemObject2['default'].create({
    container: container,
    people: _emberMetalCore2['default'].A([{ name: 'robert' }, { name: 'brian' }])
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with people controller="people"}}{{#each}}<a href="#" {{action name}}>{{name}}</a>{{/each}}{{/with}}'),
    controller: parentController
  });

  registry.register('controller:people', PeopleController);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('click');

  deepEqual(eventsCalled, ['robert', 'brian'], 'the events are fired properly');
});

QUnit.test('should allow a target to be specified', function () {
  var registeredTarget;

  _emberRoutingHtmlbarsKeywordsElementAction.ActionHelper.registerAction = function (_ref6) {
    var node = _ref6.node;

    registeredTarget = node.state.target;
  };

  var anotherTarget = _emberViewsViewsView2['default'].create();

  view = _emberViewsViewsView2['default'].create({
    controller: {},
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit" target=view.anotherTarget}}>edit</a>'),
    anotherTarget: anotherTarget
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(registeredTarget, anotherTarget, 'The specified target was registered');

  (0, _emberRuntimeTestsUtils.runDestroy)(anotherTarget);
});

QUnit.test('should lazily evaluate the target', function () {
  var firstEdit = 0;
  var secondEdit = 0;
  var controller = {};
  var first = {
    edit: function edit() {
      firstEdit++;
    }
  };

  var second = {
    edit: function edit() {
      secondEdit++;
    }
  };

  controller.theTarget = first;

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit" target=theTarget}}>edit</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberViewsSystemJquery2['default'])('a').trigger('click');
  });

  equal(firstEdit, 1);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'theTarget', second);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberViewsSystemJquery2['default'])('a').trigger('click');
  });

  equal(firstEdit, 1);
  equal(secondEdit, 1);
});

QUnit.test('should register an event handler', function () {
  var eventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit"}}>click me</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var actionId = view.$('a[data-ember-action]').attr('data-ember-action');

  ok(_emberViewsSystemAction_manager2['default'].registeredActions[actionId], 'The action was registered');

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled, 'The event handler was called');
});

QUnit.test('handles whitelisted modifier keys', function () {
  var eventHandlerWasCalled = false;
  var shortcutHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      edit: function edit() {
        eventHandlerWasCalled = true;
      },
      shortcut: function shortcut() {
        shortcutHandlerWasCalled = true;
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit" allowedKeys="alt"}}>click me</a> <div {{action "shortcut" allowedKeys="any"}}>click me too</div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var actionId = view.$('a[data-ember-action]').attr('data-ember-action');

  ok(_emberViewsSystemAction_manager2['default'].registeredActions[actionId], 'The action was registered');

  var e = _emberViewsSystemJquery2['default'].Event('click');
  e.altKey = true;
  view.$('a').trigger(e);

  ok(eventHandlerWasCalled, 'The event handler was called');

  e = _emberViewsSystemJquery2['default'].Event('click');
  e.ctrlKey = true;
  view.$('div').trigger(e);

  ok(shortcutHandlerWasCalled, 'The "any" shortcut\'s event handler was called');
});

QUnit.test('should be able to use action more than once for the same event within a view', function () {
  var editWasCalled = false;
  var deleteWasCalled = false;
  var originalEventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      edit: function edit() {
        editWasCalled = true;
      },
      'delete': function _delete() {
        deleteWasCalled = true;
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a id="edit" href="#" {{action "edit"}}>edit</a><a id="delete" href="#" {{action "delete"}}>delete</a>'),
    click: function click() {
      originalEventHandlerWasCalled = true;
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('#edit').trigger('click');

  equal(editWasCalled, true, 'The edit action was called');
  equal(deleteWasCalled, false, 'The delete action was not called');

  editWasCalled = deleteWasCalled = originalEventHandlerWasCalled = false;

  view.$('#delete').trigger('click');

  equal(editWasCalled, false, 'The edit action was not called');
  equal(deleteWasCalled, true, 'The delete action was called');

  editWasCalled = deleteWasCalled = originalEventHandlerWasCalled = false;

  view.$().trigger('click');

  equal(editWasCalled, false, 'The edit action was not called');
  equal(deleteWasCalled, false, 'The delete action was not called');
});

QUnit.test('the event should not bubble if `bubbles=false` is passed', function () {
  var editWasCalled = false;
  var deleteWasCalled = false;
  var originalEventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      edit: function edit() {
        editWasCalled = true;
      },
      'delete': function _delete() {
        deleteWasCalled = true;
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a id="edit" href="#" {{action "edit" bubbles=false}}>edit</a><a id="delete" href="#" {{action "delete" bubbles=false}}>delete</a>'),
    click: function click() {
      originalEventHandlerWasCalled = true;
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('#edit').trigger('click');

  equal(editWasCalled, true, 'The edit action was called');
  equal(deleteWasCalled, false, 'The delete action was not called');
  equal(originalEventHandlerWasCalled, false, 'The original event handler was not called');

  editWasCalled = deleteWasCalled = originalEventHandlerWasCalled = false;

  view.$('#delete').trigger('click');

  equal(editWasCalled, false, 'The edit action was not called');
  equal(deleteWasCalled, true, 'The delete action was called');
  equal(originalEventHandlerWasCalled, false, 'The original event handler was not called');

  editWasCalled = deleteWasCalled = originalEventHandlerWasCalled = false;

  view.$().trigger('click');

  equal(editWasCalled, false, 'The edit action was not called');
  equal(deleteWasCalled, false, 'The delete action was not called');
  equal(originalEventHandlerWasCalled, true, 'The original event handler was called');
});

QUnit.test('should work properly in an #each block', function () {
  var eventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    items: _emberMetalCore2['default'].A([1, 2, 3, 4]),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items as |item|}}<a href="#" {{action "edit"}}>click me</a>{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled, 'The event handler was called');
});

QUnit.test('should work properly in a {{#with foo as |bar|}} block', function () {
  var eventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    something: { ohai: 'there' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.something as |somethingElse|}}<a href="#" {{action "edit"}}>click me</a>{{/with}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled, 'The event handler was called');
});

QUnit.test('should work properly in a #with block [DEPRECATED]', function () {
  var eventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    something: { ohai: 'there' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.something}}<a href="#" {{action "edit"}}>click me</a>{{/with}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled, 'The event handler was called');
});

QUnit.test('should unregister event handlers on rerender', function () {
  var eventHandlerWasCalled = false;

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.active}}<a href="#" {{action "edit"}}>click me</a>{{/if}}'),
    active: true,
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var previousActionId = view.$('a[data-ember-action]').attr('data-ember-action');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'active', false);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'active', true);
  });

  ok(!_emberViewsSystemAction_manager2['default'].registeredActions[previousActionId], 'On rerender, the event handler was removed');

  var newActionId = view.$('a[data-ember-action]').attr('data-ember-action');

  ok(_emberViewsSystemAction_manager2['default'].registeredActions[newActionId], 'After rerender completes, a new event handler was added');
});

QUnit.test('should unregister event handlers on inside virtual views', function () {
  var things = _emberMetalCore2['default'].A([{
    name: 'Thingy'
  }]);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.things as |thing|}}<a href="#" {{action "edit"}}>click me</a>{{/each}}'),
    things: things
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var actionId = view.$('a[data-ember-action]').attr('data-ember-action');

  (0, _emberMetalRun_loop2['default'])(function () {
    things.removeAt(0);
  });

  ok(!_emberViewsSystemAction_manager2['default'].registeredActions[actionId], 'After the virtual view was destroyed, the action was unregistered');
});

QUnit.test('should properly capture events on child elements of a container with an action', function () {
  var eventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{action "edit"}}><button>click me</button></div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('button').trigger('click');

  ok(eventHandlerWasCalled, 'Event on a child element triggered the action of its parent');
});

QUnit.test('should allow bubbling of events from action helper to original parent event', function () {
  var eventHandlerWasCalled = false;
  var originalEventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit"}}>click me</a>'),
    click: function click() {
      originalEventHandlerWasCalled = true;
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled && originalEventHandlerWasCalled, 'Both event handlers were called');
});

QUnit.test('should not bubble an event from action helper to original parent event if `bubbles=false` is passed', function () {
  var eventHandlerWasCalled = false;
  var originalEventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: { edit: function edit() {
        eventHandlerWasCalled = true;
      } }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit" bubbles=false}}>click me</a>'),
    click: function click() {
      originalEventHandlerWasCalled = true;
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled, 'The child handler was called');
  ok(!originalEventHandlerWasCalled, 'The parent handler was not called');
});

QUnit.test('should allow \'send\' as action name (#594)', function () {
  var eventHandlerWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    send: function send() {
      eventHandlerWasCalled = true;
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "send"}}>send</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('click');

  ok(eventHandlerWasCalled, 'The view\'s send method was called');
});

QUnit.test('should send the view, event and current context to the action', function () {
  var passedTarget;
  var passedContext;

  var aTarget = _emberRuntimeControllersController2['default'].extend({
    actions: {
      edit: function edit(context) {
        passedTarget = this;
        passedContext = context;
      }
    }
  }).create();

  var aContext = { aTarget: aTarget };

  view = _emberViewsViewsView2['default'].create({
    context: aContext,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a id="edit" href="#" {{action "edit" this target=aTarget}}>edit</a>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('#edit').trigger('click');

  strictEqual(passedTarget, aTarget, 'the action is called with the target as this');
  strictEqual(passedContext, aContext, 'the parameter is passed along');
});

QUnit.test('should only trigger actions for the event they were registered on', function () {
  var editWasCalled = false;

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href="#" {{action "edit"}}>edit</a>'),
    actions: { edit: function edit() {
        editWasCalled = true;
      } }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('a').trigger('mouseover');

  ok(!editWasCalled, 'The action wasn\'t called');
});

QUnit.test('should unwrap controllers passed as a context', function () {
  var passedContext;
  var model = _emberRuntimeSystemObject2['default'].create();
  var controller = _emberRuntimeControllersController2['default'].extend({
    model: model,
    actions: {
      edit: function edit(context) {
        passedContext = context;
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<button {{action "edit" this}}>edit</button>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('button').trigger('click');

  equal(passedContext, model, 'the action was passed the unwrapped model');
});

QUnit.test('should not unwrap controllers passed as `controller`', function () {
  var passedContext;
  var model = _emberRuntimeSystemObject2['default'].create();
  var controller = _emberRuntimeControllersController2['default'].extend({
    model: model,
    actions: {
      edit: function edit(context) {
        passedContext = context;
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<button {{action "edit" controller}}>edit</button>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('button').trigger('click');

  equal(passedContext, controller, 'the action was passed the controller');
});

QUnit.test('should allow multiple contexts to be specified', function () {
  var passedContexts;
  var models = [_emberRuntimeSystemObject2['default'].create(), _emberRuntimeSystemObject2['default'].create()];

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      edit: function edit() {
        passedContexts = [].slice.call(arguments);
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    modelA: models[0],
    modelB: models[1],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<button {{action "edit" view.modelA view.modelB}}>edit</button>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('button').trigger('click');

  deepEqual(passedContexts, models, 'the action was called with the passed contexts');
});

QUnit.test('should allow multiple contexts to be specified mixed with string args', function () {
  var passedParams;
  var model = _emberRuntimeSystemObject2['default'].create();

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      edit: function edit() {
        passedParams = [].slice.call(arguments);
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    modelA: model,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<button {{action "edit" "herp" view.modelA}}>edit</button>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  view.$('button').trigger('click');

  deepEqual(passedParams, ['herp', model], 'the action was called with the passed contexts');
});

QUnit.test('it does not trigger action with special clicks', function () {
  var showCalled = false;

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a {{action \'show\' href=true}}>Hi</a>')
  });

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      show: function show() {
        showCalled = true;
      }
    }
  }).create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller', controller);
    view.appendTo('#qunit-fixture');
  });

  function checkClick(prop, value, expected) {
    var event = _emberViewsSystemJquery2['default'].Event('click');
    event[prop] = value;
    view.$('a').trigger(event);
    if (expected) {
      ok(showCalled, 'should call action with ' + prop + ':' + value);
      ok(event.isDefaultPrevented(), 'should prevent default');
    } else {
      ok(!showCalled, 'should not call action with ' + prop + ':' + value);
      ok(!event.isDefaultPrevented(), 'should not prevent default');
    }
  }

  checkClick('ctrlKey', true, false);
  checkClick('altKey', true, false);
  checkClick('metaKey', true, false);
  checkClick('shiftKey', true, false);
  checkClick('which', 2, false);

  checkClick('which', 1, true);
  checkClick('which', undefined, true); // IE <9
});

QUnit.test('it can trigger actions for keyboard events', function () {
  var showCalled = false;

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input type=\'text\' {{action \'show\' on=\'keyUp\'}}>')
  });

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      show: function show() {
        showCalled = true;
      }
    }
  }).create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller', controller);
    view.appendTo('#qunit-fixture');
  });

  var event = _emberViewsSystemJquery2['default'].Event('keyup');
  event.char = 'a';
  event.which = 65;
  view.$('input').trigger(event);
  ok(showCalled, 'should call action with keyup');
});

QUnit.test('a quoteless parameter should allow dynamic lookup of the actionName', function () {
  expect(4);
  var lastAction;
  var actionOrder = [];

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a id=\'woot-bound-param\' {{action hookMeUp}}>Hi</a>')
  });

  var controller = _emberRuntimeControllersController2['default'].extend({
    hookMeUp: 'biggityBoom',
    actions: {
      biggityBoom: function biggityBoom() {
        lastAction = 'biggityBoom';
        actionOrder.push(lastAction);
      },
      whompWhomp: function whompWhomp() {
        lastAction = 'whompWhomp';
        actionOrder.push(lastAction);
      },
      sloopyDookie: function sloopyDookie() {
        lastAction = 'sloopyDookie';
        actionOrder.push(lastAction);
      }
    }
  }).create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller', controller);
    view.appendTo('#qunit-fixture');
  });

  var testBoundAction = function testBoundAction(propertyValue) {
    (0, _emberMetalRun_loop2['default'])(function () {
      controller.set('hookMeUp', propertyValue);
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      view.$('#woot-bound-param').click();
    });

    equal(lastAction, propertyValue, 'lastAction set to ' + propertyValue);
  };

  testBoundAction('whompWhomp');
  testBoundAction('sloopyDookie');
  testBoundAction('biggityBoom');

  deepEqual(actionOrder, ['whompWhomp', 'sloopyDookie', 'biggityBoom'], 'action name was looked up properly');
});

QUnit.test('a quoteless parameter should lookup actionName in context [DEPRECATED]', function () {
  expect(5);
  var lastAction;
  var actionOrder = [];

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each allactions}}<a {{bind-attr id=\'name\'}} {{action name}}>{{title}}</a>{{/each}}')
    });
  });

  var controller = _emberRuntimeControllersController2['default'].extend({
    allactions: _emberMetalCore2['default'].A([{ title: 'Biggity Boom', name: 'biggityBoom' }, { title: 'Whomp Whomp', name: 'whompWhomp' }, { title: 'Sloopy Dookie', name: 'sloopyDookie' }]),
    actions: {
      biggityBoom: function biggityBoom() {
        lastAction = 'biggityBoom';
        actionOrder.push(lastAction);
      },
      whompWhomp: function whompWhomp() {
        lastAction = 'whompWhomp';
        actionOrder.push(lastAction);
      },
      sloopyDookie: function sloopyDookie() {
        lastAction = 'sloopyDookie';
        actionOrder.push(lastAction);
      }
    }
  }).create();

  expectDeprecation(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('controller', controller);
      view.appendTo('#qunit-fixture');
    });
  }, _emberHtmlbarsHelpersEach.deprecation);

  var testBoundAction = function testBoundAction(propertyValue) {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.$('#' + propertyValue).click();
    });

    equal(lastAction, propertyValue, 'lastAction set to ' + propertyValue);
  };

  testBoundAction('whompWhomp');
  testBoundAction('sloopyDookie');
  testBoundAction('biggityBoom');

  deepEqual(actionOrder, ['whompWhomp', 'sloopyDookie', 'biggityBoom'], 'action name was looked up properly');
});

QUnit.test('a quoteless string parameter should resolve actionName, including path', function () {
  expect(4);
  var lastAction;
  var actionOrder = [];

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each item in allactions}}<a {{bind-attr id=\'item.name\'}} {{action item.name}}>{{item.title}}</a>{{/each}}')
    });
  });

  var controller = _emberRuntimeControllersController2['default'].extend({
    allactions: _emberMetalCore2['default'].A([{ title: 'Biggity Boom', name: 'biggityBoom' }, { title: 'Whomp Whomp', name: 'whompWhomp' }, { title: 'Sloopy Dookie', name: 'sloopyDookie' }]),
    actions: {
      biggityBoom: function biggityBoom() {
        lastAction = 'biggityBoom';
        actionOrder.push(lastAction);
      },
      whompWhomp: function whompWhomp() {
        lastAction = 'whompWhomp';
        actionOrder.push(lastAction);
      },
      sloopyDookie: function sloopyDookie() {
        lastAction = 'sloopyDookie';
        actionOrder.push(lastAction);
      }
    }
  }).create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller', controller);
    view.appendTo('#qunit-fixture');
  });

  var testBoundAction = function testBoundAction(propertyValue) {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.$('#' + propertyValue).click();
    });

    equal(lastAction, propertyValue, 'lastAction set to ' + propertyValue);
  };

  testBoundAction('whompWhomp');
  testBoundAction('sloopyDookie');
  testBoundAction('biggityBoom');

  deepEqual(actionOrder, ['whompWhomp', 'sloopyDookie', 'biggityBoom'], 'action name was looked up properly');
});

if ((0, _emberMetalFeatures2['default'])('ember-routing-htmlbars-improved-actions')) {

  QUnit.test('a quoteless function parameter should be called, including arguments', function () {
    expect(2);

    var arg = 'rough ray';

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a {{action submit \'' + arg + '\'}}></a>')
    });

    var controller = _emberRuntimeControllersController2['default'].extend({
      submit: function submit(actualArg) {
        ok(true, 'submit function called');
        equal(actualArg, arg, 'argument passed');
      }
    }).create();

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('controller', controller);
      view.appendTo('#qunit-fixture');
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      view.$('a').click();
    });
  });
}

QUnit.test('a quoteless parameter that does not resolve to a value asserts', function () {

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      ohNoeNotValid: function ohNoeNotValid() {}
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a id=\'oops-bound-param\' {{action ohNoeNotValid}}>Hi</a>')
  });

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.appendTo('#qunit-fixture');
    });
  }, 'You specified a quoteless path to the {{action}} helper ' + 'which did not resolve to an action name (a string). ' + 'Perhaps you meant to use a quoted actionName? (e.g. {{action \'save\'}}).');
});

QUnit.test('allows multiple actions on a single element', function () {
  var clickActionWasCalled = false;
  var doubleClickActionWasCalled = false;

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      clicked: function clicked() {
        clickActionWasCalled = true;
      },

      doubleClicked: function doubleClicked() {
        doubleClickActionWasCalled = true;
      }
    }
  }).create();

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('\n      <a href="#"\n        {{action "clicked" on="click"}}\n        {{action "doubleClicked" on="doubleClick"}}\n      >click me</a>\n    ')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var actionId = view.$('a[data-ember-action]').attr('data-ember-action');

  ok(_emberViewsSystemAction_manager2['default'].registeredActions[actionId], 'The action was registered');

  view.$('a').trigger('click');

  ok(clickActionWasCalled, 'The clicked action was called');

  view.$('a').trigger('dblclick');

  ok(doubleClickActionWasCalled, 'The double click handler was called');
});

QUnit.module('ember-routing-htmlbars: action helper - deprecated invoking directly on target', {
  setup: function setup() {
    dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
    dispatcher.setup();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(dispatcher);
  }
});

QUnit.test('should respect preventDefault=false option if provided', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<a {{action \'show\' preventDefault=false}}>Hi</a>')
  });

  var controller = _emberRuntimeControllersController2['default'].extend({
    actions: {
      show: function show() {}
    }
  }).create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller', controller);
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  var event = _emberViewsSystemJquery2['default'].Event('click');
  view.$('a').trigger(event);

  equal(event.isDefaultPrevented(), false, 'should not preventDefault');
});