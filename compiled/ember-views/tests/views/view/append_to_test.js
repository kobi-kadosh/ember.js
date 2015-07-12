'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var View, view, otherView, willDestroyCalled, childView;

QUnit.module('EmberView - append() and appendTo()', {
  setup: function setup() {
    View = _emberViewsViewsView2['default'].extend({});
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(otherView);
  }
});

QUnit.test('can call `appendTo` for multiple views #11109', function () {
  var elem;
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div><div id="other-menu"></div>');

  view = View.create();
  otherView = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');
  ok(!(0, _emberMetalProperty_get.get)(otherView, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#menu');
    otherView.appendTo('#other-menu');
  });

  elem = (0, _emberViewsSystemJquery2['default'])('#menu').children();
  ok(elem.length > 0, 'creates and appends the first view\'s element');

  elem = (0, _emberViewsSystemJquery2['default'])('#other-menu').children();
  ok(elem.length > 0, 'creates and appends the second view\'s element');
});

QUnit.test('should be added to the specified element when calling appendTo()', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div>');

  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#menu');
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#menu').children();
  ok(viewElem.length > 0, 'creates and appends the view\'s element');
});

QUnit.test('should be added to the document body when calling append()', function () {
  view = View.create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('foo bar baz')
  });

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])(document.body).find(':contains("foo bar baz")');
  ok(viewElem.length > 0, 'creates and appends the view\'s element');
});

QUnit.test('raises an assert when a target does not exist in the DOM', function () {
  view = View.create();

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.appendTo('does-not-exist-in-dom');
    });
  });
});

QUnit.test('append calls willInsertElement and didInsertElement callbacks', function () {
  var willInsertElementCalled = false;
  var willInsertElementCalledInChild = false;
  var didInsertElementCalled = false;

  var ViewWithCallback = View.extend({
    willInsertElement: function willInsertElement() {
      willInsertElementCalled = true;
    },
    didInsertElement: function didInsertElement() {
      didInsertElementCalled = true;
    },
    childView: _emberViewsViewsView2['default'].create({
      willInsertElement: function willInsertElement() {
        willInsertElementCalledInChild = true;
      }
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.childView}}')
  });

  view = ViewWithCallback.create();

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(willInsertElementCalled, 'willInsertElement called');
  ok(willInsertElementCalledInChild, 'willInsertElement called in child');
  ok(didInsertElementCalled, 'didInsertElement called');
});

QUnit.test('a view calls its children\'s willInsertElement and didInsertElement', function () {
  var parentView;
  var willInsertElementCalled = false;
  var didInsertElementCalled = false;
  var didInsertElementSawElement = false;

  parentView = _emberViewsViewsView2['default'].create({
    ViewWithCallback: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="do-i-exist"></div>'),

      willInsertElement: function willInsertElement() {
        willInsertElementCalled = true;
      },
      didInsertElement: function didInsertElement() {
        didInsertElementCalled = true;
        didInsertElementSawElement = this.$('div').length === 1;
      }
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.condition}}{{view view.ViewWithCallback}}{{/if}}'),
    condition: false
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.append();
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.set('condition', true);
  });

  ok(willInsertElementCalled, 'willInsertElement called');
  ok(didInsertElementCalled, 'didInsertElement called');
  ok(didInsertElementSawElement, 'didInsertElement saw element');

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.destroy();
  });
});

QUnit.test('replacing a view should invalidate childView elements', function () {
  var elementOnDidInsert;

  view = _emberViewsViewsView2['default'].create({
    show: false,

    CustomView: _emberViewsViewsView2['default'].extend({
      init: function init() {
        this._super.apply(this, arguments);
        // This will be called in preRender
        // We want it to cache a null value
        // Hopefully it will be invalidated when `show` is toggled
        this.get('element');
      },

      didInsertElement: function didInsertElement() {
        elementOnDidInsert = this.get('element');
      }
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.show}}{{view view.CustomView}}{{/if}}')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('show', true);
  });

  ok(elementOnDidInsert, 'should have an element on insert');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });
});

QUnit.test('trigger rerender of parent and SimpleBoundView', function () {
  var view = _emberViewsViewsView2['default'].create({
    show: true,
    foo: 'bar',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.show}}{{#if view.foo}}{{view.foo}}{{/if}}{{/if}}')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(view.$().text(), 'bar');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('foo', 'baz'); // schedule render of simple bound
    view.set('show', false); // destroy tree
  });

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });
});

