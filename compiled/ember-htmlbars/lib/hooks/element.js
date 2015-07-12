/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = emberElement;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsSystemLookupHelper = require('ember-htmlbars/system/lookup-helper');

var _htmlbarsRuntimeHooks = require('htmlbars-runtime/hooks');

var _emberHtmlbarsSystemInvokeHelper = require('ember-htmlbars/system/invoke-helper');

var fakeElement;

function updateElementAttributesFromString(element, string) {
  if (!fakeElement) {
    fakeElement = document.createElement('div');
  }

  fakeElement.innerHTML = '<' + element.tagName + ' ' + string + '><' + '/' + element.tagName + '>';

  var attrs = fakeElement.firstChild.attributes;
  for (var i = 0, l = attrs.length; i < l; i++) {
    var attr = attrs[i];
    if (attr.specified) {
      element.setAttribute(attr.name, attr.value);
    }
  }
}

function emberElement(morph, env, scope, path, params, hash, visitor) {
  if ((0, _htmlbarsRuntimeHooks.handleRedirect)(morph, env, scope, path, params, hash, null, null, visitor)) {
    return;
  }

  var result;
  var helper = (0, _emberHtmlbarsSystemLookupHelper.findHelper)(path, scope.self, env);
  if (helper) {
    var helperStream = (0, _emberHtmlbarsSystemInvokeHelper.buildHelperStream)(helper, params, hash, { element: morph.element }, env, scope, null, path);
    result = helperStream.value();
  } else {
    result = env.hooks.get(env, scope, path);
  }

  var value = env.hooks.getValue(result);
  if (value) {
    _emberMetalCore2['default'].deprecate('Returning a string of attributes from a helper inside an element is deprecated.');
    updateElementAttributesFromString(morph.element, value);
  }
}

module.exports = exports['default'];