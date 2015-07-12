'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalBinding = require('ember-metal/binding');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalComputed = require('ember-metal/computed');

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberMetalProperty_set = require('ember-metal/property_set');

var view, MyApp, originalLookup, lookup;

var trim = _emberViewsSystemJquery2['default'].trim;

QUnit.module('ember-htmlbars: binding integration', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    MyApp = lookup.MyApp = _emberRuntimeSystemObject2['default'].create({});
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].lookup = originalLookup;

    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    view = null;

    MyApp = null;
  }
});

QUnit.test('should call a registered helper for mustache without parameters', function () {
  (0, _emberHtmlbarsHelpers.registerHelper)('foobar', function () {
    return 'foobar';
  });

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{foobar}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$().text() === 'foobar', 'Regular helper was invoked correctly');
});

QUnit.test('should bind to the property if no registered helper found for a mustache without parameters', function () {
  view = _emberViewsViewsView2['default'].extend({
    foobarProperty: (0, _emberMetalComputed.computed)(function () {
      return 'foobarProperty';
    })
  }).create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.foobarProperty}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$().text() === 'foobarProperty', 'Property was bound to correctly');
});

QUnit.test('should be able to update when bound property updates', function () {
  MyApp.set('controller', _emberRuntimeSystemObject2['default'].create({ name: 'first' }));

  var View = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<i>{{view.value.name}}, {{view.computed}}</i>'),
    valueBinding: 'MyApp.controller',
    computed: (0, _emberMetalComputed.computed)(function () {
      return this.get('value.name') + ' - computed';
    }).property('value')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view = View.create();
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    MyApp.set('controller', _emberRuntimeSystemObject2['default'].create({
      name: 'second'
    }));
  });

  equal(view.get('computed'), 'second - computed', 'view computed properties correctly update');
  equal(view.$('i').text(), 'second, second - computed', 'view rerenders when bound properties change');
});

QUnit.test('should allow rendering of undefined props', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '', 'rendered undefined binding');
});

QUnit.test('should cleanup bound properties on rerender', function () {
  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ name: 'wycats' }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'wycats', 'rendered binding');

  (0, _emberMetalRun_loop2['default'])(view, 'rerender');

  equal(view.$().text(), 'wycats', 'rendered binding');
});

QUnit.test('should update bound values after view\'s parent is removed and then re-appended', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  var controller = _emberRuntimeSystemObject2['default'].create();

  var parentView = _emberViewsViewsContainer_view2['default'].create({
    childViews: ['testView'],

    controller: controller,

    testView: _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if showStuff}}{{boundValue}}{{else}}Not true.{{/if}}')
    })
  });

  controller.setProperties({
    showStuff: true,
    boundValue: 'foo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(parentView);
  view = parentView.get('testView');

  equal(trim(view.$().text()), 'foo');
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'showStuff', false);
  });
  equal(trim(view.$().text()), 'Not true.');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'showStuff', true);
  });
  equal(trim(view.$().text()), 'foo');

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.remove();
    (0, _emberMetalProperty_set.set)(controller, 'showStuff', false);
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'showStuff', true);
  });
  (0, _emberRuntimeTestsUtils.runAppend)(parentView);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'boundValue', 'bar');
  });
  equal(trim(view.$().text()), 'bar');

  (0, _emberRuntimeTestsUtils.runDestroy)(parentView);
});

QUnit.test('should accept bindings as a string or an Ember.Binding', function () {
  var ViewWithBindings;

  expectDeprecation(function () {
    ViewWithBindings = _emberViewsViewsView2['default'].extend({
      oneWayBindingTestBinding: _emberMetalBinding.Binding.oneWay('context.direction'),
      twoWayBindingTestBinding: _emberMetalBinding.Binding.from('context.direction'),
      stringBindingTestBinding: 'context.direction',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('one way: {{view.oneWayBindingTest}}, ' + 'two way: {{view.twoWayBindingTest}}, ' + 'string: {{view.stringBindingTest}}')
    });
  }, 'Ember.oneWay has been deprecated. Please use Ember.computed.oneWay instead.');

  view = _emberViewsViewsView2['default'].create({
    viewWithBindingsClass: ViewWithBindings,
    context: _emberRuntimeSystemObject2['default'].create({
      direction: 'down'
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.viewWithBindingsClass}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'one way: down, two way: down, string: down');
});