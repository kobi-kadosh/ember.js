'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;

QUnit.module('ember-htmlbars: element hook', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    delete _emberHtmlbarsHelpers2['default'].test;
  }
});

QUnit.test('allows unbound usage within an element', function () {
  expect(4);

  function someHelper(params, hash, options, env) {
    equal(params[0], 'blammo');
    equal(params[1], 'blazzico');

    return 'class=\'foo\'';
  }

  (0, _emberHtmlbarsHelpers.registerHelper)('test', someHelper);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      value: 'foo'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{test "blammo" "blazzico"}}>Bar</div>')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo').length, 1, 'class attribute was added by helper');
});

QUnit.test('allows unbound usage within an element from property', function () {
  expect(2);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      someProp: 'class="foo"'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{someProp}}>Bar</div>')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo').length, 1, 'class attribute was added by helper');
});

QUnit.test('allows unbound usage within an element creating multiple attributes', function () {
  expect(2);

  view = _emberViewsViewsView2['default'].create({
    controller: {
      someProp: 'class="foo" data-foo="bar"'
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{someProp}}>Bar</div>')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo[data-foo="bar"]').length, 1, 'attributes added by helper');
});