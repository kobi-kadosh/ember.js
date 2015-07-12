'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsTestsTestHelpersGetElementStyle = require('ember-views/tests/test-helpers/get-element-style');

var _emberViewsTestsTestHelpersGetElementStyle2 = _interopRequireDefault(_emberViewsTestsTestHelpersGetElementStyle);

var trim = _emberViewsSystemJquery2['default'].trim;
var container, registry, view, otherContainer;

QUnit.module('ember-views/views/container_view_test', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (container) {
        container.destroy();
      }
      if (view) {
        view.destroy();
      }
      if (otherContainer) {
        otherContainer.destroy();
      }
    });
  }
});

QUnit.test('should be able to insert views after the DOM representation is created', function () {
  container = _emberViewsViewsContainer_view2['default'].create({
    classNameBindings: ['name'],
    name: 'foo',
    container: registry.container()
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is my moment')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(view);
  });

  equal(view.container, container.container, 'view gains its containerViews container');
  equal(view.parentView, container, 'view\'s parentView is the container');
  equal(trim(container.$().text()), 'This is my moment');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.destroy();
  });
});

QUnit.test('should be able to observe properties that contain child views', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  (0, _emberMetalRun_loop2['default'])(function () {
    var Container = _emberViewsViewsContainer_view2['default'].extend({
      childViews: ['displayView'],
      displayIsDisplayed: _emberMetalComputed.computed.alias('displayView.isDisplayed'),

      displayView: _emberViewsViewsView2['default'].extend({
        isDisplayed: true
      })
    });

    container = Container.create();
    container.appendTo('#qunit-fixture');
  });
  equal(container.get('displayIsDisplayed'), true, 'can bind to child view');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.set('displayView.isDisplayed', false);
  });

  equal(container.get('displayIsDisplayed'), false, 'can bind to child view');
});

QUnit.test('childViews inherit their parents iocContainer, and retain the original container even when moved', function () {
  var iocContainer = registry.container();

  container = _emberViewsViewsContainer_view2['default'].create({
    container: iocContainer
  });

  otherContainer = _emberViewsViewsContainer_view2['default'].create({
    container: iocContainer
  });

  view = _emberViewsViewsView2['default'].create();

  container.pushObject(view);

  strictEqual(view.get('parentView'), container, 'sets the parent view after the childView is appended');
  strictEqual((0, _emberMetalProperty_get.get)(view, 'container'), container.container, 'inherits its parentViews iocContainer');

  container.removeObject(view);

  strictEqual((0, _emberMetalProperty_get.get)(view, 'container'), container.container, 'leaves existing iocContainer alone');

  otherContainer.pushObject(view);

  strictEqual(view.get('parentView'), otherContainer, 'sets the new parent view after the childView is appended');
  strictEqual((0, _emberMetalProperty_get.get)(view, 'container'), container.container, 'still inherits its original parentViews iocContainer');
});

QUnit.test('should set the parentView property on views that are added to the child views array', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  var ViewKlass = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is my moment')
  });

  view = ViewKlass.create();

  container.pushObject(view);
  equal(view.get('parentView'), container, 'sets the parent view after the childView is appended');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.removeObject(view);
  });
  equal((0, _emberMetalProperty_get.get)(view, 'parentView'), null, 'sets parentView to null when a view is removed');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(view);
  });

  equal((0, _emberMetalProperty_get.get)(view, 'parentView'), container, 'sets the parent view after the childView is appended');

  var secondView = ViewKlass.create();
  var thirdView = ViewKlass.create();
  var fourthView = ViewKlass.create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(secondView);
    container.replace(1, 0, [thirdView, fourthView]);
  });

  equal((0, _emberMetalProperty_get.get)(secondView, 'parentView'), container, 'sets the parent view of the second view');
  equal((0, _emberMetalProperty_get.get)(thirdView, 'parentView'), container, 'sets the parent view of the third view');
  equal((0, _emberMetalProperty_get.get)(fourthView, 'parentView'), container, 'sets the parent view of the fourth view');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.replace(2, 2);
  });

  equal((0, _emberMetalProperty_get.get)(view, 'parentView'), container, 'doesn\'t change non-removed view');
  equal((0, _emberMetalProperty_get.get)(thirdView, 'parentView'), container, 'doesn\'t change non-removed view');
  equal((0, _emberMetalProperty_get.get)(secondView, 'parentView'), null, 'clears the parent view of the third view');
  equal((0, _emberMetalProperty_get.get)(fourthView, 'parentView'), null, 'clears the parent view of the fourth view');

  (0, _emberMetalRun_loop2['default'])(function () {
    secondView.destroy();
    thirdView.destroy();
    fourthView.destroy();
  });
});

