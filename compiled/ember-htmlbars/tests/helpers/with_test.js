/*jshint newcap:false*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view, lookup;
var originalLookup = _emberMetalCore2['default'].lookup;

function testWithAs(moduleName, templateString, deprecated) {
  QUnit.module(moduleName, {
    setup: function setup() {
      _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

      var template;
      if (deprecated) {
        expectDeprecation(function () {
          template = (0, _emberTemplateCompilerSystemCompile2['default'])(templateString);
        }, 'Using {{with}} without block syntax (L1:C0) is deprecated. Please use standard block form (`{{#with foo as |bar|}}`) instead.');
      } else {
        template = (0, _emberTemplateCompilerSystemCompile2['default'])(templateString);
      }

      view = _emberViewsViewsView2['default'].create({
        template: template,
        context: {
          title: 'Señor Engineer',
          person: { name: 'Tom Dale' }
        }
      });

      (0, _emberRuntimeTestsUtils.runAppend)(view);
    },

    teardown: function teardown() {
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
      _emberMetalCore2['default'].lookup = originalLookup;
    }
  });

  QUnit.test('it should support #with-as syntax', function () {
    equal(view.$().text(), 'Señor Engineer: Tom Dale', 'should be properly scoped');
  });

  QUnit.test('updating the context should update the alias', function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.person', {
        name: 'Yehuda Katz'
      });
    });

    equal(view.$().text(), 'Señor Engineer: Yehuda Katz', 'should be properly scoped after updating');
  });

  QUnit.test('updating a property on the context should update the HTML', function () {
    equal(view.$().text(), 'Señor Engineer: Tom Dale', 'precond - should be properly scoped after updating');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'context.person.name', 'Yehuda Katz');
    });

    equal(view.$().text(), 'Señor Engineer: Yehuda Katz', 'should be properly scoped after updating');
  });

  QUnit.test('updating a property on the view should update the HTML', function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.title', 'Señorette Engineer');
    });

    equal(view.$().text(), 'Señorette Engineer: Tom Dale', 'should be properly scoped after updating');
  });
}

testWithAs('ember-htmlbars: {{#with}} helper', '{{#with person as tom}}{{title}}: {{tom.name}}{{/with}}', true);

QUnit.module('Multiple Handlebars {{with foo as bar}} helpers', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('re-using the same variable with different #with blocks does not override each other', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Admin: {{#with admin as |person|}}{{person.name}}{{/with}} User: {{#with user as |person|}}{{person.name}}{{/with}}'),
    context: {
      admin: { name: 'Tom Dale' },
      user: { name: 'Yehuda Katz' }
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Admin: Tom Dale User: Yehuda Katz', 'should be properly scoped');
});

QUnit.test('the scoped variable is not available outside the {{with}} block.', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}-{{#with other as |name|}}{{name}}{{/with}}-{{name}}'),
    context: {
      name: 'Stef',
      other: 'Yehuda'
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Stef-Yehuda-Stef', 'should be properly scoped after updating');
});

QUnit.test('nested {{with}} blocks shadow the outer scoped variable properly.', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with first as |ring|}}{{ring}}-{{#with fifth as |ring|}}{{ring}}-{{#with ninth as |ring|}}{{ring}}-{{/with}}{{ring}}-{{/with}}{{ring}}{{/with}}'),
    context: {
      first: 'Limbo',
      fifth: 'Wrath',
      ninth: 'Treachery'
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Limbo-Wrath-Treachery-Wrath-Limbo', 'should be properly scoped after updating');
});

QUnit.module('Handlebars {{#with}} globals helper [DEPRECATED]', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    lookup.Foo = { bar: 'baz' };
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with Foo.bar as |qux|}}{{qux}}{{/with}}')
    });
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('it should support #with Foo.bar as qux [DEPRECATED]', function () {
  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Global lookup of Foo from a Handlebars template is deprecated/);

  equal(view.$().text(), 'baz', 'should be properly scoped');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(lookup.Foo, 'bar', 'updated');
  });

  equal(view.$().text(), 'updated', 'should update');
});

QUnit.module('Handlebars {{#with keyword as |foo|}}');

QUnit.test('it should support #with view as foo', function () {
  var view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view as |myView|}}{{myView.name}}{{/with}}'),
    name: 'Sonics'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Sonics', 'should be properly scoped');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'name', 'Thunder');
  });

  equal(view.$().text(), 'Thunder', 'should update');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('it should support #with name as foo, then #with foo as bar', function () {
  var view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with name as |foo|}}{{#with foo as |bar|}}{{bar}}{{/with}}{{/with}}'),
    context: { name: 'caterpillar' }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'caterpillar', 'should be properly scoped');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context.name', 'butterfly');
  });

  equal(view.$().text(), 'butterfly', 'should update');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.module('Handlebars {{#with this as |foo|}}');

QUnit.test('it should support #with this as qux', function () {
  var view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with this as |person|}}{{person.name}}{{/with}}'),
    controller: _emberRuntimeSystemObject2['default'].create({ name: 'Los Pivots' })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Los Pivots', 'should be properly scoped');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'controller.name', 'l\'Pivots');
  });

  equal(view.$().text(), 'l\'Pivots', 'should update');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.module('Handlebars {{#with foo}} with defined controller');

QUnit.test('it should wrap context with object controller [DEPRECATED]', function () {
  var childController;

  var Controller = _emberRuntimeControllersObject_controller2['default'].extend({
    init: function init() {
      if (childController) {
        throw new Error('Did not expect controller.init to be invoked twice');
      }
      childController = this;
      this._super();
    },
    controllerName: (0, _emberMetalComputed.computed)(function () {
      return 'controller:' + this.get('model.name') + ' and ' + this.get('parentController.name');
    }).property('model.name', 'parentController.name')
  });

  var person = _emberRuntimeSystemObject2['default'].create({ name: 'Steve Holt' });
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  var parentController = _emberRuntimeSystemObject2['default'].create({
    container: container,
    name: 'Bob Loblaw'
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.person controller="person"}}{{controllerName}}{{/with}}'),
    person: person,
    controller: parentController
  });

  registry.register('controller:person', Controller);

  expectDeprecation(_emberRuntimeControllersObject_controller.objectControllerDeprecation);
  expectDeprecation('Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller:Steve Holt and Bob Loblaw');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal(view.$().text(), 'controller:Steve Holt and Bob Loblaw');

  (0, _emberMetalRun_loop2['default'])(function () {
    parentController.set('name', 'Carl Weathers');
    view.rerender();
  });

  equal(view.$().text(), 'controller:Steve Holt and Carl Weathers');

  (0, _emberMetalRun_loop2['default'])(function () {
    person.set('name', 'Gob');
    view.rerender();
  });

  equal(view.$().text(), 'controller:Gob and Carl Weathers');

  strictEqual(childController.get('target'), parentController, 'the target property of the child controllers are set correctly');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

/* requires each
QUnit.test("it should still have access to original parentController within an {{#each}}", function() {
  var Controller = ObjectController.extend({
    controllerName: computed(function() {
      return "controller:"+this.get('model.name') + ' and ' + this.get('parentController.name');
    })
  });

  var people = A([{ name: "Steve Holt" }, { name: "Carl Weathers" }]);
  var registry = new Registry();
  var container = registry.container();

  var parentController = EmberObject.create({
    container: container,
    name: 'Bob Loblaw',
    people: people
  });

  view = EmberView.create({
    container: container,
    template: compile('{{#each person in people}}{{#with person controller="person"}}{{controllerName}}{{/with}}{{/each}}'),
    controller: parentController
  });

  registry.register('controller:person', Controller);

  runAppend(view);

  equal(view.$().text(), "controller:Steve Holt and Bob Loblawcontroller:Carl Weathers and Bob Loblaw");

  runDestroy(view);
});
*/

