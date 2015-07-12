'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsViewsText_field = require('ember-views/views/text_field');

var _emberViewsViewsText_field2 = _interopRequireDefault(_emberViewsViewsText_field);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

function K() {
  return this;
}

var textField;
var TestObject;

var view;

var appendView = function appendView(view) {
  (0, _emberMetalRun_loop2['default'])(view, 'appendTo', '#qunit-fixture');
};

var caretPosition = function caretPosition(element) {
  var ctrl = element[0];
  var caretPos = 0;

  // IE Support
  if (document.selection) {
    ctrl.focus();
    var selection = document.selection.createRange();

    selection.moveStart('character', -ctrl.value.length);

    caretPos = selection.text.length;
  } else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
    // Firefox support
    caretPos = ctrl.selectionStart;
  }

  return caretPos;
};

var setCaretPosition = function setCaretPosition(element, pos) {
  var ctrl = element[0];

  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};

function set(object, key, value) {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(object, key, value);
  });
}

function append() {
  (0, _emberMetalRun_loop2['default'])(function () {
    textField.appendTo('#qunit-fixture');
  });
}

QUnit.module('Ember.TextField', {
  setup: function setup() {
    TestObject = window.TestObject = _emberRuntimeSystemObject2['default'].create({
      value: null
    });

    textField = _emberViewsViewsText_field2['default'].create();
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      textField.destroy();
    });
    TestObject = window.TestObject = textField = null;
  }
});

QUnit.test('should become disabled if the disabled attribute is true before append', function () {
  textField.set('disabled', true);
  append();

  ok(textField.$().is(':disabled'));
});

QUnit.test('should become disabled if the disabled attribute is true', function () {
  append();
  ok(textField.$().is(':not(:disabled)'));

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.set('disabled', true);
  });
  ok(textField.$().is(':disabled'));

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.set('disabled', false);
  });
  ok(textField.$().is(':not(:disabled)'));
});

QUnit.test('input value is updated when setting value property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'value', 'foo');
    textField.append();
  });

  equal(textField.$().val(), 'foo', 'renders text field with value');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'value', 'bar');
  });

  equal(textField.$().val(), 'bar', 'updates text field after value changes');
});

QUnit.test('input placeholder is updated when setting placeholder property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'placeholder', 'foo');
    textField.append();
  });

  equal(textField.$().attr('placeholder'), 'foo', 'renders text field with placeholder');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'placeholder', 'bar');
  });

  equal(textField.$().attr('placeholder'), 'bar', 'updates text field after placeholder changes');
});

QUnit.test('input name is updated when setting name property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'name', 'foo');
    textField.append();
  });

  equal(textField.$().attr('name'), 'foo', 'renders text field with name');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'name', 'bar');
  });

  equal(textField.$().attr('name'), 'bar', 'updates text field after name changes');
});

QUnit.test('input maxlength is updated when setting maxlength property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'maxlength', '30');
    textField.append();
  });

  equal(textField.$().attr('maxlength'), '30', 'renders text field with maxlength');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'maxlength', '40');
  });

  equal(textField.$().attr('maxlength'), '40', 'updates text field after maxlength changes');
});

QUnit.test('input size is updated when setting size property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'size', '30');
    textField.append();
  });

  equal(textField.$().attr('size'), '30', 'renders text field with size');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'size', '40');
  });

  equal(textField.$().attr('size'), '40', 'updates text field after size changes');
});

QUnit.test('input tabindex is updated when setting tabindex property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'tabindex', '5');
    textField.append();
  });

  equal(textField.$().attr('tabindex'), '5', 'renders text field with the tabindex');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'tabindex', '3');
  });

  equal(textField.$().attr('tabindex'), '3', 'updates text field after tabindex changes');
});

QUnit.test('input title is updated when setting title property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'title', 'FooTitle');
    textField.append();
  });

  equal(textField.$().attr('title'), 'FooTitle', 'renders text field with the title');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'title', 'BarTitle');
  });

  equal(textField.$().attr('title'), 'BarTitle', 'updates text field after title changes');
});

QUnit.test('input type is configurable when creating view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textField, 'type', 'password');
    textField.append();
  });

  equal(textField.$().attr('type'), 'password', 'renders text field with type');
});

