'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view, registry, container;

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-get-helper')) {

  QUnit.module('ember-htmlbars: {{get}} helper', {
    setup: function setup() {
      registry = new _emberRuntimeSystemContainer.Registry();
      container = registry.container();
      registry.optionsForType('template', { instantiate: false });
    },
    teardown: function teardown() {
      (0, _emberMetalRun_loop2['default'])(function () {
        _emberMetalCore2['default'].TEMPLATES = {};
      });
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
      (0, _emberRuntimeTestsUtils.runDestroy)(container);
      registry = container = view = null;
    }
  });

  QUnit.test('should be able to get an object value with a static key', function () {
    var context = {
      colors: { apple: 'red', banana: 'yellow' }
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get colors \'apple\'}}] [{{if true (get colors \'apple\')}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[red] [red]', 'should return \'red\' for {{get colors \'apple\'}}');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.colors', { apple: 'green', banana: 'purple' });
    });

    equal(view.$().text(), '[green] [green]', 'should return \'green\' for {{get colors \'apple\'}}');
  });

  QUnit.test('should be able to get an object value with a bound/dynamic key', function () {
    var context = {
      colors: { apple: 'red', banana: 'yellow' },
      key: 'apple'
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get colors key}}] [{{if true (get colors key)}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[red] [red]', 'should return \'red\' for {{get colors key}}  (key = \'apple\')');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'banana');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'red\' for {{get colors key}} (key = \'banana\')');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.colors', { apple: 'green', banana: 'purple' });
    });

    equal(view.$().text(), '[purple] [purple]', 'should return \'purple\' for {{get colors key}} (key = \'banana\')');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'apple');
    });

    equal(view.$().text(), '[green] [green]', 'should return \'green\' for {{get colors key}} (key = \'apple\')');
  });

  QUnit.test('should be able to get an object value with a GetStream key', function () {
    var context = {
      colors: { apple: 'red', banana: 'yellow' },
      key: 'key1',
      possibleKeys: { key1: 'apple', key2: 'banana' }
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get colors (get possibleKeys key)}}] [{{if true (get colors (get possibleKeys key))}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[red] [red]', 'should return \'red\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'key2');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'red\' for {{get colors key}} (key = \'banana\')');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.colors', { apple: 'green', banana: 'purple' });
    });

    equal(view.$().text(), '[purple] [purple]', 'should return \'purple\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'key1');
    });

    equal(view.$().text(), '[green] [green]', 'should return \'green\'');
  });

  QUnit.test('should be able to get an object value with a GetStream value and bound/dynamic key', function () {
    var context = {
      possibleValues: {
        colors1: { apple: 'red', banana: 'yellow' },
        colors2: { apple: 'green', banana: 'purple' }
      },
      objectKey: 'colors1',
      key: 'apple'
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get (get possibleValues objectKey) key}}] [{{if true (get (get possibleValues objectKey) key)}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[red] [red]', 'should return \'red\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors2');
    });

    equal(view.$().text(), '[green] [green]', 'should return \'green\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors1');
    });

    equal(view.$().text(), '[red] [red]', 'should return \'red\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'banana');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'yellow\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors2');
    });

    equal(view.$().text(), '[purple] [purple]', 'should return \'purple\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors1');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'yellow\'');
  });

  QUnit.test('should be able to get an object value with a GetStream value and GetStream key', function () {
    var context = {
      possibleValues: {
        colors1: { apple: 'red', banana: 'yellow' },
        colors2: { apple: 'green', banana: 'purple' }
      },
      objectKey: 'colors1',
      possibleKeys: {
        key1: 'apple',
        key2: 'banana'
      },
      key: 'key1'
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get (get possibleValues objectKey) (get possibleKeys key)}}] [{{if true (get (get possibleValues objectKey) (get possibleKeys key))}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[red] [red]', 'should return \'red\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors2');
    });

    equal(view.$().text(), '[green] [green]', 'should return \'green\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors1');
    });

    equal(view.$().text(), '[red] [red]', 'should return \'red\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'key2');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'yellow\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors2');
    });

    equal(view.$().text(), '[purple] [purple]', 'should return \'purple\'');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.objectKey', 'colors1');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'yellow\'');
  });

  QUnit.test('should handle object values as nulls', function () {
    var context = {
      colors: null
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get colors \'apple\'}}] [{{if true (get colors \'apple\')}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[] []', 'should return \'\' for {{get colors \'apple\'}} (colors = null)');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.colors', { apple: 'green', banana: 'purple' });
    });

    equal(view.$().text(), '[green] [green]', 'should return \'green\' for {{get colors \'apple\'}} (colors = { apple: \'green\', banana: \'purple\' })');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.colors', null);
    });

    equal(view.$().text(), '[] []', 'should return \'\' for {{get colors \'apple\'}} (colors = null)');
  });

  QUnit.test('should handle object keys as nulls', function () {
    var context = {
      colors: { apple: 'red', banana: 'yellow' },
      key: null
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get colors key}}] [{{if true (get colors key)}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[] []', 'should return \'\' for {{get colors key}}  (key = null)');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', 'banana');
    });

    equal(view.$().text(), '[yellow] [yellow]', 'should return \'yellow\' for {{get colors key}} (key = \'banana\')');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('context.key', null);
    });

    equal(view.$().text(), '[] []', 'should return \'\' for {{get colors key}}  (key = null)');
  });

  QUnit.test('should handle object values and keys as nulls', function () {
    var context = {
      colors: null,
      key: null
    };

    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('[{{get colors key}}] [{{if true (get colors key)}}]')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), '[] []', 'should return \'\' for {{get colors key}}  (colors=null, key = null)');
  });
}
// jscs:enable validateIndentation