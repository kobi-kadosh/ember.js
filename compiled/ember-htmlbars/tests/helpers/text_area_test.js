'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberViewsViewsText_area = require('ember-views/views/text_area');

var _emberViewsViewsText_area2 = _interopRequireDefault(_emberViewsViewsText_area);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var textArea, controller;

function set(object, key, value) {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(object, key, value);
  });
}

QUnit.module('{{textarea}}', {
  setup: function setup() {
    controller = {
      val: 'Lorem ipsum dolor'
    };

    var registry = new _containerRegistry2['default']();
    registry.register('component:-text-area', _emberViewsViewsText_area2['default']);
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);

    textArea = _emberViewsViewsView2['default'].extend({
      container: registry.container(),
      controller: controller,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{textarea disabled=disabled value=val}}')
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(textArea);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(textArea);
  }
});

QUnit.test('Should insert a textarea', function () {
  equal(textArea.$('textarea').length, 1, 'There is a single textarea');
});

QUnit.test('Should become disabled when the controller changes', function () {
  ok(textArea.$('textarea').is(':not(:disabled)'), 'Nothing is disabled yet');
  set(controller, 'disabled', true);
  ok(textArea.$('textarea').is(':disabled'), 'The disabled attribute is updated');
});

QUnit.test('Should bind its contents to the specified value', function () {
  equal(textArea.$('textarea').val(), 'Lorem ipsum dolor', 'The contents are included');
  set(controller, 'val', 'sit amet');
  equal(textArea.$('textarea').val(), 'sit amet', 'The new contents are included');
});