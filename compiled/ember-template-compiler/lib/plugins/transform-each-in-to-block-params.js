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
@module ember
@submodule ember-htmlbars
*/

/**
  An HTMLBars AST transformation that replaces all instances of

  ```handlebars
  {{#each item in items}}
  {{/each}}
  ```

  with

  ```handlebars
  {{#each items as |item|}}
  {{/each}}
  ```

  @class TransformEachInToBlockParams
  @private
*/
function TransformEachInToBlockParams(options) {
  // set later within HTMLBars to the syntax package
  this.syntax = null;
  this.options = options;
}

/**
  @private
  @method transform
  @param {AST} ast The AST to be transformed.
*/
TransformEachInToBlockParams.prototype.transform = function TransformEachInToBlockParams_transform(ast) {
  var b = this.syntax.builders;
  var walker = new this.syntax.Walker();
  var moduleName = this.options.moduleName;

  walker.visit(ast, function (node) {
    if (validate(node)) {

      var removedParams = node.params.splice(0, 2);
      var keyword = removedParams[0].original;
      var moduleInfo = undefined;

      if (node.type === 'BlockStatement') {
        moduleInfo = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, node.program.loc);

        if (node.program.blockParams.length) {
          throw new Error('You cannot use keyword (`{{#each foo in bar}}`) and block params (`{{#each bar as |foo|}}`) at the same time ' + moduleInfo + '.');
        }

        node.program.blockParams = [keyword];
      } else {
        moduleInfo = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, node.loc);

        node.hash.pairs.push(b.pair('keyword', b.string(keyword)));
      }

      _emberMetalCore2['default'].deprecate('Using the \'{{#each item in model}}\' form of the {{#each}} helper ' + moduleInfo + 'is deprecated. ' + 'Please use the block param form instead (\'{{#each model as |item|}}\').', false, { url: 'http://emberjs.com/guides/deprecations/#toc_code-in-code-syntax-for-code-each-code' });
    }
  });

  return ast;
};

function validate(node) {
  return (node.type === 'BlockStatement' || node.type === 'MustacheStatement') && node.path.original === 'each' && node.params.length === 3 && node.params[1].type === 'PathExpression' && node.params[1].original === 'in';
}

exports['default'] = TransformEachInToBlockParams;
module.exports = exports['default'];