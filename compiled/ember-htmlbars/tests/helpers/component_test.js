'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view, registry, container;

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-component-helper')) {
  QUnit.module('ember-htmlbars: {{#component}} helper', {
    setup: function setup() {
      registry = new _containerRegistry2['default']();
      container = registry.container();

      registry.optionsForType('template', { instantiate: false });
      registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
    },

    teardown: function teardown() {
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
      (0, _emberRuntimeTestsUtils.runDestroy)(container);
      registry = container = view = null;
    }
  });

  QUnit.test('component helper with unquoted string is bound', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie! {{attrs.location}} {{yield}}'));
    registry.register('template:components/baz-qux', (0, _emberTemplateCompilerSystemCompile2['default'])('yummy {{attrs.location}} {{yield}}'));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      dynamicComponent: 'foo-bar',
      location: 'Caracas',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component view.dynamicComponent location=view.location}}arepas!{{/component}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
    equal(view.$().text(), 'yippie! Caracas arepas!', 'component was looked up and rendered');

    _emberMetalCore2['default'].run(function () {
      (0, _emberMetalProperty_set.set)(view, 'dynamicComponent', 'baz-qux');
      (0, _emberMetalProperty_set.set)(view, 'location', 'Loisaida');
    });
    equal(view.$().text(), 'yummy Loisaida arepas!', 'component was updated and re-rendered');
  });

  QUnit.test('component helper destroys underlying component when it is swapped out', function () {
    var currentComponent;
    var destroyCalls = 0;
    registry.register('component:foo-bar', _emberViewsViewsComponent2['default'].extend({
      init: function init() {
        this._super.apply(this, arguments);
        currentComponent = 'foo-bar';
      },
      willDestroy: function willDestroy() {
        destroyCalls++;
      }
    }));
    registry.register('component:baz-qux', _emberViewsViewsComponent2['default'].extend({
      init: function init() {
        this._super.apply(this, arguments);
        currentComponent = 'baz-qux';
      },
      willDestroy: function willDestroy() {
        destroyCalls++;
      }
    }));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      dynamicComponent: 'foo-bar',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{component view.dynamicComponent}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(currentComponent, 'foo-bar', 'precond - instantiates the proper component');
    equal(destroyCalls, 0, 'precond - nothing destroyed yet');

    _emberMetalCore2['default'].run(function () {
      (0, _emberMetalProperty_set.set)(view, 'dynamicComponent', 'baz-qux');
    });

    equal(currentComponent, 'baz-qux', 'changing bound value instantiates the proper component');
    equal(destroyCalls, 1, 'prior component should be destroyed');

    _emberMetalCore2['default'].run(function () {
      (0, _emberMetalProperty_set.set)(view, 'dynamicComponent', 'foo-bar');
    });

    equal(currentComponent, 'foo-bar', 'changing bound value instantiates the proper component');
    equal(destroyCalls, 2, 'prior components destroyed');
  });

  QUnit.test('component helper with actions', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie! {{yield}}'));
    registry.register('component:foo-bar', _emberMetalCore2['default'].Component.extend({
      classNames: 'foo-bar',
      didInsertElement: function didInsertElement() {
        // trigger action on click in absence of app's EventDispatcher
        var self = this;
        this.$().on('click', function () {
          self.sendAction('fooBarred');
        });
      },
      willDestroyElement: function willDestroyElement() {
        this.$().off('click');
      }
    }));

    var actionTriggered = 0;
    var controller = _emberMetalCore2['default'].Controller.extend({
      dynamicComponent: 'foo-bar',
      actions: {
        mappedAction: function mappedAction() {
          actionTriggered++;
        }
      }
    }).create();
    view = _emberViewsViewsView2['default'].create({
      container: container,
      controller: controller,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component dynamicComponent fooBarred="mappedAction"}}arepas!{{/component}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
    _emberMetalCore2['default'].run(function () {
      view.$('.foo-bar').trigger('click');
    });
    equal(actionTriggered, 1, 'action was triggered');
  });

  QUnit.test('component helper maintains expected logical parentView', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie! {{yield}}'));
    var componentInstance;
    registry.register('component:foo-bar', _emberMetalCore2['default'].Component.extend({
      didInsertElement: function didInsertElement() {
        componentInstance = this;
      }
    }));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      dynamicComponent: 'foo-bar',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component view.dynamicComponent}}arepas!{{/component}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
    equal((0, _emberMetalProperty_get.get)(componentInstance, 'parentView'), view, 'component\'s parentView is the view invoking the helper');
  });

  QUnit.test('nested component helpers', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie! {{attrs.location}} {{yield}}'));
    registry.register('template:components/baz-qux', (0, _emberTemplateCompilerSystemCompile2['default'])('yummy {{attrs.location}} {{yield}}'));
    registry.register('template:components/corge-grault', (0, _emberTemplateCompilerSystemCompile2['default'])('delicious {{attrs.location}} {{yield}}'));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      dynamicComponent1: 'foo-bar',
      dynamicComponent2: 'baz-qux',
      location: 'Caracas',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component view.dynamicComponent1 location=view.location}}{{#component view.dynamicComponent2 location=view.location}}arepas!{{/component}}{{/component}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
    equal(view.$().text(), 'yippie! Caracas yummy Caracas arepas!', 'components were looked up and rendered');

    _emberMetalCore2['default'].run(function () {
      (0, _emberMetalProperty_set.set)(view, 'dynamicComponent1', 'corge-grault');
      (0, _emberMetalProperty_set.set)(view, 'location', 'Loisaida');
    });
    equal(view.$().text(), 'delicious Loisaida yummy Loisaida arepas!', 'components were updated and re-rendered');
  });

  QUnit.test('component helper can be used with a quoted string (though you probably would not do this)', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie! {{attrs.location}} {{yield}}'));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      location: 'Caracas',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component "foo-bar" location=view.location}}arepas!{{/component}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'yippie! Caracas arepas!', 'component was looked up and rendered');
  });

  QUnit.test('component with unquoted param resolving to non-existent component', function () {
    view = _emberViewsViewsView2['default'].create({
      container: container,
      dynamicComponent: 'does-not-exist',
      location: 'Caracas',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component view.dynamicComponent location=view.location}}arepas!{{/component}}')
    });

    expectAssertion(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, /HTMLBars error: Could not find component named "does-not-exist"./, 'Expected missing component to generate an exception');
  });

  QUnit.test('component with unquoted param resolving to a component, then non-existent component', function () {
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('yippie! {{attrs.location}} {{yield}}'));
    view = _emberViewsViewsView2['default'].create({
      container: container,
      dynamicComponent: 'foo-bar',
      location: 'Caracas',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component view.dynamicComponent location=view.location}}arepas!{{/component}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'yippie! Caracas arepas!', 'component was looked up and rendered');

    _emberMetalCore2['default'].run(function () {
      (0, _emberMetalProperty_set.set)(view, 'dynamicComponent', undefined);
    });

    equal(view.$().text(), '', 'component correctly deals with falsey values set post-render');
  });

  QUnit.test('component with quoted param for non-existent component', function () {
    view = _emberViewsViewsView2['default'].create({
      container: container,
      location: 'Caracas',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#component "does-not-exist" location=view.location}}arepas!{{/component}}')
    });

    expectAssertion(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, /HTMLBars error: Could not find component named "does-not-exist"./);
  });

  QUnit.test('component helper properly invalidates hash params inside an {{each}} invocation #11044', function () {
    registry.register('component:foo-bar', _emberViewsViewsComponent2['default'].extend({
      willRender: function willRender() {
        // store internally available name to ensure that the name available in `this.attrs.name`
        // matches the template lookup name
        (0, _emberMetalProperty_set.set)(this, 'internalName', this.attrs.name);
      }
    }));
    registry.register('template:components/foo-bar', (0, _emberTemplateCompilerSystemCompile2['default'])('{{internalName}} - {{attrs.name}}|'));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      items: [{ name: 'Robert' }, { name: 'Jacquie' }],
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items as |item|}}{{component "foo-bar" name=item.name}}{{/each}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
    equal(view.$().text(), 'Robert - Robert|Jacquie - Jacquie|', 'component was rendered');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'items', [{ name: 'Max' }, { name: 'James' }]);
    });
    equal(view.$().text(), 'Max - Max|James - James|', 'component was updated and re-rendered');
  });

  QUnit.test('dashless components should not be found', function () {
    expect(1);

    registry.register('template:components/dashless', (0, _emberTemplateCompilerSystemCompile2['default'])('Do not render me!'));

    view = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{component "dashless"}}'),
      container: container
    }).create();

    expectAssertion(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, /You cannot use 'dashless' as a component name. Component names must contain a hyphen./);
  });
}