/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.validateLazyHelperName = validateLazyHelperName;
exports.findHelper = findHelper;
exports['default'] = lookupHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalCache = require('ember-metal/cache');

var _emberMetalCache2 = _interopRequireDefault(_emberMetalCache);

var _emberHtmlbarsCompatHelper = require('ember-htmlbars/compat/helper');

var _emberHtmlbarsCompatHelper2 = _interopRequireDefault(_emberHtmlbarsCompatHelper);

var CONTAINS_DASH_CACHE = new _emberMetalCache2['default'](1000, function (key) {
  return key.indexOf('-') !== -1;
});

exports.CONTAINS_DASH_CACHE = CONTAINS_DASH_CACHE;

function validateLazyHelperName(helperName, container, keywords, knownHelpers) {
  if (!container || helperName in keywords) {
    return false;
  }

  if (knownHelpers[helperName] || CONTAINS_DASH_CACHE.get(helperName)) {
    return true;
  }
}

function isLegacyBareHelper(helper) {
  return helper && (!helper.isHelperFactory && !helper.isHelperInstance && !helper.isHTMLBars);
}

/**
  Used to lookup/resolve handlebars helpers. The lookup order is:

  * Look for a registered helper
  * If a dash exists in the name:
    * Look for a helper registed in the container
    * Use Ember.ComponentLookup to find an Ember.Component that resolves
      to the given name

  @private
  @method resolveHelper
  @param {String} name the name of the helper to lookup
  @return {Handlebars Helper}
*/

function findHelper(name, view, env) {
  var helper = env.helpers[name];

  if (!helper) {
    var container = env.container;
    if (validateLazyHelperName(name, container, env.hooks.keywords, env.knownHelpers)) {
      var helperName = 'helper:' + name;
      if (container._registry.has(helperName)) {
        helper = container.lookupFactory(helperName);
        if (isLegacyBareHelper(helper)) {
          _emberMetalCore2['default'].deprecate('The helper "' + name + '" is a deprecated bare function helper. Please use Ember.Helper.build to wrap helper functions.');
          helper = new _emberHtmlbarsCompatHelper2['default'](helper);
        }
      }
    }
  }

  return helper;
}

function lookupHelper(name, view, env) {
  var helper = findHelper(name, view, env);

  _emberMetalCore2['default'].assert('A helper named \'' + name + '\' could not be found', !!helper);

  return helper;
}