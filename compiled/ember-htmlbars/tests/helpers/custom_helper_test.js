'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberHtmlbarsHelper2 = _interopRequireDefault(_emberHtmlbarsHelper);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var registry = undefined,
    container = undefined,
    component = undefined;

QUnit.module('ember-htmlbars: custom app helpers', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    registry.optionsForType('template', { instantiate: false });
    registry.optionsForType('helper', { singleton: false });
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    registry = container = component = null;
  }
});

QUnit.test('dashed shorthand helper is resolved from container', function () {
  var HelloWorld = (0, _emberHtmlbarsHelper.helper)(function () {
    return 'hello world';
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  equal(component.$().text(), 'hello world');
});

QUnit.test('dashed helper is resolved from container', function () {
  var HelloWorld = _emberHtmlbarsHelper2['default'].extend({
    compute: function compute() {
      return 'hello world';
    }
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  equal(component.$().text(), 'hello world');
});

QUnit.test('dashed helper can recompute a new value', function () {
  var destroyCount = 0;
  var count = 0;
  var helper;
  var HelloWorld = _emberHtmlbarsHelper2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      helper = this;
    },
    compute: function compute() {
      return ++count;
    },
    destroy: function destroy() {
      destroyCount++;
      this._super();
    }
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  equal(component.$().text(), '1');
  (0, _emberMetalRun_loop2['default'])(function () {
    helper.recompute();
  });
  equal(component.$().text(), '2');
  equal(destroyCount, 0, 'destroy is not called on recomputation');
});

QUnit.test('dashed helper with arg can recompute a new value', function () {
  var destroyCount = 0;
  var count = 0;
  var helper;
  var HelloWorld = _emberHtmlbarsHelper2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      helper = this;
    },
    compute: function compute() {
      return ++count;
    },
    destroy: function destroy() {
      destroyCount++;
      this._super();
    }
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world "whut"}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  equal(component.$().text(), '1');
  (0, _emberMetalRun_loop2['default'])(function () {
    helper.recompute();
  });
  equal(component.$().text(), '2');
  equal(destroyCount, 0, 'destroy is not called on recomputation');
});

QUnit.test('dashed shorthand helper is called for param changes', function () {
  var count = 0;
  var HelloWorld = (0, _emberHtmlbarsHelper.helper)(function () {
    return ++count;
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    name: 'bob',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world name}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  equal(component.$().text(), '1');
  (0, _emberMetalRun_loop2['default'])(function () {
    component.set('name', 'sal');
  });
  equal(component.$().text(), '2');
});

QUnit.test('dashed helper compute is called for param changes', function () {
  var count = 0;
  var createCount = 0;
  var HelloWorld = _emberHtmlbarsHelper2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      // FIXME: Ideally, the helper instance does not need to be recreated
      // for change of params.
      createCount++;
    },
    compute: function compute() {
      return ++count;
    }
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    name: 'bob',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world name}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  equal(component.$().text(), '1');
  (0, _emberMetalRun_loop2['default'])(function () {
    component.set('name', 'sal');
  });
  equal(component.$().text(), '2');
  equal(createCount, 1, 'helper is only created once');
});

QUnit.test('dashed shorthand helper receives params, hash', function () {
  var params, hash;
  var HelloWorld = (0, _emberHtmlbarsHelper.helper)(function (_params, _hash) {
    params = _params;
    hash = _hash;
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    name: 'bob',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world name "rich" last="sam"}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(params[0], 'bob', 'first argument is bob');
  equal(params[1], 'rich', 'second argument is rich');
  equal(hash.last, 'sam', 'hash.last argument is sam');
});

QUnit.test('dashed helper receives params, hash', function () {
  var params, hash;
  var HelloWorld = _emberHtmlbarsHelper2['default'].extend({
    compute: function compute(_params, _hash) {
      params = _params;
      hash = _hash;
    }
  });
  registry.register('helper:hello-world', HelloWorld);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    name: 'bob',
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{hello-world name "rich" last="sam"}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(params[0], 'bob', 'first argument is bob');
  equal(params[1], 'rich', 'second argument is rich');
  equal(hash.last, 'sam', 'hash.last argument is sam');
});

QUnit.test('dashed helper usable in subexpressions', function () {
  var JoinWords = _emberHtmlbarsHelper2['default'].extend({
    compute: function compute(params) {
      return params.join(' ');
    }
  });
  registry.register('helper:join-words', JoinWords);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{join-words "Who"\n                   (join-words "overcomes" "by")\n                   "force"\n                   (join-words (join-words "hath overcome but" "half"))\n                   (join-words "his" (join-words "foe"))}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$().text(), 'Who overcomes by force hath overcome but half his foe');
});

