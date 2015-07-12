'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = TransformEachIntoCollection;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerSystemCalculateLocationDisplay = require('ember-template-compiler/system/calculate-location-display');

var _emberTemplateCompilerSystemCalculateLocationDisplay2 = _interopRequireDefault(_emberTemplateCompilerSystemCalculateLocationDisplay);

function TransformEachIntoCollection(options) {
  this.options = options;
  this.syntax = null;
}

TransformEachIntoCollection.prototype.transform = function TransformEachIntoCollection_transform(ast) {
  var moduleName = this.options.moduleName;
  var b = this.syntax.builders;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function (node) {
    var legacyHashKey = validate(node);
    if (!legacyHashKey) {
      return;
    }

    var moduleInfo = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, legacyHashKey.loc);

    _emberMetalCore2['default'].deprecate('Using \'' + legacyHashKey.key + '\' with \'{{each}}\' ' + moduleInfo + 'is deprecated.  Please refactor to a component.');

    var list = node.params.shift();
    node.path = b.path('collection');

    node.params.unshift(b.string('-legacy-each'));

    var pair = b.pair('content', list);
    pair.loc = list.loc;

    node.hash.pairs.push(pair);

    //pair = b.pair('dataSource', list);
    //node.hash.pairs.push(pair);
  });

  return ast;
};

function validate(node) {
  if ((node.type === 'BlockStatement' || node.type === 'MustacheStatement') && node.path.original === 'each') {

    return any(node.hash.pairs, function (pair) {
      var key = pair.key;
      return key === 'itemController' || key === 'itemView' || key === 'itemViewClass' || key === 'tagName' || key === 'emptyView' || key === 'emptyViewClass';
    });
  }

  return false;
}

function any(list, predicate) {
  for (var i = 0, l = list.length; i < l; i++) {
    if (predicate(list[i])) {
      return list[i];
    }
  }

  return false;
}
module.exports = exports['default'];