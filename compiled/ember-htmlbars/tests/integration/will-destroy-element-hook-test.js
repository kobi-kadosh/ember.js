'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalProperty_set = require('ember-metal/property_set');

var component;

QUnit.module('ember-htmlbars: destroy-element-hook tests', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(component);
  }
});

QUnit.test('willDestroyElement is only called once when a component leaves scope', function (assert) {
  var innerChild, innerChildDestroyed;

  component = _emberViewsViewsComponent2['default'].create({
    'switch': true,

    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n     {{~#if switch~}}\n       {{~#view innerChild}}Truthy{{/view~}}\n     {{~/if~}}\n    '),

    innerChild: _emberViewsViewsComponent2['default'].extend({
      init: function init() {
        this._super.apply(this, arguments);
        innerChild = this;
      },

      willDestroyElement: function willDestroyElement() {
        if (innerChildDestroyed) {
          throw new Error('willDestroyElement has already been called!!');
        } else {
          innerChildDestroyed = true;
        }
      }
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(component);

  assert.equal(component.$().text(), 'Truthy', 'precond - truthy template is displayed');
  assert.equal(component.get('childViews.length'), 1);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(component, 'switch', false);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    assert.equal(innerChild.get('isDestroyed'), true, 'the innerChild has been destroyed');
    assert.equal(component.$().text(), '', 'truthy template is removed');
  });
});