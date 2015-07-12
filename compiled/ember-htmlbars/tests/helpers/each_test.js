/*jshint newcap:false*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.lookup;

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsLegacy_each_view = require('ember-views/views/legacy_each_view');

var _emberViewsViewsLegacy_each_view2 = _interopRequireDefault(_emberViewsViewsLegacy_each_view);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsHelpersEach = require('ember-htmlbars/helpers/each');

var people, view, registry, container;
var template, templateMyView, MyView, MyEmptyView, templateMyEmptyView;

// This function lets us write {{#EACH|people|p}} {{p}} {{/each}}
// and generate:
//
// - {{#each p in people}} (legacy)
// - {{#each people as |p|}} (legacy)
function makeReplacer(useBlockParams) {
  return function (_, matchString) {
    var values = matchString.split('|');
    if (values.length === 1) {
      return 'each';
    }

    var arr = useBlockParams ? ['each', values[1], 'as', '|' + values[2] + '|'] : ['each', values[2], 'in', values[1]];

    var options = values[3];
    if (options) {
      if (useBlockParams) {
        arr.splice(2, 0, options);
      } else {
        arr.push(options);
      }
    }

    return arr.join(' ');
  };
}

var parseEachReplacerBlockParam = makeReplacer(true);
var parseEachReplacerNonBlockParam = makeReplacer(false);

var EACH_REGEX = /(EACH[^\}]*)/g;

function parseEach(str, useBlockParams) {
  return str.replace(EACH_REGEX, useBlockParams ? parseEachReplacerBlockParam : parseEachReplacerNonBlockParam);
}

QUnit.module('parseEach test helper');

QUnit.test('block param syntax substitution', function () {
  equal(parseEach('{{#EACH|people|p}}p people{{/EACH}}', true), '{{#each people as |p|}}p people{{/each}}');
  equal(parseEach('{{#EACH|people|p|a=\'b\' c=\'d\'}}p people{{/EACH}}', true), '{{#each people a=\'b\' c=\'d\' as |p|}}p people{{/each}}');
});

QUnit.test('non-block param syntax substitution', function () {
  equal(parseEach('{{#EACH|people|p}}p people{{/EACH}}', false), '{{#each p in people}}p people{{/each}}');
  equal(parseEach('{{#EACH|people|p|a=\'b\' c=\'d\'}}p people{{/EACH}}', false), '{{#each p in people a=\'b\' c=\'d\'}}p people{{/each}}');
});

function templateFor(templateString, useBlockParams) {
  var parsedTemplateString = parseEach(templateString, useBlockParams);
  var template;

  if (!useBlockParams) {
    expectDeprecation(/use the block param form/);
  }
  template = (0, _emberTemplateCompilerSystemCompile2['default'])(parsedTemplateString);

  return template;
}

var originalLookup = _emberMetalCore2['default'].lookup;
var lookup;

QUnit.module('the #each helper [DEPRECATED]', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    template = (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.people}}{{name}}{{/each}}');
    people = (0, _emberRuntimeSystemNative_array.A)([{ name: 'Steve Holt' }, { name: 'Annabelle' }]);

    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();

    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
    registry.register('view:-legacy-each', _emberViewsViewsLegacy_each_view2['default']);

    view = _emberViewsViewsView2['default'].create({
      container: container,
      template: template,
      people: people
    });

    templateMyView = (0, _emberTemplateCompilerSystemCompile2['default'])('{{name}}');
    lookup.MyView = MyView = _emberViewsViewsView2['default'].extend({
      template: templateMyView
    });
    registry.register('view:my-view', MyView);

    templateMyEmptyView = (0, _emberTemplateCompilerSystemCompile2['default'])('I\'m empty');
    lookup.MyEmptyView = MyEmptyView = _emberViewsViewsView2['default'].extend({
      template: templateMyEmptyView
    });
    registry.register('view:my-empty-view', MyEmptyView);

    expectDeprecation(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(view);
    }, _emberHtmlbarsHelpersEach.deprecation);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;

    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

var assertHTML = function assertHTML(view, expectedHTML) {
  var html = view.$().html();

  // IE 8 (and prior?) adds the \r\n
  html = html.replace(/<script[^>]*><\/script>/ig, '').replace(/[\r\n]/g, '');

  equal(html, expectedHTML);
};

var assertText = function assertText(view, expectedText) {
  equal(view.$().text(), expectedText);
};

QUnit.test('it renders the template for each item in an array', function () {
  assertHTML(view, 'Steve HoltAnnabelle');
});

QUnit.test('it updates the view if an item is added', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Tom Dale' });
  });

  assertHTML(view, 'Steve HoltAnnabelleTom Dale');
});

if (typeof Handlebars === 'object') {
  QUnit.test('should be able to use standard Handlebars #each helper', function () {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);

    view = _emberViewsViewsView2['default'].create({
      context: { items: ['a', 'b', 'c'] },
      template: Handlebars.compile('{{#each items}}{{this}}{{/each}}')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().html(), 'abc');
  });
}

QUnit.test('it allows you to access the current context using {{this}}', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.people}}{{this}}{{/each}}'),
    people: (0, _emberRuntimeSystemNative_array.A)(['Black Francis', 'Joey Santiago', 'Kim Deal', 'David Lovering'])
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertHTML(view, 'Black FrancisJoey SantiagoKim DealDavid Lovering');
});

QUnit.test('it updates the view if an item is removed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.removeAt(0);
  });

  assertHTML(view, 'Annabelle');
});

QUnit.test('it updates the view if an item is replaced', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.removeAt(0);
    people.insertAt(0, { name: 'Kazuki' });
  });

  assertHTML(view, 'KazukiAnnabelle');
});

QUnit.test('can add and replace in the same runloop', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Tom Dale' });
    people.removeAt(0);
    people.insertAt(0, { name: 'Kazuki' });
  });

  assertHTML(view, 'KazukiAnnabelleTom Dale');
});

QUnit.test('can add and replace the object before the add in the same runloop', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Tom Dale' });
    people.removeAt(1);
    people.insertAt(1, { name: 'Kazuki' });
  });

  assertHTML(view, 'Steve HoltKazukiTom Dale');
});

QUnit.test('can add and replace complicatedly', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Tom Dale' });
    people.removeAt(1);
    people.insertAt(1, { name: 'Kazuki' });
    people.pushObject({ name: 'Firestone' });
    people.pushObject({ name: 'McMunch' });
    people.removeAt(3);
  });

  assertHTML(view, 'Steve HoltKazukiTom DaleMcMunch');
});

QUnit.test('can add and replace complicatedly harder', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Tom Dale' });
    people.removeAt(1);
    people.insertAt(1, { name: 'Kazuki' });
    people.pushObject({ name: 'Firestone' });
    people.pushObject({ name: 'McMunch' });
    people.removeAt(2);
  });

  assertHTML(view, 'Steve HoltKazukiFirestoneMcMunch');
});

QUnit.test('it does not mark each option tag as selected', function () {
  var selectView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<select id="people-select"><option value="">Please select a name</option>{{#each view.people}}<option {{bind-attr value=name}}>{{name}}</option>{{/each}}</select>'),
    people: people
  });

  (0, _emberRuntimeTestsUtils.runAppend)(selectView);

  equal(selectView.$('option').length, 3, 'renders 3 <option> elements');

  equal(selectView.$().find(':selected').text(), 'Please select a name', 'first option is selected');

  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Black Francis' });
  });

  equal(selectView.$().find(':selected').text(), 'Please select a name', 'first option is selected');

  equal(selectView.$('option').length, 4, 'renders an additional <option> element when an object is added');

  (0, _emberRuntimeTestsUtils.runDestroy)(selectView);
});

QUnit.test('View should not use keyword incorrectly - Issue #1315', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.content as |value|}}{{value}}-{{#each view.options as |option|}}{{option.value}}:{{option.label}} {{/each}}{{/each}}'),

    content: (0, _emberRuntimeSystemNative_array.A)(['X', 'Y']),
    options: (0, _emberRuntimeSystemNative_array.A)([{ label: 'One', value: 1 }, { label: 'Two', value: 2 }])
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'X-1:One 2:Two Y-1:One 2:Two ');
});

QUnit.test('it works inside a ul element', function () {
  var ulView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<ul>{{#each view.people}}<li>{{name}}</li>{{/each}}</ul>'),
    people: people
  });

  (0, _emberRuntimeTestsUtils.runAppend)(ulView);

  equal(ulView.$('li').length, 2, 'renders two <li> elements');

  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Black Francis' });
  });

  equal(ulView.$('li').length, 3, 'renders an additional <li> element when an object is added');

  (0, _emberRuntimeTestsUtils.runDestroy)(ulView);
});

QUnit.test('it works inside a table element', function () {
  var tableView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<table><tbody>{{#each view.people}}<tr><td>{{name}}</td></tr>{{/each}}</tbody></table>'),
    people: people
  });

  (0, _emberRuntimeTestsUtils.runAppend)(tableView);

  equal(tableView.$('td').length, 2, 'renders two <td> elements');

  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Black Francis' });
  });

  equal(tableView.$('td').length, 3, 'renders an additional <td> element when an object is added');

  (0, _emberMetalRun_loop2['default'])(function () {
    people.insertAt(0, { name: 'Kim Deal' });
  });

  equal(tableView.$('td').length, 4, 'renders an additional <td> when an object is inserted at the beginning of the array');

  (0, _emberRuntimeTestsUtils.runDestroy)(tableView);
});

QUnit.test('it supports itemController', function () {
  var Controller = _emberRuntimeControllersController2['default'].extend({
    controllerName: (0, _emberMetalComputed.computed)(function () {
      return 'controller:' + this.get('model.name');
    })
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  var parentController = {
    container: container
  };

  registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'].extend());

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.people itemController="person"}}{{controllerName}}{{/each}}'),
    people: people,
    controller: parentController
  });

  registry.register('controller:person', Controller);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller:Steve Holtcontroller:Annabelle');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  assertText(view, 'controller:Steve Holtcontroller:Annabelle');

  (0, _emberMetalRun_loop2['default'])(function () {
    people.pushObject({ name: 'Yehuda Katz' });
  });

  assertText(view, 'controller:Steve Holtcontroller:Annabellecontroller:Yehuda Katz');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'people', (0, _emberRuntimeSystemNative_array.A)([{ name: 'Trek Glowacki' }, { name: 'Geoffrey Grosenbach' }]));
  });

  assertText(view, 'controller:Trek Glowackicontroller:Geoffrey Grosenbach');

  strictEqual(view.childViews[0].get('_arrayController.target'), parentController, 'the target property of the child controllers are set correctly');
});

QUnit.test('itemController should not affect the DOM structure', function () {
  var Controller = _emberRuntimeControllersController2['default'].extend({
    name: _emberMetalComputed.computed.alias('model.name')
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'].extend());

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="a">{{#each view.people itemController="person" as |person|}}{{person.name}}{{/each}}</div>' + '<div id="b">{{#each view.people as |person|}}{{person.name}}{{/each}}</div>'),
    people: people
  });

  registry.register('controller:person', Controller);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#a').html(), view.$('#b').html());
});

QUnit.test('itemController specified in template gets a parentController property', function () {
  // using an ObjectController for this test to verify that parentController does accidentally get set
  // on the proxied model.
  var Controller = _emberRuntimeControllersObject_controller2['default'].extend({
    controllerName: (0, _emberMetalComputed.computed)(function () {
      return 'controller:' + (0, _emberMetalProperty_get.get)(this, 'model.name') + ' of ' + (0, _emberMetalProperty_get.get)(this, 'parentController.company');
    })
  });
  var parentController = {
    container: container,
    company: 'Yapp'
  };

  registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'].extend());
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.people itemController="person"}}{{controllerName}}{{/each}}'),
    people: people,
    controller: parentController
  });

  registry.register('controller:person', Controller);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller:Steve Holt of Yappcontroller:Annabelle of Yapp');
});

QUnit.test('itemController specified in ArrayController gets a parentController property', function () {
  var PersonController = _emberRuntimeControllersObject_controller2['default'].extend({
    controllerName: (0, _emberMetalComputed.computed)(function () {
      return 'controller:' + (0, _emberMetalProperty_get.get)(this, 'model.name') + ' of ' + (0, _emberMetalProperty_get.get)(this, 'parentController.company');
    })
  });
  var PeopleController = _emberRuntimeControllersArray_controller2['default'].extend({
    model: people,
    itemController: 'person',
    company: 'Yapp'
  });

  registry.register('controller:people', PeopleController);
  registry.register('controller:person', PersonController);
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each}}{{controllerName}}{{/each}}'),
    controller: container.lookup('controller:people')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller:Steve Holt of Yappcontroller:Annabelle of Yapp');
});

QUnit.test('itemController\'s parentController property, when the ArrayController has a parentController', function () {
  var PersonController = _emberRuntimeControllersObject_controller2['default'].extend({
    controllerName: (0, _emberMetalComputed.computed)(function () {
      return 'controller:' + (0, _emberMetalProperty_get.get)(this, 'model.name') + ' of ' + (0, _emberMetalProperty_get.get)(this, 'parentController.company');
    })
  });
  var PeopleController = _emberRuntimeControllersArray_controller2['default'].extend({
    model: people,
    itemController: 'person',
    parentController: (0, _emberMetalComputed.computed)(function () {
      return this.container.lookup('controller:company');
    }),
    company: 'Yapp'
  });
  var CompanyController = _emberRuntimeControllersController2['default'].extend();

  registry.register('controller:company', CompanyController);
  registry.register('controller:people', PeopleController);
  registry.register('controller:person', PersonController);

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each}}{{controllerName}}{{/each}}'),
    controller: container.lookup('controller:people')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'controller:Steve Holt of Yappcontroller:Annabelle of Yapp');
});

QUnit.test('it supports {{itemView=}}', function () {
  var itemView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('itemView:{{name}}')
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people itemView="anItemView"}}'),
    people: people,
    container: container
  });

  registry.register('view:anItemView', itemView);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'itemView:Steve HoltitemView:Annabelle');
});

QUnit.test('it defers all normalization of itemView names to the resolver', function () {
  var itemView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('itemView:{{name}}')
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people itemView="an-item-view"}}'),
    people: people,
    container: container
  });

  registry.register('view:an-item-view', itemView);
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'itemView:Steve HoltitemView:Annabelle');
});

QUnit.test('it supports {{itemViewClass=}} with global (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people itemViewClass=MyView}}'),
    people: people,
    container: container
  });

  var deprecation = /Global lookup of MyView from a Handlebars template is deprecated/;

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, deprecation);

  assertText(view, 'Steve HoltAnnabelle');
});

QUnit.test('it supports {{itemViewClass=}} via container', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people itemViewClass="my-view"}}'),
    people: people
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'Steve HoltAnnabelle');
});

QUnit.test('it supports {{itemViewClass=}} with each view tagName (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people itemViewClass=MyView tagName="ul"}}'),
    people: people,
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$('ul').length, 1, 'rendered ul tag');
  equal(view.$('ul li').length, 2, 'rendered 2 li tags');
  equal(view.$('ul li').text(), 'Steve HoltAnnabelle');
});

QUnit.test('it supports {{itemViewClass=}} with tagName in itemViewClass (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  registry.register('view:li-view', _emberViewsViewsView2['default'].extend({
    tagName: 'li'
  }));

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<ul>{{#each view.people itemViewClass="li-view" as |item|}}{{item.name}}{{/each}}</ul>'),
    people: people,
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul').length, 1, 'rendered ul tag');
  equal(view.$('ul li').length, 2, 'rendered 2 li tags');
  equal(view.$('ul li').text(), 'Steve HoltAnnabelle');
});

QUnit.test('it supports {{itemViewClass=}} with {{else}} block (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('\n      {{~#each view.people itemViewClass="my-view" as |item|~}}\n        {{item.name}}\n      {{~else~}}\n        No records!\n      {{~/each}}'),
    people: (0, _emberRuntimeSystemNative_array.A)(),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'No records!');
});

QUnit.test('it supports non-context switching with {{itemViewClass=}} (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  registry.register('view:foo-view', _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{person.name}}')
  }));

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each person in view.people itemViewClass="foo-view"}}'),
    people: people,
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'Steve HoltAnnabelle');
});

QUnit.test('it supports {{emptyView=}}', function () {
  var emptyView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('emptyView:sad panda')
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people emptyView="anEmptyView"}}'),
    people: (0, _emberRuntimeSystemNative_array.A)(),
    container: container
  });

  registry.register('view:anEmptyView', emptyView);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'emptyView:sad panda');
});

QUnit.test('it defers all normalization of emptyView names to the resolver', function () {
  var emptyView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('emptyView:sad panda')
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people emptyView="an-empty-view"}}'),
    people: (0, _emberRuntimeSystemNative_array.A)(),
    container: container
  });

  registry.register('view:an-empty-view', emptyView);

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'emptyView:sad panda');
});

QUnit.test('it supports {{emptyViewClass=}} with global (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people emptyViewClass=MyEmptyView}}'),
    people: (0, _emberRuntimeSystemNative_array.A)(),
    container: container
  });

  var deprecation = /Global lookup of MyEmptyView from a Handlebars template is deprecated/;

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, deprecation);

  assertText(view, 'I\'m empty');
});

QUnit.test('it supports {{emptyViewClass=}} via container', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people emptyViewClass="my-empty-view"}}'),
    people: (0, _emberRuntimeSystemNative_array.A)()
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'I\'m empty');
});

QUnit.test('it supports {{emptyViewClass=}} with tagName (DEPRECATED)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each view.people emptyViewClass=MyEmptyView tagName="b"}}'),
    people: (0, _emberRuntimeSystemNative_array.A)(),
    container: container
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('b').length, 1, 'rendered b tag');
  equal(view.$('b').text(), 'I\'m empty');
});

QUnit.test('it supports {{emptyViewClass=}} with in format', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{each person in view.people emptyViewClass="my-empty-view"}}'),
    people: (0, _emberRuntimeSystemNative_array.A)()
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertText(view, 'I\'m empty');
});

QUnit.test('it uses {{else}} when replacing model with an empty array', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items}}{{this}}{{else}}Nothing{{/each}}'),
    items: (0, _emberRuntimeSystemNative_array.A)(['one', 'two'])
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertHTML(view, 'onetwo');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('items', (0, _emberRuntimeSystemNative_array.A)());
  });

  assertHTML(view, 'Nothing');
});

QUnit.test('it uses {{else}} when removing all items in an array', function () {
  var items = (0, _emberRuntimeSystemNative_array.A)(['one', 'two']);
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items}}{{this}}{{else}}Nothing{{/each}}'),
    items: items
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertHTML(view, 'onetwo');

  (0, _emberMetalRun_loop2['default'])(function () {
    items.shiftObject();
    items.shiftObject();
  });

  assertHTML(view, 'Nothing');
});

QUnit.test('it can move to and from {{else}} properly when the backing array gains and looses items (#11140)', function () {
  var items = (0, _emberRuntimeSystemNative_array.A)(['one', 'two']);
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items}}{{this}}{{else}}Nothing{{/each}}'),
    items: items
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assertHTML(view, 'onetwo');

  (0, _emberMetalRun_loop2['default'])(function () {
    items.shiftObject();
    items.shiftObject();
  });

  assertHTML(view, 'Nothing');

  (0, _emberMetalRun_loop2['default'])(function () {
    items.pushObject('three');
    items.pushObject('four');
  });

  assertHTML(view, 'threefour');

  (0, _emberMetalRun_loop2['default'])(function () {
    items.shiftObject();
    items.shiftObject();
  });

  assertHTML(view, 'Nothing');
});

QUnit.test('it works with the controller keyword', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  var controller = _emberRuntimeControllersArray_controller2['default'].create({
    model: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view}}{{#each controller}}{{this}}{{/each}}{{/view}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'foobarbaz');
});

QUnit.test('views inside #each preserve the new context [DEPRECATED]', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  var controller = (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }]);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: controller,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each controller}}{{#view}}{{name}}{{/view}}{{/each}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, _emberHtmlbarsHelpersEach.deprecation);

  equal(view.$().text(), 'AdamSteve');
});

QUnit.test('single-arg each defaults to current context [DEPRECATED]', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    context: (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }]),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each}}{{name}}{{/each}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, _emberHtmlbarsHelpersEach.deprecation);

  equal(view.$().text(), 'AdamSteve');
});

QUnit.test('single-arg each will iterate over controller if present [DEPRECATED]', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    controller: (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }]),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each}}{{name}}{{/each}}'),
    container: container
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, _emberHtmlbarsHelpersEach.deprecation);

  equal(view.$().text(), 'AdamSteve');
});

function testEachWithItem(moduleName, useBlockParams) {
  QUnit.module(moduleName, {
    setup: function setup() {
      registry = new _emberRuntimeSystemContainer.Registry();
      container = registry.container();

      registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
      registry.register('view:-legacy-each', _emberViewsViewsLegacy_each_view2['default']);
    },
    teardown: function teardown() {
      (0, _emberRuntimeTestsUtils.runDestroy)(container);
      (0, _emberRuntimeTestsUtils.runDestroy)(view);
      container = view = null;
    }
  });

  QUnit.test('#each accepts a name binding', function () {
    view = _emberViewsViewsView2['default'].create({
      template: templateFor('{{#EACH|view.items|item}}{{view.title}} {{item}}{{/each}}', useBlockParams),
      title: 'My Cool Each Test',
      items: (0, _emberRuntimeSystemNative_array.A)([1, 2])
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'My Cool Each Test 1My Cool Each Test 2');
  });

  QUnit.test('#each accepts a name binding and does not change the context', function () {
    var controller = _emberRuntimeControllersController2['default'].create({
      name: 'bob the controller'
    });
    var obj = _emberRuntimeSystemObject2['default'].create({
      name: 'henry the item'
    });

    view = _emberViewsViewsView2['default'].create({
      template: templateFor('{{#EACH|view.items|item}}{{name}}{{/each}}', useBlockParams),
      title: 'My Cool Each Test',
      items: (0, _emberRuntimeSystemNative_array.A)([obj]),
      controller: controller
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'bob the controller');
  });

  QUnit.test('#each accepts a name binding and can display child properties', function () {
    view = _emberViewsViewsView2['default'].create({
      template: templateFor('{{#EACH|view.items|item}}{{view.title}} {{item.name}}{{/each}}', useBlockParams),
      title: 'My Cool Each Test',
      items: (0, _emberRuntimeSystemNative_array.A)([{ name: 1 }, { name: 2 }])
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'My Cool Each Test 1My Cool Each Test 2');
  });

  QUnit.test('#each accepts \'this\' as the right hand side', function () {
    view = _emberViewsViewsView2['default'].create({
      template: templateFor('{{#EACH|this|item}}{{view.title}} {{item.name}}{{/each}}', useBlockParams),
      title: 'My Cool Each Test',
      controller: (0, _emberRuntimeSystemNative_array.A)([{ name: 1 }, { name: 2 }])
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'My Cool Each Test 1My Cool Each Test 2');
  });

  if (!useBlockParams) {
    QUnit.test('views inside #each preserve the new context [DEPRECATED]', function () {
      var controller = (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }]);

      view = _emberViewsViewsView2['default'].create({
        container: container,
        controller: controller,
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each controller}}{{#view}}{{name}}{{/view}}{{/each}}', useBlockParams)
      });

      expectDeprecation(function () {
        (0, _emberRuntimeTestsUtils.runAppend)(view);
      }, _emberHtmlbarsHelpersEach.deprecation);

      equal(view.$().text(), 'AdamSteve');
    });
  }

  QUnit.test('controller is assignable inside an #each', function () {
    expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
    var controller = _emberRuntimeControllersArray_controller2['default'].create({
      model: (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }])
    });

    view = _emberViewsViewsView2['default'].create({
      container: container,
      controller: controller,
      template: templateFor('{{#EACH|this|personController}}{{#view controller=personController}}{{name}}{{/view}}{{/each}}', useBlockParams)
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'AdamSteve');
  });

  QUnit.test('it doesn\'t assert when the morph tags have the same parent', function () {
    view = _emberViewsViewsView2['default'].create({
      controller: (0, _emberRuntimeSystemNative_array.A)(['Cyril', 'David']),
      template: templateFor('<table><tbody>{{#EACH|this|name}}<tr><td>{{name}}</td></tr>{{/each}}</tbody></table>', useBlockParams)
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    ok(true, 'No assertion from valid template');
  });

  QUnit.test('itemController specified in template with name binding does not change context [DEPRECATED]', function () {
    var Controller = _emberRuntimeControllersController2['default'].extend({
      controllerName: (0, _emberMetalComputed.computed)(function () {
        return 'controller:' + this.get('model.name');
      })
    });

    registry = new _emberRuntimeSystemContainer.Registry();
    registry.register('view:-legacy-each', _emberViewsViewsLegacy_each_view2['default']);
    container = registry.container();

    people = (0, _emberRuntimeSystemNative_array.A)([{ name: 'Steve Holt' }, { name: 'Annabelle' }]);

    var parentController = {
      container: container,
      people: people,
      controllerName: 'controller:parentController'
    };

    registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'].extend());

    var template;
    expectDeprecation(function () {
      template = templateFor('{{#EACH|people|person|itemController="person"}}{{controllerName}} - {{person.controllerName}} - {{/each}}', useBlockParams);
    }, /Using 'itemController' with '{{each}}'/);

    view = _emberViewsViewsView2['default'].create({
      template: template,
      container: container,
      controller: parentController
    });

    registry.register('controller:person', Controller);

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'controller:parentController - controller:Steve Holt - controller:parentController - controller:Annabelle - ');

    (0, _emberMetalRun_loop2['default'])(function () {
      people.pushObject({ name: 'Yehuda Katz' });
    });

    assertText(view, 'controller:parentController - controller:Steve Holt - controller:parentController - controller:Annabelle - controller:parentController - controller:Yehuda Katz - ');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(parentController, 'people', (0, _emberRuntimeSystemNative_array.A)([{ name: 'Trek Glowacki' }, { name: 'Geoffrey Grosenbach' }]));
    });

    assertText(view, 'controller:parentController - controller:Trek Glowacki - controller:parentController - controller:Geoffrey Grosenbach - ');

    strictEqual(view.childViews[0].get('_arrayController.target'), parentController, 'the target property of the child controllers are set correctly');
  });

  QUnit.test('itemController specified in ArrayController with name binding does not change context', function () {
    expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
    people = (0, _emberRuntimeSystemNative_array.A)([{ name: 'Steve Holt' }, { name: 'Annabelle' }]);

    var PersonController = _emberRuntimeControllersController2['default'].extend({
      controllerName: (0, _emberMetalComputed.computed)(function () {
        return 'controller:' + (0, _emberMetalProperty_get.get)(this, 'model.name') + ' of ' + (0, _emberMetalProperty_get.get)(this, 'parentController.company');
      })
    });
    var PeopleController = _emberRuntimeControllersArray_controller2['default'].extend({
      model: people,
      itemController: 'person',
      company: 'Yapp',
      controllerName: 'controller:people'
    });
    registry = new _emberRuntimeSystemContainer.Registry();
    registry.register('view:-legacy-each', _emberViewsViewsLegacy_each_view2['default']);
    container = registry.container();

    registry.register('controller:people', PeopleController);
    registry.register('controller:person', PersonController);

    view = _emberViewsViewsView2['default'].create({
      container: container,
      template: templateFor('{{#EACH|this|person}}{{controllerName}} - {{person.controllerName}} - {{/each}}', useBlockParams),
      controller: container.lookup('controller:people')
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'controller:people - controller:Steve Holt of Yapp - controller:people - controller:Annabelle of Yapp - ');
  });

  QUnit.test('locals in stable loops update when the list is updated', function () {
    expect(3);

    var list = [{ key: 'adam', name: 'Adam' }, { key: 'steve', name: 'Steve' }];
    view = _emberViewsViewsView2['default'].create({
      queries: list,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.queries key="key" as |query|}}{{query.name}}{{/each}}', true)
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);
    equal(view.$().text(), 'AdamSteve');

    (0, _emberMetalRun_loop2['default'])(function () {
      list.unshift({ key: 'bob', name: 'Bob' });
      view.set('queries', list);
      view.notifyPropertyChange('queries');
    });

    equal(view.$().text(), 'BobAdamSteve');

    (0, _emberMetalRun_loop2['default'])(function () {
      view.set('queries', [{ key: 'bob', name: 'Bob' }, { key: 'steve', name: 'Steve' }]);
      view.notifyPropertyChange('queries');
    });

    equal(view.$().text(), 'BobSteve');
  });

  if (!useBlockParams) {
    QUnit.test('{{each}} without arguments [DEPRECATED]', function () {
      expect(2);

      view = _emberViewsViewsView2['default'].create({
        controller: (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }]),
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each}}{{name}}{{/each}}')
      });

      expectDeprecation(function () {
        (0, _emberRuntimeTestsUtils.runAppend)(view);
      }, _emberHtmlbarsHelpersEach.deprecation);

      equal(view.$().text(), 'AdamSteve');
    });

    QUnit.test('{{each this}} without keyword [DEPRECATED]', function () {
      expect(2);

      view = _emberViewsViewsView2['default'].create({
        controller: (0, _emberRuntimeSystemNative_array.A)([{ name: 'Adam' }, { name: 'Steve' }]),
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each this}}{{name}}{{/each}}')
      });

      expectDeprecation(function () {
        (0, _emberRuntimeTestsUtils.runAppend)(view);
      }, _emberHtmlbarsHelpersEach.deprecation);

      equal(view.$().text(), 'AdamSteve');
    });
  }

  if (useBlockParams) {
    QUnit.test('the index is passed as the second parameter to #each blocks', function () {
      expect(3);

      var adam = { name: 'Adam' };
      view = _emberViewsViewsView2['default'].create({
        controller: (0, _emberRuntimeSystemNative_array.A)([adam, { name: 'Steve' }]),
        template: templateFor('{{#each this as |person index|}}{{index}}. {{person.name}}{{/each}}', true)
      });
      (0, _emberRuntimeTestsUtils.runAppend)(view);
      equal(view.$().text(), '0. Adam1. Steve');

      (0, _emberMetalRun_loop2['default'])(function () {
        view.get('controller').unshiftObject({ name: 'Bob' });
      });
      equal(view.$().text(), '0. Bob1. Adam2. Steve');

      (0, _emberMetalRun_loop2['default'])(function () {
        view.get('controller').removeObject(adam);
      });
      equal(view.$().text(), '0. Bob1. Steve');
    });
  }
}

QUnit.test('context switching deprecation is printed when no items are present', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items}}{{this}}{{else}}Nothing{{/each}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Using the context switching form of \{\{each\}\} is deprecated/);

  assertHTML(view, 'Nothing');
});

QUnit.test('a string key can be used with {{each}}', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'id\' as |item|}}{{item.id}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'foobarbaz');
});

QUnit.test('a numeric key can be used with {{each}}', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'id\' as |item|}}{{item.id}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '123');
});

QUnit.test('can specify `@index` to represent the items index in the array being iterated', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'@index\' as |item|}}{{item.id}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '123');
});

QUnit.test('can specify `@guid` to represent the items GUID [DEPRECATED]', function () {
  expectDeprecation('Using \'@guid\' with the {{each}} helper, is deprecated. Switch to \'@identity\' or remove \'key=\' from your template.');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'@guid\' as |item|}}{{item.id}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '123');
});

QUnit.test('can specify `@item` to represent primitive items', function () {
  expectDeprecation('Using \'@item\' with the {{each}} helper, is deprecated. Switch to \'@identity\' or remove \'key=\' from your template.');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [1, 2, 3],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'@item\' as |item|}}{{item}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '123');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'items', ['foo', 'bar', 'baz']);
  });

  equal(view.$().text(), 'foobarbaz');
});

QUnit.test('can specify `@identity` to represent primitive items', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [1, 2, 3],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'@identity\' as |item|}}{{item}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '123');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'items', ['foo', 'bar', 'baz']);
  });

  equal(view.$().text(), 'foobarbaz');
});

QUnit.test('can specify `@identity` to represent mixed object and primitive items', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: [1, { id: 2 }, 3],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items key=\'@identity\' as |item|}}{{#if item.id}}{{item.id}}{{else}}{{item}}{{/if}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '123');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'items', ['foo', { id: 'bar' }, 'baz']);
  });

  equal(view.$().text(), 'foobarbaz');
});

QUnit.test('duplicate keys trigger a useful error (temporary until we can deal with this properly in HTMLBars)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: ['a', 'a', 'a'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items as |item|}}{{item}}{{/each}}')
  });

  throws(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Duplicate key found (\'a\') for \'{{each}}\' helper, please use a unique key or switch to \'{{#each model key="@index"}}{{/each}}\'.');
});

QUnit.test('pushing a new duplicate key will trigger a useful error (temporary until we can deal with this properly in HTMLBars)', function () {
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
  view = _emberViewsViewsView2['default'].create({
    items: (0, _emberRuntimeSystemNative_array.A)(['a', 'b', 'c']),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items as |item|}}{{item}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.get('items').pushObject('a');
    });
  }, 'Duplicate key found (\'a\') for \'{{each}}\' helper, please use a unique key or switch to \'{{#each model key="@index"}}{{/each}}\'.');
});

testEachWithItem('{{#each foo in bar}}', false);
testEachWithItem('{{#each bar as |foo|}}', true);