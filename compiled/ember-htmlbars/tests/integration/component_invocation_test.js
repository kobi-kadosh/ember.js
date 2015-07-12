'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var registry, container, view;

function commonSetup() {
  registry = new _containerRegistry2['default']();
  container = registry.container();
  registry.optionsForType('component', { singleton: false });
  registry.optionsForType('view', { singleton: false });
  registry.optionsForType('template', { instantiate: false });
  registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
}

function commonTeardown() {
  (0, _emberRuntimeTestsUtils.runDestroy)(container);
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  registry = container = view = null;
}

function appendViewFor(template) {
  var hash = arguments[1] === undefined ? {} : arguments[1];

  var view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(template),
    container: container
  }).create(hash);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  return view;
}

QUnit.module('component - invocation', {
  setup: function setup() {
    commonSetup();
  },

  teardown: function teardown() {
    commonTeardown();
  }
});

QUnit.test('non-block without properties', function () {
  expect(1);

  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout');
});

QUnit.test('block without properties', function () {
  expect(1);

  registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - {{yield}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block}}In template{{/with-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - In template');
});

QUnit.test('non-block with properties on attrs', function () {
  expect(1);

  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block someProp="something here"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here');
});

QUnit.test('non-block with properties on attrs and component class', function () {
  registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend());
  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block someProp="something here"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here');
});

QUnit.test('lookup of component takes priority over property', function () {
  expect(1);

  registry.register('template:components/some-component', (0, _emberTemplateCompilerSystemCompile2['default'])('some-component'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{some-prop}} {{some-component}}'),
    container: container,
    context: {
      'some-component': 'not-some-component',
      'some-prop': 'some-prop'
    }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'some-prop some-component');
});

QUnit.test('component without dash is not looked up', function () {
  expect(1);

  registry.register('template:components/somecomponent', (0, _emberTemplateCompilerSystemCompile2['default'])('somecomponent'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{somecomponent}}'),
    container: container,
    context: {
      'somecomponent': 'notsomecomponent'
    }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'notsomecomponent');
});

QUnit.test('rerendering component with attrs from parent', function () {
  var _willUpdate = 0;
  var _didReceiveAttrs = 0;

  registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend({
    didReceiveAttrs: function didReceiveAttrs() {
      _didReceiveAttrs++;
    },

    willUpdate: function willUpdate() {
      _willUpdate++;
    }
  }));
  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block someProp=view.someProp}}'),
    container: container,
    someProp: 'wycats'
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(_didReceiveAttrs, 1, 'The didReceiveAttrs hook fired');

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: wycats');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('someProp', 'tomdale');
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: tomdale');
  equal(_didReceiveAttrs, 2, 'The didReceiveAttrs hook fired again');
  equal(_willUpdate, 1, 'The willUpdate hook fired once');

  _emberMetalCore2['default'].run(view, 'rerender');

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: tomdale');
  equal(_didReceiveAttrs, 3, 'The didReceiveAttrs hook fired again');
  equal(_willUpdate, 2, 'The willUpdate hook fired again');
});

QUnit.test('[DEPRECATED] non-block with properties on self', function () {
  // TODO: attrs
  // expectDeprecation("You accessed the `someProp` attribute directly. Please use `attrs.someProp` instead.");

  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{someProp}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block someProp="something here"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here');
});

QUnit.test('block with properties on attrs', function () {
  expect(1);

  registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}} - {{yield}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block someProp="something here"}}In template{{/with-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here - In template');
});

QUnit.test('[DEPRECATED] block with properties on self', function () {
  // TODO: attrs
  // expectDeprecation("You accessed the `someProp` attribute directly. Please use `attrs.someProp` instead.");

  registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{someProp}} - {{yield}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block someProp="something here"}}In template{{/with-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here - In template');
});

