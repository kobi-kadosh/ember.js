'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var originalLookup = _emberMetalCore2['default'].lookup;

var view, lookup, registry, container, TemplateTests;

QUnit.module('ember-htmlbars: {{#if}} and {{#unless}} helpers', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
    lookup.TemplateTests = TemplateTests = _emberRuntimeSystemNamespace2['default'].create();
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;

    _emberMetalCore2['default'].lookup = lookup = originalLookup;
    TemplateTests = null;
  }
});

QUnit.test('unless should keep the current context (#784) [DEPRECATED]', function () {
  view = _emberViewsViewsView2['default'].create({
    o: _emberRuntimeSystemObject2['default'].create({ foo: '42' }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.o}}{{#view}}{{#unless view.doesNotExist}}foo: {{foo}}{{/unless}}{{/view}}{{/with}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  equal(view.$().text(), 'foo: 42');
});

QUnit.test('The `if` helper tests for `isTruthy` if available', function () {
  view = _emberViewsViewsView2['default'].create({
    truthy: _emberRuntimeSystemObject2['default'].create({ isTruthy: true }),
    falsy: _emberRuntimeSystemObject2['default'].create({ isTruthy: false }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.truthy}}Yep{{/if}}{{#if view.falsy}}Nope{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Yep');
});

QUnit.test('The `if` helper does not error on undefined', function () {
  view = _emberViewsViewsView2['default'].create({
    undefinedValue: undefined,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.undefinedValue}}Yep{{/if}}{{#unbound if view.undefinedValue}}Yep{{/unbound}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');
});

QUnit.test('The `unless` helper does not error on undefined', function () {
  view = _emberViewsViewsView2['default'].create({
    undefinedValue: undefined,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#unless view.undefinedValue}}YepBound{{/unless}}{{#unbound unless view.undefinedValue}}YepUnbound{{/unbound}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'YepBoundYepUnbound');
});

QUnit.test('The `if` helper does not print the contents for an object proxy without content', function () {
  view = _emberViewsViewsView2['default'].create({
    truthy: _emberRuntimeSystemObject_proxy2['default'].create({ content: {} }),
    falsy: _emberRuntimeSystemObject_proxy2['default'].create({ content: null }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.truthy}}Yep{{/if}}{{#if view.falsy}}Nope{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Yep');
});

QUnit.test('The `if` helper updates if an object proxy gains or loses context', function () {
  view = _emberViewsViewsView2['default'].create({
    proxy: _emberRuntimeSystemObject_proxy2['default'].create({ content: null }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.proxy}}Yep{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('proxy.content', {});
  });

  equal(view.$().text(), 'Yep');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('proxy.content', null);
  });

  equal(view.$().text(), '');
});

function testIfArray(array) {
  view = _emberViewsViewsView2['default'].create({
    array: array,

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.array}}Yep{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('array').pushObject(1);
  });

  equal(view.$().text(), 'Yep');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('array').removeObject(1);
  });

  equal(view.$().text(), '');
}

QUnit.test('The `if` helper updates if an array is empty or not', function () {
  testIfArray(_emberMetalCore2['default'].A());
});

QUnit.test('The `if` helper updates if an array-like object is empty or not', function () {
  testIfArray(_emberRuntimeSystemArray_proxy2['default'].create({ content: _emberMetalCore2['default'].A([]) }));
});

QUnit.test('The `unless` helper updates if an array-like object is empty or not', function () {
  view = _emberViewsViewsView2['default'].create({
    array: _emberRuntimeSystemArray_proxy2['default'].create({ content: _emberMetalCore2['default'].A([]) }),

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#unless view.array}}Yep{{/unless}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Yep');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('array').pushObject(1);
  });

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('array').removeObject(1);
  });

  equal(view.$().text(), 'Yep');
});

QUnit.test('The `if` helper updates when the value changes', function () {
  view = _emberViewsViewsView2['default'].create({
    conditional: true,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.conditional}}Yep{{/if}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Yep');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('conditional', false);
  });
  equal(view.$().text(), '');
});

QUnit.test('The `unbound if` helper does not update when the value changes', function () {
  view = _emberViewsViewsView2['default'].create({
    conditional: true,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#unbound if view.conditional}}Yep{{/unbound}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Yep');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('conditional', false);
  });
  equal(view.$().text(), 'Yep');
});

QUnit.test('The `unless` helper updates when the value changes', function () {
  view = _emberViewsViewsView2['default'].create({
    conditional: false,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#unless view.conditional}}Nope{{/unless}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Nope');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('conditional', true);
  });
  equal(view.$().text(), '');
});

QUnit.test('The `unbound if` helper does not update when the value changes', function () {
  view = _emberViewsViewsView2['default'].create({
    conditional: false,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#unbound unless view.conditional}}Nope{{/unbound}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Nope');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('conditional', true);
  });
  equal(view.$().text(), 'Nope');
});

QUnit.test('The `unbound if` helper should work when its inverse is not present', function () {
  view = _emberViewsViewsView2['default'].create({
    conditional: false,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#unbound if view.conditional}}Yep{{/unbound}}')
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), '');
});

QUnit.test('should not rerender if truthiness does not change', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<h1 id="first">{{#if view.shouldDisplay}}{{view view.InnerViewClass}}{{/if}}</h1>'),

    shouldDisplay: true,

    InnerViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('bam')
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#first').text(), 'bam', 'renders block when condition is true');
  equal(view.$('#first div').text(), 'bam', 'inserts a div into the DOM');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'shouldDisplay', 1);
  });

  equal(view.$('#first').text(), 'bam', 'renders block when condition is true');
});

QUnit.test('should update the block when object passed to #unless helper changes', function () {
  registry.register('template:advice', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#unless view.onDrugs}}{{view.doWellInSchool}}{{/unless}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'advice',

    onDrugs: true,
    doWellInSchool: 'Eat your vegetables'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1').text(), '', 'hides block if true');

  var tests = [false, null, undefined, [], '', 0];

  tests.forEach(function (val) {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'onDrugs', val);
    });

    equal(view.$('h1').text(), 'Eat your vegetables', (0, _emberRuntimeSystemString.fmt)('renders block when conditional is "%@"; %@', [String(val), (0, _emberRuntimeUtils.typeOf)(val)]));
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'onDrugs', true);
    });

    equal(view.$('h1').text(), '', 'precond - hides block when conditional is true');
  });
});

