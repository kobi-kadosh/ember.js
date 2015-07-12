'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// TEMPLATES

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsSystemAction_manager = require('ember-views/system/action_manager');

var _emberViewsSystemAction_manager2 = _interopRequireDefault(_emberViewsSystemAction_manager);

var _emberRoutingHtmlbarsTestsUtils = require('ember-routing-htmlbars/tests/utils');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

function runSet(object, key, value) {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(object, key, value);
  });
}

var view, container;

QUnit.module('ember-routing-htmlbars: {{render}} helper', {
  setup: function setup() {
    var namespace = _emberRuntimeSystemNamespace2['default'].create();
    var registry = (0, _emberRoutingHtmlbarsTestsUtils.buildRegistry)(namespace);
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    _emberMetalCore2['default'].TEMPLATES = {};
  }
});

QUnit.test('{{render}} helper should render given template', function () {
  var template = '<h1>HI</h1>{{render \'home\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BYE</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'HIBYE');
  // This is a poor assertion. What is really being tested is that
  // a second render with the same name will throw an assert.
  ok(container.lookup('router:main')._lookupActiveComponentNode('home'), 'should register home as active view');
});

QUnit.test('{{render}} helper should render nested helpers', function () {
  var template = '<h1>HI</h1>{{render \'foo\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['foo'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>FOO</p>{{render \'bar\'}}');
  _emberMetalCore2['default'].TEMPLATES['bar'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BAR</p>{{render \'baz\'}}');
  _emberMetalCore2['default'].TEMPLATES['baz'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BAZ</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'HIFOOBARBAZ');
});

QUnit.test('{{render}} helper should have assertion if neither template nor view exists', function () {
  var template = '<h1>HI</h1>{{render \'oops\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'You used `{{render \'oops\'}}`, but \'oops\' can not be found as either a template or a view.');
});

QUnit.test('{{render}} helper should not have assertion if template is supplied in block-form', function () {
  var template = '<h1>HI</h1>{{#render \'good\'}} {{name}}{{/render}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  container._registry.register('controller:good', _emberRuntimeControllersController2['default'].extend({ name: 'Rob' }));
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'HI Rob');
});

QUnit.test('{{render}} helper should not have assertion if view exists without a template', function () {
  var template = '<h1>HI</h1>{{render \'oops\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  container._registry.register('view:oops', _emberViewsViewsView2['default'].extend());

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'HI');
});

QUnit.test('{{render}} helper should render given template with a supplied model', function () {
  var template = '<h1>HI</h1>{{render \'post\' post}}';
  var post = {
    title: 'Rails is omakase'
  };

  var Controller = _emberRuntimeControllersController2['default'].extend({
    container: container,
    post: post
  });

  var controller = Controller.create({});

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  var postController;
  var PostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      postController = this;
    }
  });
  container._registry.register('controller:post', PostController);

  _emberMetalCore2['default'].TEMPLATES['post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{model.title}}</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'HIRails is omakase');
  equal(postController.get('model'), post);

  runSet(controller, 'post', { title: 'Rails is unagi' });

  equal(view.$().text(), 'HIRails is unagi');
  deepEqual(postController.get('model'), { title: 'Rails is unagi' });
});

QUnit.test('{{render}} helper with a supplied model should not fire observers on the controller', function () {
  var template = '<h1>HI</h1>{{render \'post\' post}}';
  var post = {
    title: 'Rails is omakase'
  };

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: _emberRuntimeControllersController2['default'].create({
      container: container,
      post: post
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  var PostController = _emberRuntimeControllersController2['default'].extend({
    modelDidChange: (0, _emberMetalMixin.observer)('model', function () {
      modelDidChange++;
    })
  });

  container._registry.register('controller:post', PostController);

  _emberMetalCore2['default'].TEMPLATES['post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{title}}</p>');

  var modelDidChange = 0;
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(modelDidChange, 0, 'model observer did not fire');
});

QUnit.test('{{render}} helper should raise an error when a given controller name does not resolve to a controller', function () {
  var template = '<h1>HI</h1>{{render "home" controller="postss"}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  container._registry.register('controller:posts', _emberRuntimeControllersArray_controller2['default'].extend());
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BYE</p>');

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'The controller name you supplied \'postss\' did not resolve to a controller.');
});

QUnit.test('{{render}} helper should render with given controller', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var template = '{{render "home" controller="posts"}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  var id = 0;
  container._registry.register('controller:posts', _emberRuntimeControllersArray_controller2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      this.uniqueId = id++;
    }
  }));
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{uniqueId}}');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var uniqueId = container.lookup('controller:posts').get('uniqueId');
  equal(uniqueId, 0, 'precond - first uniqueId is used for singleton');
  equal(uniqueId, view.$().html(), 'rendered with singleton controller');
});