QUnit.test('with ariaRole specified', function () {
  expect(1);

  registry.register('template:components/aria-test', (0, _emberTemplateCompilerSystemCompile2['default'])('Here!'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{aria-test id="aria-test" ariaRole="main"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#aria-test').attr('role'), 'main', 'role attribute is applied');
});

QUnit.test('`template` is true when block supplied', function () {
  expect(3);

  var innerComponent = undefined;
  registry.register('component:with-block', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      innerComponent = this;
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block}}In template{{/with-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In template');

  var template = undefined;
  expectDeprecation(function () {
    template = (0, _emberMetalProperty_get.get)(innerComponent, 'template');
  }, /Accessing 'template' in .+ is deprecated. To determine if a block was specified to .+ please use '{{#if hasBlock}}' in the components layout./);

  ok(template, 'template property is truthy when a block was provided');
});

QUnit.test('`template` is false when no block supplied', function () {
  expect(2);

  var innerComponent = undefined;
  registry.register('component:without-block', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      innerComponent = this;
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{without-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var template = undefined;
  expectDeprecation(function () {
    template = (0, _emberMetalProperty_get.get)(innerComponent, 'template');
  }, /Accessing 'template' in .+ is deprecated. To determine if a block was specified to .+ please use '{{#if hasBlock}}' in the components layout./);

  ok(!template, 'template property is falsey when a block was not provided');
});

QUnit.test('`template` specified in a component is overridden by block', function () {
  expect(1);

  registry.register('component:with-block', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{yield}}'),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Oh, noes!')
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block}}Whoop, whoop!{{/with-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Whoop, whoop!', 'block provided always overrides template property');
});

QUnit.test('template specified inline is available from Views looked up as components', function () {
  expect(2);

  registry.register('component:without-block', _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Whoop, whoop!')
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{without-block}}'),
    container: container
  }).create();

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using deprecated `template` property on a Component.');

  equal(view.$().text(), 'Whoop, whoop!', 'template inline works properly');
});

if ((0, _emberMetalFeatures2['default'])('ember-views-component-block-info')) {
  QUnit.test('hasBlock is true when block supplied', function () {
    expect(1);

    registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlock}}{{yield}}{{else}}No Block!{{/if}}'));

    view = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block}}In template{{/with-block}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In template');
  });

  QUnit.test('hasBlock is false when no block supplied', function () {
    expect(1);

    registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlock}}{{yield}}{{else}}No Block!{{/if}}'));

    view = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{with-block}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'No Block!');
  });

  QUnit.test('hasBlockParams is true when block param supplied', function () {
    expect(1);

    registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlockParams}}{{yield this}} - In Component{{else}}{{yield}} No Block!{{/if}}'));

    view = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block as |something|}}In template{{/with-block}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In template - In Component');
  });

  QUnit.test('hasBlockParams is false when no block param supplied', function () {
    expect(1);

    registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlockParams}}{{yield this}}{{else}}{{yield}} No Block Param!{{/if}}'));

    view = _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with-block}}In block{{/with-block}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In block No Block Param!');
  });
}

QUnit.test('static named positional parameters', function () {
  registry.register('template:components/sample-component', (0, _emberTemplateCompilerSystemCompile2['default'])('{{attrs.name}}{{attrs.age}}'));
  registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
    positionalParams: ['name', 'age']
  }));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{sample-component "Quint" 4}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Quint4');
});

QUnit.test('dynamic named positional parameters', function () {
  registry.register('template:components/sample-component', (0, _emberTemplateCompilerSystemCompile2['default'])('{{attrs.name}}{{attrs.age}}'));
  registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
    positionalParams: ['name', 'age']
  }));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{sample-component myName myAge}}'),
    container: container,
    context: {
      myName: 'Quint',
      myAge: 4
    }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Quint4');
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view.context, 'myName', 'Edward');
    (0, _emberMetalProperty_set.set)(view.context, 'myAge', '5');
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Edward5');
});

QUnit.test('static arbitrary number of positional parameters', function () {
  registry.register('template:components/sample-component', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each attrs.names as |name|}}{{name}}{{/each}}'));
  registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
    positionalParams: 'names'
  }));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{sample-component "Foo" 4 "Bar" id="args-3"}}{{sample-component "Foo" 4 "Bar" 5 "Baz" id="args-5"}}{{component "sample-component" "Foo" 4 "Bar" 5 "Baz" id="helper"}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#args-3').text(), 'Foo4Bar');
  equal(view.$('#args-5').text(), 'Foo4Bar5Baz');
  equal(view.$('#helper').text(), 'Foo4Bar5Baz');
});

QUnit.test('dynamic arbitrary number of positional parameters', function () {
  registry.register('template:components/sample-component', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each attrs.names as |name|}}{{name}}{{/each}}'));
  registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
    positionalParams: 'names'
  }));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{sample-component user1 user2 id="direct"}}{{component "sample-component" user1 user2 id="helper"}}'),
    container: container,
    context: {
      user1: 'Foo',
      user2: 4
    }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$('#direct').text(), 'Foo4');
  equal(view.$('#helper').text(), 'Foo4');
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view.context, 'user1', 'Bar');
    (0, _emberMetalProperty_set.set)(view.context, 'user2', '5');
  });

  equal(view.$('#direct').text(), 'Bar5');
  equal(view.$('#helper').text(), 'Bar5');
});

