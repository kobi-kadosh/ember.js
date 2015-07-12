'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

QUnit.module('Ember.View additions to run queue');

QUnit.test('View hierarchy is done rendering to DOM when functions queued in afterRender execute', function () {
  var didInsert = 0;
  var childView = _emberViewsViewsView2['default'].create({
    elementId: 'child_view',
    didInsertElement: function didInsertElement() {
      didInsert++;
    }
  });
  var parentView = _emberViewsViewsView2['default'].create({
    elementId: 'parent_view',
    template: (0, _emberTemplateCompiler.compile)('{{view view.childView}}'),
    childView: childView,
    didInsertElement: function didInsertElement() {
      didInsert++;
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.appendTo('#qunit-fixture');
    _emberMetalRun_loop2['default'].schedule('afterRender', this, function () {
      equal(didInsert, 2, 'all didInsertElement hooks fired for hierarchy');
    });
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    parentView.destroy();
  });
});