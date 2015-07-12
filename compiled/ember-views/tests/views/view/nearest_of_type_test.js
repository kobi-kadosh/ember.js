'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var parentView, view;

QUnit.module('View#nearest*', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      if (parentView) {
        parentView.destroy();
      }
      if (view) {
        view.destroy();
      }
    });
  }
});

(function () {
  var Mixin = _emberMetalMixin.Mixin.create({});
  var Parent = _emberViewsViewsView2['default'].extend(Mixin, {
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view}}')
  });

  QUnit.test('nearestOfType should find the closest view by view class', function () {
    var child;

    (0, _emberMetalRun_loop2['default'])(function () {
      parentView = Parent.create();
      parentView.appendTo('#qunit-fixture');
    });

    child = parentView.get('childViews')[0];
    equal(child.nearestOfType(Parent), parentView, 'finds closest view in the hierarchy by class');
  });

  QUnit.test('nearestOfType should find the closest view by mixin', function () {
    var child;

    (0, _emberMetalRun_loop2['default'])(function () {
      parentView = Parent.create();
      parentView.appendTo('#qunit-fixture');
    });

    child = parentView.get('childViews')[0];
    equal(child.nearestOfType(Mixin), parentView, 'finds closest view in the hierarchy by class');
  });

  QUnit.test('nearestWithProperty should search immediate parent', function () {
    var childView;

    view = _emberViewsViewsView2['default'].create({
      myProp: true,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view}}')
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      view.appendTo('#qunit-fixture');
    });

    childView = view.get('childViews')[0];
    equal(childView.nearestWithProperty('myProp'), view);
  });

  QUnit.test('nearestChildOf should be deprecated', function () {
    var child;

    (0, _emberMetalRun_loop2['default'])(function () {
      parentView = Parent.create();
      parentView.appendTo('#qunit-fixture');
    });

    child = parentView.get('childViews')[0];
    expectDeprecation(function () {
      child.nearestChildOf(Parent);
    }, 'nearestChildOf has been deprecated.');
  });
})();