QUnit.test('moduleName is available on _renderNode when a layout is present', function () {
  expect(1);

  var layoutModuleName = 'my-app-name/templates/components/sample-component';
  var sampleComponentLayout = (0, _emberTemplateCompilerSystemCompile2['default'])('Sample Component - {{yield}}', {
    moduleName: layoutModuleName
  });
  registry.register('template:components/sample-component', sampleComponentLayout);
  registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
    didInsertElement: function didInsertElement() {
      equal(this._renderNode.lastResult.template.meta.moduleName, layoutModuleName);
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{sample-component}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('moduleName is available on _renderNode when no layout is present', function () {
  expect(1);

  var templateModuleName = 'my-app-name/templates/application';
  registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
    didInsertElement: function didInsertElement() {
      equal(this._renderNode.lastResult.template.meta.moduleName, templateModuleName);
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#sample-component}}Derp{{/sample-component}}', {
      moduleName: templateModuleName
    }),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-component-helper')) {
  QUnit.test('{{component}} helper works with positional params', function () {
    registry.register('template:components/sample-component', (0, _emberTemplateCompilerSystemCompile2['default'])('{{attrs.name}}{{attrs.age}}'));
    registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
      positionalParams: ['name', 'age']
    }));

    view = _emberViewsViewsView2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{component "sample-component" myName myAge}}'),
      container: container,
      context: {
        myName: 'Quint',
        myAge: 4
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);
    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Quint4');
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view.context, 'myName', 'Edward');
      (0, _emberMetalProperty_set.set)(view.context, 'myAge', '5');
    });

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Edward5');
  });
}

QUnit.test('yield to inverse', function () {
  registry.register('template:components/my-if', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if predicate}}Yes:{{yield someValue}}{{else}}No:{{yield to="inverse"}}{{/if}}'));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#my-if predicate=activated someValue=42 as |result|}}Hello{{result}}{{else}}Goodbye{{/my-if}}'),
    container: container,
    context: {
      activated: true
    }
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'Yes:Hello42');
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view.context, 'activated', false);
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'No:Goodbye');
});

QUnit.test('parameterized hasBlock inverse', function () {
  registry.register('template:components/check-inverse', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if (hasBlock "inverse")}}Yes{{else}}No{{/if}}'));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#check-inverse id="expect-no"}}{{/check-inverse}}  {{#check-inverse id="expect-yes"}}{{else}}{{/check-inverse}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-no').text(), 'No');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-yes').text(), 'Yes');
});

QUnit.test('parameterized hasBlock default', function () {
  registry.register('template:components/check-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if (hasBlock)}}Yes{{else}}No{{/if}}'));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{check-block id="expect-no"}}  {{#check-block id="expect-yes"}}{{/check-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-no').text(), 'No');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-yes').text(), 'Yes');
});

QUnit.test('non-expression hasBlock ', function () {
  registry.register('template:components/check-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlock}}Yes{{else}}No{{/if}}'));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{check-block id="expect-no"}}  {{#check-block id="expect-yes"}}{{/check-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-no').text(), 'No');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-yes').text(), 'Yes');
});

QUnit.test('parameterized hasBlockParams', function () {
  registry.register('template:components/check-params', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if (hasBlockParams)}}Yes{{else}}No{{/if}}'));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#check-params id="expect-no"}}{{/check-params}}  {{#check-params id="expect-yes" as |foo|}}{{/check-params}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-no').text(), 'No');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-yes').text(), 'Yes');
});

QUnit.test('non-expression hasBlockParams', function () {
  registry.register('template:components/check-params', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlockParams}}Yes{{else}}No{{/if}}'));

  view = _emberViewsViewsView2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#check-params id="expect-no"}}{{/check-params}}  {{#check-params id="expect-yes" as |foo|}}{{/check-params}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-no').text(), 'No');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture #expect-yes').text(), 'Yes');
});

