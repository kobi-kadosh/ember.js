'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberViewsViewsSelect = require('ember-views/views/select');

var _emberViewsViewsSelect2 = _interopRequireDefault(_emberViewsViewsSelect);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var dispatcher, view;

QUnit.module('ember-htmlbars: Ember.Select - usage inside templates', {
  setup: function setup() {
    dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
    dispatcher.setup();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(dispatcher);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

QUnit.test('works from a template with bindings [DEPRECATED]', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var Person = _emberRuntimeSystemObject2['default'].extend({
    id: null,
    firstName: null,
    lastName: null,

    fullName: (0, _emberMetalComputed.computed)(function () {
      return this.get('firstName') + ' ' + this.get('lastName');
    }).property('firstName', 'lastName')
  });

  var erik = Person.create({ id: 4, firstName: 'Erik', lastName: 'Bryn' });

  var application = _emberRuntimeSystemNamespace2['default'].create();

  application.peopleController = _emberRuntimeControllersArray_controller2['default'].create({
    content: _emberMetalCore2['default'].A([Person.create({ id: 1, firstName: 'Yehuda', lastName: 'Katz' }), Person.create({ id: 2, firstName: 'Tom', lastName: 'Dale' }), Person.create({ id: 3, firstName: 'Peter', lastName: 'Wagenet' }), erik])
  });

  application.selectedPersonController = _emberRuntimeSystemObject2['default'].create({
    person: null
  });

  view = _emberViewsViewsView2['default'].create({
    app: application,
    selectView: _emberViewsViewsSelect2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.selectView viewName="select"' + '    content=view.app.peopleController' + '    optionLabelPath="content.fullName"' + '    optionValuePath="content.id"' + '    prompt="Pick a person:"' + '    selection=view.app.selectedPersonController.person}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var select = view.get('select');
  ok(select.$().length, 'Select was rendered');
  equal(select.$('option').length, 5, 'Options were rendered');
  equal(select.$().text(), 'Pick a person:Yehuda KatzTom DalePeter WagenetErik Bryn\n', 'Option values were rendered');
  equal(select.get('selection'), null, 'Nothing has been selected');

  (0, _emberMetalRun_loop2['default'])(function () {
    application.selectedPersonController.set('person', erik);
  });

  equal(select.get('selection'), erik, 'Selection was updated through binding');
  (0, _emberMetalRun_loop2['default'])(function () {
    application.peopleController.pushObject(Person.create({ id: 5, firstName: 'James', lastName: 'Rosen' }));
  });

  equal(select.$('option').length, 6, 'New option was added');
  equal(select.get('selection'), erik, 'Selection was maintained after new option was added');
});

QUnit.test('works from a template', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var Person = _emberRuntimeSystemObject2['default'].extend({
    id: null,
    firstName: null,
    lastName: null,

    fullName: (0, _emberMetalComputed.computed)(function () {
      return this.get('firstName') + ' ' + this.get('lastName');
    }).property('firstName', 'lastName')
  });

  var erik = Person.create({ id: 4, firstName: 'Erik', lastName: 'Bryn' });

  var application = _emberRuntimeSystemNamespace2['default'].create();

  application.peopleController = _emberRuntimeControllersArray_controller2['default'].create({
    content: _emberMetalCore2['default'].A([Person.create({ id: 1, firstName: 'Yehuda', lastName: 'Katz' }), Person.create({ id: 2, firstName: 'Tom', lastName: 'Dale' }), Person.create({ id: 3, firstName: 'Peter', lastName: 'Wagenet' }), erik])
  });

  application.selectedPersonController = _emberRuntimeSystemObject2['default'].create({
    person: null
  });

  view = _emberViewsViewsView2['default'].create({
    app: application,
    selectView: _emberViewsViewsSelect2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.selectView viewName="select"' + '    content=view.app.peopleController' + '    optionLabelPath="content.fullName"' + '    optionValuePath="content.id"' + '    prompt="Pick a person:"' + '    selection=view.app.selectedPersonController.person}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var select = view.get('select');
  ok(select.$().length, 'Select was rendered');
  equal(select.$('option').length, 5, 'Options were rendered');
  equal(select.$().text(), 'Pick a person:Yehuda KatzTom DalePeter WagenetErik Bryn\n', 'Option values were rendered');
  equal(select.get('selection'), null, 'Nothing has been selected');

  (0, _emberMetalRun_loop2['default'])(function () {
    application.selectedPersonController.set('person', erik);
  });

  equal(select.get('selection'), erik, 'Selection was updated through binding');
  (0, _emberMetalRun_loop2['default'])(function () {
    application.peopleController.pushObject(Person.create({ id: 5, firstName: 'James', lastName: 'Rosen' }));
  });

  equal(select.$('option').length, 6, 'New option was added');
  equal(select.get('selection'), erik, 'Selection was maintained after new option was added');
});

QUnit.test('upon content change, the DOM should reflect the selection (#481)', function () {
  var userOne = { name: 'Mike', options: _emberMetalCore2['default'].A(['a', 'b']), selectedOption: 'a' };
  var userTwo = { name: 'John', options: _emberMetalCore2['default'].A(['c', 'd']), selectedOption: 'd' };

  view = _emberViewsViewsView2['default'].create({
    user: userOne,
    selectView: _emberViewsViewsSelect2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.selectView viewName="select"' + '    content=view.user.options' + '    selection=view.user.selectedOption}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var select = view.get('select');
  var selectEl = select.$()[0];

  equal(select.get('selection'), 'a', 'Precond: Initial selection is correct');
  equal(selectEl.selectedIndex, 0, 'Precond: The DOM reflects the correct selection');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('user', userTwo);
  });

  equal(select.get('selection'), 'd', 'Selection was properly set after content change');
  equal(selectEl.selectedIndex, 1, 'The DOM reflects the correct selection');
});

QUnit.test('upon content change with Array-like content, the DOM should reflect the selection', function () {
  var tom = { id: 4, name: 'Tom' };
  var sylvain = { id: 5, name: 'Sylvain' };

  var proxy = _emberRuntimeSystemArray_proxy2['default'].create({
    content: _emberMetalCore2['default'].A(),
    selectedOption: sylvain
  });

  view = _emberViewsViewsView2['default'].create({
    proxy: proxy,
    selectView: _emberViewsViewsSelect2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view view.selectView viewName="select"' + '    content=view.proxy' + '    selection=view.proxy.selectedOption}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var select = view.get('select');
  var selectEl = select.$()[0];

  equal(selectEl.selectedIndex, -1, 'Precond: The DOM reflects the lack of selection');

  (0, _emberMetalRun_loop2['default'])(function () {
    proxy.set('content', _emberMetalCore2['default'].A([tom, sylvain]));
  });

  equal(select.get('selection'), sylvain, 'Selection was properly set after content change');
  equal(selectEl.selectedIndex, 1, 'The DOM reflects the correct selection');
});

function testValueBinding(templateString) {
  view = _emberViewsViewsView2['default'].create({
    collection: _emberMetalCore2['default'].A([{ name: 'Wes', value: 'w' }, { name: 'Gordon', value: 'g' }]),
    val: 'g',
    selectView: _emberViewsViewsSelect2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var select = view.get('select');
  var selectEl = select.$()[0];

  equal(view.get('val'), 'g', 'Precond: Initial bound property is correct');
  equal(select.get('value'), 'g', 'Precond: Initial selection is correct');
  equal(selectEl.selectedIndex, 2, 'Precond: The DOM reflects the correct selection');

  select.$('option:eq(2)').removeAttr('selected');
  select.$('option:eq(1)').prop('selected', true);
  select.$().trigger('change');

  equal(view.get('val'), 'w', 'Updated bound property is correct');
  equal(select.get('value'), 'w', 'Updated selection is correct');
  equal(selectEl.selectedIndex, 1, 'The DOM is updated to reflect the new selection');
}

QUnit.test('select element should correctly initialize and update selectedIndex and bound properties when using valueBinding [DEPRECATED]', function () {
  expectDeprecation('You\'re using legacy binding syntax: valueBinding="view.val" (L1:C176) . Please replace with value=view.val');

  testValueBinding('{{view view.selectView viewName="select"' + '    contentBinding="view.collection"' + '    optionLabelPath="content.name"' + '    optionValuePath="content.value"' + '    prompt="Please wait..."' + '    valueBinding="view.val"}}');
});

QUnit.test('select element should correctly initialize and update selectedIndex and bound properties when using valueBinding', function () {
  testValueBinding('{{view view.selectView viewName="select"' + '    content=view.collection' + '    optionLabelPath="content.name"' + '    optionValuePath="content.value"' + '    prompt="Please wait..."' + '    value=view.val}}');
});

function testSelectionBinding(templateString) {
  view = _emberViewsViewsView2['default'].create({
    collection: _emberMetalCore2['default'].A([{ name: 'Wes', value: 'w' }, { name: 'Gordon', value: 'g' }]),
    selection: { name: 'Gordon', value: 'g' },
    selectView: _emberViewsViewsSelect2['default'],
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(templateString)
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var select = view.get('select');
  var selectEl = select.$()[0];

  equal(view.get('selection.value'), 'g', 'Precond: Initial bound property is correct');
  equal(select.get('selection.value'), 'g', 'Precond: Initial selection is correct');
  equal(selectEl.selectedIndex, 2, 'Precond: The DOM reflects the correct selection');
  equal(select.$('option:eq(2)').prop('selected'), true, 'Precond: selected property is set to proper option');

  select.$('option:eq(2)').removeAttr('selected');
  select.$('option:eq(1)').prop('selected', true);
  select.$().trigger('change');

  equal(view.get('selection.value'), 'w', 'Updated bound property is correct');
  equal(select.get('selection.value'), 'w', 'Updated selection is correct');
  equal(selectEl.selectedIndex, 1, 'The DOM is updated to reflect the new selection');
  equal(select.$('option:eq(1)').prop('selected'), true, 'Selected property is set to proper option');
}

QUnit.test('select element should correctly initialize and update selectedIndex and bound properties when using selectionBinding [DEPRECATED]', function () {
  expectDeprecation('You\'re using legacy binding syntax: contentBinding="view.collection" (L1:C44) . Please replace with content=view.collection');

  testSelectionBinding('{{view view.selectView viewName="select"' + '    contentBinding="view.collection"' + '    optionLabelPath="content.name"' + '    optionValuePath="content.value"' + '    prompt="Please wait..."' + '    selectionBinding="view.selection"}}');
});

QUnit.test('select element should correctly initialize and update selectedIndex and bound properties when using a bound selection', function () {
  testSelectionBinding('{{view view.selectView viewName="select"' + '    content=view.collection' + '    optionLabelPath="content.name"' + '    optionValuePath="content.value"' + '    prompt="Please wait..."' + '    selection=view.selection}}');
});

QUnit.test('select element should correctly initialize and update selectedIndex and bound properties when using selectionBinding and optionValuePath with custom path', function () {
  var templateString = '{{view view.selectView viewName="select"' + '    content=view.collection' + '    optionLabelPath="content.name"' + '    optionValuePath="content.val"' + '    prompt="Please wait..."' + '    selection=view.selection}}';

  view = _emberViewsViewsView2['default'].create({
    collection: _emberMetalCore2['default'].A([{ name: 'Wes', val: 'w' }, { name: 'Gordon', val: 'g' }]),
    selection: { name: 'Gordon', val: 'g' },
    selectView: _emberViewsViewsSelect2['default'],
    template: _emberMetalCore2['default'].Handlebars.compile(templateString)
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  var select = view.get('select');
  var selectEl = select.$()[0];

  equal(view.get('selection.val'), 'g', 'Precond: Initial bound property is correct');
  equal(select.get('selection.val'), 'g', 'Precond: Initial selection is correct');
  equal(selectEl.selectedIndex, 2, 'Precond: The DOM reflects the correct selection');
  equal(select.$('option:eq(1)').prop('selected'), false, 'Precond: selected property is set to proper option');

  select.$('option:eq(2)').removeAttr('selected');
  select.$('option:eq(1)').prop('selected', true);
  select.$().trigger('change');

  equal(view.get('selection.val'), 'w', 'Updated bound property is correct');
  equal(select.get('selection.val'), 'w', 'Updated selection is correct');
  equal(selectEl.selectedIndex, 1, 'The DOM is updated to reflect the new selection');
  equal(select.$('option:eq(1)').prop('selected'), true, 'selected property is set to proper option');
});