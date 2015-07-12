'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var registry, container, component;

QUnit.module('component - invocation', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.optionsForType('helper', { instantiate: false });
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
    registry = container = component = null;
  }
});

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-dashless-helpers')) {
  QUnit.test('non-dashed helpers are found', function () {
    expect(1);

    registry.register('helper:fullname', (0, _emberHtmlbarsHelper.helper)(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var first = _ref2[0];
      var last = _ref2[1];

      return first + ' ' + last;
    }));

    component = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{fullname "Robert" "Jackson"}}'),
      container: container
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(component);

    equal(component.$().text(), 'Robert Jackson');
  });
}