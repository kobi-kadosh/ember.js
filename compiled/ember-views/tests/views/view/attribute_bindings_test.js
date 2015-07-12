'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberHtmlbarsUtilsString = require('ember-htmlbars/utils/string');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var originalLookup = _emberMetalCore2['default'].lookup;
var lookup, view;

var appendView = function appendView() {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });
};

QUnit.module('EmberView - Attribute Bindings', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
  },
  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
      view = null;
    }
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should render attribute bindings', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['type', 'destroyed', 'exists', 'nothing', 'notDefined', 'notNumber', 'explosions'],

    type: 'submit',
    exists: true,
    nothing: null,
    notDefined: undefined
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('type'), 'submit', 'updates type attribute');
  ok(view.$().attr('exists'), 'adds exists attribute when true');
  ok(!view.$().attr('nothing'), 'removes nothing attribute when null');
  equal(view.$().attr('notDefined'), undefined, 'removes notDefined attribute when undefined');
});

QUnit.test('should normalize case for attribute bindings', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['disAbled'],
    disAbled: true
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$().prop('disabled'), 'sets property with correct case');
});

QUnit.test('should render attribute bindings on input', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['type', 'isDisabled:disabled'],

    type: 'submit',
    isDisabled: true
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('type'), 'submit', 'updates type attribute');
  ok(view.$().prop('disabled'), 'supports customizing attribute name for Boolean values');
});

QUnit.test('should update attribute bindings', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['type', 'color:data-color', 'exploded', 'collapsed', 'times'],
    type: 'reset',
    color: 'red',
    exploded: 'bang',
    collapsed: null,
    times: 15
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('type'), 'reset', 'adds type attribute');
  equal(view.$().attr('data-color'), 'red', 'attr value set with ternary');
  equal(view.$().attr('exploded'), 'bang', 'adds exploded attribute when it has a value');
  ok(!view.$().attr('collapsed'), 'does not add null attribute');
  equal(view.$().attr('times'), '15', 'sets an integer to an attribute');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('type', 'submit');
    view.set('color', 'blue');
    view.set('exploded', null);
    view.set('collapsed', 'swish');
    view.set('times', 16);
  });

  equal(view.$().attr('type'), 'submit', 'adds type attribute');
  equal(view.$().attr('data-color'), 'blue', 'attr value set with ternary');
  ok(!view.$().attr('exploded'), 'removed exploded attribute when it is null');
  ok(view.$().attr('collapsed'), 'swish', 'adds an attribute when it has a value');
  equal(view.$().attr('times'), '16', 'updates an integer attribute');
});

QUnit.test('should update attribute bindings on input (boolean)', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['disabled'],
    disabled: true
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$().prop('disabled'), 'adds disabled property when true');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('disabled', false);
  });

  ok(!view.$().prop('disabled'), 'updates disabled property when false');
});

QUnit.test('should update attribute bindings on input (raw number prop)', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['size'],
    size: 20
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().prop('size'), 20, 'adds size property');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('size', 10);
  });

  equal(view.$().prop('size'), 10, 'updates size property');
});

QUnit.test('should update attribute bindings on input (name)', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['name'],
    name: 'bloody-awful'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().prop('name'), 'bloody-awful', 'adds name property');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('name', 'simply-grand');
  });

  equal(view.$().prop('name'), 'simply-grand', 'updates name property');
});

QUnit.test('should update attribute bindings with micro syntax', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['isDisabled:disabled'],
    type: 'reset',
    isDisabled: true
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  ok(view.$().prop('disabled'), 'adds disabled property when true');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('isDisabled', false);
  });
  ok(!view.$().prop('disabled'), 'updates disabled property when false');
});

QUnit.test('should allow namespaced attributes in micro syntax', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['xlinkHref:xlink:href'],
    xlinkHref: '/foo.png'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  equal(view.$().attr('xlink:href'), '/foo.png', 'namespaced attribute is set');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('xlinkHref', '/bar.png');
  });
  equal(view.$().attr('xlink:href'), '/bar.png', 'namespaced attribute is updated');
});

QUnit.test('should update attribute bindings on svg', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['viewBox'],
    viewBox: null
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('viewBox'), null, 'viewBox can be null');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('viewBox', '0 0 100 100');
  });

  equal(view.$().attr('viewBox'), '0 0 100 100', 'viewBox can be updated');
});

