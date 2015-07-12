'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalProperty_set = require('ember-metal/property_set');

var view;

QUnit.module('ember-htmlbars: custom morph integration tests', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('can properly re-render an if/else with attribute morphs', function () {
  view = _emberViewsViewsView2['default'].create({
    trueClass: 'truthy',
    falseClass: 'falsey',
    'switch': true,

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.switch}}<div class={{view.trueClass}}>Truthy</div>{{else}}<div class={{view.falseClass}}>Falsey</div>{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('.truthy').length, 1, 'template block rendered properly');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'switch', false);
  });

  equal(view.$('.falsey').length, 1, 'inverse block rendered properly');
});

QUnit.test('can properly re-render an if/else with element morphs', function () {
  view = _emberViewsViewsView2['default'].create({
    trueClass: 'truthy',
    falseClass: 'falsey',
    'switch': true,

    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.switch}}<div class="truthy" {{action view.trueClass}}>Truthy</div>{{else}}<div class="falsey" {{action view.falseClass}}>Falsey</div>{{/if}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('.truthy').length, 1, 'template block rendered properly');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'switch', false);
  });

  equal(view.$('.falsey').length, 1, 'inverse block rendered properly');
});