QUnit.test('{{render}} helper should render a template without a model only once', function () {
  var template = '<h1>HI</h1>{{render \'home\'}}<hr/>{{render \'home\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BYE</p>');

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /\{\{render\}\} helper once/i);
});

QUnit.test('{{render}} helper should render templates with models multiple times', function () {
  var template = '<h1>HI</h1> {{render \'post\' post1}} {{render \'post\' post2}}';
  var post1 = {
    title: 'Me first'
  };
  var post2 = {
    title: 'Then me'
  };

  var Controller = _emberRuntimeControllersController2['default'].extend({
    container: container,
    post1: post1,
    post2: post2
  });

  var controller = Controller.create();

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  var postController1, postController2;
  var PostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      if (!postController1) {
        postController1 = this;
      } else if (!postController2) {
        postController2 = this;
      }
    }
  });
  container._registry.register('controller:post', PostController, { singleton: false });

  _emberMetalCore2['default'].TEMPLATES['post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{model.title}}</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$().text().match(/^HI ?Me first ?Then me$/));
  equal(postController1.get('model'), post1);
  equal(postController2.get('model'), post2);

  runSet(controller, 'post1', { title: 'I am new' });

  ok(view.$().text().match(/^HI ?I am new ?Then me$/));
  deepEqual(postController1.get('model'), { title: 'I am new' });
});

QUnit.test('{{render}} helper should not leak controllers', function () {
  var template = '<h1>HI</h1> {{render \'post\' post1}}';
  var post1 = {
    title: 'Me first'
  };

  var Controller = _emberRuntimeControllersController2['default'].extend({
    container: container,
    post1: post1
  });

  var controller = Controller.create();

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  var postController;
  var PostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      postController = this;
    }
  });
  container._registry.register('controller:post', PostController);

  _emberMetalCore2['default'].TEMPLATES['post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{title}}</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  ok(postController.isDestroyed, 'expected postController to be destroyed');
});

QUnit.test('{{render}} helper should not treat invocations with falsy contexts as context-less', function () {
  var template = '<h1>HI</h1> {{render \'post\' zero}} {{render \'post\' nonexistent}}';

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: _emberRuntimeControllersController2['default'].create({
      container: container,
      zero: false
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  var postController1, postController2;
  var PostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      if (!postController1) {
        postController1 = this;
      } else if (!postController2) {
        postController2 = this;
      }
    }
  });
  container._registry.register('controller:post', PostController, { singleton: false });

  _emberMetalCore2['default'].TEMPLATES['post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>{{#unless model}}NOTHING{{/unless}}</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$().text().match(/^HI ?NOTHING ?NOTHING$/));
  equal(postController1.get('model'), 0);
  equal(postController2.get('model'), undefined);
});

QUnit.test('{{render}} helper should render templates both with and without models', function () {
  var template = '<h1>HI</h1> {{render \'post\'}} {{render \'post\' post}}';
  var post = {
    title: 'Rails is omakase'
  };

  var Controller = _emberRuntimeControllersController2['default'].extend({
    container: container,
    post: post
  });

  var controller = Controller.create();

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  var postController1, postController2;
  var PostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      if (!postController1) {
        postController1 = this;
      } else if (!postController2) {
        postController2 = this;
      }
    }
  });
  container._registry.register('controller:post', PostController, { singleton: false });

  _emberMetalCore2['default'].TEMPLATES['post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>Title:{{model.title}}</p>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$().text().match(/^HI ?Title: ?Title:Rails is omakase$/));
  equal(postController1.get('model'), null);
  equal(postController2.get('model'), post);

  runSet(controller, 'post', { title: 'Rails is unagi' });

  ok(view.$().text().match(/^HI ?Title: ?Title:Rails is unagi$/));
  deepEqual(postController2.get('model'), { title: 'Rails is unagi' });
});

