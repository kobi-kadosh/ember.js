'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberRoutingHtmlbarsTestsUtils = require('ember-routing-htmlbars/tests/utils');

var trim = _emberViewsSystemJquery2['default'].trim;

var registry, container, top;

QUnit.module('ember-routing-htmlbars: {{outlet}} helper', {
  setup: function setup() {
    var namespace = _emberRuntimeSystemNamespace2['default'].create();
    registry = (0, _emberRoutingHtmlbarsTestsUtils.buildRegistry)(namespace);
    container = registry.container();

    var CoreOutlet = container.lookupFactory('view:core-outlet');
    top = CoreOutlet.create();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(top);
    registry = container = top = null;
  }
});

QUnit.test('view should render the outlet when set after dom insertion', function () {
  var routerState = withTemplate('<h1>HI</h1>{{outlet}}');
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  equal(top.$().text(), 'HI');

  routerState.outlets.main = withTemplate('<p>BYE</p>');

  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('a top-level outlet should always be a view', function () {
  registry.register('view:toplevel', _emberViewsViewsView2['default'].extend({
    elementId: 'top-level'
  }));
  var routerState = withTemplate('<h1>HI</h1>{{outlet}}');
  top.setOutletState(routerState);
  routerState.outlets.main = withTemplate('<p>BYE</p>');
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  // Replace whitespace for older IE
  equal(trim(top.$('#top-level').text()), 'HIBYE');
});

QUnit.test('a top-level outlet should have access to `{{controller}}`', function () {
  var routerState = withTemplate('<h1>{{controller.salutation}}</h1>{{outlet}}');
  routerState.render.controller = _emberRuntimeControllersController2['default'].create({
    salutation: 'HI'
  });
  top.setOutletState(routerState);
  routerState.outlets.main = withTemplate('<p>BYE</p>');
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('a non top-level outlet should have access to `{{controller}}`', function () {
  var routerState = withTemplate('<h1>HI</h1>{{outlet}}');
  top.setOutletState(routerState);
  routerState.outlets.main = withTemplate('<p>BYE</p>');
  routerState.outlets.main.render.controller = _emberRuntimeControllersController2['default'].create({
    salutation: 'BYE'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(top);

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('view should render the outlet when set before dom insertion', function () {
  var routerState = withTemplate('<h1>HI</h1>{{outlet}}');
  routerState.outlets.main = withTemplate('<p>BYE</p>');
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('outlet should support an optional name', function () {
  var routerState = withTemplate('<h1>HI</h1>{{outlet \'mainView\'}}');
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  equal(top.$().text(), 'HI');

  routerState.outlets.mainView = withTemplate('<p>BYE</p>');

  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('outlet should correctly lookup a view [DEPRECATED]', function () {
  expectDeprecation(/Passing `view` or `viewClass` to {{outlet}} is deprecated/);
  var CoreOutlet = container.lookupFactory('view:core-outlet');
  var SpecialOutlet = CoreOutlet.extend({
    classNames: ['special']
  });

  registry.register('view:special-outlet', SpecialOutlet);

  var routerState = withTemplate('<h1>HI</h1>{{outlet view=\'special-outlet\'}}');
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  equal(top.$().text(), 'HI');

  routerState.outlets.main = withTemplate('<p>BYE</p>');
  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
  equal(top.$().find('.special').length, 1, 'expected to find .special element');
});

QUnit.test('outlet should assert view is specified as a string [DEPRECATED]', function () {
  expectDeprecation(/Passing `view` or `viewClass` to {{outlet}} is deprecated/);
  top.setOutletState(withTemplate('<h1>HI</h1>{{outlet view=containerView}}'));

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(top);
  }, /Using a quoteless view parameter with {{outlet}} is not supported/);
});

QUnit.test('outlet should assert view path is successfully resolved [DEPRECATED]', function () {
  expectDeprecation(/Passing `view` or `viewClass` to {{outlet}} is deprecated/);
  top.setOutletState(withTemplate('<h1>HI</h1>{{outlet view=\'someViewNameHere\'}}'));

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(top);
  }, /someViewNameHere must be a subclass or an instance of Ember.View/);
});

QUnit.test('outlet should support an optional view class [DEPRECATED]', function () {
  expectDeprecation(/Passing `view` or `viewClass` to {{outlet}} is deprecated/);
  var CoreOutlet = container.lookupFactory('view:core-outlet');
  var SpecialOutlet = CoreOutlet.extend({
    classNames: ['very-special']
  });
  var routerState = {
    render: {
      ViewClass: _emberViewsViewsView2['default'].extend({
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>HI</h1>{{outlet viewClass=view.outletView}}'),
        outletView: SpecialOutlet
      })
    },
    outlets: {}
  };
  top.setOutletState(routerState);

  (0, _emberRuntimeTestsUtils.runAppend)(top);

  equal(top.$().text(), 'HI');
  equal(top.$().find('.very-special').length, 1, 'Should find .very-special');

  routerState.outlets.main = withTemplate('<p>BYE</p>');

  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('Outlets bind to the current view, not the current concrete view', function () {
  var routerState = withTemplate('<h1>HI</h1>{{outlet}}');
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);
  routerState.outlets.main = withTemplate('<h2>MIDDLE</h2>{{outlet}}');
  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });
  routerState.outlets.main.outlets.main = withTemplate('<h3>BOTTOM</h3>');
  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  var output = (0, _emberViewsSystemJquery2['default'])('#qunit-fixture h1 ~ h2 ~ h3').text();
  equal(output, 'BOTTOM', 'all templates were rendered');
});

QUnit.test('Outlets bind to the current template\'s view, not inner contexts [DEPRECATED]', function () {
  var parentTemplate = '<h1>HI</h1>{{#if view.alwaysTrue}}{{outlet}}{{/if}}';
  var bottomTemplate = '<h3>BOTTOM</h3>';

  var routerState = {
    render: {
      ViewClass: _emberViewsViewsView2['default'].extend({
        alwaysTrue: true,
        template: (0, _emberTemplateCompilerSystemCompile2['default'])(parentTemplate)
      })
    },
    outlets: {}
  };

  top.setOutletState(routerState);

  (0, _emberRuntimeTestsUtils.runAppend)(top);

  routerState.outlets.main = withTemplate(bottomTemplate);

  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  var output = (0, _emberViewsSystemJquery2['default'])('#qunit-fixture h1 ~ h3').text();
  equal(output, 'BOTTOM', 'all templates were rendered');
});

QUnit.test('should support layouts [DEPRECATED]', function () {
  expectDeprecation(/Using deprecated `template` property on a View/);
  var template = '{{outlet}}';
  var layout = '<h1>HI</h1>{{yield}}';
  var routerState = {
    render: {
      ViewClass: _emberViewsViewsView2['default'].extend({
        template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
        layout: (0, _emberTemplateCompilerSystemCompile2['default'])(layout)
      })
    },
    outlets: {}
  };
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  equal(top.$().text(), 'HI');

  routerState.outlets.main = withTemplate('<p>BYE</p>');

  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test('should not throw deprecations if {{outlet}} is used without a name', function () {
  expectNoDeprecation();
  top.setOutletState(withTemplate('{{outlet}}'));
  (0, _emberRuntimeTestsUtils.runAppend)(top);
});

QUnit.test('should not throw deprecations if {{outlet}} is used with a quoted name', function () {
  expectNoDeprecation();
  top.setOutletState(withTemplate('{{outlet "foo"}}'));
  (0, _emberRuntimeTestsUtils.runAppend)(top);
});

QUnit.test('{{outlet}} should work with an unquoted name', function () {
  var routerState = {
    render: {
      controller: _emberMetalCore2['default'].Controller.create({
        outletName: 'magical'
      }),
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet outletName}}')
    },
    outlets: {
      magical: withTemplate('It\'s magic')
    }
  };

  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);

  equal(top.$().text().trim(), 'It\'s magic');
});

QUnit.test('{{outlet}} should rerender when bound name changes', function () {
  var routerState = {
    render: {
      controller: _emberMetalCore2['default'].Controller.create({
        outletName: 'magical'
      }),
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet outletName}}')
    },
    outlets: {
      magical: withTemplate('It\'s magic'),
      second: withTemplate('second')
    }
  };

  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);
  equal(top.$().text().trim(), 'It\'s magic');
  (0, _emberMetalRun_loop2['default'])(function () {
    routerState.render.controller.set('outletName', 'second');
  });
  equal(top.$().text().trim(), 'second');
});

QUnit.test('views created by {{outlet}} should get destroyed', function () {
  var inserted = 0;
  var destroyed = 0;
  var routerState = {
    render: {
      ViewClass: _emberViewsViewsView2['default'].extend({
        didInsertElement: function didInsertElement() {
          inserted++;
        },
        willDestroyElement: function willDestroyElement() {
          destroyed++;
        }
      })
    },
    outlets: {}
  };
  top.setOutletState(routerState);
  (0, _emberRuntimeTestsUtils.runAppend)(top);
  equal(inserted, 1, 'expected to see view inserted');
  (0, _emberMetalRun_loop2['default'])(function () {
    top.setOutletState(withTemplate('hello world'));
  });
  equal(destroyed, 1, 'expected to see view destroyed');
});

function withTemplate(string) {
  return {
    render: {
      template: (0, _emberTemplateCompilerSystemCompile2['default'])(string)
    },
    outlets: {}
  };
}