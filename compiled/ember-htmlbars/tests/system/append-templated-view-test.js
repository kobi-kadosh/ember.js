'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;
QUnit.module('ember-htmlbars: appendTemplatedView', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('can accept a view instance', function () {
  var controller = {
    someProp: 'controller context',
    someView: _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}}')
    })
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}} - {{view someView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller context - controller context');
});

QUnit.test('can accept a view factory', function () {
  var controller = {
    someProp: 'controller context',
    someView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}}')
    })
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}} - {{view someView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller context - controller context');
});

QUnit.test('does change the context if the view factory has a controller specified', function () {
  var controller = {
    someProp: 'controller context',
    someView: _emberViewsViewsView2['default'].extend({
      controller: {
        someProp: 'view local controller context'
      },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}}')
    })
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}} - {{view someView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller context - view local controller context');
});

QUnit.test('does change the context if a component factory is used', function () {
  var controller = {
    someProp: 'controller context',
    someView: _emberViewsViewsComponent2['default'].extend({
      someProp: 'view local controller context',
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}}')
    })
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}} - {{view someView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller context - view local controller context');
});

QUnit.test('does change the context if a component instance is used', function () {
  var controller = {
    someProp: 'controller context',
    someView: _emberViewsViewsComponent2['default'].create({
      someProp: 'view local controller context',
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}}')
    })
  };

  view = _emberViewsViewsView2['default'].create({
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{someProp}} - {{view someView}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller context - view local controller context');
});