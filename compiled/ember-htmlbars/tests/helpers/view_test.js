/*globals EmberDev */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsText_field = require('ember-views/views/text_field');

var _emberViewsViewsText_field2 = _interopRequireDefault(_emberViewsViewsText_field);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _htmlbarsUtilSafeString = require('htmlbars-util/safe-string');

var _htmlbarsUtilSafeString2 = _interopRequireDefault(_htmlbarsUtilSafeString);

var _emberTemplateCompilerCompatPrecompile = require('ember-template-compiler/compat/precompile');

var _emberTemplateCompilerCompatPrecompile2 = _interopRequireDefault(_emberTemplateCompilerCompatPrecompile);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberTemplateCompilerSystemTemplate = require('ember-template-compiler/system/template');

var _emberTemplateCompilerSystemTemplate2 = _interopRequireDefault(_emberTemplateCompilerSystemTemplate);

var _emberMetalObserver = require('ember-metal/observer');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberHtmlbarsSystemMake_bound_helper = require('ember-htmlbars/system/make_bound_helper');

var _emberHtmlbarsSystemMake_bound_helper2 = _interopRequireDefault(_emberHtmlbarsSystemMake_bound_helper);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalComputed = require('ember-metal/computed');

var view, originalLookup, registry, container, lookup;

var trim = _emberViewsSystemJquery2['default'].trim;

function firstGrandchild(view) {
  return (0, _emberMetalProperty_get.get)((0, _emberMetalProperty_get.get)(view, 'childViews').objectAt(0), 'childViews').objectAt(0);
}

function nthChild(view, nth) {
  return (0, _emberMetalProperty_get.get)(view, 'childViews').objectAt(nth || 0);
}

function viewClass(options) {
  options.container = options.container || container;
  return _emberViewsViewsView2['default'].extend(options);
}

var firstChild = nthChild;

QUnit.module('ember-htmlbars: {{#view}} helper', {
  setup: function setup() {
    originalLookup = _emberMetalCore2['default'].lookup;
    _emberMetalCore2['default'].lookup = lookup = {};

    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;

    _emberMetalCore2['default'].lookup = lookup = originalLookup;
  }
});

// https://github.com/emberjs/ember.js/issues/120
QUnit.test('should not enter an infinite loop when binding an attribute in Handlebars', function () {
  var LinkView = _emberViewsViewsView2['default'].extend({
    classNames: ['app-link'],
    tagName: 'a',
    attributeBindings: ['href'],
    href: '#none',

    click: function click() {
      return false;
    }
  });

  var parentView = _emberViewsViewsView2['default'].create({
    linkView: LinkView,
    test: _emberRuntimeSystemObject2['default'].create({ href: 'test' }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.linkView href=view.test.href}} Test {{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(parentView);

  // Use match, since old IE appends the whole URL
  var href = parentView.$('a').attr('href');
  var classNames = parentView.$('a').attr('class');
  ok(href.match(/(^|\/)test$/), 'Expected href to be \'test\' but got "' + href + '"');
  equal(classNames, 'ember-view app-link');

  (0, _emberRuntimeTestsUtils.runDestroy)(parentView);
});

QUnit.test('By default view:toplevel is used', function () {
  var registry = new _containerRegistry2['default']();

  var DefaultView = viewClass({
    elementId: 'toplevel-view',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('hello world')
  });

  registry.register('view:toplevel', DefaultView);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view}}'),
    container: registry.container()
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#toplevel-view').text(), 'hello world');
});

QUnit.test('By default, without a container, EmberView is used', function () {
  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view tagName="span"}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html().toUpperCase().match(/<SPAN/), 'contains view with span');
});

QUnit.test('View lookup - App.FuView (DEPRECATED)', function () {
  _emberMetalCore2['default'].lookup = {
    App: {
      FuView: viewClass({
        elementId: 'fu',
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('bro')
      })
    }
  };

  view = viewClass({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view App.FuView}}')
  }).create();

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Global lookup of App from a Handlebars template is deprecated./);

  equal((0, _emberViewsSystemJquery2['default'])('#fu').text(), 'bro');
});

QUnit.test('View lookup - \'fu\'', function () {
  var FuView = viewClass({
    elementId: 'fu',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('bro')
  });

  registry.register('view:fu', FuView);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view \'fu\'}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#fu').text(), 'bro');
});

QUnit.test('View lookup - \'fu\' when fu is a property and a view name', function () {
  var FuView = viewClass({
    elementId: 'fu',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('bro')
  });

  registry.register('view:fu', FuView);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view \'fu\'}}'),
    context: { fu: 'boom!' },
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#fu').text(), 'bro');
});

