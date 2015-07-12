'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsCheckbox = require('ember-views/views/checkbox');

var _emberViewsViewsCheckbox2 = _interopRequireDefault(_emberViewsViewsCheckbox);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

function set(obj, key, value) {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(obj, key, value);
  });
}

function append() {
  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.appendTo('#qunit-fixture');
  });
}

var checkboxComponent, dispatcher;

QUnit.module('Ember.Checkbox', {
  setup: function setup() {
    dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
    dispatcher.setup();
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      dispatcher.destroy();
      checkboxComponent.destroy();
    });
  }
});

QUnit.test('should begin disabled if the disabled attribute is true', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});

  checkboxComponent.set('disabled', true);
  append();

  ok(checkboxComponent.$().is(':disabled'));
});

QUnit.test('should become disabled if the disabled attribute is changed', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});

  append();
  ok(checkboxComponent.$().is(':not(:disabled)'));

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('disabled', true);
  });
  ok(checkboxComponent.$().is(':disabled'));

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('disabled', false);
  });
  ok(checkboxComponent.$().is(':not(:disabled)'));
});

QUnit.test('should begin indeterminate if the indeterminate attribute is true', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});

  checkboxComponent.set('indeterminate', true);
  append();

  equal(checkboxComponent.$().prop('indeterminate'), true, 'Checkbox should be indeterminate');
});

QUnit.test('should become indeterminate if the indeterminate attribute is changed', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});

  append();

  equal(checkboxComponent.$().prop('indeterminate'), false, 'Checkbox should not be indeterminate');

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('indeterminate', true);
  });
  equal(checkboxComponent.$().prop('indeterminate'), true, 'Checkbox should be indeterminate');

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('indeterminate', false);
  });
  equal(checkboxComponent.$().prop('indeterminate'), false, 'Checkbox should not be indeterminate');
});

QUnit.test('should support the tabindex property', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('tabindex', 6);
  });
  append();

  equal(checkboxComponent.$().prop('tabindex'), '6', 'the initial checkbox tabindex is set in the DOM');

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('tabindex', 3);
  });
  equal(checkboxComponent.$().prop('tabindex'), '3', 'the checkbox tabindex changes when it is changed in the component');
});

QUnit.test('checkbox name is updated when setting name property of view', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('name', 'foo');
  });
  append();

  equal(checkboxComponent.$().attr('name'), 'foo', 'renders checkbox with the name');

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.set('name', 'bar');
  });

  equal(checkboxComponent.$().attr('name'), 'bar', 'updates checkbox after name changes');
});

QUnit.test('checked property mirrors input value', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({});
  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.append();
  });

  equal((0, _emberMetalProperty_get.get)(checkboxComponent, 'checked'), false, 'initially starts with a false value');
  equal(!!checkboxComponent.$().prop('checked'), false, 'the initial checked property is false');

  set(checkboxComponent, 'checked', true);

  equal(checkboxComponent.$().prop('checked'), true, 'changing the value property changes the DOM');

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.remove();
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.append();
  });

  equal(checkboxComponent.$().prop('checked'), true, 'changing the value property changes the DOM');

  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.remove();
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    set(checkboxComponent, 'checked', false);
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    checkboxComponent.append();
  });

  equal(checkboxComponent.$().prop('checked'), false, 'changing the value property changes the DOM');
});

QUnit.test('checking the checkbox updates the value', function () {
  checkboxComponent = _emberViewsViewsCheckbox2['default'].create({ checked: true });
  append();

  equal((0, _emberMetalProperty_get.get)(checkboxComponent, 'checked'), true, 'precond - initially starts with a true value');
  equal(!!checkboxComponent.$().prop('checked'), true, 'precond - the initial checked property is true');

  // IE fires 'change' event on blur.
  checkboxComponent.$()[0].focus();
  checkboxComponent.$()[0].click();
  checkboxComponent.$()[0].blur();

  equal(!!checkboxComponent.$().prop('checked'), false, 'after clicking a checkbox, the checked property changed');
  equal((0, _emberMetalProperty_get.get)(checkboxComponent, 'checked'), false, 'changing the checkbox causes the view\'s value to get updated');
});