QUnit.test('dashed helper not usable with a block', function () {
  var SomeHelper = (0, _emberHtmlbarsHelper.helper)(function () {});
  registry.register('helper:some-helper', SomeHelper);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#some-helper}}{{/some-helper}}')
  }).create();

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(component);
  }, /Helpers may not be used in the block form/);
});

QUnit.test('dashed helper is torn down', function () {
  var destroyCalled = 0;
  var SomeHelper = _emberHtmlbarsHelper2['default'].extend({
    destroy: function destroy() {
      destroyCalled++;
      this._super.apply(this, arguments);
    },
    compute: function compute() {
      return 'must define a compute';
    }
  });
  registry.register('helper:some-helper', SomeHelper);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{some-helper}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  (0, _emberRuntimeTestsUtils.runDestroy)(component);

  equal(destroyCalled, 1, 'destroy called once');
});

QUnit.test('dashed helper used in subexpression can recompute', function () {
  var helper;
  var phrase = 'overcomes by';
  var DynamicSegment = _emberHtmlbarsHelper2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      helper = this;
    },
    compute: function compute() {
      return phrase;
    }
  });
  var JoinWords = _emberHtmlbarsHelper2['default'].extend({
    compute: function compute(params) {
      return params.join(' ');
    }
  });
  registry.register('helper:dynamic-segment', DynamicSegment);
  registry.register('helper:join-words', JoinWords);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{join-words "Who"\n                   (dynamic-segment)\n                   "force"\n                   (join-words (join-words "hath overcome but" "half"))\n                   (join-words "his" (join-words "foe"))}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$().text(), 'Who overcomes by force hath overcome but half his foe');

  phrase = 'believes his';
  _emberMetalCore2['default'].run(function () {
    helper.recompute();
  });

  equal(component.$().text(), 'Who believes his force hath overcome but half his foe');
});

QUnit.test('dashed helper used in subexpression can recompute component', function () {
  var helper;
  var phrase = 'overcomes by';
  var DynamicSegment = _emberHtmlbarsHelper2['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      helper = this;
    },
    compute: function compute() {
      return phrase;
    }
  });
  var JoinWords = _emberHtmlbarsHelper2['default'].extend({
    compute: function compute(params) {
      return params.join(' ');
    }
  });
  registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  registry.register('component:some-component', _emberMetalCore2['default'].Component.extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{first}} {{second}} {{third}} {{fourth}} {{fifth}}')
  }));
  registry.register('helper:dynamic-segment', DynamicSegment);
  registry.register('helper:join-words', JoinWords);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{some-component first="Who"\n                   second=(dynamic-segment)\n                   third="force"\n                   fourth=(join-words (join-words "hath overcome but" "half"))\n                   fifth=(join-words "his" (join-words "foe"))}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$().text(), 'Who overcomes by force hath overcome but half his foe');

  phrase = 'believes his';
  _emberMetalCore2['default'].run(function () {
    helper.recompute();
  });

  equal(component.$().text(), 'Who believes his force hath overcome but half his foe');
});

QUnit.test('dashed helper used in subexpression is destroyed', function () {
  var destroyCount = 0;
  var DynamicSegment = _emberHtmlbarsHelper2['default'].extend({
    phrase: 'overcomes by',
    compute: function compute() {
      return this.phrase;
    },
    destroy: function destroy() {
      destroyCount++;
      this._super.apply(this, arguments);
    }
  });
  var JoinWords = (0, _emberHtmlbarsHelper.helper)(function (params) {
    return params.join(' ');
  });
  registry.register('helper:dynamic-segment', DynamicSegment);
  registry.register('helper:join-words', JoinWords);
  component = _emberViewsViewsComponent2['default'].extend({
    container: container,
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{join-words "Who"\n                   (dynamic-segment)\n                   "force"\n                   (join-words (join-words "hath overcome but" "half"))\n                   (join-words "his" (join-words "foe"))}}')
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(component);
  (0, _emberRuntimeTestsUtils.runDestroy)(component);

  equal(destroyCount, 1, 'destroy is called after a view is destroyed');
});