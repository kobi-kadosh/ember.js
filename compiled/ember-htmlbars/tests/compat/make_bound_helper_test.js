/*jshint newcap:false*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

// import {expectAssertion} from "ember-metal/tests/debug_helpers";

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberHtmlbarsHelpersEach = require('ember-htmlbars/helpers/each');

var compile, helpers, helper;
compile = _emberHtmlbarsCompat2['default'].compile;
helpers = _emberHtmlbarsCompat2['default'].helpers;
helper = _emberHtmlbarsCompat2['default'].helper;

var view;

var originalLookup = _emberMetalCore2['default'].lookup;

function registerRepeatHelper() {
  expectDeprecationInHTMLBars();

  helper('repeat', function (value, options) {
    var count = options.hash.count || 1;
    var a = [];
    while (a.length < count) {
      a.push(value);
    }
    return a.join('');
  });
}

function expectDeprecationInHTMLBars() {}

QUnit.module('ember-htmlbars: compat - makeBoundHelper', {
  setup: function setup() {},
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('primitives should work correctly [DEPRECATED]', function () {
  expectDeprecation(_emberHtmlbarsHelpersEach.deprecation);
  expectDeprecation('Using the context switching form of `{{with}}` is deprecated. Please use the keyword form (`{{with foo as bar}}`) instead.');

  view = _emberViewsViewsView2['default'].create({
    prims: _emberMetalCore2['default'].A(['string', 12]),

    template: compile('{{#each view.prims}}{{#if this}}inside-if{{/if}}{{#with this}}inside-with{{/with}}{{/each}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'inside-ifinside-withinside-ifinside-with');
});

QUnit.test('should update bound helpers when properties change', function () {
  expectDeprecationInHTMLBars();

  helper('capitalize', function (value) {
    return value.toUpperCase();
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ name: 'Brogrammer' }),
    template: compile('{{capitalize name}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'BROGRAMMER', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'controller.name', 'wes');
  });

  equal(view.$().text(), 'WES', 'helper output updated');
});

QUnit.test('should update bound helpers in a subexpression when properties change', function () {
  expectDeprecationInHTMLBars();

  helper('dasherize', function (value) {
    return (0, _emberRuntimeSystemString.dasherize)(value);
  });

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      controller: { prop: 'isThing' },
      template: compile('<div {{bind-attr data-foo=(dasherize prop)}}>{{prop}}</div>')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div[data-foo="is-thing"]').text(), 'isThing', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.prop', 'notThing');

  equal(view.$('div[data-foo="not-thing"]').text(), 'notThing', 'helper output is correct');
});

QUnit.test('should allow for computed properties with dependencies', function () {
  expectDeprecationInHTMLBars();

  helper('capitalizeName', function (value) {
    return (0, _emberMetalProperty_get.get)(value, 'name').toUpperCase();
  }, 'name');

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({
      person: _emberRuntimeSystemObject2['default'].create({
        name: 'Brogrammer'
      })
    }),
    template: compile('{{capitalizeName person}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'BROGRAMMER', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'controller.person.name', 'wes');
  });

  equal(view.$().text(), 'WES', 'helper output updated');
});

QUnit.test('bound helpers should support options', function () {
  registerRepeatHelper();

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ text: 'ab' }),
    template: compile('{{repeat text count=3}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ababab', 'helper output is correct');
});

QUnit.test('bound helpers should support keywords', function () {
  expectDeprecationInHTMLBars();

  helper('capitalize', function (value) {
    return value.toUpperCase();
  });

  view = _emberViewsViewsView2['default'].create({
    text: 'ab',
    template: compile('{{capitalize view.text}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'AB', 'helper output is correct');
});

QUnit.test('bound helpers should support global paths [DEPRECATED]', function () {
  expectDeprecationInHTMLBars();

  helper('capitalize', function (value) {
    return value.toUpperCase();
  });

  _emberMetalCore2['default'].lookup = { Text: 'ab' };

  view = _emberViewsViewsView2['default'].create({
    template: compile('{{capitalize Text}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Global lookup of Text from a Handlebars template is deprecated/);

  equal(view.$().text(), 'AB', 'helper output is correct');
});

QUnit.test('bound helper should support this keyword', function () {
  expectDeprecationInHTMLBars();

  helper('capitalize', function (value) {
    return (0, _emberMetalProperty_get.get)(value, 'text').toUpperCase();
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ text: 'ab' }),
    template: compile('{{capitalize this}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'AB', 'helper output is correct');
});

QUnit.test('bound helpers should support bound options via `fooBinding` [DEPRECATED]', function () {
  registerRepeatHelper();

  var template;

  expectDeprecation(function () {
    template = compile('{{repeat text countBinding="numRepeats"}}');
  }, /You're using legacy binding syntax: countBinding="numRepeats"/);

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ text: 'ab', numRepeats: 3 }),
    template: template
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ababab', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.numRepeats', 4);
  });

  equal(view.$().text(), 'abababab', 'helper correctly re-rendered after bound option was changed');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.numRepeats', 2);
    view.set('controller.text', 'YES');
  });

  equal(view.$().text(), 'YESYES', 'helper correctly re-rendered after both bound option and property changed');
});

QUnit.test('bound helpers should support bound hash options', function () {
  registerRepeatHelper();

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ text: 'ab', numRepeats: 3 }),
    template: compile('{{repeat text count=numRepeats}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ababab', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.numRepeats', 4);
  });

  equal(view.$().text(), 'abababab', 'helper correctly re-rendered after bound option was changed');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.numRepeats', 2);
    view.set('controller.text', 'YES');
  });

  equal(view.$().text(), 'YESYES', 'helper correctly re-rendered after both bound option and property changed');
});

QUnit.test('bound helpers should support unquoted values as bound options', function () {
  registerRepeatHelper();

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ text: 'ab', numRepeats: 3 }),
    template: compile('{{repeat text count=numRepeats}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ababab', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.numRepeats', 4);
  });

  equal(view.$().text(), 'abababab', 'helper correctly re-rendered after bound option was changed');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.numRepeats', 2);
    view.set('controller.text', 'YES');
  });

  equal(view.$().text(), 'YESYES', 'helper correctly re-rendered after both bound option and property changed');
});

QUnit.test('bound helpers should support multiple bound properties', function () {
  expectDeprecationInHTMLBars();

  helper('combine', function () {
    return [].slice.call(arguments, 0, -1).join('');
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ thing1: 'ZOID', thing2: 'BERG' }),
    template: compile('{{combine thing1 thing2}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'ZOIDBERG', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('controller.thing2', 'NERD');
  });

  equal(view.$().text(), 'ZOIDNERD', 'helper correctly re-rendered after second bound helper property changed');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('controller').setProperties({
      thing1: 'WOOT',
      thing2: 'YEAH'
    });
  });

  equal(view.$().text(), 'WOOTYEAH', 'helper correctly re-rendered after both bound helper properties changed');
});

QUnit.test('bound helpers should expose property names in options.data.properties', function () {
  expectDeprecationInHTMLBars();

  helper('echo', function () {
    var options = arguments[arguments.length - 1];
    var values = [].slice.call(arguments, 0, -1);
    var a = [];
    for (var i = 0; i < values.length; ++i) {
      var propertyName = options.data.properties[i];
      a.push(propertyName);
    }
    return a.join(' ');
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({
      thing1: 'ZOID',
      thing2: 'BERG',
      thing3: _emberRuntimeSystemObject2['default'].create({
        foo: 123
      })
    }),
    template: compile('{{echo thing1 thing2 thing3.foo}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'thing1 thing2 thing3.foo', 'helper output is correct');
});

QUnit.test('bound helpers can be invoked with zero args', function () {
  expectDeprecationInHTMLBars();

  helper('troll', function (options) {
    return options.hash.text || 'TROLOLOL';
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ trollText: 'yumad' }),
    template: compile('{{troll}} and {{troll text="bork"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'TROLOLOL and bork', 'helper output is correct');
});

QUnit.test('bound helpers should not be invoked with blocks', function () {
  registerRepeatHelper();

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({}),
    template: compile('{{#repeat}}Sorry, Charlie{{/repeat}}')
  });

  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /registerBoundHelper-generated helpers do not support use with Handlebars blocks/i);
});

QUnit.test('should observe dependent keys passed to registerBoundHelper', function () {
  try {
    expectDeprecationInHTMLBars();

    var simplyObject = _emberRuntimeSystemObject2['default'].create({
      firstName: 'Jim',
      lastName: 'Owen',
      birthday: _emberRuntimeSystemObject2['default'].create({
        year: '2009'
      })
    });

    helper('fullName', function (value) {
      return [value.get('firstName'), value.get('lastName'), value.get('birthday.year')].join(' ');
    }, 'firstName', 'lastName', 'birthday.year');

    view = _emberViewsViewsView2['default'].create({
      template: compile('{{fullName this}}'),
      context: simplyObject
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'Jim Owen 2009', 'simply render the helper');

    (0, _emberMetalRun_loop2['default'])(simplyObject, simplyObject.set, 'firstName', 'Tom');

    equal(view.$().text(), 'Tom Owen 2009', 'render the helper after prop change');

    (0, _emberMetalRun_loop2['default'])(simplyObject, simplyObject.set, 'birthday.year', '1692');

    equal(view.$().text(), 'Tom Owen 1692', 'render the helper after path change');
  } finally {
    delete helpers['fullName'];
  }
});

QUnit.test('shouldn\'t treat raw numbers as bound paths', function () {
  expectDeprecationInHTMLBars();

  helper('sum', function (a, b) {
    return a + b;
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ aNumber: 1 }),
    template: compile('{{sum aNumber 1}} {{sum 0 aNumber}} {{sum 5 6}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), '2 1 11', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.aNumber', 5);

  equal(view.$().text(), '6 5 11', 'helper still updates as expected');
});

QUnit.test('shouldn\'t treat quoted strings as bound paths', function () {
  expectDeprecationInHTMLBars();

  var helperCount = 0;
  helper('combine', function (a, b, opt) {
    helperCount++;
    return a + b;
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({ word: 'jerkwater', loo: 'unused' }),
    template: compile('{{combine word \'loo\'}} {{combine \'\' word}} {{combine \'will\' "didi"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'jerkwaterloo jerkwater willdidi', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.word', 'bird');
  equal(view.$().text(), 'birdloo bird willdidi', 'helper still updates as expected');

  (0, _emberMetalRun_loop2['default'])(view, 'set', 'controller.loo', 'soup-de-doo');
  equal(view.$().text(), 'birdloo bird willdidi', 'helper still updates as expected');
  equal(helperCount, 5, 'changing controller property with same name as quoted string doesn\'t re-render helper');
});

QUnit.test('bound helpers can handle nulls in array (with primitives) [DEPRECATED]', function () {
  expectDeprecationInHTMLBars();

  // The problem here is that `undefined` is treated as "use the parent scope" in yieldItem

  helper('reverse', function (val) {
    return val ? val.split('').reverse().join('') : 'NOPE';
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({
      things: (0, _emberRuntimeSystemNative_array.A)([null, 0, undefined, false, 'OMG'])
    }),
    template: compile('{{#each things}}{{this}}|{{reverse this}} {{/each}}{{#each things as |thing|}}{{thing}}|{{reverse thing}} {{/each}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, _emberHtmlbarsHelpersEach.deprecation);

  equal(view.$().text(), '|NOPE 0|NOPE |NOPE false|NOPE OMG|GMO |NOPE 0|NOPE |NOPE false|NOPE OMG|GMO ', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('controller.things').pushObject('blorg');
    view.get('controller.things').shiftObject();
  });

  equal(view.$().text(), '0|NOPE |NOPE false|NOPE OMG|GMO blorg|grolb 0|NOPE |NOPE false|NOPE OMG|GMO blorg|grolb ', 'helper output is still correct');
});

QUnit.test('bound helpers can handle nulls in array (with objects)', function () {
  expectDeprecationInHTMLBars();

  helper('print-foo', function (val) {
    return val ? (0, _emberMetalProperty_get.get)(val, 'foo') : 'NOPE';
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create({
      things: (0, _emberRuntimeSystemNative_array.A)([null, { foo: 5 }])
    }),
    template: compile('{{#each things}}{{foo}}|{{print-foo this}} {{/each}}{{#each things as |thing|}}{{thing.foo}}|{{print-foo thing}} {{/each}}')
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, _emberHtmlbarsHelpersEach.deprecation);

  equal(view.$().text(), '|NOPE 5|5 |NOPE 5|5 ', 'helper output is correct');

  (0, _emberMetalRun_loop2['default'])(view.get('controller.things'), 'pushObject', { foo: 6 });

  equal(view.$().text(), '|NOPE 5|5 6|6 |NOPE 5|5 6|6 ', 'helper output is correct');
});

QUnit.test('bound helpers can handle `this` keyword when it\'s a non-object', function () {
  expectDeprecationInHTMLBars();

  helper('shout', function (value) {
    return value + '!';
  });

  view = _emberViewsViewsView2['default'].create({
    context: 'alex',
    template: compile('{{shout this}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'alex!', 'helper output is correct first');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context', '');
  });

  equal(view.$().text(), '!', 'helper output is correct after updating to empty');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context', 'wallace');
  });

  equal(view.$().text(), 'wallace!', 'helper output is correct after updating to wallace');
});

QUnit.test('should have correct argument types', function () {
  expectDeprecationInHTMLBars();

  helper('getType', function (value) {
    return value === null ? 'null' : typeof value;
  });

  view = _emberViewsViewsView2['default'].create({
    controller: _emberRuntimeSystemObject2['default'].create(),
    template: compile('{{getType null}}, {{getType undefProp}}, {{getType "string"}}, {{getType 1}}, {{getType}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'null, undefined, string, number, object', 'helper output is correct');
});

// leave this empty function as a place holder to
// enable a deprecation notice