QUnit.test('View lookup - view.computed', function () {
  var FuView = viewClass({
    elementId: 'fu',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('bro')
  });

  registry.register('view:fu', FuView);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.computed}}'),
    container: container,
    computed: 'fu'
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#fu').text(), 'bro');
});

QUnit.test('id bindings downgrade to one-time property lookup', function () {
  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id=view.meshuggah}}{{view.parentView.meshuggah}}{{/view}}'),
    meshuggah: 'stengah'
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#stengah').text(), 'stengah', 'id binding performed property lookup');
  (0, _emberMetalRun_loop2['default'])(view, 'set', 'meshuggah', 'omg');
  equal((0, _emberViewsSystemJquery2['default'])('#stengah').text(), 'omg', 'id didn\'t change');
});

QUnit.test('specifying `id` as a static value works properly', function () {
  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id=\'blah\'}}{{view.parentView.meshuggah}}{{/view}}'),
    meshuggah: 'stengah'
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#blah').text(), 'stengah', 'id binding performed property lookup');
});

QUnit.test('mixing old and new styles of property binding fires a warning, treats value as if it were quoted', function () {
  if (EmberDev && EmberDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  expect(2);

  var oldWarn = _emberMetalCore2['default'].warn;

  _emberMetalCore2['default'].warn = function (msg, disableWarning) {
    if (!disableWarning) {
      ok(msg.match(/You're attempting to render a view by passing borfBinding.+, but this syntax is ambiguous./));
    }
  };

  var compiled = undefined;
  expectDeprecation(function () {
    compiled = (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view borfBinding=view.snork}}<p id=\'lol\'>{{view.borf}}</p>{{/view}}');
  }, 'You\'re using legacy binding syntax: borfBinding=view.snork (L1:C8) . Please replace with borf=view.snork');

  view = _emberViewsViewsView2['default'].extend({
    template: compiled,
    snork: 'nerd'
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#lol').text(), 'nerd', 'awkward mixed syntax treated like binding');

  _emberMetalCore2['default'].warn = oldWarn;
});

QUnit.test('"Binding"-suffixed bindings are runloop-synchronized [DEPRECATED]', function () {
  var subview;

  var Subview = _emberViewsViewsView2['default'].extend({
    init: function init() {
      subview = this;
      return this._super.apply(this, arguments);
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class="color">{{view.color}}</div>')
  });

  var compiled = undefined;
  expectDeprecation(function () {
    compiled = (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{view view.Subview colorBinding="view.color"}}</h1>');
  }, 'You\'re using legacy binding syntax: colorBinding="view.color" (L1:C24) . Please replace with color=view.color');

  var View = _emberViewsViewsView2['default'].extend({
    color: 'mauve',
    Subview: Subview,
    template: compiled
  });

  view = View.create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1 .color').text(), 'mauve', 'renders bound value');

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].schedule('sync', function () {
      equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'mauve', 'bound property is correctly scheduled into the sync queue');
    });

    view.set('color', 'persian rose');

    _emberMetalRun_loop2['default'].schedule('sync', function () {
      equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'mauve', 'bound property is correctly scheduled into the sync queue');
    });

    _emberMetalRun_loop2['default'].schedule('afterRender', function () {
      equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'persian rose', 'bound property is correctly scheduled into the sync queue');
    });

    equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'mauve', 'bound property does not update immediately');
  });

  equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'persian rose', 'bound property is updated after runloop flush');
});

QUnit.test('Non-"Binding"-suffixed bindings are runloop-synchronized', function () {
  var subview;

  var Subview = _emberViewsViewsView2['default'].extend({
    init: function init() {
      subview = this;
      return this._super.apply(this, arguments);
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div class="color">{{view.attrs.color}}</div>')
  });

  var View = _emberViewsViewsView2['default'].extend({
    color: 'mauve',
    Subview: Subview,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{view view.Subview color=view.color}}</h1>')
  });

  view = View.create();
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1 .color').text(), 'mauve', 'renders bound value');

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].schedule('sync', function () {
      equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'mauve', 'bound property is correctly scheduled into the sync queue');
    });

    view.set('color', 'persian rose');

    _emberMetalRun_loop2['default'].schedule('sync', function () {
      equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'mauve', 'bound property is correctly scheduled into the sync queue');
    });

    _emberMetalRun_loop2['default'].schedule('afterRender', function () {
      equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'persian rose', 'bound property is correctly scheduled into the sync queue');
    });

    equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'mauve', 'bound property does not update immediately');
  });

  equal((0, _emberMetalProperty_get.get)(subview, 'color'), 'persian rose', 'bound property is updated after runloop flush');
});

