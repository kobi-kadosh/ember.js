'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberHtmlbarsSystemMake_bound_helper = require('ember-htmlbars/system/make_bound_helper');

var _emberHtmlbarsSystemMake_bound_helper2 = _interopRequireDefault(_emberHtmlbarsSystemMake_bound_helper);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var view, registry, container;

function registerRepeatHelper() {
  registry.register('helper:x-repeat', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash, options, env) {
    var times = hash.times || 1;
    return new Array(times + 1).join(params[0]);
  }));
}

QUnit.module('ember-htmlbars: makeBoundHelper', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = view = null;
  }
});

QUnit.test('should update bound helpers in a subexpression when properties change', function () {
  registry.register('helper:x-dasherize', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash, options, env) {
    return (0, _emberRuntimeSystemString.dasherize)(params[0]);
  }));

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      container: container,
      controller: { prop: 'isThing' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{bind-attr data-foo=(x-dasherize prop)}}>{{prop}}</div>')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div[data-foo="is-thing"]').text(), 'isThing', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.prop', 'notThing');

  equal(view.$('div[data-foo="not-thing"]').text(), 'notThing', 'helper output is correct');
});

QUnit.test('should update bound helpers when properties change', function () {
  registry.register('helper:x-capitalize', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash, options, env) {
    return params[0].toUpperCase();
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: { name: 'Brogrammer' },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-capitalize name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'BROGRAMMER', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.name', 'wes');

  equal(view.$().text(), 'WES', 'helper output updated');
});

QUnit.test('should update bound helpers when hash properties change', function () {
  registerRepeatHelper();

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      phrase: 'Yo',
      repeatCount: 1
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-repeat phrase times=repeatCount}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Yo', 'initial helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.repeatCount', 5);

  equal(view.$().text(), 'YoYoYoYoYo', 'helper output updated');
});

QUnit.test('bound helpers should support keywords', function () {
  registry.register('helper:x-capitalize', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash, options, env) {
    return params[0].toUpperCase();
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    text: 'ab',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-capitalize view.text}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'AB', 'helper output is correct');
});

QUnit.test('bound helpers should process `fooBinding` style hash properties [DEPRECATED]', function () {
  registry.register('helper:x-repeat', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash, options, env) {
    equal(hash.times, 3);
  }));

  var template;

  expectDeprecation(function () {
    template = (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-repeat text timesBinding="numRepeats"}}');
  }, /You're using legacy binding syntax: timesBinding="numRepeats"/);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      text: 'ab',
      numRepeats: 3
    },
    template: template
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
});

QUnit.test('bound helpers should support multiple bound properties', function () {

  registry.register('helper:x-combine', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash, options, env) {
    return params.join('');
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      thing1: 'ZOID',
      thing2: 'BERG'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-combine thing1 thing2}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ZOIDBERG', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.thing2', 'NERD');

  equal(view.$().text(), 'ZOIDNERD', 'helper correctly re-rendered after second bound helper property changed');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.thing1', 'WOOT');
    view.set('controller.thing2', 'YEAH');
  });

  equal(view.$().text(), 'WOOTYEAH', 'helper correctly re-rendered after both bound helper properties changed');
});

QUnit.test('bound helpers can be invoked with zero args', function () {
  registry.register('helper:x-troll', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params, hash) {
    return hash.text || 'TROLOLOL';
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      trollText: 'yumad'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-troll}} and {{x-troll text="bork"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'TROLOLOL and bork', 'helper output is correct');
});

QUnit.test('bound helpers should not be invoked with blocks', function () {
  registerRepeatHelper();
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {},
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#x-repeat}}Sorry, Charlie{{/x-repeat}}')
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Helpers may not be used in the block form/);
});

QUnit.test('shouldn\'t treat raw numbers as bound paths', function () {
  registry.register('helper:x-sum', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params) {
    return params[0] + params[1];
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: { aNumber: 1 },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-sum aNumber 1}} {{x-sum 0 aNumber}} {{x-sum 5 6}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '2 1 11', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.aNumber', 5);

  equal(view.$().text(), '6 5 11', 'helper still updates as expected');
});

QUnit.test('should have correct argument types', function () {
  registry.register('helper:get-type', (0, _emberHtmlbarsSystemMake_bound_helper2['default'])(function (params) {
    var value = params[0];

    return value === null ? 'null' : typeof value;
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {},
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{get-type null}}, {{get-type undefProp}}, {{get-type "string"}}, {{get-type 1}}, {{get-type this}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'null, undefined, string, number, object', 'helper output is correct');
});