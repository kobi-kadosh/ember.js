'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var component, registry, container;

QUnit.module('ember-htmlbars: {{concat}} helper', {
  setup: function setup() {
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('helper', { instantiate: false });
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
  }
});

QUnit.test('concats provided params', function () {
  component = _emberViewsViewsComponent2['default'].create({
    container: container,

    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{concat "foo" " " "bar" " " "baz"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$().text(), 'foo bar baz');
});

QUnit.test('updates for bound params', function () {
  component = _emberViewsViewsComponent2['default'].create({
    container: container,

    firstParam: 'one',
    secondParam: 'two',

    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{concat firstParam secondParam}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$().text(), 'onetwo');

  (0, _emberMetalRun_loop2['default'])(function () {
    component.set('firstParam', 'three');
  });

  equal(component.$().text(), 'threetwo');

  (0, _emberMetalRun_loop2['default'])(function () {
    component.set('secondParam', 'four');
  });

  equal(component.$().text(), 'threefour');
});

QUnit.test('can be used as a sub-expression', function () {
  function eq(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var actual = _ref2[0];
    var expected = _ref2[1];

    return actual === expected;
  }
  eq.isHTMLBars = true;
  registry.register('helper:x-eq', eq);

  component = _emberViewsViewsComponent2['default'].create({
    container: container,

    firstParam: 'one',
    secondParam: 'two',

    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if (x-eq (concat firstParam secondParam) "onetwo")}}Truthy!{{else}}False{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  equal(component.$().text(), 'Truthy!');

  (0, _emberMetalRun_loop2['default'])(function () {
    component.set('firstParam', 'three');
  });

  equal(component.$().text(), 'False');
});