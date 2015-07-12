'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberTemplateCompilerSystemCalculateLocationDisplay = require('ember-template-compiler/system/calculate-location-display');

var _emberTemplateCompilerSystemCalculateLocationDisplay2 = _interopRequireDefault(_emberTemplateCompilerSystemCalculateLocationDisplay);

function DeprecateViewHelper(options) {
  // set later within HTMLBars to the syntax package
  this.syntax = null;
  this.options = options || {};
}

/**
  @private
  @method transform
  @param {AST} ast The AST to be transformed.
*/
DeprecateViewHelper.prototype.transform = function DeprecateViewHelper_transform(ast) {
  if (!!_emberMetalCore2['default'].ENV._ENABLE_LEGACY_VIEW_SUPPORT) {
    return ast;
  }
  var walker = new this.syntax.Walker();
  var moduleName = this.options && this.options.moduleName;

  walker.visit(ast, function (node) {
    if (!validate(node)) {
      return;
    }

    deprecateHelper(moduleName, node);
  });

  return ast;
};

function deprecateHelper(moduleName, node) {
  var paramValue = node.params.length && node.params[0].value;

  if (!paramValue) {
    return;
  } else if (paramValue === 'select') {
    deprecateSelect(moduleName, node);
  } else {
    _emberMetalCore2['default'].deprecate('Using the `{{view "string"}}` helper is deprecated. ' + (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, node.loc), false, { url: 'http://emberjs.com/deprecations/v1.x#toc_ember-view', id: 'view.helper' });
  }
}

function deprecateSelect(moduleName, node) {
  _emberMetalCore2['default'].deprecate('Using `{{view "select"}}` is deprecated. ' + (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, node.loc), false, { url: 'http://emberjs.com/deprecations/v1.x#toc_ember-select', id: 'view.helper.select' });
}

function validate(node) {
  return (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && node.path.parts[0] === 'view';
}

exports['default'] = DeprecateViewHelper;
module.exports = exports['default'];