QUnit.test('allows you to pass attributes that will be assigned to the class instance, like class="foo"', function () {
  expect(4);

  registry = new _containerRegistry2['default']();
  container = registry.container();
  registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view id="foo" tagName="h1" class="foo"}}{{#view id="bar" class="bar"}}Bar{{/view}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('foo'));
  ok((0, _emberViewsSystemJquery2['default'])('#foo').is('h1'));
  ok((0, _emberViewsSystemJquery2['default'])('#bar').hasClass('bar'));
  equal((0, _emberViewsSystemJquery2['default'])('#bar').text(), 'Bar');
});

QUnit.test('Should apply class without condition always', function () {
  view = _emberViewsViewsView2['default'].create({
    controller: _emberMetalCore2['default'].Object.create(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" classBinding=":foo"}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('foo'), 'Always applies classbinding without condition');
});

QUnit.test('Should apply classes when bound controller.* property specified', function () {
  view = _emberViewsViewsView2['default'].create({
    controller: {
      someProp: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" class=controller.someProp}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('foo'), 'Always applies classbinding without condition');
});

QUnit.test('Should apply classes when bound property specified', function () {
  view = _emberViewsViewsView2['default'].create({
    controller: {
      someProp: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" class=someProp}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('foo'), 'Always applies classbinding without condition');
});

QUnit.test('Should apply a class from a sub expression', function () {
  registry.register('helper:string-concat', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params) {
    return params.join('');
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      type: 'btn',
      size: 'large'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" class=(string-concat type "-" size)}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('btn-large'), 'applies classname from subexpression');

  (0, _emberMetalRun_loop2['default'])(view, view.set, 'controller.size', 'medium');

  ok(!(0, _emberViewsSystemJquery2['default'])('#foo').hasClass('btn-large'), 'removes classname from subexpression update');
  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('btn-medium'), 'adds classname from subexpression update');
});

QUnit.test('Should not apply classes when bound property specified is false', function () {
  view = _emberViewsViewsView2['default'].create({
    controller: {
      someProp: false
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" class=someProp}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(!(0, _emberViewsSystemJquery2['default'])('#foo').hasClass('some-prop'), 'does not add class when value is falsey');
});

QUnit.test('Should apply classes of the dasherized property name when bound property specified is true', function () {
  view = _emberViewsViewsView2['default'].create({
    controller: {
      someProp: true
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" class=someProp}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('some-prop'), 'adds dasherized class when value is true');
});

QUnit.test('Should update classes from a bound property', function () {
  var controller = {
    someProp: true
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view id="foo" class=someProp}} Foo{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('some-prop'), 'adds dasherized class when value is true');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'someProp', false);
  });

  ok(!(0, _emberViewsSystemJquery2['default'])('#foo').hasClass('some-prop'), 'does not add class when value is falsey');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(controller, 'someProp', 'fooBar');
  });

  ok((0, _emberViewsSystemJquery2['default'])('#foo').hasClass('fooBar'), 'changes property to string value (but does not dasherize)');
});

QUnit.test('bound properties should be available in the view', function () {
  var FuView = viewClass({
    elementId: 'fu',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.attrs.foo}}')
  });

  registry.register('view:fu', FuView);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view \'fu\' foo=view.someProp}}'),
    container: container,
    someProp: 'initial value'
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#fu').text(), 'initial value');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'someProp', 'second value');
  });

  equal(view.$('#fu').text(), 'second value');
});

QUnit.test('should escape HTML in normal mustaches', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.output}}'),
    output: 'you need to be more <b>bold</b>'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$('b').length, 0, 'does not create an element');
  equal(view.$().text(), 'you need to be more <b>bold</b>', 'inserts entities, not elements');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'output', 'you are so <i>super</i>');
  });

  equal(view.$().text(), 'you are so <i>super</i>', 'updates with entities, not elements');
  equal(view.$('i').length, 0, 'does not create an element when value is updated');
});

QUnit.test('should not escape HTML in triple mustaches', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{{view.output}}}'),
    output: 'you need to be more <b>bold</b>'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 1, 'creates an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'output', 'you are so <i>super</i>');
  });

  equal(view.$('i').length, 1, 'creates an element when value is updated');
});

QUnit.test('should not escape HTML if string is a Handlebars.SafeString', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.output}}'),
    output: new _htmlbarsUtilSafeString2['default']('you need to be more <b>bold</b>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 1, 'creates an element');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'output', new _htmlbarsUtilSafeString2['default']('you are so <i>super</i>'));
  });

  equal(view.$('i').length, 1, 'creates an element when value is updated');
});

QUnit.test('should teardown observers from bound properties on rerender', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.foo}}'),
    foo: 'bar'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberMetalObserver.observersFor)(view, 'foo').length, 1);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal((0, _emberMetalObserver.observersFor)(view, 'foo').length, 1);
});