QUnit.test('it should wrap keyword with object controller [DEPRECATED]', function () {
  expectDeprecation(_emberRuntimeControllersObject_controller.objectControllerDeprecation);

  var PersonController = _emberRuntimeControllersObject_controller2['default'].extend({
    name: (0, _emberMetalComputed.computed)('model.name', function () {
      return (0, _emberMetalProperty_get.get)(this, 'model.name').toUpperCase();
    })
  });

  var person = _emberRuntimeSystemObject2['default'].create({ name: 'Steve Holt' });
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  var parentController = _emberRuntimeSystemObject2['default'].create({
    container: container,
    person: person,
    name: 'Bob Loblaw'
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with person controller="person" as |steve|}}{{name}} - {{steve.name}}{{/with}}'),
    controller: parentController
  });

  registry.register('controller:person', PersonController);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Bob Loblaw - STEVE HOLT');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal(view.$().text(), 'Bob Loblaw - STEVE HOLT');

  (0, _emberMetalRun_loop2['default'])(function () {
    parentController.set('name', 'Carl Weathers');
    view.rerender();
  });

  equal(view.$().text(), 'Carl Weathers - STEVE HOLT');

  (0, _emberMetalRun_loop2['default'])(function () {
    person.set('name', 'Gob');
    view.rerender();
  });

  equal(view.$().text(), 'Carl Weathers - GOB');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('destroys the controller generated with {{with foo controller=\'blah\'}} [DEPRECATED]', function () {
  var destroyed = false;
  var Controller = _emberRuntimeControllersController2['default'].extend({
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      destroyed = true;
    }
  });

  var person = _emberRuntimeSystemObject2['default'].create({ name: 'Steve Holt' });
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  var parentController = _emberRuntimeSystemObject2['default'].create({
    container: container,
    person: person,
    name: 'Bob Loblaw'
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with person controller="person"}}{{controllerName}}{{/with}}'),
    controller: parentController
  });

  registry.register('controller:person', Controller);

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  ok(destroyed, 'controller was destroyed properly');
});

