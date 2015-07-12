'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

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

function canSetFalsyMaxLength() {
  var input = document.createElement('input');
  input.maxLength = 0;

  return input.maxLength === 0;
}

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  QUnit.module('ember-htmlbars: property', {
    teardown: function teardown() {
      if (view) {
        (0, _emberMetalRun_loop2['default'])(view, view.destroy);
      }
    }
  });

  QUnit.test('maxlength sets the property and attribute', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { length: 5 },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input maxlength={{length}}>')
    });

    appendView(view);
    equal(view.element.firstChild.maxLength, 5);

    _emberMetalCore2['default'].run(view, view.set, 'context.length', 1);
    equal(view.element.firstChild.maxLength, 1);
  });

  QUnit.test('quoted maxlength sets the attribute and is reflected as a property', function () {
    view = _emberViewsViewsView2['default'].create({
      context: { length: 5 },
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input maxlength=\'{{length}}\'>')
    });

    appendView(view);
    equal(view.element.firstChild.maxLength, '5');

    if (canSetFalsyMaxLength()) {
      _emberMetalCore2['default'].run(view, view.set, 'context.length', null);
      equal(view.element.firstChild.maxLength, document.createElement('input').maxLength);
    } else {
      _emberMetalCore2['default'].run(view, view.set, 'context.length', 1);
      equal(view.element.firstChild.maxLength, 1);
    }
  });

  QUnit.test('array value can be set as property', function () {
    view = _emberViewsViewsView2['default'].create({
      context: {},
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<input value={{items}}>')
    });

    appendView(view);

    _emberMetalCore2['default'].run(view, view.set, 'context.items', [4, 5]);
    ok(true, 'no legacy assertion prohibited setting an array');
  });
}
// jscs:enable validateIndentation