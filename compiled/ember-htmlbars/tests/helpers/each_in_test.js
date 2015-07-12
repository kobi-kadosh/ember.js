'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var component;

QUnit.module('ember-htmlbars: {{#each-in}} helper', {
  teardown: function teardown() {
    if (component) {
      (0, _emberRuntimeTestsUtils.runDestroy)(component);
    }
  }
});

function renderTemplate(_template, props) {
  var template = (0, _emberTemplateCompilerSystemCompile2['default'])(_template);

  component = _emberViewsViewsComponent2['default'].create(props, {
    layout: template
  });

  (0, _emberRuntimeTestsUtils.runAppend)(component);
}

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-each-in')) {
  QUnit.test('it renders the template for each item in a hash', function (assert) {
    var categories = {
      'Smartphones': 8203,
      'JavaScript Frameworks': Infinity
    };

    renderTemplate('\n      <ul class="categories">\n      {{#each-in categories as |category count|}}\n        <li>{{category}}: {{count}}</li>\n      {{/each-in}}\n      </ul>\n    ', { categories: categories });

    assert.equal(component.$('li').length, 2, 'renders 2 lis');
    assert.equal(component.$('li').first().text(), 'Smartphones: 8203', 'renders first item correctly');
    assert.equal(component.$('li:eq(1)').text(), 'JavaScript Frameworks: Infinity', 'renders second item correctly');

    (0, _emberMetalRun_loop2['default'])(function () {
      component.rerender();
    });

    assert.equal(component.$('li').length, 2, 'renders 2 lis after rerender');
    assert.equal(component.$('li').first().text(), 'Smartphones: 8203', 'renders first item correctly after rerender');
    assert.equal(component.$('li:eq(1)').text(), 'JavaScript Frameworks: Infinity', 'renders second item correctly after rerender');

    (0, _emberMetalRun_loop2['default'])(function () {
      component.set('categories', {
        'Smartphones': 100
      });
    });

    assert.equal(component.$('li').length, 1, 'removes unused item after data changes');
    assert.equal(component.$('li').first().text(), 'Smartphones: 100', 'correctly updates item after data changes');

    (0, _emberMetalRun_loop2['default'])(function () {
      component.set('categories', {
        'Programming Languages': 199303,
        'Good Programming Languages': 123,
        'Bad Programming Languages': 456
      });
    });

    assert.equal(component.$('li').length, 3, 'renders 3 lis after updating data');
    assert.equal(component.$('li').first().text(), 'Programming Languages: 199303', 'renders first item correctly after rerender');
    assert.equal(component.$('li:eq(1)').text(), 'Good Programming Languages: 123', 'renders second item correctly after rerender');
    assert.equal(component.$('li:eq(2)').text(), 'Bad Programming Languages: 456', 'renders third item correctly after rerender');
  });

  QUnit.test('it only iterates over an object\'s own properties', function (assert) {
    var protoCategories = {
      'Smartphones': 8203,
      'JavaScript Frameworks': Infinity
    };

    var categories = Object.create(protoCategories);
    categories['Televisions'] = 183;
    categories['Alarm Clocks'] = 999;

    renderTemplate('\n      <ul class="categories">\n      {{#each-in categories as |category count|}}\n        <li>{{category}}: {{count}}</li>\n      {{/each-in}}\n      </ul>\n    ', { categories: categories });

    assert.equal(component.$('li').length, 2, 'renders 2 lis');
    assert.equal(component.$('li').first().text(), 'Televisions: 183', 'renders first item correctly');
    assert.equal(component.$('li:eq(1)').text(), 'Alarm Clocks: 999', 'renders second item correctly');

    (0, _emberMetalRun_loop2['default'])(function () {
      return component.rerender();
    });

    assert.equal(component.$('li').length, 2, 'renders 2 lis after rerender');
    assert.equal(component.$('li').first().text(), 'Televisions: 183', 'renders first item correctly after rerender');
    assert.equal(component.$('li:eq(1)').text(), 'Alarm Clocks: 999', 'renders second item correctly after rerender');
  });

  QUnit.test('it emits nothing if the passed argument is not an object', function (assert) {
    var categories = null;

    renderTemplate('\n      <ul class="categories">\n      {{#each-in categories as |category count|}}\n        <li>{{category}}: {{count}}</li>\n      {{/each-in}}\n      </ul>\n    ', { categories: categories });

    assert.equal(component.$('li').length, 0, 'nothing is rendered if the object is not passed');

    (0, _emberMetalRun_loop2['default'])(function () {
      return component.rerender();
    });
    assert.equal(component.$('li').length, 0, 'nothing is rendered if the object is not passed after rerender');
  });

  QUnit.test('it supports rendering an inverse', function (assert) {
    var categories = null;

    renderTemplate('\n      <ul class="categories">\n      {{#each-in categories as |category count|}}\n        <li>{{category}}: {{count}}</li>\n      {{else}}\n        <li>No categories.</li>\n      {{/each-in}}\n      </ul>\n    ', { categories: categories });

    assert.equal(component.$('li').length, 1, 'one li is rendered');
    assert.equal(component.$('li').text(), 'No categories.', 'the inverse is rendered');

    (0, _emberMetalRun_loop2['default'])(function () {
      return component.rerender();
    });
    assert.equal(component.$('li').length, 1, 'one li is rendered');
    assert.equal(component.$('li').text(), 'No categories.', 'the inverse is rendered');

    (0, _emberMetalRun_loop2['default'])(function () {
      component.set('categories', {
        'First Category': 123
      });
    });

    assert.equal(component.$('li').length, 1, 'one li is rendered');
    assert.equal(component.$('li').text(), 'First Category: 123', 'the list is rendered after being set');

    (0, _emberMetalRun_loop2['default'])(function () {
      component.set('categories', null);
    });

    assert.equal(component.$('li').length, 1, 'one li is rendered');
    assert.equal(component.$('li').text(), 'No categories.', 'the inverse is rendered when the value becomes falsey again');
  });
}