'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = TransformOldClassBindingSyntax;

function TransformOldClassBindingSyntax(options) {
  this.syntax = null;
  this.options = options;
}

TransformOldClassBindingSyntax.prototype.transform = function TransformOldClassBindingSyntax_transform(ast) {
  var b = this.syntax.builders;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function (node) {
    if (!validate(node)) {
      return;
    }

    var allOfTheMicrosyntaxes = [];
    var allOfTheMicrosyntaxIndexes = [];
    var classPair = undefined;

    each(node.hash.pairs, function (pair, index) {
      var key = pair.key;

      if (key === 'classBinding' || key === 'classNameBindings') {
        allOfTheMicrosyntaxIndexes.push(index);
        allOfTheMicrosyntaxes.push(pair);
      } else if (key === 'class') {
        classPair = pair;
      }
    });

    if (allOfTheMicrosyntaxes.length === 0) {
      return;
    }

    var classValue = [];

    if (classPair) {
      classValue.push(classPair.value);
      classValue.push(b.string(' '));
    } else {
      classPair = b.pair('class', null);
      node.hash.pairs.push(classPair);
    }

    each(allOfTheMicrosyntaxIndexes, function (index) {
      node.hash.pairs.splice(index, 1);
    });

    each(allOfTheMicrosyntaxes, function (_ref) {
      var value = _ref.value;
      var loc = _ref.loc;

      var sexprs = [];
      // TODO: add helpful deprecation when both `classNames` and `classNameBindings` can
      // be removed.

      if (value.type === 'StringLiteral') {
        var microsyntax = parseMicrosyntax(value.original);

        buildSexprs(microsyntax, sexprs, b);

        classValue.push.apply(classValue, sexprs);
      }
    });

    var hash = b.hash();
    classPair.value = b.sexpr(b.string('concat'), classValue, hash);
  });

  return ast;
};

function buildSexprs(microsyntax, sexprs, b) {
  for (var i = 0, l = microsyntax.length; i < l; i++) {
    var _microsyntax$i = _slicedToArray(microsyntax[i], 3);

    var propName = _microsyntax$i[0];
    var activeClass = _microsyntax$i[1];
    var inactiveClass = _microsyntax$i[2];

    var sexpr = undefined;

    // :my-class-name microsyntax for static values
    if (propName === '') {
      sexpr = b.string(activeClass);
    } else {
      var params = [b.path(propName)];

      if (activeClass) {
        params.push(b.string(activeClass));
      } else {
        var sexprParams = [b.string(propName), b.path(propName)];

        var hash = b.hash();
        if (activeClass !== undefined) {
          hash.pairs.push(b.pair('activeClass', b.string(activeClass)));
        }

        if (inactiveClass !== undefined) {
          hash.pairs.push(b.pair('inactiveClass', b.string(inactiveClass)));
        }

        params.push(b.sexpr(b.string('-normalize-class'), sexprParams, hash));
      }

      if (inactiveClass) {
        params.push(b.string(inactiveClass));
      }

      sexpr = b.sexpr(b.string('if'), params);
    }

    sexprs.push(sexpr);
    sexprs.push(b.string(' '));
  }
}

function validate(node) {
  return node.type === 'BlockStatement' || node.type === 'MustacheStatement';
}

function each(list, callback) {
  for (var i = 0, l = list.length; i < l; i++) {
    callback(list[i], i);
  }
}

function parseMicrosyntax(string) {
  var segments = string.split(' ');

  for (var i = 0, l = segments.length; i < l; i++) {
    segments[i] = segments[i].split(':');
  }

  return segments;
}
module.exports = exports['default'];