QUnit.test('should trigger parentViewDidChange when parentView is changed', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  var secondContainer = _emberViewsViewsContainer_view2['default'].create();
  var parentViewChanged = 0;

  var ViewKlass = _emberViewsViewsView2['default'].extend({
    parentViewDidChange: function parentViewDidChange() {
      parentViewChanged++;
    }
  });

  view = ViewKlass.create();

  container.pushObject(view);
  container.removeChild(view);
  secondContainer.pushObject(view);

  equal(parentViewChanged, 3);

  (0, _emberMetalRun_loop2['default'])(function () {
    secondContainer.destroy();
  });
});

QUnit.test('should be able to push initial views onto the ContainerView and have it behave', function () {
  var Container = _emberViewsViewsContainer_view2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      this.pushObject(_emberViewsViewsView2['default'].create({
        name: 'A',
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('A')
      }));
      this.pushObject(_emberViewsViewsView2['default'].create({
        name: 'B',
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('B')
      }));
    },
    // functions here avoid attaching an observer, which is
    // not supported.
    lengthSquared: function lengthSquared() {
      return this.get('length') * this.get('length');
    },
    mapViewNames: function mapViewNames() {
      return this.map(function (_view) {
        return _view.get('name');
      });
    }
  });

  container = Container.create();

  equal(container.lengthSquared(), 4);

  deepEqual(container.mapViewNames(), ['A', 'B']);

  (0, _emberMetalRun_loop2['default'])(container, 'appendTo', '#qunit-fixture');

  equal(container.$().text(), 'AB');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(_emberViewsViewsView2['default'].create({
      name: 'C',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('C')
    }));
  });

  equal(container.lengthSquared(), 9);

  deepEqual(container.mapViewNames(), ['A', 'B', 'C']);

  equal(container.$().text(), 'ABC');

  (0, _emberMetalRun_loop2['default'])(container, 'destroy');
});

QUnit.test('views that are removed from a ContainerView should have their child views cleared', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  var ChildView = _emberViewsViewsView2['default'].extend({
    MyView: _emberViewsViewsView2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view MyView}}')
  });
  var view = ChildView.create();

  container.pushObject(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal((0, _emberMetalProperty_get.get)(view, 'childViews.length'), 1, 'precond - renders one child view');
  (0, _emberMetalRun_loop2['default'])(function () {
    container.removeObject(view);
  });
  strictEqual(container.$('div').length, 0, 'the child view is removed from the DOM');
});

QUnit.test('if a ContainerView starts with an empty currentView, nothing is displayed', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().text(), '', 'has a empty contents');
  equal((0, _emberMetalProperty_get.get)(container, 'childViews.length'), 0, 'should not have any child views');
});

QUnit.test('if a ContainerView starts with a currentView, it is rendered as a child view', function () {
  var controller = _emberRuntimeControllersController2['default'].create();
  container = _emberViewsViewsContainer_view2['default'].create({
    controller: controller
  });

  var mainView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the main view.')
  });

  (0, _emberMetalProperty_set.set)(container, 'currentView', mainView);

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(trim(container.$().text()), 'This is the main view.', 'should render its child');
  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), mainView, 'should have the currentView as the only child view');
  equal(mainView.get('parentView'), container, 'parentView is setup');
});

QUnit.test('if a ContainerView is created with a currentView, it is rendered as a child view', function () {
  var mainView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the main view.')
  });

  var controller = _emberRuntimeControllersController2['default'].create();

  container = _emberViewsViewsContainer_view2['default'].create({
    currentView: mainView,
    controller: controller
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().text(), 'This is the main view.', 'should render its child');
  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), mainView, 'should have the currentView as the only child view');
  equal(mainView.get('parentView'), container, 'parentView is setup');
});

QUnit.test('if a ContainerView starts with no currentView and then one is set, the ContainerView is updated', function () {
  var mainView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the {{name}} view.')
  });

  var controller = _emberRuntimeControllersController2['default'].create({
    name: 'main'
  });

  container = _emberViewsViewsContainer_view2['default'].create({
    controller: controller
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().text(), '', 'has a empty contents');
  equal((0, _emberMetalProperty_get.get)(container, 'childViews.length'), 0, 'should not have any child views');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(container, 'currentView', mainView);
  });

  equal(container.$().text(), 'This is the main view.', 'should render its child');
  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), mainView, 'should have the currentView as the only child view');
  equal(mainView.get('parentView'), container, 'parentView is setup');
});

QUnit.test('if a ContainerView starts with a currentView and then is set to null, the ContainerView is updated', function () {
  var mainView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the main view.')
  });

  var controller = _emberRuntimeControllersController2['default'].create();

  container = _emberViewsViewsContainer_view2['default'].create({
    controller: controller
  });

  container.set('currentView', mainView);

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().text(), 'This is the main view.', 'should render its child');
  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), mainView, 'should have the currentView as the only child view');
  equal(mainView.get('parentView'), container, 'parentView is setup');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(container, 'currentView', null);
  });

  equal(container.$().text(), '', 'has a empty contents');
  equal((0, _emberMetalProperty_get.get)(container, 'childViews.length'), 0, 'should not have any child views');
});

