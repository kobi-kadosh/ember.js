'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = TransformItemClass;

function TransformItemClass() {
  this.syntax = null;
}

TransformItemClass.prototype.transform = function TransformItemClass_transform(ast) {
  var b = this.syntax.builders;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function (node) {
    if (!validate(node)) {
      return;
    }

    each(node.hash.pairs, function (pair) {
      var key = pair.key;
      var value = pair.value;

      if (key !== 'itemClass') {
        return;
      }
      if (value.type === 'StringLiteral') {
        return;
      }

      var propName = value.original;
      var params = [value];
      var sexprParams = [b.string(propName), b.path(propName)];

      params.push(b.sexpr(b.string('-normalize-class'), sexprParams));
      var sexpr = b.sexpr(b.string('if'), params);

      pair.value = sexpr;
    });
  });

  return ast;
};

function validate(node) {
  return (node.type === 'BlockStatement' || node.type === 'MustacheStatement') && node.path.original === 'collection';
}

function each(list, callback) {
  for (var i = 0, l = list.length; i < l; i++) {
    callback(list[i]);
  }
}
module.exports = exports['default'];