QUnit.test('{{render}} helper should link child controllers to the parent controller', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var parentTriggered = 0;

  var template = '<h1>HI</h1>{{render "posts"}}';
  var controller = _emberRuntimeControllersController2['default'].extend({
    container: container,
    actions: {
      parentPlease: function parentPlease() {
        parentTriggered++;
      }
    },
    role: 'Mom'
  });

  container._registry.register('controller:posts', _emberRuntimeControllersArray_controller2['default'].extend());

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['posts'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<button id="parent-action" {{action "parentPlease"}}>Go to {{parentController.role}}</button>');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var button = (0, _emberViewsSystemJquery2['default'])('#parent-action');
  var actionId = button.data('ember-action');

  var _ActionManager$registeredActions$actionId = _slicedToArray(_emberViewsSystemAction_manager2['default'].registeredActions[actionId], 1);

  var action = _ActionManager$registeredActions$actionId[0];

  var handler = action.handler;

  equal(button.text(), 'Go to Mom', 'The parentController property is set on the child controller');

  (0, _emberMetalRun_loop2['default'])(null, handler, new _emberViewsSystemJquery2['default'].Event('click'));

  equal(parentTriggered, 1, 'The event bubbled to the parent');
});

QUnit.test('{{render}} helper should be able to render a template again when it was removed', function () {
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  var CoreOutlet = container.lookupFactory('view:core-outlet');
  view = CoreOutlet.create({
    container: container
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BYE</p>');

  var liveRoutes = {
    render: {
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>HI</h1>{{outlet}}')
    },
    outlets: {}
  };

  (0, _emberMetalRun_loop2['default'])(function () {
    liveRoutes.outlets.main = {
      render: {
        controller: controller.create(),
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div>1{{render \'home\'}}</div>')
      }
    };
    view.setOutletState(liveRoutes);
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'HI1BYE');

  (0, _emberMetalRun_loop2['default'])(function () {
    liveRoutes.outlets.main = {
      render: {
        controller: controller.create(),
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div>2{{render \'home\'}}</div>')
      }
    };
    view.setOutletState(liveRoutes);
  });

  equal(view.$().text(), 'HI2BYE');
});

QUnit.test('{{render}} works with dot notation', function () {
  var template = '{{render "blog.post"}}';

  var ContextController = _emberRuntimeControllersController2['default'].extend({ container: container });

  var controller;
  var id = 0;
  var BlogPostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      controller = this;
      this.uniqueId = id++;
    }
  });
  container._registry.register('controller:blog.post', BlogPostController);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: ContextController.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['blog.post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{uniqueId}}');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var singletonController = container.lookup('controller:blog.post');
  equal(singletonController.uniqueId, view.$().html(), 'rendered with correct singleton controller');
});

QUnit.test('{{render}} works with slash notation', function () {
  var template = '{{render "blog/post"}}';

  var ContextController = _emberRuntimeControllersController2['default'].extend({ container: container });

  var controller;
  var id = 0;
  var BlogPostController = _emberRuntimeControllersController2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      controller = this;
      this.uniqueId = id++;
    }
  });
  container._registry.register('controller:blog.post', BlogPostController);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: ContextController.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['blog.post'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{uniqueId}}');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var singletonController = container.lookup('controller:blog.post');
  equal(singletonController.uniqueId, view.$().html(), 'rendered with correct singleton controller');
});

QUnit.test('throws an assertion if {{render}} is called with an unquoted template name', function () {
  var template = '<h1>HI</h1>{{render home}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BYE</p>');

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'The first argument of {{render}} must be quoted, e.g. {{render "sidebar"}}.');
});

QUnit.test('throws an assertion if {{render}} is called with a literal for a model', function () {
  var template = '<h1>HI</h1>{{render "home" "model"}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  _emberMetalCore2['default'].TEMPLATES['home'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>BYE</p>');

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'The second argument of {{render}} must be a path, e.g. {{render "post" post}}.');
});

QUnit.test('{{render}} helper should let view provide its own template', function () {
  var template = '{{render \'fish\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  container._registry.register('template:fish', (0, _emberTemplateCompilerSystemCompile2['default'])('Hello fish!'));
  container._registry.register('template:other', (0, _emberTemplateCompilerSystemCompile2['default'])('Hello other!'));

  container._registry.register('view:fish', _emberViewsViewsView2['default'].extend({
    templateName: 'other'
  }));

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Hello other!');
});

QUnit.test('{{render}} helper should not require view to provide its own template', function () {
  var template = '{{render \'fish\'}}';
  var controller = _emberRuntimeControllersController2['default'].extend({ container: container });
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  container._registry.register('template:fish', (0, _emberTemplateCompilerSystemCompile2['default'])('Hello fish!'));

  container._registry.register('view:fish', _emberViewsViewsView2['default'].extend());

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Hello fish!');
});