// This comes into play when using the {{#each}} helper. If the
// passed array item is a String, it will be converted into a
// String object instead of a normal string.
QUnit.test('should allow binding to String objects', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['foo'],
    // JSHint doesn't like `new String` so we'll create it the same way it gets created in practice
    foo: (function () {
      return this;
    }).call('bar')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  equal(view.$().attr('foo'), 'bar', 'should convert String object to bare string');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('foo', null);
  });

  ok(!view.$().attr('foo'), 'removes foo attribute when null');
});

QUnit.test('should teardown observers on rerender', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['foo'],
    classNameBindings: ['foo'],
    foo: 'bar'
  });

  appendView();

  equal((0, _emberMetalObserver.observersFor)(view, 'foo').length, 1, 'observer count after render is one');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal((0, _emberMetalObserver.observersFor)(view, 'foo').length, 1, 'observer count after rerender remains one');
});

QUnit.test('handles attribute bindings for properties', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['checked'],
    checked: null
  });

  appendView();

  equal(!!view.$().prop('checked'), false, 'precond - is not checked');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('checked', true);
  });

  equal(view.$().prop('checked'), true, 'changes to checked');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('checked', false);
  });

  equal(!!view.$().prop('checked'), false, 'changes to unchecked');
});

QUnit.test('handles `undefined` value for properties', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['value'],
    value: 'test'
  });

  appendView();

  equal(view.$().prop('value'), 'test', 'value is defined');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', undefined);
  });

  equal(view.$().prop('value'), '', 'value is blank');
});

QUnit.test('handles null value for attributes on text fields', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['value']
  });

  appendView();

  view.$().attr('value', 'test');

  equal(view.$().attr('value'), 'test', 'value is defined');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', null);
  });

  equal(!!view.$().prop('value'), false, 'value is not defined');
});

QUnit.test('handles a 0 value attribute on text fields', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'input',
    attributeBindings: ['value']
  });

  appendView();

  view.$().attr('value', 'test');
  equal(view.$().attr('value'), 'test', 'value is defined');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 0);
  });
  strictEqual(view.$().prop('value'), '0', 'value should be 0');
});

QUnit.test('attributeBindings should not fail if view has been removed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      attributeBindings: ['checked'],
      checked: true
    });
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  var error;
  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_events.changeProperties)(function () {
        view.set('checked', false);
        view.remove();
      });
    });
  } catch (e) {
    error = e;
  }
  ok(!error, error);
});

QUnit.test('attributeBindings should not fail if view has been destroyed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      attributeBindings: ['checked'],
      checked: true
    });
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  var error;
  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_events.changeProperties)(function () {
        view.set('checked', false);
        view.destroy();
      });
    });
  } catch (e) {
    error = e;
  }
  ok(!error, error);
});

QUnit.test('asserts if an attributeBinding is setup on class', function () {
  view = _emberViewsViewsView2['default'].create({
    attributeBindings: ['class']
  });

  expectAssertion(function () {
    appendView();
  }, 'You cannot use class as an attributeBinding, use classNameBindings instead.');

  // Remove render node to avoid "Render node exists without concomitant env"
  // assertion on teardown.
  view._renderNode = null;
});

QUnit.test('blacklists href bindings based on protocol', function () {
  /* jshint scripturl:true */

  view = _emberViewsViewsView2['default'].create({
    tagName: 'a',
    attributeBindings: ['href'],
    href: 'javascript:alert(\'foo\')'
  });

  appendView();

  equal(view.$().attr('href'), 'unsafe:javascript:alert(\'foo\')', 'value property sanitized');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('href', new _emberHtmlbarsUtilsString.SafeString(view.get('href')));
  });

  equal(view.$().attr('href'), 'javascript:alert(\'foo\')', 'value is not defined');
});

QUnit.test('attributeBindings should be overridable', function () {
  var ParentView = _emberViewsViewsView2['default'].extend({
    attributeBindings: ['href'],
    href: 'an href'
  });

  var ChildView = ParentView.extend({
    attributeBindings: ['newHref:href'],
    newHref: 'a new href'
  });

  view = ChildView.create();

  appendView();

  equal(view.$().attr('href'), 'a new href', 'expect value from subclass attribute binding');
});

QUnit.test('role attribute is included if provided as ariaRole', function () {
  view = _emberViewsViewsView2['default'].create({
    ariaRole: 'main'
  });

  appendView();

  equal(view.$().attr('role'), 'main');
});

QUnit.test('role attribute is not included if not provided', function () {
  view = _emberViewsViewsView2['default'].create();

  appendView();

  ok(!view.element.hasAttribute('role'), 'role attribute is not present');
});