QUnit.test('properties within an if statement should not fail on re-render', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.value}}{{view.value}}{{/if}}'),
    value: null
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 'test');
  });

  equal(view.$().text(), 'test');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', null);
  });

  equal(view.$().text(), '');
});

QUnit.test('should update the block when object passed to #if helper changes', function () {
  registry.register('template:menu', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#if view.inception}}{{view.INCEPTION}}{{/if}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'menu',

    INCEPTION: 'BOOOOOOOONG doodoodoodoodooodoodoodoo',
    inception: 'OOOOoooooOOOOOOooooooo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1').text(), 'BOOOOOOOONG doodoodoodoodooodoodoodoo', 'renders block if a string');

  var tests = [false, null, undefined, [], '', 0];

  tests.forEach(function (val) {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', val);
    });

    equal(view.$('h1').text(), '', (0, _emberRuntimeSystemString.fmt)('hides block when conditional is "%@"', [String(val)]));

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', true);
    });

    equal(view.$('h1').text(), 'BOOOOOOOONG doodoodoodoodooodoodoodoo', 'precond - renders block when conditional is true');
  });
});

QUnit.test('should update the block when object passed to #if helper changes and an inverse is supplied', function () {
  registry.register('template:menu', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#if view.inception}}{{view.INCEPTION}}{{else}}{{view.SAD}}{{/if}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'menu',

    INCEPTION: 'BOOOOOOOONG doodoodoodoodooodoodoodoo',
    inception: false,
    SAD: 'BOONG?'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1').text(), 'BOONG?', 'renders alternate if false');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'inception', true);
  });

  var tests = [false, null, undefined, [], '', 0];

  tests.forEach(function (val) {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', val);
    });

    equal(view.$('h1').text(), 'BOONG?', (0, _emberRuntimeSystemString.fmt)('renders alternate if %@', [String(val)]));

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', true);
    });

    equal(view.$('h1').text(), 'BOOOOOOOONG doodoodoodoodooodoodoodoo', 'precond - renders block when conditional is true');
  });
});

QUnit.test('views within an if statement should be sane on re-render', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.display}}{{view view.MyView}}{{/if}}'),
    MyView: _emberViewsViewsView2['default'].extend({
      tagName: 'input'
    }),
    display: false
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('input').length, 0);

  (0, _emberMetalRun_loop2['default'])(function () {
    // Setting twice will trigger the observer twice, this is intentional
    view.set('display', true);
    view.set('display', 'yes');
  });

  var textfield = view.$('input');
  equal(textfield.length, 1);

  // Make sure the view is still registered in View.views
  ok(_emberViewsViewsView2['default'].views[textfield.attr('id')]);
});

