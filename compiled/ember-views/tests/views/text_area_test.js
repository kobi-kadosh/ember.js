'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsText_area = require('ember-views/views/text_area');

var _emberViewsViewsText_area2 = _interopRequireDefault(_emberViewsViewsText_area);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var textArea, TestObject;

function set(object, key, value) {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(object, key, value);
  });
}

function append() {
  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.appendTo('#qunit-fixture');
  });
}

QUnit.module('TextArea', {
  setup: function setup() {
    TestObject = window.TestObject = _emberRuntimeSystemObject2['default'].create({
      value: null
    });

    textArea = _emberViewsViewsText_area2['default'].create();
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      textArea.destroy();
    });

    TestObject = window.TestObject = textArea = null;
  }
});

QUnit.test('should become disabled if the disabled attribute is true', function () {
  textArea.set('disabled', true);
  append();

  ok(textArea.$().is(':disabled'));
});

QUnit.test('should become disabled if the disabled attribute is true', function () {
  append();
  ok(textArea.$().is(':not(:disabled)'));

  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.set('disabled', true);
  });
  ok(textArea.$().is(':disabled'));

  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.set('disabled', false);
  });
  ok(textArea.$().is(':not(:disabled)'));
});

QUnit.test('input value is updated when setting value property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'value', 'foo');
    textArea.append();
  });

  equal(textArea.$().val(), 'foo', 'renders text field with value');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'value', 'bar');
  });

  equal(textArea.$().val(), 'bar', 'updates text field after value changes');
});

QUnit.test('input placeholder is updated when setting placeholder property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'placeholder', 'foo');
    textArea.append();
  });

  equal(textArea.$().attr('placeholder'), 'foo', 'renders text area with placeholder');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'placeholder', 'bar');
  });

  equal(textArea.$().attr('placeholder'), 'bar', 'updates text area after placeholder changes');
});

QUnit.test('input name is updated when setting name property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'name', 'foo');
    textArea.append();
  });

  equal(textArea.$().attr('name'), 'foo', 'renders text area with name');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'name', 'bar');
  });

  equal(textArea.$().attr('name'), 'bar', 'updates text area after name changes');
});

QUnit.test('input maxlength is updated when setting maxlength property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'maxlength', '300');
    textArea.append();
  });

  equal(textArea.$().attr('maxlength'), '300', 'renders text area with maxlength');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'maxlength', '400');
  });

  equal(textArea.$().attr('maxlength'), '400', 'updates text area after maxlength changes');
});

QUnit.test('input rows is updated when setting rows property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'rows', '3');
    textArea.append();
  });

  equal(textArea.$().attr('rows'), '3', 'renders text area with rows');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'rows', '4');
  });

  equal(textArea.$().attr('rows'), '4', 'updates text area after rows changes');
});

QUnit.test('input cols is updated when setting cols property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'cols', '30');
    textArea.append();
  });

  equal(textArea.$().attr('cols'), '30', 'renders text area with cols');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'cols', '40');
  });

  equal(textArea.$().attr('cols'), '40', 'updates text area after cols changes');
});

QUnit.test('input tabindex is updated when setting tabindex property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'tabindex', '4');
    textArea.append();
  });

  equal(textArea.$().attr('tabindex'), '4', 'renders text area with the tabindex');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'tabindex', '1');
  });

  equal(textArea.$().attr('tabindex'), '1', 'updates text area after tabindex changes');
});

QUnit.test('input title is updated when setting title property of view', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'title', 'FooTitle');
    textArea.append();
  });
  equal(textArea.$().attr('title'), 'FooTitle', 'renders text area with the title');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(textArea, 'title', 'BarTitle');
  });
  equal(textArea.$().attr('title'), 'BarTitle', 'updates text area after title changes');
});

QUnit.test('value binding works properly for inputs that haven\'t been created', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.destroy(); // destroy existing textarea
    textArea = _emberViewsViewsText_area2['default'].create({
      valueBinding: 'TestObject.value'
    });
  });

  equal((0, _emberMetalProperty_get.get)(textArea, 'value'), null, 'precond - default value is null');
  equal(textArea.$(), undefined, 'precond - view doesn\'t have its layer created yet, thus no input element');

  (0, _emberMetalRun_loop2['default'])(function () {
    set(TestObject, 'value', 'ohai');
  });

  equal((0, _emberMetalProperty_get.get)(textArea, 'value'), 'ohai', 'value property was properly updated');

  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.append();
  });

  equal((0, _emberMetalProperty_get.get)(textArea, 'value'), 'ohai', 'value property remains the same once the view has been appended');
  equal(textArea.$().val(), 'ohai', 'value is reflected in the input element once it is created');
});

['cut', 'paste', 'input'].forEach(function (eventName) {
  QUnit.test('should update the value on ' + eventName + ' events', function () {

    (0, _emberMetalRun_loop2['default'])(function () {
      textArea.append();
    });

    textArea.$().val('new value');
    (0, _emberMetalRun_loop2['default'])(function () {
      textArea.trigger(eventName, _emberRuntimeSystemObject2['default'].create({
        type: eventName
      }));
    });

    equal(textArea.get('value'), 'new value', 'value property updates on ' + eventName + ' events');
  });
});

QUnit.test('should call the insertNewline method when return key is pressed', function () {
  var wasCalled;
  var event = _emberRuntimeSystemObject2['default'].create({
    keyCode: 13
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.append();
  });

  textArea.insertNewline = function () {
    wasCalled = true;
  };

  textArea.trigger('keyUp', event);
  ok(wasCalled, 'invokes insertNewline method');
});

QUnit.test('should call the cancel method when escape key is pressed', function () {
  var wasCalled;
  var event = _emberRuntimeSystemObject2['default'].create({
    keyCode: 27
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    textArea.append();
  });

  textArea.cancel = function () {
    wasCalled = true;
  };

  textArea.trigger('keyUp', event);
  ok(wasCalled, 'invokes cancel method');
});