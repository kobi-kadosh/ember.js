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
 {{input on="enter" action="doStuff"}}
 {{input on="key-press" action="doStuff"}}
  ```

  with

  ```handlebars
 {{input enter="doStuff"}}
 {{input key-press="doStuff"}}
  ```

  @private
  @class TransformInputOnToOnEvent
*/
function TransformInputOnToOnEvent(options) {
  // set later within HTMLBars to the syntax package
  this.syntax = null;
  this.options = options || {};
}

/**
  @private
  @method transform
  @param {AST} ast The AST to be transformed.
*/
TransformInputOnToOnEvent.prototype.transform = function TransformInputOnToOnEvent_transform(ast) {
  var pluginContext = this;
  var b = pluginContext.syntax.builders;
  var walker = new pluginContext.syntax.Walker();
  var moduleName = pluginContext.options.moduleName;

  walker.visit(ast, function (node) {
    if (pluginContext.validate(node)) {
      var action = hashPairForKey(node.hash, 'action');
      var on = hashPairForKey(node.hash, 'on');
      var onEvent = hashPairForKey(node.hash, 'onEvent');
      var normalizedOn = on || onEvent;
      var moduleInfo = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, node.loc);

      if (normalizedOn && normalizedOn.value.type !== 'StringLiteral') {
        _emberMetalCore2['default'].deprecate('Using a dynamic value for \'#{normalizedOn.key}=\' with the \'{{input}}\' helper ' + moduleInfo + 'is deprecated.');

        normalizedOn.key = 'onEvent';
        return; // exit early, as we cannot transform further
      }

      removeFromHash(node.hash, normalizedOn);
      removeFromHash(node.hash, action);

      if (!action) {
        _emberMetalCore2['default'].deprecate('Using \'{{input ' + normalizedOn.key + '="' + normalizedOn.value.value + '" ...}}\' without specifying an action ' + moduleInfo + 'will do nothing.');

        return; // exit early, if no action was available there is nothing to do
      }

      var specifiedOn = normalizedOn ? normalizedOn.key + '="' + normalizedOn.value.value + '" ' : '';
      if (normalizedOn && normalizedOn.value.value === 'keyPress') {
        // using `keyPress` in the root of the component will
        // clobber the keyPress event handler
        normalizedOn.value.value = 'key-press';
      }

      var expected = (normalizedOn ? normalizedOn.value.value : 'enter') + '="' + action.value.original + '"';

      _emberMetalCore2['default'].deprecate('Using \'{{input ' + specifiedOn + 'action="' + action.value.original + '"}}\' ' + moduleInfo + 'is deprecated. Please use \'{{input ' + expected + '}}\' instead.');
      if (!normalizedOn) {
        normalizedOn = b.pair('onEvent', b.string('enter'));
      }

      node.hash.pairs.push(b.pair(normalizedOn.value.value, action.value));
    }
  });

  return ast;
};

TransformInputOnToOnEvent.prototype.validate = function TransformWithAsToHash_validate(node) {
  return node.type === 'MustacheStatement' && node.path.original === 'input' && (hashPairForKey(node.hash, 'action') || hashPairForKey(node.hash, 'on') || hashPairForKey(node.hash, 'onEvent'));
};

function hashPairForKey(hash, key) {
  for (var i = 0, l = hash.pairs.length; i < l; i++) {
    var pair = hash.pairs[i];
    if (pair.key === key) {
      return pair;
    }
  }

  return false;
}

function removeFromHash(hash, pairToRemove) {
  var newPairs = [];
  for (var i = 0, l = hash.pairs.length; i < l; i++) {
    var pair = hash.pairs[i];

    if (pair !== pairToRemove) {
      newPairs.push(pair);
    }
  }

  hash.pairs = newPairs;
}

exports['default'] = TransformInputOnToOnEvent;
module.exports = exports['default'];