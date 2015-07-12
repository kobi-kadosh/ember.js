'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberTemplateCompilerPlugins = require('ember-template-compiler/plugins');

var _emberTemplateCompilerPlugins2 = _interopRequireDefault(_emberTemplateCompilerPlugins);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var originalASTPlugins;

QUnit.module('ember-htmlbars: Ember.HTMLBars.registerASTPlugin', {
  setup: function setup() {
    originalASTPlugins = _emberTemplateCompilerPlugins2['default'].ast.slice();
  },

  teardown: function teardown() {
    _emberTemplateCompilerPlugins2['default'].ast = originalASTPlugins;
  }
});

QUnit.test('registering a plugin adds it to htmlbars-compiler options', function () {
  expect(2);

  function TestPlugin() {
    ok(true, 'TestPlugin instantiated');
  }

  TestPlugin.prototype.transform = function (ast) {
    ok(true, 'transform was called');

    return ast;
  };

  (0, _emberTemplateCompilerPlugins.registerPlugin)('ast', TestPlugin);

  (0, _emberTemplateCompilerSystemCompile2['default'])('some random template');
});

QUnit.test('registering an unknown type throws an error', function () {
  throws(function () {
    (0, _emberTemplateCompilerPlugins.registerPlugin)('asdf', 'whatever');
  }, /Attempting to register "whatever" as "asdf" which is not a valid HTMLBars plugin type./);
});