QUnit.test('if a ContainerView starts with a currentView and then is set to null, the ContainerView is updated and the previous currentView is destroyed', function () {
  var mainView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the main view.')
  });

  var controller = _emberRuntimeControllersController2['default'].create();

  container = _emberViewsViewsContainer_view2['default'].create({
    controller: controller
  });

  container.set('currentView', mainView);

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().text(), 'This is the main view.', 'should render its child');
  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), mainView, 'should have the currentView as the only child view');
  equal(mainView.get('parentView'), container, 'parentView is setup');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(container, 'currentView', null);
  });

  equal(mainView.isDestroyed, true, 'should destroy the previous currentView.');

  equal(container.$().text(), '', 'has a empty contents');
  equal((0, _emberMetalProperty_get.get)(container, 'childViews.length'), 0, 'should not have any child views');
});

QUnit.test('if a ContainerView starts with a currentView and then a different currentView is set, the old view is destroyed and the new one is added', function () {
  container = _emberViewsViewsContainer_view2['default'].create();
  var mainView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the main view.')
  });

  var secondaryView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the secondary view.')
  });

  var tertiaryView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is the tertiary view.')
  });

  container.set('currentView', mainView);

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().text(), 'This is the main view.', 'should render its child');
  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), mainView, 'should have the currentView as the only child view');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(container, 'currentView', secondaryView);
  });

  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), secondaryView, 'should have the currentView as the only child view');
  equal(mainView.isDestroyed, true, 'should destroy the previous currentView: mainView.');

  equal(trim(container.$().text()), 'This is the secondary view.', 'should render its child');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(container, 'currentView', tertiaryView);
  });

  equal((0, _emberMetalProperty_get.get)(container, 'length'), 1, 'should have one child view');
  equal(container.objectAt(0), tertiaryView, 'should have the currentView as the only child view');
  equal(secondaryView.isDestroyed, true, 'should destroy the previous currentView: secondaryView.');

  equal(trim(container.$().text()), 'This is the tertiary view.', 'should render its child');
});

QUnit.test('should be able to modify childViews many times during an run loop', function () {

  container = _emberViewsViewsContainer_view2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  var one = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('one')
  });

  var two = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('two')
  });

  var three = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('three')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    // initial order
    container.pushObjects([three, one, two]);
    // sort
    container.removeObject(three);
    container.pushObject(three);
  });

  // Remove whitespace added by IE 8
  equal(trim(container.$().text()), 'onetwothree');
});

QUnit.test('should be able to modify childViews then rerender the ContainerView in same run loop', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  var child = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('child')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(child);
    container.rerender();
  });

  equal(trim(container.$().text()), 'child');
});

QUnit.test('should be able to modify childViews then rerender then modify again the ContainerView in same run loop', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  var Child = _emberViewsViewsView2['default'].extend({
    count: 0,
    _willRender: function _willRender() {
      this.count++;
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.label}}')
  });

  var one = Child.create({ label: 'one' });
  var two = Child.create({ label: 'two' });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(one);
    container.pushObject(two);
  });

  equal(one.count, 1, 'rendered one.count child only once');
  equal(two.count, 1, 'rendered two.count child only once');
  // Remove whitespace added by IE 8
  equal(trim(container.$().text()), 'onetwo');
});

QUnit.test('should be able to modify childViews then rerender again the ContainerView in same run loop and then modify again', function () {
  container = _emberViewsViewsContainer_view2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  var Child = _emberViewsViewsView2['default'].extend({
    count: 0,
    _willRender: function _willRender() {
      this.count++;
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.label}}')
  });

  var one = Child.create({ label: 'one' });
  var two = Child.create({ label: 'two' });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(one);
    container.rerender();
  });

  equal(one.count, 1, 'rendered one child only once');
  equal(container.$().text(), 'one');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(two);
  });

  equal(one.count, 1, 'rendered one child only once');
  equal(two.count, 1, 'rendered two child only once');

  // IE 8 adds a line break but this shouldn't affect validity
  equal(trim(container.$().text()), 'onetwo');
});

QUnit.test('should invalidate `element` on itself and childViews when being rendered by ensureChildrenAreInDOM', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  var root = _emberViewsViewsContainer_view2['default'].create();

  view = _emberViewsViewsView2['default'].create({ template: (0, _emberTemplateCompilerSystemCompile2['default'])('child view') });
  container = _emberViewsViewsContainer_view2['default'].create({ childViews: ['child'], child: view });

  (0, _emberMetalRun_loop2['default'])(function () {
    root.appendTo('#qunit-fixture');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    root.pushObject(container);

    // Get the parent and child's elements to cause them to be cached as null
    container.get('element');
    view.get('element');
  });

  ok(!!container.get('element'), 'Parent\'s element should have been recomputed after being rendered');
  ok(!!view.get('element'), 'Child\'s element should have been recomputed after being rendered');

  (0, _emberMetalRun_loop2['default'])(function () {
    root.destroy();
  });
});

