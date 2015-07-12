'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;

function appendView(view) {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });
}

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  QUnit.module('ember-htmlbars: value attribute', {
    teardown: function teardown() {
      if (view) {
        (0, _emberMetalRun_loop2['default'])(view, view.destroy);
      }
    }
  });

  QUnit.test('property is output', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { name: 'rick' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input value={{name}}>')
    });
    appendView(view);

    equal(view.element.firstChild.tagName, 'INPUT', 'input element is created');
    equal(view.element.firstChild.value, 'rick', 'property is set true');
  });

  QUnit.test('string property is output', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { name: 'rick' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input value=\'{{name}}\'>')
    });
    appendView(view);

    equal(view.element.firstChild.tagName, 'INPUT', 'input element is created');
    equal(view.element.firstChild.value, 'rick', 'property is set true');
  });

  QUnit.test('blank property is output', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { name: '' },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input value={{name}}>')
    });
    appendView(view);

    equal(view.element.firstChild.tagName, 'INPUT', 'input element is created');
    equal(view.element.firstChild.value, '', 'property is set true');
  });
}
// jscs:enable validateIndentation