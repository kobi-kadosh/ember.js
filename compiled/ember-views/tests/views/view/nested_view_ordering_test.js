'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var registry, container, view;

QUnit.module('EmberView - Nested View Ordering', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
      container.destroy();
    });
    registry = container = view = null;
  }
});

QUnit.test('should call didInsertElement on child views before parent', function () {
  var insertedLast;

  view = _emberViewsViewsView2['default'].create({
    didInsertElement: function didInsertElement() {
      insertedLast = 'outer';
    },
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view "inner"}}')
  });

  registry.register('view:inner', _emberViewsViewsView2['default'].extend({
    didInsertElement: function didInsertElement() {
      insertedLast = 'inner';
    }
  }));

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(insertedLast, 'outer', 'didInsertElement called on outer view after inner view');
});