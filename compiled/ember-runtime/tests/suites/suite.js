'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalProperty_get = require('ember-metal/property_get');

/*
  @class
  A Suite can be used to define a reusable set of unit tests that can be
  applied to any object.  Suites are most useful for defining tests that
  work against a mixin or plugin API.  Developers implementing objects that
  use the mixin or support the API can then run these tests against their
  own code to verify compliance.

  To define a suite, you need to define the tests themselves as well as a
  callback API implementers can use to tie your tests to their specific class.

  ## Defining a Callback API

  To define the callback API, just extend this class and add your properties
  or methods that must be provided.

  ## Defining Unit Tests

  To add unit tests, use the suite.module() or suite.test() methods instead
  of a regular module() or test() method when defining your tests.  This will
  add the tests to the suite.

  ## Using a Suite

  To use a Suite to test your own objects, extend the suite subclass and
  define any required methods.  Then call run() on the new subclass.  This
  will create an instance of your class and then defining the unit tests.

  @extends Ember.Object
  @private
*/
var Suite = _emberRuntimeSystemObject2['default'].extend({

  /*
    __Required.__ You must implement this method to apply this mixin.
      Define a name for these tests - all modules are prefixed w/ it.
      @type String
  */
  name: null,

  /*
    Invoked to actually run the test - overridden by mixins
  */
  run: function run() {}

});

Suite.reopenClass({

  plan: null,

  run: function run() {
    var C = this;
    return new C().run();
  },

  module: function module(desc, opts) {
    if (!opts) {
      opts = {};
    }

    var _setup = opts.setup;
    var _teardown = opts.teardown;
    this.reopen({
      run: function run() {
        this._super.apply(this, arguments);
        var title = (0, _emberMetalProperty_get.get)(this, 'name') + ': ' + desc;
        var ctx = this;
        QUnit.module(title, {
          setup: function setup() {
            if (_setup) {
              _setup.call(ctx);
            }
          },

          teardown: function teardown() {
            if (_teardown) {
              _teardown.call(ctx);
            }
          }
        });
      }
    });
  },

  test: function test(name, func) {
    this.reopen({
      run: function run() {
        this._super.apply(this, arguments);
        var ctx = this;

        if (!func) {
          QUnit.test(name); // output warning
        } else {
          QUnit.test(name, function () {
            func.call(ctx);
          });
        }
      }
    });
  },

  // convert to guids to minimize logging.
  same: function same(actual, exp, message) {
    actual = actual && actual.map ? actual.map(function (x) {
      return (0, _emberMetalUtils.guidFor)(x);
    }) : actual;
    exp = exp && exp.map ? exp.map(function (x) {
      return (0, _emberMetalUtils.guidFor)(x);
    }) : exp;
    return deepEqual(actual, exp, message);
  },

  // easy way to disable tests
  notest: function notest() {},

  importModuleTests: function importModuleTests(builder) {
    var _this = this;

    this.module(builder._module);

    builder._tests.forEach(function (descAndFunc) {
      _this.test.apply(_this, descAndFunc);
    });
  }
});

var SuiteModuleBuilder = _emberRuntimeSystemObject2['default'].extend({
  _module: null,
  _tests: null,

  init: function init() {
    this._tests = [];
  },

  module: function module(name) {
    this._module = name;
  },

  test: function test(name, func) {
    this._tests.push([name, func]);
  }
});

exports.SuiteModuleBuilder = SuiteModuleBuilder;
exports.Suite = Suite;
exports['default'] = Suite;