QUnit.test('should update bound values after the view is removed and then re-appended', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.showStuff}}{{view.boundValue}}{{else}}Not true.{{/if}}'),
    showStuff: true,
    boundValue: 'foo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'foo');
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'showStuff', false);
  });
  equal(trim(view.$().text()), 'Not true.');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'showStuff', true);
  });
  equal(trim(view.$().text()), 'foo');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.remove();
    (0, _emberMetalProperty_set.set)(view, 'showStuff', false);
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'showStuff', true);
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'boundValue', 'bar');
  });
  equal(trim(view.$().text()), 'bar');
});

QUnit.test('views set the template of their children to a passed block', function () {
  registry.register('template:parent', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#view}}<span>It worked!</span>{{/view}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'parent'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  ok(view.$('h1:has(span)').length === 1, 'renders the passed template inside the parent template');
});

QUnit.test('{{view}} should not override class bindings defined on a child view', function () {
  var LabelView = _emberViewsViewsView2['default'].extend({
    container: container,
    classNameBindings: ['something'],
    something: 'visible'
  });

  registry.register('controller:label', _emberRuntimeControllersController2['default'], { instantiate: true });
  registry.register('view:label', LabelView);
  registry.register('template:label', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="child-view"></div>'));
  registry.register('template:nester', (0, _emberTemplateCompilerSystemCompile2['default'])('{{render "label"}}'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'nester',
    controller: _emberRuntimeControllersController2['default'].create({
      container: container
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('.visible').length > 0, 'class bindings are not overriden');
});

QUnit.test('child views can be inserted using the {{view}} helper', function () {
  registry.register('template:nester', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1 id="hello-world">Hello {{world}}</h1>{{view view.labelView}}'));
  registry.register('template:nested', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="child-view">Goodbye {{cruel}} {{world}}</div>'));

  var context = {
    world: 'world!'
  };

  var LabelView = _emberViewsViewsView2['default'].extend({
    container: container,
    tagName: 'aside',
    templateName: 'nested'
  });

  view = _emberViewsViewsView2['default'].create({
    labelView: LabelView,
    container: container,
    templateName: 'nester',
    context: context
  });

  (0, _emberMetalProperty_set.set)(context, 'cruel', 'cruel');

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('#hello-world:contains("Hello world!")').length, 'The parent view renders its contents');
  ok(view.$('#child-view:contains("Goodbye cruel world!")').length === 1, 'The child view renders its content once');
  ok(view.$().text().match(/Hello world!.*Goodbye cruel world\!/), 'parent view should appear before the child view');
});

QUnit.test('should be able to explicitly set a view\'s context', function () {
  var context = _emberRuntimeSystemObject2['default'].create({
    test: 'test'
  });

  var CustomContextView = _emberViewsViewsView2['default'].extend({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{test}}')
  });

  view = _emberViewsViewsView2['default'].create({
    customContextView: CustomContextView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.customContextView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'test');
});

QUnit.test('Template views add an elementId to child views created using the view helper', function () {
  registry.register('template:parent', (0, _emberTemplateCompilerSystemCompile2['default'])('<div>{{view view.childView}}</div>'));
  registry.register('template:child', (0, _emberTemplateCompilerSystemCompile2['default'])('I can\'t believe it\'s not butter.'));

  var ChildView = _emberViewsViewsView2['default'].extend({
    container: container,
    templateName: 'child'
  });

  view = _emberViewsViewsView2['default'].create({
    container: container,
    childView: ChildView,
    templateName: 'parent'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var childView = (0, _emberMetalProperty_get.get)(view, 'childViews.firstObject');
  equal(view.$().children().first().children().first().attr('id'), (0, _emberMetalProperty_get.get)(childView, 'elementId'));
});

QUnit.test('Child views created using the view helper should have their parent view set properly', function () {
  var template = '{{#view}}{{#view}}{{view}}{{/view}}{{/view}}';

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var childView = firstGrandchild(view);
  equal(childView, (0, _emberMetalProperty_get.get)(firstChild(childView), 'parentView'), 'parent view is correct');
});

QUnit.test('Child views created using the view helper should have their IDs registered for events', function () {
  var template = '{{view}}{{view id="templateViewTest"}}';

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var childView = firstChild(view);
  var id = childView.$()[0].id;
  equal(_emberViewsViewsView2['default'].views[id], childView, 'childView without passed ID is registered with View.views so that it can properly receive events from EventDispatcher');

  childView = nthChild(view, 1);
  id = childView.$()[0].id;
  equal(id, 'templateViewTest', 'precond -- id of childView should be set correctly');
  equal(_emberViewsViewsView2['default'].views[id], childView, 'childView with passed ID is registered with View.views so that it can properly receive events from EventDispatcher');
});

QUnit.test('Child views created using the view helper and that have a viewName should be registered as properties on their parentView', function () {
  var template = '{{#view}}{{view viewName="ohai"}}{{/view}}';

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var parentView = firstChild(view);
  var childView = firstGrandchild(view);

  equal((0, _emberMetalProperty_get.get)(parentView, 'ohai'), childView);
});

QUnit.test('{{view}} id attribute should set id on layer', function () {
  registry.register('template:foo', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.idView id="bar"}}baz{{/view}}'));

  var IdView = _emberViewsViewsView2['default'];

  view = _emberViewsViewsView2['default'].create({
    idView: IdView,
    container: container,
    templateName: 'foo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#bar').length, 1, 'adds id attribute to layer');
  equal(view.$('#bar').text(), 'baz', 'emits content');
});

QUnit.test('{{view}} tag attribute should set tagName of the view', function () {
  registry.register('template:foo', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.tagView tag="span"}}baz{{/view}}'));

  var TagView = _emberViewsViewsView2['default'];

  view = _emberViewsViewsView2['default'].create({
    tagView: TagView,
    container: container,
    templateName: 'foo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('span').length, 1, 'renders with tag name');
  equal(view.$('span').text(), 'baz', 'emits content');
});

QUnit.test('{{view}} class attribute should set class on layer', function () {
  registry.register('template:foo', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.idView class="bar"}}baz{{/view}}'));

  var IdView = _emberViewsViewsView2['default'];

  view = _emberViewsViewsView2['default'].create({
    idView: IdView,
    container: container,
    templateName: 'foo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('.bar').length, 1, 'adds class attribute to layer');
  equal(view.$('.bar').text(), 'baz', 'emits content');
});

QUnit.test('{{view}} should not allow attributeBindings to be set', function () {
  expectAssertion(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view attributeBindings="one two"}}')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Setting 'attributeBindings' via template helpers is not allowed/);
});

QUnit.test('{{view}} should be able to point to a local view', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.common}}'),

    common: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('common')
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'common', 'tries to look up view name locally');
});

QUnit.test('{{view}} should evaluate class bindings set to global paths DEPRECATED', function () {
  var App;

  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.App = App = _emberRuntimeSystemNamespace2['default'].create({
      isApp: true,
      isGreat: true,
      directClass: 'app-direct',
      isEnabled: true
    });
  });

  view = _emberViewsViewsView2['default'].create({
    textField: _emberViewsViewsText_field2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.textField class="unbound" classBinding="App.isGreat:great App.directClass App.isApp App.isEnabled:enabled:disabled"}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  ok(view.$('input').hasClass('unbound'), 'sets unbound classes directly');
  ok(view.$('input').hasClass('great'), 'evaluates classes bound to global paths');
  ok(view.$('input').hasClass('app-direct'), 'evaluates classes bound directly to global paths');
  ok(view.$('input').hasClass('is-app'), 'evaluates classes bound directly to booleans in global paths - dasherizes and sets class when true');
  ok(view.$('input').hasClass('enabled'), 'evaluates ternary operator in classBindings');
  ok(!view.$('input').hasClass('disabled'), 'evaluates ternary operator in classBindings');

  (0, _emberMetalRun_loop2['default'])(function () {
    App.set('isApp', false);
    App.set('isEnabled', false);
  });

  ok(!view.$('input').hasClass('is-app'), 'evaluates classes bound directly to booleans in global paths - removes class when false');
  ok(!view.$('input').hasClass('enabled'), 'evaluates ternary operator in classBindings');
  ok(view.$('input').hasClass('disabled'), 'evaluates ternary operator in classBindings');

  (0, _emberRuntimeTestsUtils.runDestroy)(lookup.App);
});

QUnit.test('{{view}} should evaluate class bindings set in the current context', function () {
  view = _emberViewsViewsView2['default'].create({
    isView: true,
    isEditable: true,
    directClass: 'view-direct',
    isEnabled: true,
    textField: _emberViewsViewsText_field2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.textField class="unbound" classBinding="view.isEditable:editable view.directClass view.isView view.isEnabled:enabled:disabled"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('input').hasClass('unbound'), 'sets unbound classes directly');
  ok(view.$('input').hasClass('editable'), 'evaluates classes bound in the current context');
  ok(view.$('input').hasClass('view-direct'), 'evaluates classes bound directly in the current context');
  ok(view.$('input').hasClass('is-view'), 'evaluates classes bound directly to booleans in the current context - dasherizes and sets class when true');
  ok(view.$('input').hasClass('enabled'), 'evaluates ternary operator in classBindings');
  ok(!view.$('input').hasClass('disabled'), 'evaluates ternary operator in classBindings');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isView', false);
    view.set('isEnabled', false);
  });

  ok(!view.$('input').hasClass('is-view'), 'evaluates classes bound directly to booleans in the current context - removes class when false');
  ok(!view.$('input').hasClass('enabled'), 'evaluates ternary operator in classBindings');
  ok(view.$('input').hasClass('disabled'), 'evaluates ternary operator in classBindings');
});

QUnit.test('{{view}} should evaluate class bindings set with either classBinding or classNameBindings from globals DEPRECATED', function () {
  var App;

  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.App = App = _emberRuntimeSystemNamespace2['default'].create({
      isGreat: true,
      isEnabled: true
    });
  });

  view = _emberViewsViewsView2['default'].create({
    textField: _emberViewsViewsText_field2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.textField class="unbound" classBinding="App.isGreat:great App.isEnabled:enabled:disabled" classNameBindings="App.isGreat:really-great App.isEnabled:really-enabled:really-disabled"}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  ok(view.$('input').hasClass('unbound'), 'sets unbound classes directly');
  ok(view.$('input').hasClass('great'), 'evaluates classBinding');
  ok(view.$('input').hasClass('really-great'), 'evaluates classNameBinding');
  ok(view.$('input').hasClass('enabled'), 'evaluates ternary operator in classBindings');
  ok(view.$('input').hasClass('really-enabled'), 'evaluates ternary operator in classBindings');
  ok(!view.$('input').hasClass('disabled'), 'evaluates ternary operator in classBindings');
  ok(!view.$('input').hasClass('really-disabled'), 'evaluates ternary operator in classBindings');

  (0, _emberMetalRun_loop2['default'])(function () {
    App.set('isEnabled', false);
  });

  ok(!view.$('input').hasClass('enabled'), 'evaluates ternary operator in classBindings');
  ok(!view.$('input').hasClass('really-enabled'), 'evaluates ternary operator in classBindings');
  ok(view.$('input').hasClass('disabled'), 'evaluates ternary operator in classBindings');
  ok(view.$('input').hasClass('really-disabled'), 'evaluates ternary operator in classBindings');

  (0, _emberRuntimeTestsUtils.runDestroy)(lookup.App);
});

QUnit.test('{{view}} should evaluate other attribute bindings set to global paths [DEPRECATED]', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.App = _emberRuntimeSystemNamespace2['default'].create({
      name: 'myApp'
    });
  });

  var template;
  expectDeprecation(function () {
    template = (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.textField valueBinding="App.name"}}');
  }, /You're using legacy binding syntax: valueBinding/);

  view = _emberViewsViewsView2['default'].create({
    textField: _emberViewsViewsText_field2['default'],
    template: template
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Global lookup of App from a Handlebars template is deprecated.');

  equal(view.$('input').val(), 'myApp', 'evaluates attributes bound to global paths');

  (0, _emberRuntimeTestsUtils.runDestroy)(lookup.App);
});