QUnit.test('remove removes an element from the DOM', function () {
  willDestroyCalled = 0;

  view = View.create({
    willDestroyElement: function willDestroyElement() {
      willDestroyCalled++;
    }
  });

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId')).length === 1, 'precond - element was inserted');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId')).length === 0, 'remove removes an element from the DOM');
  ok(_emberViewsViewsView2['default'].views[(0, _emberMetalProperty_get.get)(view, 'elementId')] === undefined, 'remove does not remove the view from the view hash');
  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'remove nulls out the element');
  equal(willDestroyCalled, 1, 'the willDestroyElement hook was called once');
});

QUnit.test('destroy more forcibly removes the view', function () {
  willDestroyCalled = 0;

  view = View.create({
    willDestroyElement: function willDestroyElement() {
      willDestroyCalled++;
    }
  });

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId')).length === 1, 'precond - element was inserted');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(view, 'elementId')).length === 0, 'destroy removes an element from the DOM');
  ok(_emberViewsViewsView2['default'].views[(0, _emberMetalProperty_get.get)(view, 'elementId')] === undefined, 'destroy removes a view from the global views hash');
  equal((0, _emberMetalProperty_get.get)(view, 'isDestroyed'), true, 'the view is marked as destroyed');
  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'the view no longer has an element');
  equal(willDestroyCalled, 1, 'the willDestroyElement hook was called once');
});

QUnit.module('EmberView - append() and appendTo() in a view hierarchy', {
  setup: function setup() {
    expectDeprecation('Setting `childViews` on a Container is deprecated.');

    View = _emberViewsViewsContainer_view2['default'].extend({
      childViews: ['child'],
      child: _emberViewsViewsView2['default'].extend({
        elementId: 'child'
      })
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (!view.isDestroyed) {
        view.destroy();
      }
    });
  }
});

QUnit.test('should be added to the specified element when calling appendTo()', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div>');

  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#menu');
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#menu #child');
  ok(viewElem.length > 0, 'creates and appends the view\'s element');
});

QUnit.test('should be added to the document body when calling append()', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<div id="menu"></div>');

  view = View.create();

  ok(!(0, _emberMetalProperty_get.get)(view, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  var viewElem = (0, _emberViewsSystemJquery2['default'])('#child');
  ok(viewElem.length > 0, 'creates and appends the view\'s element');
});

QUnit.module('EmberView - removing views in a view hierarchy', {
  setup: function setup() {
    expectDeprecation('Setting `childViews` on a Container is deprecated.');

    willDestroyCalled = 0;

    view = _emberViewsViewsContainer_view2['default'].create({
      childViews: ['child'],
      child: _emberViewsViewsView2['default'].create({
        willDestroyElement: function willDestroyElement() {
          willDestroyCalled++;
        }
      })
    });

    childView = (0, _emberMetalProperty_get.get)(view, 'child');
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (!view.isDestroyed) {
        view.destroy();
      }
    });
  }
});

QUnit.test('remove removes child elements from the DOM', function () {
  ok(!(0, _emberMetalProperty_get.get)(childView, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(childView, 'elementId')).length === 1, 'precond - element was inserted');

  // remove parent view
  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(childView, 'elementId')).length === 0, 'remove removes child elements the DOM');
  ok(_emberViewsViewsView2['default'].views[(0, _emberMetalProperty_get.get)(childView, 'elementId')] === undefined, 'remove does not remove child views from the view hash');
  ok(!(0, _emberMetalProperty_get.get)(childView, 'element'), 'remove nulls out child elements');
  equal(willDestroyCalled, 1, 'the willDestroyElement hook was called once');
});

QUnit.test('destroy more forcibly removes child views', function () {
  ok(!(0, _emberMetalProperty_get.get)(childView, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(childView, 'elementId')).length === 1, 'precond - child element was inserted');

  willDestroyCalled = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(childView, 'elementId')).length === 0, 'destroy removes child elements from the DOM');
  ok(_emberViewsViewsView2['default'].views[(0, _emberMetalProperty_get.get)(childView, 'elementId')] === undefined, 'destroy removes a child views from the global views hash');
  equal((0, _emberMetalProperty_get.get)(childView, 'isDestroyed'), true, 'child views are marked as destroyed');
  ok(!(0, _emberMetalProperty_get.get)(childView, 'element'), 'child views no longer have an element');
  equal(willDestroyCalled, 1, 'the willDestroyElement hook was called once on children');
});

QUnit.test('destroy removes a child view from its parent', function () {
  ok(!(0, _emberMetalProperty_get.get)(childView, 'element'), 'precond - should not have an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#' + (0, _emberMetalProperty_get.get)(childView, 'elementId')).length === 1, 'precond - child element was inserted');

  (0, _emberMetalRun_loop2['default'])(function () {
    childView.destroy();
  });

  ok((0, _emberMetalProperty_get.get)(view, 'childViews.length') === 0, 'Destroyed child views should be removed from their parent');
});