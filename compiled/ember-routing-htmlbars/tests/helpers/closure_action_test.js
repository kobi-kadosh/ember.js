'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var innerComponent, outerComponent;

if ((0, _emberMetalFeatures2['default'])('ember-routing-htmlbars-improved-actions')) {

  QUnit.module('ember-routing-htmlbars: action helper', {
    setup: function setup() {},

    teardown: function teardown() {
      (0, _emberRuntimeTestsUtils.runDestroy)(innerComponent);
      (0, _emberRuntimeTestsUtils.runDestroy)(outerComponent);
    }
  });

  QUnit.test('action should be called', function (assert) {
    assert.expect(1);

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit();
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view innerComponent submit=(action outerSubmit)}}'),
      innerComponent: innerComponent,
      outerSubmit: function outerSubmit() {
        assert.ok(true, 'action is called');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('action value is returned', function (assert) {
    assert.expect(1);

    var returnedValue = 'terrible tom';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        var actualReturnedValue = this.attrs.submit();
        assert.equal(actualReturnedValue, returnedValue, 'action can return to caller');
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view innerComponent submit=(action outerSubmit)}}'),
      innerComponent: innerComponent,
      outerSubmit: function outerSubmit() {
        return returnedValue;
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('action should be called on the correct scope', function (assert) {
    assert.expect(1);

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit();
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view innerComponent submit=(action outerSubmit)}}'),
      innerComponent: innerComponent,
      isOuterComponent: true,
      outerSubmit: function outerSubmit() {
        assert.ok(this.isOuterComponent, 'action has the correct context');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('arguments to action are passed, curry', function (assert) {
    assert.expect(4);

    var first = 'mitch';
    var second = 'martin';
    var third = 'matt';
    var fourth = 'wacky wycats';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit(fourth);
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      third: third,
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action (action outerSubmit "' + first + '") "' + second + '" third)}}\n      '),
      innerComponent: innerComponent,
      outerSubmit: function outerSubmit(actualFirst, actualSecond, actualThird, actualFourth) {
        assert.equal(actualFirst, first, 'action has the correct first arg');
        assert.equal(actualSecond, second, 'action has the correct second arg');
        assert.equal(actualThird, third, 'action has the correct third arg');
        assert.equal(actualFourth, fourth, 'action has the correct fourth arg');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('arguments to action are bound', function (assert) {
    assert.expect(1);

    var value = 'lazy leah';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit();
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action outerSubmit value)}}\n      '),
      innerComponent: innerComponent,
      value: '',
      outerSubmit: function outerSubmit(actualValue) {
        assert.equal(actualValue, value, 'action has the correct first arg');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      outerComponent.set('value', value);
    });

    innerComponent.fireAction();
  });

  QUnit.test('array arguments are passed correctly to action', function (assert) {
    assert.expect(3);

    var first = 'foo';
    var second = [3, 5];
    var third = [4, 9];

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit(second, third);
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action outerSubmit first)}}\n      '),
      innerComponent: innerComponent,
      value: '',
      outerSubmit: function outerSubmit(actualFirst, actualSecond, actualThird) {
        assert.equal(actualFirst, first, 'action has the correct first arg');
        assert.equal(actualSecond, second, 'action has the correct second arg');
        assert.equal(actualThird, third, 'action has the correct third arg');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      outerComponent.set('first', first);
      outerComponent.set('second', second);
    });

    innerComponent.fireAction();
  });

  QUnit.test('mut values can be wrapped in actions, are settable', function (assert) {
    assert.expect(1);

    var newValue = 'trollin trek';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit(newValue);
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action (mut outerMut))}}\n      '),
      innerComponent: innerComponent,
      outerMut: 'patient peter'
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
      assert.equal(outerComponent.get('outerMut'), newValue, 'mut value is set');
    });
  });

  QUnit.test('mut values can be wrapped in actions, are settable with a curry', function (assert) {
    assert.expect(1);

    var newValue = 'trollin trek';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit();
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action (mut outerMut) \'' + newValue + '\')}}\n      '),
      innerComponent: innerComponent,
      outerMut: 'patient peter'
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
      assert.equal(outerComponent.get('outerMut'), newValue, 'mut value is set');
    });
  });

  QUnit.test('action can create closures over actions', function (assert) {
    assert.expect(3);

    var first = 'raging robert';
    var second = 'mild machty';
    var returnValue = 'butch brian';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        var actualReturnedValue = this.attrs.submit(second);
        assert.equal(actualReturnedValue, returnValue, 'return value is present');
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action \'outerAction\' \'' + first + '\')}}\n      '),
      innerComponent: innerComponent,
      actions: {
        outerAction: function outerAction(actualFirst, actualSecond) {
          assert.equal(actualFirst, first, 'first argument is correct');
          assert.equal(actualSecond, second, 'second argument is correct');
          return returnValue;
        }
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('provides a helpful error if an action is not present', function (assert) {
    assert.expect(1);

    innerComponent = _emberViewsViewsComponent2['default'].create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action \'doesNotExist\')}}\n      '),
      innerComponent: innerComponent,
      actions: {
        something: function something() {}
      }
    }).create();

    throws(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);
    }, /An action named 'doesNotExist' was not found in /);
  });

  QUnit.test('provides a helpful error if actions hash is not present', function (assert) {
    assert.expect(1);

    innerComponent = _emberViewsViewsComponent2['default'].create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action \'doesNotExist\')}}\n      '),
      innerComponent: innerComponent
    }).create();

    throws(function () {
      (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);
    }, /An action named 'doesNotExist' was not found in /);
  });

  QUnit.test('action can create closures over actions with target', function (assert) {
    assert.expect(1);

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit();
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action \'outerAction\' target=otherComponent)}}\n      '),
      innerComponent: innerComponent,
      otherComponent: (0, _emberMetalComputed.computed)(function () {
        return {
          actions: {
            outerAction: function outerAction(actualFirst, actualSecond) {
              assert.ok(true, 'action called on otherComponent');
            }
          }
        };
      })
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('value can be used with action over actions', function (assert) {
    assert.expect(1);

    var newValue = 'yelping yehuda';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit({
          readProp: newValue
        });
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action \'outerAction\' value="readProp")}}\n      '),
      innerComponent: innerComponent,
      outerContent: {
        readProp: newValue
      },
      actions: {
        outerAction: function outerAction(actualValue) {
          assert.equal(actualValue, newValue, 'value is read');
        }
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('action will read the value of a first property', function (assert) {
    assert.expect(1);

    var newValue = 'irate igor';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit({
          readProp: newValue
        });
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action outerAction value="readProp")}}\n      '),
      innerComponent: innerComponent,
      outerAction: function outerAction(actualNewValue) {
        assert.equal(actualNewValue, newValue, 'property is read');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('action will read the value of a curried first argument property', function (assert) {
    assert.expect(1);

    var newValue = 'kissing kris';

    innerComponent = _emberViewsViewsComponent2['default'].extend({
      fireAction: function fireAction() {
        this.attrs.submit();
      }
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=(action outerAction objectArgument value="readProp")}}\n      '),
      innerComponent: innerComponent,
      objectArgument: {
        readProp: newValue
      },
      outerAction: function outerAction(actualNewValue) {
        assert.equal(actualNewValue, newValue, 'property is read');
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });

  QUnit.test('action closure does not get auto-mut wrapped', function (assert) {
    assert.expect(3);

    var first = 'raging robert';
    var second = 'mild machty';
    var returnValue = 'butch brian';

    innerComponent = _emberMetalCore2['default'].Component.extend({
      middleComponent: middleComponent,

      fireAction: function fireAction() {
        var actualReturnedValue = this.attrs.submit(second);
        assert.equal(actualReturnedValue, returnValue, 'return value is present');
      }
    }).create();

    var middleComponent = _emberViewsViewsComponent2['default'].extend({
      innerComponent: innerComponent,

      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view innerComponent submit=attrs.submit}}\n      ')
    }).create();

    outerComponent = _emberViewsViewsComponent2['default'].extend({
      middleComponent: middleComponent,

      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('\n        {{view middleComponent submit=(action \'outerAction\' \'' + first + '\')}}\n      '),

      actions: {
        outerAction: function outerAction(actualFirst, actualSecond) {
          assert.equal(actualFirst, first, 'first argument is correct');
          assert.equal(actualSecond, second, 'second argument is correct');

          return returnValue;
        }
      }
    }).create();

    (0, _emberRuntimeTestsUtils.runAppend)(outerComponent);

    (0, _emberMetalRun_loop2['default'])(function () {
      innerComponent.fireAction();
    });
  });
}

// this is present to ensure `actions` hash is present
// a different error is triggered if `actions` is missing
// completely