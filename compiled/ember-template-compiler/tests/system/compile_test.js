'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _htmlbarsCompilerCompiler = require('htmlbars-compiler/compiler');

QUnit.module('ember-htmlbars: compile');

QUnit.test('compiles the provided template with htmlbars', function () {
  var templateString = '{{foo}} -- {{some-bar blah=\'foo\'}}';

  var actual = (0, _emberTemplateCompilerSystemCompile2['default'])(templateString);
  var expected = (0, _htmlbarsCompilerCompiler.compile)(templateString);

  equal(actual.toString(), expected.toString(), 'compile function matches content with htmlbars compile');
});

QUnit.test('calls template on the compiled function', function () {
  var templateString = '{{foo}} -- {{some-bar blah=\'foo\'}}';

  var actual = (0, _emberTemplateCompilerSystemCompile2['default'])(templateString);

  ok(actual.isTop, 'sets isTop via template function');
  ok(actual.isMethod === false, 'sets isMethod via template function');
});

QUnit.test('includes the current revision in the compiled template', function () {
  var templateString = '{{foo}} -- {{some-bar blah=\'foo\'}}';

  var actual = (0, _emberTemplateCompilerSystemCompile2['default'])(templateString);

  equal(actual.meta.revision, 'Ember@VERSION_STRING_PLACEHOLDER', 'revision is included in generated template');
});

QUnit.test('the template revision is different than the HTMLBars default revision', function () {
  var templateString = '{{foo}} -- {{some-bar blah=\'foo\'}}';

  var actual = (0, _emberTemplateCompilerSystemCompile2['default'])(templateString);
  var expected = (0, _htmlbarsCompilerCompiler.compile)(templateString);

  ok(actual.meta.revision !== expected.meta.revision, 'revision differs from default');
});

QUnit.test('{{with}} template deprecation includes moduleName if provided', function () {
  var templateString = '{{#with foo as bar}} {{bar}} {{/with}}';

  expectDeprecation(function () {
    (0, _emberTemplateCompilerSystemCompile2['default'])(templateString, {
      moduleName: 'foo/bar/baz'
    });
  }, /foo\/bar\/baz/);
});