QUnit.test('{{view}} should evaluate other attributes bindings set in the current context', function () {
  view = _emberViewsViewsView2['default'].create({
    name: 'myView',
    textField: _emberViewsViewsText_field2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.textField value=view.name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('input').val(), 'myView', 'evaluates attributes bound in the current context');
});

QUnit.test('{{view}} should be able to bind class names to truthy properties', function () {
  registry.register('template:template', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.classBindingView classBinding="view.number:is-truthy"}}foo{{/view}}'));

  var ClassBindingView = _emberViewsViewsView2['default'].extend();

  view = _emberViewsViewsView2['default'].create({
    classBindingView: ClassBindingView,
    container: container,
    number: 5,
    templateName: 'template'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('.is-truthy').length, 1, 'sets class name');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'number', 0);
  });

  equal(view.$('.is-truthy').length, 0, 'removes class name if bound property is set to falsey');
});

QUnit.test('{{view}} should be able to bind class names to truthy or falsy properties', function () {
  registry.register('template:template', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.classBindingView classBinding="view.number:is-truthy:is-falsy"}}foo{{/view}}'));

  var ClassBindingView = _emberViewsViewsView2['default'].extend();

  view = _emberViewsViewsView2['default'].create({
    classBindingView: ClassBindingView,
    container: container,
    number: 5,
    templateName: 'template'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('.is-truthy').length, 1, 'sets class name to truthy value');
  equal(view.$('.is-falsy').length, 0, 'doesn\'t set class name to falsy value');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'number', 0);
  });

  equal(view.$('.is-truthy').length, 0, 'doesn\'t set class name to truthy value');
  equal(view.$('.is-falsy').length, 1, 'sets class name to falsy value');
});