QUnit.test('value binding works properly for inputs that haven\'t been created', function () {

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.destroy(); // destroy existing textField
    textField = _emberViewsViewsText_field2['default'].create({
      valueBinding: 'TestObject.value'
    });
  });

  equal((0, _emberMetalProperty_get.get)(textField, 'value'), null, 'precond - default value is null');
  equal(textField.$(), undefined, 'precond - view doesn\'t have its layer created yet, thus no input element');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(TestObject, 'value', 'ohai');
  });

  equal((0, _emberMetalProperty_get.get)(textField, 'value'), 'ohai', 'value property was properly updated');

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.append();
  });

  equal((0, _emberMetalProperty_get.get)(textField, 'value'), 'ohai', 'value property remains the same once the view has been appended');
  equal(textField.$().val(), 'ohai', 'value is reflected in the input element once it is created');
});

QUnit.test('value binding sets value on the element', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    textField.destroy(); // destroy existing textField
    textField = _emberViewsViewsText_field2['default'].create({
      valueBinding: 'TestObject.value'
    });
    textField.append();
  });

  // Set the value via the DOM
  (0, _emberMetalRun_loop2['default'])(function () {
    textField.$().val('via dom');
    // Trigger lets the view know we changed this value (like a real user editing)
    textField.trigger('input', _emberRuntimeSystemObject2['default'].create({
      type: 'input'
    }));
  });

  equal((0, _emberMetalProperty_get.get)(textField, 'value'), 'via dom', 'value property was properly updated via dom');
  equal(textField.$().val(), 'via dom', 'dom property was properly updated via dom');

  // Now, set it via the binding
  (0, _emberMetalRun_loop2['default'])(function () {
    set(TestObject, 'value', 'via view');
  });

  equal((0, _emberMetalProperty_get.get)(textField, 'value'), 'via view', 'value property was properly updated via view');
  equal(textField.$().val(), 'via view', 'dom property was properly updated via view');
});

QUnit.test('should call the insertNewline method when return key is pressed', function () {
  var wasCalled;
  var event = _emberRuntimeSystemObject2['default'].create({
    keyCode: 13
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.append();
  });

  textField.insertNewline = function () {
    wasCalled = true;
  };

  textField.trigger('keyUp', event);
  ok(wasCalled, 'invokes insertNewline method');
});

QUnit.test('should call the cancel method when escape key is pressed', function () {
  var wasCalled;
  var event = _emberRuntimeSystemObject2['default'].create({
    keyCode: 27
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.append();
  });

  textField.cancel = function () {
    wasCalled = true;
  };

  textField.trigger('keyUp', event);
  ok(wasCalled, 'invokes cancel method');
});

QUnit.test('should send an action if one is defined when the return key is pressed', function () {
  expect(2);

  var StubController = _emberRuntimeSystemObject2['default'].extend({
    send: function send(actionName, value, sender) {
      equal(actionName, 'didTriggerAction', 'text field sent correct action name');
      equal(value, 'textFieldValue', 'text field sent its current value as first argument');
    }
  });

  textField.set('action', 'didTriggerAction');
  textField.set('value', 'textFieldValue');
  textField.set('targetObject', StubController.create());

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.append();
  });

  var event = {
    keyCode: 13,
    stopPropagation: K
  };

  textField.trigger('keyUp', event);
});

QUnit.test('should send an action on keyPress if one is defined with onEvent=keyPress', function () {
  expect(2);

  var StubController = _emberRuntimeSystemObject2['default'].extend({
    send: function send(actionName, value, sender) {
      equal(actionName, 'didTriggerAction', 'text field sent correct action name');
      equal(value, 'textFieldValue', 'text field sent its current value as first argument');
    }
  });

  textField.set('action', 'didTriggerAction');
  textField.set('onEvent', 'keyPress');
  textField.set('value', 'textFieldValue');
  textField.set('targetObject', StubController.create());

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.append();
  });

  var event = {
    keyCode: 48,
    stopPropagation: K
  };

  textField.trigger('keyPress', event);
});

QUnit.test('bubbling of handled actions can be enabled via bubbles property', function () {
  textField.set('bubbles', true);
  textField.set('action', 'didTriggerAction');

  textField.set('controller', _emberRuntimeSystemObject2['default'].create({
    send: K
  }));

  append();

  var stopPropagationCount = 0;
  var event = {
    keyCode: 13,
    stopPropagation: function stopPropagation() {
      stopPropagationCount++;
    }
  };

  textField.trigger('keyUp', event);
  equal(stopPropagationCount, 0, 'propagation was not prevented if bubbles is true');

  textField.set('bubbles', false);
  textField.trigger('keyUp', event);
  equal(stopPropagationCount, 1, 'propagation was prevented if bubbles is false');
});