QUnit.test('the {{this}} helper should not fail on removal', function () {
  view = _emberViewsViewsView2['default'].create({
    context: 'abc',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.show}}{{this}}{{/if}}'),
    show: true
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'abc', 'should start property - precond');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('show', false);
  });

  equal(view.$().text(), '');
});

QUnit.test('should update the block when object passed to #unless helper changes', function () {
  registry.register('template:advice', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#unless view.onDrugs}}{{view.doWellInSchool}}{{/unless}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'advice',

    onDrugs: true,
    doWellInSchool: 'Eat your vegetables'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1').text(), '', 'hides block if true');

  var tests = [false, null, undefined, [], '', 0];

  tests.forEach(function (val) {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'onDrugs', val);
    });

    equal(view.$('h1').text(), 'Eat your vegetables', (0, _emberRuntimeSystemString.fmt)('renders block when conditional is "%@"; %@', [String(val), (0, _emberRuntimeUtils.typeOf)(val)]));

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'onDrugs', true);
    });

    equal(view.$('h1').text(), '', 'precond - hides block when conditional is true');
  });
});

QUnit.test('properties within an if statement should not fail on re-render', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.value}}{{view.value}}{{/if}}'),
    value: null
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 'test');
  });

  equal(view.$().text(), 'test');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', null);
  });

  equal(view.$().text(), '');
});

QUnit.test('should update the block when object passed to #if helper changes', function () {
  registry.register('template:menu', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#if view.inception}}{{view.INCEPTION}}{{/if}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'menu',

    INCEPTION: 'BOOOOOOOONG doodoodoodoodooodoodoodoo',
    inception: 'OOOOoooooOOOOOOooooooo'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1').text(), 'BOOOOOOOONG doodoodoodoodooodoodoodoo', 'renders block if a string');

  var tests = [false, null, undefined, [], '', 0];

  tests.forEach(function (val) {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', val);
    });

    equal(view.$('h1').text(), '', (0, _emberRuntimeSystemString.fmt)('hides block when conditional is "%@"', [String(val)]));

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', true);
    });

    equal(view.$('h1').text(), 'BOOOOOOOONG doodoodoodoodooodoodoodoo', 'precond - renders block when conditional is true');
  });
});

QUnit.test('should update the block when object passed to #if helper changes and an inverse is supplied', function () {
  registry.register('template:menu', (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>{{#if view.inception}}{{view.INCEPTION}}{{else}}{{view.SAD}}{{/if}}</h1>'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    templateName: 'menu',

    INCEPTION: 'BOOOOOOOONG doodoodoodoodooodoodoodoo',
    inception: false,
    SAD: 'BOONG?'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('h1').text(), 'BOONG?', 'renders alternate if false');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'inception', true);
  });

  var tests = [false, null, undefined, [], '', 0];

  tests.forEach(function (val) {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', val);
    });

    equal(view.$('h1').text(), 'BOONG?', (0, _emberRuntimeSystemString.fmt)('renders alternate if %@', [String(val)]));

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'inception', true);
    });

    equal(view.$('h1').text(), 'BOOOOOOOONG doodoodoodoodooodoodoodoo', 'precond - renders block when conditional is true');
  });
});

QUnit.test('the {{this}} helper should not fail on removal', function () {
  view = _emberViewsViewsView2['default'].create({
    context: 'abc',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.show}}{{this}}{{/if}}'),
    show: true
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'abc', 'should start property - precond');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('show', false);
  });

  equal(view.$().text(), '');
});

