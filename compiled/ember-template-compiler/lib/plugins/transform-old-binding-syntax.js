'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = TransformOldBindingSyntax;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerSystemCalculateLocationDisplay = require('ember-template-compiler/system/calculate-location-display');

var _emberTemplateCompilerSystemCalculateLocationDisplay2 = _interopRequireDefault(_emberTemplateCompilerSystemCalculateLocationDisplay);

function TransformOldBindingSyntax(options) {
  this.syntax = null;
  this.options = options;
}

TransformOldBindingSyntax.prototype.transform = function TransformOldBindingSyntax_transform(ast) {
  var moduleName = this.options.moduleName;
  var b = this.syntax.builders;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function (node) {
    if (!validate(node)) {
      return;
    }

    each(node.hash.pairs, function (pair) {
      var key = pair.key;
      var value = pair.value;

      var sourceInformation = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, pair.loc);

      if (key === 'classBinding') {
        return;
      }

      _emberMetalCore2['default'].assert('Setting \'attributeBindings\' via template helpers is not allowed ' + sourceInformation, key !== 'attributeBindings');

      if (key.substr(-7) === 'Binding') {
        var newKey = key.slice(0, -7);

        _emberMetalCore2['default'].deprecate('You\'re using legacy binding syntax: ' + key + '=' + exprToString(value) + ' ' + sourceInformation + '. Please replace with ' + newKey + '=' + value.original);

        pair.key = newKey;
        if (value.type === 'StringLiteral') {
          pair.value = b.path(value.original);
        }
      }
    });
  });

  return ast;
};

function validate(node) {
  return node.type === 'BlockStatement' || node.type === 'MustacheStatement';
}

function each(list, callback) {
  for (var i = 0, l = list.length; i < l; i++) {
    callback(list[i]);
  }
}

function exprToString(expr) {
  switch (expr.type) {
    case 'StringLiteral':
      return '"' + expr.original + '"';
    case 'PathExpression':
      return expr.original;
  }
}
module.exports = exports['default'];