QUnit.test('a view helper\'s bindings are to the parent context', function () {
  var Subview = _emberViewsViewsView2['default'].extend({
    classNameBindings: ['attrs.color'],
    controller: _emberRuntimeSystemObject2['default'].create({
      color: 'green',
      name: 'bar'
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{attrs.someController.name}} {{name}}')
  });

  var View = _emberViewsViewsView2['default'].extend({
    controller: _emberRuntimeSystemObject2['default'].create({
      color: 'mauve',
      name: 'foo'
    }),
    Subview: Subview,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{view view.Subview color=color someController=this}}</h1>')
  });

  view = View.create();
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1 .mauve').length, 1, 'renders property on helper declaration from parent context');
  equal(view.$('h1 .mauve').text(), 'foo bar', 'renders property bound in template from subview context');
});

QUnit.test('should expose a controller keyword when present on the view', function () {
  var templateString = '{{controller.foo}}{{#view}}{{controller.baz}}{{/view}}';
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: _emberRuntimeSystemObject2['default'].create({
      foo: 'bar',
      baz: 'bang'
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'barbang', 'renders values from controller and parent controller');

  var controller = (0, _emberMetalProperty_get.get)(view, 'controller');

  (0, _emberMetalRun_loop2['default'])(function () {
    controller.set('foo', 'BAR');
    controller.set('baz', 'BLARGH');
  });

  equal(view.$().text(), 'BARBLARGH', 'updates the DOM when a bound value is updated');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    controller: 'aString',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{controller}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'aString', 'renders the controller itself if no additional path is specified');
});