QUnit.test('destroys the controller generated with {{with foo as bar controller=\'blah\'}}', function () {
  var destroyed = false;
  var Controller = _emberRuntimeControllersController2['default'].extend({
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      destroyed = true;
    }
  });

  var person = _emberRuntimeSystemObject2['default'].create({ name: 'Steve Holt' });
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  var parentController = _emberRuntimeSystemObject2['default'].create({
    container: container,
    person: person,
    name: 'Bob Loblaw'
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with person controller="person" as |steve|}}{{controllerName}}{{/with}}'),
    controller: parentController
  });

  registry.register('controller:person', Controller);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  ok(destroyed, 'controller was destroyed properly');
});

QUnit.module('{{#with}} helper binding to view keyword', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('We have: {{#with view.thing as |fromView|}}{{fromView.name}} and {{fromContext.name}}{{/with}}'),
      thing: { name: 'this is from the view' },
      context: {
        fromContext: { name: 'this is from the context' }
      }
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('{{with}} helper can bind to keywords with \'as\'', function () {
  equal(view.$().text(), 'We have: this is from the view and this is from the context', 'should render');
});

testWithAs('ember-htmlbars: {{#with x as |y|}}', '{{#with person as |tom|}}{{title}}: {{tom.name}}{{/with}}');

QUnit.module('Multiple Handlebars {{with foo as |bar|}} helpers', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('re-using the same variable with different #with blocks does not override each other', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Admin: {{#with admin as |person|}}{{person.name}}{{/with}} User: {{#with user as |person|}}{{person.name}}{{/with}}'),
    context: {
      admin: { name: 'Tom Dale' },
      user: { name: 'Yehuda Katz' }
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Admin: Tom Dale User: Yehuda Katz', 'should be properly scoped');
});

QUnit.test('the scoped variable is not available outside the {{with}} block.', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}-{{#with other as |name|}}{{name}}{{/with}}-{{name}}'),
    context: {
      name: 'Stef',
      other: 'Yehuda'
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Stef-Yehuda-Stef', 'should be properly scoped after updating');
});

QUnit.test('nested {{with}} blocks shadow the outer scoped variable properly.', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with first as |ring|}}{{ring}}-{{#with fifth as |ring|}}{{ring}}-{{#with ninth as |ring|}}{{ring}}-{{/with}}{{ring}}-{{/with}}{{ring}}{{/with}}'),
    context: {
      first: 'Limbo',
      fifth: 'Wrath',
      ninth: 'Treachery'
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Limbo-Wrath-Treachery-Wrath-Limbo', 'should be properly scoped after updating');
});

QUnit.test('{{with}} block should not render if passed variable is falsey', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with foo as |bar|}}Don\'t render me{{/with}}'),
    context: {
      foo: null
    }
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), '', 'should not render the inner template');
});

QUnit.module('{{#with}} inverse template', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.falsyThing as |thing|}}Has Thing{{else}}No Thing{{/with}}'),
      falsyThing: null
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('inverse template is displayed', function () {
  equal(view.$().text(), 'No Thing', 'should render inverse template');
});

QUnit.test('changing the property to truthy causes standard template to be displayed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'falsyThing', true);
  });
  equal(view.$().text(), 'Has Thing', 'should render standard template');
});

QUnit.module('{{#with}} inverse template preserves context', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with falsyThing as |thing|}}Has Thing{{else}}No Thing {{otherThing}}{{/with}}'),
      context: {
        falsyThing: null,
        otherThing: 'bar'
      }
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('inverse template is displayed with context', function () {
  equal(view.$().text(), 'No Thing bar', 'should render inverse template with context preserved');
});