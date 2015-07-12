'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

var view;

QUnit.module('Ember.View', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('should add ember-view to views', function () {
  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$().hasClass('ember-view'), 'the view has ember-view');
});

QUnit.test('should not add role attribute unless one is specified', function () {
  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$().attr('role') === undefined, 'does not have a role attribute');
});

QUnit.test('should allow tagName to be a computed property [DEPRECATED]', function () {
  view = _emberViewsViewsView2['default'].extend({
    tagName: (0, _emberMetalComputed.computed)(function () {
      return 'span';
    })
  }).create();

  expectDeprecation(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.createElement();
    });
  }, /using a computed property to define tagName will not be permitted/);

  equal(view.element.tagName, 'SPAN', 'the view has was created with the correct element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('tagName', 'div');
  });

  equal(view.element.tagName, 'SPAN', 'the tagName cannot be changed after initial render');
});

QUnit.test('should re-render if the context is changed', function () {
  view = _emberViewsViewsView2['default'].create({
    elementId: 'template-context-test',
    context: { foo: 'bar' },
    template: (0, _emberTemplateCompiler.compile)('{{foo}}')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #template-context-test').text(), 'bar', 'precond - renders the view with the initial value');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context', {
      foo: 'bang baz'
    });
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #template-context-test').text(), 'bang baz', 're-renders the view with the updated context');
});

QUnit.test('renders a contained view with omitted start tag and tagless parent view context', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'table',
    template: (0, _emberTemplateCompiler.compile)('{{view view.pivot}}'),
    pivot: _emberViewsViewsView2['default'].extend({
      tagName: '',
      template: (0, _emberTemplateCompiler.compile)('{{view view.row}}'),
      row: _emberViewsViewsView2['default'].extend({
        tagName: 'tr'
      })
    })
  });

  (0, _emberMetalRun_loop2['default'])(view, view.append);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  ok(view.$('tr').length, 'inner view is tr');

  (0, _emberMetalRun_loop2['default'])(view, view.rerender);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  ok(view.$('tr').length, 'inner view is tr');
});

QUnit.test('propagates dependent-key invalidated sets upstream', function () {
  view = _emberViewsViewsView2['default'].create({
    parentProp: 'parent-value',
    template: (0, _emberTemplateCompiler.compile)('{{view view.childView childProp=view.parentProp}}'),
    childView: _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('child template'),
      childProp: 'old-value'
    })
  });

  (0, _emberMetalRun_loop2['default'])(view, view.append);

  equal(view.get('parentProp'), 'parent-value', 'precond - parent value is there');
  var childView = view.get('childView');

  (0, _emberMetalRun_loop2['default'])(function () {
    childView.set('childProp', 'new-value');
  });

  equal(view.get('parentProp'), 'new-value', 'new value is propagated across template');
});

QUnit.test('propagates dependent-key invalidated bindings upstream', function () {
  view = _emberViewsViewsView2['default'].create({
    parentProp: 'parent-value',
    template: (0, _emberTemplateCompiler.compile)('{{view view.childView childProp=view.parentProp}}'),
    childView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompiler.compile)('child template'),
      childProp: _emberMetalCore2['default'].computed('dependencyProp', {
        get: function get(key) {
          return this.get('dependencyProp');
        },
        set: function set(key, value) {
          // Avoid getting stomped by the template attrs
          return this.get('dependencyProp');
        }
      }),
      dependencyProp: 'old-value'
    }).create()
  });

  (0, _emberMetalRun_loop2['default'])(view, view.append);

  equal(view.get('parentProp'), 'parent-value', 'precond - parent value is there');
  var childView = view.get('childView');
  (0, _emberMetalRun_loop2['default'])(function () {
    return childView.set('dependencyProp', 'new-value');
  });
  equal(childView.get('childProp'), 'new-value', 'pre-cond - new value is propagated to CP');
  equal(view.get('parentProp'), 'new-value', 'new value is propagated across template');
});