QUnit.test('should expose a controller keyword that can be used in conditionals', function () {
  var templateString = '{{#view}}{{#if controller}}{{controller.foo}}{{/if}}{{/view}}';
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: _emberRuntimeSystemObject2['default'].create({
      foo: 'bar'
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'bar', 'renders values from controller and parent controller');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller', null);
  });

  equal(view.$().text(), '', 'updates the DOM when the controller is changed');
});

QUnit.test('should expose a controller that can be used in the view instance', function () {
  var templateString = '{{#view view.childThing tagName="div"}}Stuff{{/view}}';
  var controller = {
    foo: 'bar'
  };
  var childThingController;
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,

    childThing: _emberViewsViewsView2['default'].extend({
      didInsertElement: function didInsertElement() {
        childThingController = (0, _emberMetalProperty_get.get)(this, 'controller');
      }
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(controller, childThingController, 'childThing should get the same controller as the outer scope');
});

QUnit.test('should expose a controller keyword that persists through Ember.ContainerView', function () {
  var templateString = '{{view view.containerView}}';
  view = _emberViewsViewsView2['default'].create({
    containerView: _emberViewsViewsContainer_view2['default'],
    container: container,
    controller: _emberRuntimeSystemObject2['default'].create({
      foo: 'bar'
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var containerView = (0, _emberMetalProperty_get.get)(view, 'childViews.firstObject');
  var viewInstanceToBeInserted = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{controller.foo}}')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    containerView.pushObject(viewInstanceToBeInserted);
  });

  equal(trim(viewInstanceToBeInserted.$().text()), 'bar', 'renders value from parent\'s controller');
});

QUnit.test('should work with precompiled templates', function () {
  var templateString = (0, _emberTemplateCompilerCompatPrecompile2['default'])('{{view.value}}');
  var compiledTemplate = (0, _emberTemplateCompilerSystemTemplate2['default'])(eval(templateString));

  view = _emberViewsViewsView2['default'].create({
    value: 'rendered',
    template: compiledTemplate
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'rendered', 'the precompiled template was rendered');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 'updated');
  });

  equal(view.$().text(), 'updated', 'the precompiled template was updated');
});

QUnit.test('bindings should be relative to the current context [DEPRECATED]', function () {
  view = _emberViewsViewsView2['default'].create({
    museumOpen: true,

    museumDetails: _emberRuntimeSystemObject2['default'].create({
      name: 'SFMoMA',
      price: 20
    }),

    museumView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('Name: {{view.attrs.name}} Price: ${{view.attrs.dollars}}')
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.museumOpen}} {{view view.museumView name=view.museumDetails.name dollars=view.museumDetails.price}} {{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'Name: SFMoMA Price: $20', 'should print baz twice');
});

QUnit.test('bindings should respect keywords [DEPRECATED]', function () {
  view = _emberViewsViewsView2['default'].create({
    museumOpen: true,

    controller: {
      museumOpen: true,
      museumDetails: _emberRuntimeSystemObject2['default'].create({
        name: 'SFMoMA',
        price: 20
      })
    },

    museumView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('Name: {{view.attrs.name}} Price: ${{view.attrs.dollars}}')
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.museumOpen}}{{view view.museumView name=controller.museumDetails.name dollars=controller.museumDetails.price}}{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'Name: SFMoMA Price: $20', 'should print baz twice');
});

QUnit.test('should respect keywords', function () {
  view = _emberViewsViewsView2['default'].create({
    museumOpen: true,

    controller: {
      museumOpen: true,
      museumDetails: _emberRuntimeSystemObject2['default'].create({
        name: 'SFMoMA',
        price: 20
      })
    },

    museumView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('Name: {{view.attrs.name}} Price: ${{view.attrs.dollars}}')
    }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.museumOpen}}{{view view.museumView name=controller.museumDetails.name dollars=controller.museumDetails.price}}{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(trim(view.$().text()), 'Name: SFMoMA Price: $20', 'should print baz twice');
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

QUnit.test('{{view}} should be able to point to a local instance of view', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.common}}'),

    common: _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('common')
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'common', 'tries to look up view name locally');
});