var dispatcher, StubController;
QUnit.module('Ember.TextField - Action events', {
  setup: function setup() {

    dispatcher = _emberViewsSystemEvent_dispatcher2['default'].create();
    dispatcher.setup();

    StubController = _emberRuntimeSystemObject2['default'].extend({
      send: function send(actionName, value, sender) {
        equal(actionName, 'doSomething', 'text field sent correct action name');
      }
    });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      dispatcher.destroy();

      if (textField) {
        textField.destroy();
      }

      if (view) {
        view.destroy();
      }
    });
  }
});

QUnit.test('when the text field is blurred, the `focus-out` action is sent to the controller', function () {
  expect(1);

  textField = _emberViewsViewsText_field2['default'].create({
    'focus-out': 'doSomething',
    targetObject: StubController.create({})
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.$().blur();
  });
});

QUnit.test('when the text field is focused, the `focus-in` action is sent to the controller', function () {
  expect(1);

  textField = _emberViewsViewsText_field2['default'].create({
    'focus-in': 'doSomething',
    targetObject: StubController.create({})
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    textField.$().focusin();
  });
});

QUnit.test('when the user presses a key, the `key-press` action is sent to the controller', function () {
  expect(1);

  textField = _emberViewsViewsText_field2['default'].create({
    'key-press': 'doSomething',
    targetObject: StubController.create({})
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    var event = _emberViewsSystemJquery2['default'].Event('keypress');
    event.keyCode = event.which = 13;
    textField.$().trigger(event);
  });
});

QUnit.test('when the user inserts a new line, the `insert-newline` action is sent to the controller', function () {
  expect(1);

  textField = _emberViewsViewsText_field2['default'].create({
    'insert-newline': 'doSomething',
    targetObject: StubController.create({})
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    var event = _emberViewsSystemJquery2['default'].Event('keyup');
    event.keyCode = event.which = 13;
    textField.$().trigger(event);
  });
});

QUnit.test('when the user presses the `enter` key, the `enter` action is sent to the controller', function () {
  expect(1);

  textField = _emberViewsViewsText_field2['default'].create({
    'enter': 'doSomething',
    targetObject: StubController.create({})
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    var event = _emberViewsSystemJquery2['default'].Event('keyup');
    event.keyCode = event.which = 13;
    textField.$().trigger(event);
  });
});

QUnit.test('when the user hits escape, the `escape-press` action is sent to the controller', function () {
  expect(1);

  textField = _emberViewsViewsText_field2['default'].create({
    'escape-press': 'doSomething',
    targetObject: StubController.create({})
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    var event = _emberViewsSystemJquery2['default'].Event('keyup');
    event.keyCode = event.which = 27;
    textField.$().trigger(event);
  });
});

QUnit.test('when the user presses a key, the `key-down` action is sent to the controller', function () {
  expect(3);
  var event;

  textField = _emberViewsViewsText_field2['default'].create({
    'key-down': 'doSomething',
    targetObject: StubController.create({
      send: function send(actionName, value, evt) {
        equal(actionName, 'doSomething', 'text field sent correct action name');
        equal(value, '', 'value was blank in key-down');
        equal(evt, event, 'event was received as param');
      }
    })
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    event = _emberViewsSystemJquery2['default'].Event('keydown');
    event.keyCode = event.which = 65;
    textField.$().val('foo');
    textField.$().trigger(event);
  });
});

QUnit.test('when the user releases a key, the `key-up` action is sent to the controller', function () {
  expect(3);
  var event;

  textField = _emberViewsViewsText_field2['default'].create({
    'key-up': 'doSomething',
    targetObject: StubController.create({
      send: function send(actionName, value, evt) {
        equal(actionName, 'doSomething', 'text field sent correct action name');
        equal(value, 'bar', 'value was received');
        equal(evt, event, 'event was received as param');
      }
    })
  });

  append();

  (0, _emberMetalRun_loop2['default'])(function () {
    event = _emberViewsSystemJquery2['default'].Event('keyup');
    event.keyCode = event.which = 65;
    textField.$().val('bar');
    textField.$().trigger(event);
  });
});

QUnit.test('should not reset cursor position when text field receives keyUp event', function () {
  view = _emberViewsViewsText_field2['default'].create({
    value: 'Broseidon, King of the Brocean'
  });

  appendView(view);

  setCaretPosition(view.$(), 5);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.trigger('keyUp', {});
  });

  equal(caretPosition(view.$()), 5, 'The keyUp event should not result in the cursor being reset due to the bind-attr observers');
});

QUnit.test('an unsupported type defaults to `text`', function () {
  view = _emberViewsViewsText_field2['default'].create({
    type: 'blahblah'
  });

  equal((0, _emberMetalProperty_get.get)(view, 'type'), 'text', 'should default to text if the type is not a valid type');

  appendView(view);

  equal(view.element.type, 'text');
});