QUnit.test('Child view can only be added to one container at a time', function () {
  expect(2);

  container = _emberViewsViewsContainer_view2['default'].create();
  var secondContainer = _emberViewsViewsContainer_view2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  var view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.set('currentView', view);
  });

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      secondContainer.set('currentView', view);
    });
  });

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      secondContainer.pushObject(view);
    });
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    secondContainer.destroy();
  });
});

QUnit.test('if a containerView appends a child in its didInsertElement event, the didInsertElement event of the child view should be fired once', function (assert) {

  var counter = 0;
  var root = _emberViewsViewsContainer_view2['default'].create({});

  container = _emberViewsViewsContainer_view2['default'].create({

    didInsertElement: function didInsertElement() {

      var view = _emberViewsViewsContainer_view2['default'].create({
        didInsertElement: function didInsertElement() {
          counter++;
        }
      });

      this.pushObject(view);
    }

  });

  (0, _emberMetalRun_loop2['default'])(function () {
    root.appendTo('#qunit-fixture');
  });

  expectDeprecation(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      root.pushObject(container);
    });
  }, /was modified inside the didInsertElement hook/);

  assert.strictEqual(counter, 1, 'child didInsertElement was invoked');

  (0, _emberMetalRun_loop2['default'])(function () {
    root.destroy();
  });
});

QUnit.test('ContainerView is observable [DEPRECATED]', function () {
  container = _emberViewsViewsContainer_view2['default'].create();
  var observerFired = false;
  expectDeprecation(function () {
    container.addObserver('this.[]', function () {
      observerFired = true;
    });
  }, /ContainerViews should not be observed as arrays. This behavior will change in future implementations of ContainerView./);

  ok(!observerFired, 'Nothing changed, no observer fired');

  container.pushObject(_emberViewsViewsView2['default'].create());
  ok(observerFired, 'View pushed, observer fired');
});

QUnit.test('ContainerView supports bound attributes', function () {
  container = _emberViewsViewsContainer_view2['default'].create({
    attributeBindings: ['width'],
    width: '100px'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal(container.$().attr('width'), '100px', 'width is applied to the element');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.set('width', '200px');
  });

  equal(container.$().attr('width'), '200px', 'width is applied to the element');
});

QUnit.test('ContainerView supports bound style attribute', function () {
  container = _emberViewsViewsContainer_view2['default'].create({
    attributeBindings: ['style'],
    style: 'width: 100px;'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal((0, _emberViewsTestsTestHelpersGetElementStyle2['default'])(container.element), 'WIDTH: 100PX;', 'width is applied to the element');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.set('style', 'width: 200px;');
  });

  equal((0, _emberViewsTestsTestHelpersGetElementStyle2['default'])(container.element), 'WIDTH: 200PX;', 'width is applied to the element');
});

QUnit.test('ContainerView supports changing children with style attribute', function () {
  container = _emberViewsViewsContainer_view2['default'].create({
    attributeBindings: ['style'],
    style: 'width: 100px;'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  equal((0, _emberViewsTestsTestHelpersGetElementStyle2['default'])(container.element), 'WIDTH: 100PX;', 'width is applied to the element');

  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    container.pushObject(view);
  });
});

QUnit.test('should render child views with a different tagName', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  container = _emberViewsViewsContainer_view2['default'].create({
    childViews: ['child'],

    child: _emberViewsViewsView2['default'].create({
      tagName: 'aside'
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.createElement();
  });

  equal(container.$('aside').length, 1);
});

QUnit.test('should allow hX tags as tagName', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  container = _emberViewsViewsContainer_view2['default'].create({
    childViews: ['child'],

    child: _emberViewsViewsView2['default'].create({
      tagName: 'h3'
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.createElement();
  });

  ok(container.$('h3').length, 'does not render the h3 tag correctly');
});

QUnit.test('renders contained view with omitted start tag and parent view context', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  view = _emberViewsViewsContainer_view2['default'].extend({
    tagName: 'table',
    childViews: ['row'],
    row: _emberViewsViewsView2['default'].create({
      tagName: 'tr'
    })
  }).create();

  (0, _emberMetalRun_loop2['default'])(view, view.append);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  equal(view.element.childNodes[2].tagName, 'TR', 'inner view is tr');

  (0, _emberMetalRun_loop2['default'])(view, view.rerender);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  equal(view.element.childNodes[2].tagName, 'TR', 'inner view is tr');
});