QUnit.test('{{view}} should be able to point to a local instance of subclass of view', function () {
  var MyView = _emberViewsViewsView2['default'].extend();
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.subclassed}}'),
    subclassed: MyView.create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('subclassed')
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'subclassed', 'tries to look up view name locally');
});

QUnit.test('{{view}} asserts that a view class is present', function () {
  var MyView = _emberRuntimeSystemObject2['default'].extend();
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.notView}}'),
    notView: MyView.extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('notView')
    })
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /must be a subclass or an instance of Ember.View/);
});

QUnit.test('{{view}} asserts that a view class is present off controller', function () {
  var MyView = _emberRuntimeSystemObject2['default'].extend();
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view notView}}'),
    controller: _emberRuntimeSystemObject2['default'].create({
      notView: MyView.extend({
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('notView')
      })
    })
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /must be a subclass or an instance of Ember.View/);
});

QUnit.test('{{view}} asserts that a view instance is present', function () {
  var MyView = _emberRuntimeSystemObject2['default'].extend();
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.notView}}'),
    notView: MyView.create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('notView')
    })
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /must be a subclass or an instance of Ember.View/);
});

QUnit.test('{{view}} asserts that a view subclass instance is present off controller', function () {
  var MyView = _emberRuntimeSystemObject2['default'].extend();
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view notView}}'),
    controller: _emberRuntimeSystemObject2['default'].create({
      notView: MyView.create({
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('notView')
      })
    })
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /must be a subclass or an instance of Ember.View/);
});

QUnit.test('Specifying `id` to {{view}} is set on the view.', function () {
  registry.register('view:derp', _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="view-id">{{view.id}}</div><div id="view-elementId">{{view.elementId}}</div>')
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    foo: 'bar',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "derp" id=view.foo}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#bar').length, 1, 'it uses the provided id for the views elementId');
  equal(view.$('#view-id').text(), 'bar', 'the views id property is set');
  equal(view.$('#view-elementId').text(), 'bar', 'the views elementId property is set');
});

QUnit.test('Specifying `id` to {{view}} does not allow bound id changes.', function () {
  registry.register('view:derp', _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="view-id">{{view.id}}</div><div id="view-elementId">{{view.elementId}}</div>')
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    foo: 'bar',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "derp" id=view.foo}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#bar #view-id').text(), 'bar', 'the views id property is set');

  (0, _emberMetalRun_loop2['default'])(view, _emberMetalProperty_set.set, view, 'foo', 'baz');

  equal(view.$('#bar #view-id').text(), 'baz', 'the views id property is not changed');
});

QUnit.test('using a bound view name does not change on view name property changes', function () {
  registry.register('view:foo', viewClass({
    elementId: 'foo'
  }));

  registry.register('view:bar', viewClass({
    elementId: 'bar'
  }));

  view = _emberViewsViewsView2['default'].extend({
    container: container,
    elementId: 'parent',
    viewName: 'foo',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.viewName}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#foo').length, 1, 'moving from falsey to truthy causes the viewName to be looked up and rendered');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'viewName', 'bar');
  });

  equal(view.$('#bar').length, 0, 'changing the viewName string after it was initially rendered does not render the new viewName');
  equal(view.$('#foo').length, 1, 'the originally rendered view is still present');
});

QUnit.test('should have the correct action target', function () {
  registry.register('component:x-outer', _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-middle}}{{view innerView dismiss="dismiss"}}{{/x-middle}}'),
    actions: {
      dismiss: function dismiss() {
        ok(true, 'We handled the action in the right place');
      }
    },
    innerView: _emberViewsViewsComponent2['default'].extend({
      container: container,
      elementId: 'x-inner'
    })
  }));

  registry.register('component:x-middle', _emberViewsViewsComponent2['default'].extend({
    container: container,
    actions: {
      dismiss: function dismiss() {
        throw new Error('action was not supposed to go here');
      }
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberViewsViewsView2['default'].views['x-inner'].sendAction('dismiss');
  });
});