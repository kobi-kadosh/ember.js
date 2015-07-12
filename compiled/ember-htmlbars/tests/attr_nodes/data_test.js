'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberMetalViewsRenderer = require('ember-metal-views/renderer');

var _emberMetalViewsRenderer2 = _interopRequireDefault(_emberMetalViewsRenderer);

var _htmlbarsTestHelpers = require('htmlbars-test-helpers');

var _emberHtmlbarsEnv = require('ember-htmlbars/env');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var view, originalSetAttribute, setAttributeCalls, renderer;

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  QUnit.module('ember-htmlbars: data attribute', {
    teardown: function teardown() {
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
    }
  });

  QUnit.test('property is output', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { name: 'erik' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'attribute is output');
  });

  QUnit.test('property set before didInsertElement', function () {
    var matchingElement;
    view = _emberViewsViewsView2['default'].create({
      didInsertElement: function didInsertElement() {
        matchingElement = this.$('div[data-name=erik]');
      },
      context: { name: 'erik' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'attribute is output');
    equal(matchingElement.length, 1, 'element is in the DOM when didInsertElement');
  });

  QUnit.test('quoted attributes are concatenated', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { firstName: 'max', lastName: 'jackson' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name=\'{{firstName}} {{lastName}}\'>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="max jackson">Hi!</div>', 'attribute is output');
  });

  QUnit.test('quoted attributes are updated when changed', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { firstName: 'max', lastName: 'jackson' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name=\'{{firstName}} {{lastName}}\'>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="max jackson">Hi!</div>', 'precond - attribute is output');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.firstName', 'james');

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="james jackson">Hi!</div>', 'attribute is output');
  });

  QUnit.test('quoted attributes are not removed when value is null', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { firstName: 'max', lastName: 'jackson' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name=\'{{firstName}}\'>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.element.firstChild.getAttribute('data-name'), 'max', 'precond - attribute is output');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.firstName', null);

    equal(view.element.firstChild.getAttribute('data-name'), '', 'attribute is output');
  });

  QUnit.test('unquoted attributes are removed when value is null', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { firstName: 'max' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{firstName}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.element.firstChild.getAttribute('data-name'), 'max', 'precond - attribute is output');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.firstName', null);

    ok(!view.element.firstChild.hasAttribute('data-name'), 'attribute is removed output');
  });

  QUnit.test('unquoted attributes that are null are not added', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { firstName: null },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{firstName}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div>Hi!</div>', 'attribute is not present');
  });

  QUnit.test('unquoted attributes are added when changing from null', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { firstName: null },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{firstName}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div>Hi!</div>', 'precond - attribute is not present');

    (0, _emberMetalRun_loop2['default'])(view, view.set, 'context.firstName', 'max');

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="max">Hi!</div>', 'attribute is added output');
  });

  QUnit.test('property value is directly added to attribute', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { name: '"" data-foo="blah"' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.element.firstChild.getAttribute('data-name'), '"" data-foo="blah"', 'attribute is output');
  });

  QUnit.test('path is output', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { name: { firstName: 'erik' } },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name.firstName}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'attribute is output');
  });

  QUnit.test('changed property updates', function () {
    var context = _emberRuntimeSystemObject2['default'].create({ name: 'erik' });
    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'precond - attribute is output');

    (0, _emberMetalRun_loop2['default'])(context, context.set, 'name', 'mmun');

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="mmun">Hi!</div>', 'attribute is updated output');
  });

  QUnit.test('updates are scheduled in the render queue', function () {
    expect(4);

    var context = _emberRuntimeSystemObject2['default'].create({ name: 'erik' });
    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'precond - attribute is output');

    (0, _emberMetalRun_loop2['default'])(function () {
      _emberMetalRun_loop2['default'].schedule('render', function () {
        (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'precond - attribute is not updated sync');
      });

      context.set('name', 'mmun');

      _emberMetalRun_loop2['default'].schedule('render', function () {
        (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="mmun">Hi!</div>', 'attribute is updated output');
      });
    });

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="mmun">Hi!</div>', 'attribute is updated output');
  });

  QUnit.test('updates fail silently after an element is destroyed', function () {
    var context = _emberRuntimeSystemObject2['default'].create({ name: 'erik' });
    view = _emberViewsViewsView2['default'].create({
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _htmlbarsTestHelpers.equalInnerHTML)(view.element, '<div data-name="erik">Hi!</div>', 'precond - attribute is output');

    (0, _emberMetalRun_loop2['default'])(function () {
      context.set('name', 'mmun');
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
    });
  });

  QUnit.module('ember-htmlbars: {{attribute}} helper -- setAttribute', {
    setup: function setup() {
      renderer = new _emberMetalViewsRenderer2['default'](_emberHtmlbarsEnv.domHelper);

      originalSetAttribute = _emberHtmlbarsEnv.domHelper.setAttribute;
      _emberHtmlbarsEnv.domHelper.setAttribute = function (element, name, value) {
        if (name.substr(0, 5) === 'data-') {
          setAttributeCalls.push([name, value]);
        }

        originalSetAttribute.call(_emberHtmlbarsEnv.domHelper, element, name, value);
      };

      setAttributeCalls = [];
    },

    teardown: function teardown() {
      _emberHtmlbarsEnv.domHelper.setAttribute = originalSetAttribute;

      (0, _emberRuntimeTestsUtils.runDestroy)(view);
    }
  });

  QUnit.test('calls setAttribute for new values', function () {
    var context = _emberRuntimeSystemObject2['default'].create({ name: 'erik' });
    view = _emberViewsViewsView2['default'].create({
      renderer: renderer,
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _emberMetalRun_loop2['default'])(context, context.set, 'name', 'mmun');

    var expected = [['data-name', 'erik'], ['data-name', 'mmun']];

    deepEqual(setAttributeCalls, expected);
  });

  QUnit.test('does not call setAttribute if the same value is set', function () {
    var context = _emberRuntimeSystemObject2['default'].create({ name: 'erik' });
    view = _emberViewsViewsView2['default'].create({
      renderer: renderer,
      context: context,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-name={{name}}>Hi!</div>')
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    (0, _emberMetalRun_loop2['default'])(function () {
      context.set('name', 'mmun');
      context.set('name', 'erik');
    });

    var expected = [['data-name', 'erik']];

    deepEqual(setAttributeCalls, expected);
  });
}