QUnit.test('implementing `render` allows pushing into a string buffer', function () {
  expect(1);

  registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend({
    render: function render(buffer) {
      buffer.push('<span id="zomg">Whoop!</span>');
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#zomg').text(), 'Whoop!');
});

QUnit.test('comopnent should rerender when a property is changed during children\'s rendering', function () {
  expectDeprecation(/twice in a single render/);

  var outer, middle;

  registry.register('component:x-outer', _emberViewsViewsComponent2['default'].extend({
    value: 1,
    grabReference: _emberMetalCore2['default'].on('init', function () {
      outer = this;
    })
  }));

  registry.register('component:x-middle', _emberViewsViewsComponent2['default'].extend({
    grabReference: _emberMetalCore2['default'].on('init', function () {
      middle = this;
    })
  }));

  registry.register('component:x-inner', _emberViewsViewsComponent2['default'].extend({
    pushDataUp: _emberMetalCore2['default'].observer('value', function () {
      middle.set('value', this.get('value'));
    })
  }));

  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-middle}}{{x-inner value=value}}{{/x-middle}}'));
  registry.register('template:components/x-middle', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="middle-value">{{value}}</div>{{yield}}'));
  registry.register('template:components/x-inner', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="inner-value">{{value}}</div>'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#inner-value').text(), '1', 'initial render of inner');
  equal(view.$('#middle-value').text(), '1', 'initial render of middle');

  (0, _emberMetalRun_loop2['default'])(function () {
    return outer.set('value', 2);
  });

  equal(view.$('#inner-value').text(), '2', 'second render of inner');
  equal(view.$('#middle-value').text(), '2', 'second render of middle');

  (0, _emberMetalRun_loop2['default'])(function () {
    return outer.set('value', 3);
  });

  equal(view.$('#inner-value').text(), '3', 'third render of inner');
  equal(view.$('#middle-value').text(), '3', 'third render of middle');
});

QUnit.test('components in template of a yielding component should have the proper parentView', function () {
  var outer, innerTemplate, innerLayout;

  registry.register('component:x-outer', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      outer = this;
    }
  }));

  registry.register('component:x-inner-in-template', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      innerTemplate = this;
    }
  }));

  registry.register('component:x-inner-in-layout', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      innerLayout = this;
    }
  }));

  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-inner-in-layout}}{{yield}}'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-outer}}{{x-inner-in-template}}{{/x-outer}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(innerTemplate.parentView, outer, 'receives the wrapping component as its parentView in template blocks');
  equal(innerLayout.parentView, outer, 'receives the wrapping component as its parentView in layout');
  equal(outer.parentView, view, 'x-outer receives the ambient scope as its parentView');
});

QUnit.test('newly-added sub-components get correct parentView', function () {
  var outer, inner;

  registry.register('component:x-outer', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      outer = this;
    }
  }));

  registry.register('component:x-inner', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      inner = this;
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-outer}}{{#if view.showInner}}{{x-inner}}{{/if}}{{/x-outer}}'),
    container: container,
    showInner: false
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('showInner', true);
  });

  equal(inner.parentView, outer, 'receives the wrapping component as its parentView in template blocks');
  equal(outer.parentView, view, 'x-outer receives the ambient scope as its parentView');
});

QUnit.test('components should receive the viewRegistry from the parent view', function () {
  var outer, innerTemplate, innerLayout;

  var viewRegistry = {};

  registry.register('component:x-outer', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      outer = this;
    }
  }));

  registry.register('component:x-inner-in-template', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      innerTemplate = this;
    }
  }));

  registry.register('component:x-inner-in-layout', _emberViewsViewsComponent2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      innerLayout = this;
    }
  }));

  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-inner-in-layout}}{{yield}}'));

  view = _emberViewsViewsView2['default'].extend({
    _viewRegistry: viewRegistry,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-outer}}{{x-inner-in-template}}{{/x-outer}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(innerTemplate._viewRegistry, viewRegistry);
  equal(innerLayout._viewRegistry, viewRegistry);
  equal(outer._viewRegistry, viewRegistry);
});

QUnit.test('comopnent should rerender when a property (with a default) is changed during children\'s rendering', function () {
  expectDeprecation(/modified value twice in a single render/);

  var outer, middle;

  registry.register('component:x-outer', _emberViewsViewsComponent2['default'].extend({
    value: 1,
    grabReference: _emberMetalCore2['default'].on('init', function () {
      outer = this;
    })
  }));

  registry.register('component:x-middle', _emberViewsViewsComponent2['default'].extend({
    value: null,
    grabReference: _emberMetalCore2['default'].on('init', function () {
      middle = this;
    })
  }));

  registry.register('component:x-inner', _emberViewsViewsComponent2['default'].extend({
    value: null,
    pushDataUp: _emberMetalCore2['default'].observer('value', function () {
      middle.set('value', this.get('value'));
    })
  }));

  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-middle}}{{x-inner value=value}}{{/x-middle}}'));
  registry.register('template:components/x-middle', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="middle-value">{{value}}</div>{{yield}}'));
  registry.register('template:components/x-inner', (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="inner-value">{{value}}</div>'));

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer}}'),
    container: container
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#inner-value').text(), '1', 'initial render of inner');
  equal(view.$('#middle-value').text(), '', 'initial render of middle (observers do not run during init)');

  (0, _emberMetalRun_loop2['default'])(function () {
    return outer.set('value', 2);
  });

  equal(view.$('#inner-value').text(), '2', 'second render of inner');
  equal(view.$('#middle-value').text(), '2', 'second render of middle');

  (0, _emberMetalRun_loop2['default'])(function () {
    return outer.set('value', 3);
  });

  equal(view.$('#inner-value').text(), '3', 'third render of inner');
  equal(view.$('#middle-value').text(), '3', 'third render of middle');
});