QUnit.test('edge case: child conditional should not render children if parent conditional becomes false', function () {
  var childCreated = false;
  var child = null;

  view = _emberViewsViewsView2['default'].create({
    cond1: true,
    cond2: false,
    viewClass: _emberViewsViewsView2['default'].extend({
      init: function init() {
        this._super.apply(this, arguments);
        childCreated = true;
        child = this;
      }
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.cond1}}{{#if view.cond2}}{{#view view.viewClass}}test{{/view}}{{/if}}{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(!childCreated, 'precondition');

  (0, _emberMetalRun_loop2['default'])(function () {
    // The order of these sets is important for the test
    view.set('cond2', true);
    view.set('cond1', false);
  });

  // TODO: Priority Queue, for now ensure correct result.
  ok(!childCreated, 'child should not be created');
  //ok(child.isDestroyed, 'child should be gone');
  equal(view.$().text(), '');
});

QUnit.test('edge case: rerender appearance of inner virtual view', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: '',
    cond2: false,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.cond2}}test{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(_emberMetalCore2['default'].$('#qunit-fixture').text(), '');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('cond2', true);
  });

  equal(_emberMetalCore2['default'].$('#qunit-fixture').text(), 'test');
});

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-inline-if-helper')) {
  QUnit.test('`if` helper with inline form: renders the second argument when conditional is truthy', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'truthy');
  });

  QUnit.test('`if` helper with inline form: renders the third argument when conditional is falsy', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: false,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'falsy');
  });

  QUnit.test('`if` helper with inline form: can omit the falsy argument', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'truthy');
  });

  QUnit.test('`if` helper with inline form: can omit the falsy argument and renders nothing when conditional is falsy', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: false,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '');
  });

  QUnit.test('`if` helper with inline form: truthy and falsy arguments are changed if conditional changes', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'truthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', false);
    });

    equal(view.$().text(), 'falsy');
  });

  QUnit.test('`if` helper with inline form: can use truthy param as binding', function () {
    view = _emberViewsViewsView2['default'].create({
      truthy: 'ok',
      conditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional view.truthy}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'ok');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('truthy', 'yes');
    });

    equal(view.$().text(), 'yes');
  });

  QUnit.test('`if` helper with inline form: can use falsy param as binding', function () {
    view = _emberViewsViewsView2['default'].create({
      truthy: 'ok',
      falsy: 'boom',
      conditional: false,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional view.truthy view.falsy}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'boom');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('falsy', 'no');
    });

    equal(view.$().text(), 'no');
  });

  QUnit.test('`if` helper with inline form: raises when using more than three arguments', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if one two three four}}')
    });

    expectAssertion(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, /The inline form of the `if` and `unless` helpers expect two or three arguments/);
  });

  QUnit.test('`if` helper with inline form: raises when using less than two arguments', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if one}}')
    });

    expectAssertion(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, /The inline form of the `if` and `unless` helpers expect two or three arguments/);
  });

  QUnit.test('`if` helper with inline form: works when used in a sub expression', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      innerConditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional (if view.innerConditional "truthy" )}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'truthy');
  });

  QUnit.test('`if` helper with inline form: updates if condition changes in a sub expression', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      innerConditional: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional (if view.innerConditional "innerTruthy" "innerFalsy")}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'innerTruthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('innerConditional', false);
    });

    equal(view.$().text(), 'innerFalsy');
  });

  QUnit.test('`if` helper with inline form: can use truthy param as binding in a sub expression', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: true,
      innerConditional: true,
      innerTruthy: 'innerTruthy',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional (if view.innerConditional view.innerTruthy)}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'innerTruthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('innerTruthy', 'innerOk');
    });

    equal(view.$().text(), 'innerOk');
  });

  QUnit.test('`if` helper with inline form: respects isTruthy when object changes', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: _emberMetalCore2['default'].Object.create({ isTruthy: false }),
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'falsy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', _emberMetalCore2['default'].Object.create({ isTruthy: true }));
    });

    equal(view.$().text(), 'truthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', _emberMetalCore2['default'].Object.create({ isTruthy: false }));
    });

    equal(view.$().text(), 'falsy');
  });

  QUnit.test('`if` helper with inline form: respects isTruthy when property changes', function () {
    var candidate = _emberMetalCore2['default'].Object.create({ isTruthy: false });

    view = _emberViewsViewsView2['default'].create({
      conditional: candidate,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'falsy');

    (0, _emberMetalRun_loop2['default'])(function () {
      candidate.set('isTruthy', true);
    });

    equal(view.$().text(), 'truthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      candidate.set('isTruthy', false);
    });

    equal(view.$().text(), 'falsy');
  });

  QUnit.test('`if` helper with inline form: respects length test when list content changes', function () {
    var list = _emberMetalCore2['default'].A();

    view = _emberViewsViewsView2['default'].create({
      conditional: list,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'falsy');

    (0, _emberMetalRun_loop2['default'])(function () {
      list.pushObject(1);
    });

    equal(view.$().text(), 'truthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      list.replace(0, 1);
    });

    equal(view.$().text(), 'falsy');
  });

  QUnit.test('`if` helper with inline form: respects length test when list itself', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: [],
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "truthy" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'falsy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', [1]);
    });

    equal(view.$().text(), 'truthy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', []);
    });

    equal(view.$().text(), 'falsy');
  });

  QUnit.test('`if` helper with inline form: updates when given a falsey second argument', function () {
    view = _emberViewsViewsView2['default'].create({
      conditional: false,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{if view.conditional "" "falsy"}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'falsy');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', true);
    });

    equal(view.$().text(), '');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('conditional', false);
    });

    equal(view.$().text(), 'falsy');
  });
}