'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

QUnit.module('Ember.View - controller property');

QUnit.test('controller property should be inherited from nearest ancestor with controller', function () {
  var grandparent = _emberViewsViewsContainer_view2['default'].create();
  var parent = _emberViewsViewsContainer_view2['default'].create();
  var child = _emberViewsViewsContainer_view2['default'].create();
  var grandchild = _emberViewsViewsContainer_view2['default'].create();

  var grandparentController = {};
  var parentController = {};

  (0, _emberMetalRun_loop2['default'])(function () {
    grandparent.set('controller', grandparentController);
    parent.set('controller', parentController);

    grandparent.pushObject(parent);
    parent.pushObject(child);
  });

  strictEqual(grandparent.get('controller'), grandparentController);
  strictEqual(parent.get('controller'), parentController);
  strictEqual(child.get('controller'), parentController);
  strictEqual(grandchild.get('controller'), null);

  (0, _emberMetalRun_loop2['default'])(function () {
    child.pushObject(grandchild);
  });

  strictEqual(grandchild.get('controller'), parentController);

  var newController = {};
  (0, _emberMetalRun_loop2['default'])(function () {
    parent.set('controller', newController);
  });

  strictEqual(parent.get('controller'), newController);
  strictEqual(child.get('controller'), newController);
  strictEqual(grandchild.get('controller'), newController);

  (0, _emberMetalRun_loop2['default'])(function () {
    grandparent.destroy();
    parent.destroy();
    child.destroy();
    grandchild.destroy();
  });
});