QUnit.test('non-block with each rendering child components', function () {
  expect(2);

  registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout. {{#each attrs.items as |item|}}[{{child-non-block item=item}}]{{/each}}'));
  registry.register('template:components/child-non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('Child: {{attrs.item}}.'));

  var items = _emberMetalCore2['default'].A(['Tom', 'Dick', 'Harry']);

  view = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{non-block items=view.items}}'),
    container: container,
    items: items
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout. [Child: Tom.][Child: Dick.][Child: Harry.]');

  (0, _emberMetalRun_loop2['default'])(function () {
    items.pushObject('James');
  });

  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout. [Child: Tom.][Child: Dick.][Child: Harry.][Child: James.]');
});

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-component-generation')) {

  QUnit.module('component - invocation (angle brackets)', {
    setup: function setup() {
      commonSetup();
    },

    teardown: function teardown() {
      commonTeardown();
    }
  });

  QUnit.test('non-block without properties', function () {
    registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout'));

    view = appendViewFor('<non-block />');

    equal(view.$().text(), 'In layout');
    ok(view.$('non-block.ember-view').length === 1, 'The non-block tag name was used');
  });

  QUnit.test('block without properties', function () {
    registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - {{yield}}'));

    view = appendViewFor('<with-block>In template</with-block>');

    equal(view.$('with-block.ember-view').text(), 'In layout - In template', 'Both the layout and template are rendered');
  });

  QUnit.test('non-block with properties on attrs', function () {
    registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout'));

    view = appendViewFor('<non-block static-prop="static text" concat-prop="{{view.dynamic}} text" dynamic-prop={{view.dynamic}} />', {
      dynamic: 'dynamic'
    });

    var el = view.$('non-block.ember-view');
    ok(el, 'precond - the view was rendered');
    equal(el.attr('static-prop'), 'static text');
    equal(el.attr('concat-prop'), 'dynamic text');
    equal(el.attr('dynamic-prop'), undefined);

    //equal(jQuery('#qunit-fixture').text(), 'In layout - someProp: something here');
  });

  QUnit.test('attributes are not installed on the top level', function () {
    var component = undefined;

    registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - {{attrs.text}}'));
    registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend({
      text: null,
      dynamic: null,

      didInitAttrs: function didInitAttrs() {
        component = this;
      }
    }));

    view = appendViewFor('<non-block text="texting" dynamic={{view.dynamic}} />', {
      dynamic: 'dynamic'
    });

    var el = view.$('non-block.ember-view');
    ok(el, 'precond - the view was rendered');

    equal(el.text(), 'In layout - texting');
    equal(component.attrs.text, 'texting');
    equal(component.attrs.dynamic, 'dynamic');
    strictEqual((0, _emberMetalProperty_get.get)(component, 'text'), null);
    strictEqual((0, _emberMetalProperty_get.get)(component, 'dynamic'), null);

    (0, _emberMetalRun_loop2['default'])(function () {
      return view.rerender();
    });

    equal(el.text(), 'In layout - texting');
    equal(component.attrs.text, 'texting');
    equal(component.attrs.dynamic, 'dynamic');
    strictEqual((0, _emberMetalProperty_get.get)(component, 'text'), null);
    strictEqual((0, _emberMetalProperty_get.get)(component, 'dynamic'), null);
  });

  QUnit.test('non-block with properties on attrs and component class', function () {
    registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend());
    registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}}'));

    view = appendViewFor('<non-block someProp="something here" />');

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here');
  });

  QUnit.test('rerendering component with attrs from parent', function () {
    var _willUpdate2 = 0;
    var _didReceiveAttrs2 = 0;

    registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend({
      didReceiveAttrs: function didReceiveAttrs() {
        _didReceiveAttrs2++;
      },

      willUpdate: function willUpdate() {
        _willUpdate2++;
      }
    }));

    registry.register('template:components/non-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}}'));

    view = appendViewFor('<non-block someProp={{view.someProp}} />', {
      someProp: 'wycats'
    });

    equal(_didReceiveAttrs2, 1, 'The didReceiveAttrs hook fired');

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: wycats');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('someProp', 'tomdale');
    });

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: tomdale');
    equal(_didReceiveAttrs2, 2, 'The didReceiveAttrs hook fired again');
    equal(_willUpdate2, 1, 'The willUpdate hook fired once');

    _emberMetalCore2['default'].run(view, 'rerender');

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: tomdale');
    equal(_didReceiveAttrs2, 3, 'The didReceiveAttrs hook fired again');
    equal(_willUpdate2, 2, 'The willUpdate hook fired again');
  });

  QUnit.test('block with properties on attrs', function () {
    registry.register('template:components/with-block', (0, _emberTemplateCompilerSystemCompile2['default'])('In layout - someProp: {{attrs.someProp}} - {{yield}}'));

    view = appendViewFor('<with-block someProp="something here">In template</with-block>');

    equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture').text(), 'In layout - someProp: something here - In template');
  });

  QUnit.test('moduleName is available on _renderNode when a layout is present', function () {
    expect(1);

    var layoutModuleName = 'my-app-name/templates/components/sample-component';
    var sampleComponentLayout = (0, _emberTemplateCompilerSystemCompile2['default'])('Sample Component - {{yield}}', {
      moduleName: layoutModuleName
    });
    registry.register('template:components/sample-component', sampleComponentLayout);
    registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
      didInsertElement: function didInsertElement() {
        equal(this._renderNode.lastResult.template.meta.moduleName, layoutModuleName);
      }
    }));

    view = _emberViewsViewsView2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<sample-component />'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  QUnit.test('moduleName is available on _renderNode when no layout is present', function () {
    expect(1);

    var templateModuleName = 'my-app-name/templates/application';
    registry.register('component:sample-component', _emberViewsViewsComponent2['default'].extend({
      didInsertElement: function didInsertElement() {
        equal(this._renderNode.lastResult.template.meta.moduleName, templateModuleName);
      }
    }));

    view = _emberViewsViewsView2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#sample-component}}Derp{{/sample-component}}', {
        moduleName: templateModuleName
      }),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  QUnit.test('parameterized hasBlock default', function () {
    registry.register('template:components/check-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if (hasBlock)}}Yes{{else}}No{{/if}}'));

    view = appendViewFor('<check-block id="expect-yes-1" />  <check-block id="expect-yes-2"></check-block>');

    equal(view.$('#expect-yes-1').text(), 'Yes');
    equal(view.$('#expect-yes-2').text(), 'Yes');
  });

  QUnit.test('non-expression hasBlock ', function () {
    registry.register('template:components/check-block', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlock}}Yes{{else}}No{{/if}}'));

    view = appendViewFor('<check-block id="expect-yes-1" />  <check-block id="expect-yes-2"></check-block>');

    equal(view.$('#expect-yes-1').text(), 'Yes');
    equal(view.$('#expect-yes-2').text(), 'Yes');
  });

  QUnit.test('parameterized hasBlockParams', function () {
    registry.register('template:components/check-params', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if (hasBlockParams)}}Yes{{else}}No{{/if}}'));

    view = appendViewFor('<check-params id="expect-no"/>  <check-params id="expect-yes" as |foo|></check-params>');

    equal(view.$('#expect-no').text(), 'No');
    equal(view.$('#expect-yes').text(), 'Yes');
  });

  QUnit.test('non-expression hasBlockParams', function () {
    registry.register('template:components/check-params', (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if hasBlockParams}}Yes{{else}}No{{/if}}'));

    view = appendViewFor('<check-params id="expect-no" />  <check-params id="expect-yes" as |foo|></check-params>');

    equal(view.$('#expect-no').text(), 'No');
    equal(view.$('#expect-yes').text(), 'Yes');
  });

  QUnit.test('implementing `render` allows pushing into a string buffer', function () {
    expect(1);

    registry.register('component:non-block', _emberViewsViewsComponent2['default'].extend({
      render: function render(buffer) {
        buffer.push('<span id="zomg">Whoop!</span>');
      }
    }));

    expectAssertion(function () {
      appendViewFor('<non-block />');
    });
  });
}