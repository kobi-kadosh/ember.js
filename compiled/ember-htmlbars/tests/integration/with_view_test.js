'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalProperty_set = require('ember-metal/property_set');

var view, registry, container;
var trim = _emberViewsSystemJquery2['default'].trim;

QUnit.module('ember-htmlbars: {{#with}} and {{#view}} integration', {
  setup: function setup() {
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;
  }
});

QUnit.test('View should update when the property used with the #with helper changes [DEPRECATED]', function () {
  registry.register('template:foo', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1 id="first">{{#with view.content}}{{wham}}{{/with}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'foo',

    content: _emberRuntimeSystemObject2['default'].create({
      wham: 'bam',
      thankYou: 'ma\'am'
    })
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  equal(view.$('#first').text(), 'bam', 'precond - view renders Handlebars template');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', _emberRuntimeSystemObject2['default'].create({
      wham: 'bazam'
    }));
  });

  equal(view.$('#first').text(), 'bazam', 'view updates when a bound property changes');
});

QUnit.test('should expose a view keyword [DEPRECATED]', function () {
  var templateString = '{{#with view.differentContent}}{{view.foo}}{{#view baz="bang"}}{{view.baz}}{{/view}}{{/with}}';
  view = _emberViewsViewsView2['default'].create({
    container: container,
    differentContent: {
      view: {
        foo: 'WRONG',
        baz: 'WRONG'
      }
    },

    foo: 'bar',

    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  equal(view.$().text(), 'barbang', 'renders values from view and child view');
});

QUnit.test('bindings can be `this`, in which case they *are* the current context [DEPRECATED]', function () {
  view = _emberViewsViewsView2['default'].create({
    museumOpen: true,

    museumDetails: _emberRuntimeSystemObject2['default'].create({
      name: 'SFMoMA',
      price: 20,
      museumView: _emberViewsViewsView2['default'].extend({
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('Name: {{view.museum.name}} Price: ${{view.museum.price}}')
      })
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.museumOpen}} {{#with view.museumDetails}}{{view museumView museum=this}} {{/with}}{{/if}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  equal(trim(view.$().text()), 'Name: SFMoMA Price: $20', 'should print baz twice');
});

QUnit.test('child views can be inserted inside a bind block', function () {
  registry.register('template:nester', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1 id="hello-world">Hello {{world}}</h1>{{view view.bqView}}'));
  registry.register('template:nested', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="child-view">Goodbye {{#with content as |thing|}}{{thing.blah}} {{view view.otherView}}{{/with}} {{world}}</div>'));
  registry.register('template:other', (0, _emberTemplateCompilerSystemCompile2['default'])('cruel'));

  var context = {
    world: 'world!'
  };

  var OtherView = _emberViewsViewsView2['default'].extend({
    container: container,
    templateName: 'other'
  });

  var BQView = _emberViewsViewsView2['default'].extend({
    container: container,
    otherView: OtherView,
    tagName: 'blockquote',
    templateName: 'nested'
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    bqView: BQView,
    context: context,
    templateName: 'nester'
  });

  (0, _emberMetalProperty_set.set)(context, 'content', _emberRuntimeSystemObject2['default'].create({
    blah: 'wot'
  }));

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('#hello-world:contains("Hello world!")').length, 'The parent view renders its contents');

  ok(view.$('blockquote').text().match(/Goodbye.*wot.*cruel.*world\!/), 'The child view renders its content once');
  ok(view.$().text().match(/Hello world!.*Goodbye.*wot.*cruel.*world\!/), 'parent view should appear before the child view');
});

QUnit.test('views render their template in the context of the parent view\'s context', function () {
  registry.register('template:parent', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#with content as |person|}}{{#view}}{{person.firstName}} {{person.lastName}}{{/view}}{{/with}}</h1>'));

  var context = {
    content: {
      firstName: 'Lana',
      lastName: 'del Heeeyyyyyy'
    }
  };

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'parent',
    context: context
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$('h1').text(), 'Lana del Heeeyyyyyy', 'renders properties from parent context');
});

QUnit.test('views make a view keyword available that allows template to reference view context', function () {
  registry.register('template:parent', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#with view.content as |person|}}{{#view person.subview}}{{view.firstName}} {{person.lastName}}{{/view}}{{/with}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'parent',

    content: {
      subview: _emberViewsViewsView2['default'].extend({
        firstName: 'Brodele'
      }),
      firstName: 'Lana',
      lastName: 'del Heeeyyyyyy'
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$('h1').text(), 'Brodele del Heeeyyyyyy', 'renders properties from parent context');
});