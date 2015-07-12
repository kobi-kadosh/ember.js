'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberTemplateCompilerPlugins = require('ember-template-compiler/plugins');

var _emberTemplateCompilerPlugins2 = _interopRequireDefault(_emberTemplateCompilerPlugins);

var _emberTemplateCompilerSystemCompile_options = require('ember-template-compiler/system/compile_options');

var _emberTemplateCompilerSystemCompile_options2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile_options);

function comparePlugins(options) {
  var results = (0, _emberTemplateCompilerSystemCompile_options2['default'])(options);
  var expectedPlugins = _emberTemplateCompilerPlugins2['default'].ast.slice();

  expectedPlugins = expectedPlugins.concat(options.plugins.ast.slice());

  deepEqual(results.plugins.ast, expectedPlugins);
}

QUnit.module('ember-htmlbars: compile_options');

QUnit.test('repeated function calls should be able to have separate plugins', function () {
  comparePlugins({
    plugins: {
      ast: ['foo', 'bar']
    }
  });

  comparePlugins({
    plugins: {
      ast: ['baz', 'qux']
    }
  });
});

QUnit.test('options is not required', function () {
  var results = (0, _emberTemplateCompilerSystemCompile_options2['default'])();

  deepEqual(results.plugins.ast, _emberTemplateCompilerPlugins2['default'].ast.slice());
});

QUnit.test('options.plugins is not required', function () {
  var results = (0, _emberTemplateCompilerSystemCompile_options2['default'])({});

  deepEqual(results.plugins.ast, _emberTemplateCompilerPlugins2['default'].ast.slice());
});

QUnit.test('options.plugins.ast is not required', function () {
  var results = (0, _emberTemplateCompilerSystemCompile_options2['default'])({
    plugins: {}
  });

  deepEqual(results.plugins.ast, _emberTemplateCompilerPlugins2['default'].ast.slice());
});