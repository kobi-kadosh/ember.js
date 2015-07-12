/**
@module ember
@submodule ember-htmlbars
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerSystemCalculateLocationDisplay = require('ember-template-compiler/system/calculate-location-display');

var _emberTemplateCompilerSystemCalculateLocationDisplay2 = _interopRequireDefault(_emberTemplateCompilerSystemCalculateLocationDisplay);

/**
  An HTMLBars AST transformation that replaces all instances of

  ```handlebars
  {{#with foo.bar as bar}}
  {{/with}}
  ```

  with

  ```handlebars
  {{#with foo.bar as |bar|}}
  {{/with}}
  ```

  @private
  @class TransformWithAsToHash
*/
function TransformWithAsToHash(options) {
  // set later within HTMLBars to the syntax package
  this.syntax = null;
  this.options = options || {};
}

/**
  @private
  @method transform
  @param {AST} ast The AST to be transformed.
*/
TransformWithAsToHash.prototype.transform = function TransformWithAsToHash_transform(ast) {
  var pluginContext = this;
  var walker = new pluginContext.syntax.Walker();
  var moduleName = this.options.moduleName;

  walker.visit(ast, function (node) {
    if (pluginContext.validate(node)) {

      if (node.program && node.program.blockParams.length) {
        throw new Error('You cannot use keyword (`{{with foo as bar}}`) and block params (`{{with foo as |bar|}}`) at the same time.');
      }

      var moduleInfo = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, node.program.loc);

      _emberMetalCore2['default'].deprecate('Using {{with}} without block syntax ' + moduleInfo + 'is deprecated. ' + 'Please use standard block form (`{{#with foo as |bar|}}`) ' + 'instead.', false, { url: 'http://emberjs.com/deprecations/v1.x/#toc_code-as-code-sytnax-for-code-with-code' });

      var removedParams = node.params.splice(1, 2);
      var keyword = removedParams[1].original;
      node.program.blockParams = [keyword];
    }
  });

  return ast;
};

TransformWithAsToHash.prototype.validate = function TransformWithAsToHash_validate(node) {
  return node.type === 'BlockStatement' && node.path.original === 'with' && node.params.length === 3 && node.params[1].type === 'PathExpression' && node.params[1].original === 'as';
};

exports['default'] = TransformWithAsToHash;
module.exports = exports['default'];