/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.registerHandlebarsCompatibleHelper = registerHandlebarsCompatibleHelper;
exports.handlebarsHelper = handlebarsHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberHtmlbarsSystemMakeViewHelper = require('ember-htmlbars/system/make-view-helper');

var _emberHtmlbarsSystemMakeViewHelper2 = _interopRequireDefault(_emberHtmlbarsSystemMakeViewHelper);

var _emberHtmlbarsCompatMakeBoundHelper = require('ember-htmlbars/compat/make-bound-helper');

var _emberHtmlbarsCompatMakeBoundHelper2 = _interopRequireDefault(_emberHtmlbarsCompatMakeBoundHelper);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberHtmlbarsKeywords = require('ember-htmlbars/keywords');

var slice = [].slice;

function calculateCompatType(item) {
  if ((0, _emberMetalStreamsUtils.isStream)(item)) {
    return 'ID';
  } else {
    var itemType = typeof item;

    return itemType.toUpperCase();
  }
}

function pathFor(param) {
  if ((0, _emberMetalStreamsUtils.isStream)(param)) {
    // param arguments to helpers may have their path prefixes with self. For
    // example {{box-thing foo}} may have a param path of `self.foo` depending
    // on scope.
    if (param.source && param.source.dependee && param.source.dependee.label === 'self') {
      return param.path.slice(5);
    } else {
      return param.path;
    }
  } else {
    return param;
  }
}

/**
  Wraps an Handlebars helper with an HTMLBars helper for backwards compatibility.

  @class HandlebarsCompatibleHelper
  @constructor
  @private
*/
function HandlebarsCompatibleHelper(fn) {
  this.helperFunction = function helperFunc(params, hash, options, env, scope) {
    var param, fnResult;
    var hasBlock = options.template && options.template['yield'];

    var handlebarsOptions = {
      hash: {},
      types: new Array(params.length),
      hashTypes: {}
    };

    handlebarsOptions.hash = {};

    if (hasBlock) {
      handlebarsOptions.fn = function () {
        options.template['yield']();
      };

      if (options.inverse['yield']) {
        handlebarsOptions.inverse = function () {
          options.inverse['yield']();
        };
      }
    }

    for (var prop in hash) {
      param = hash[prop];
      handlebarsOptions.hashTypes[prop] = calculateCompatType(param);
      handlebarsOptions.hash[prop] = pathFor(param);
    }

    var args = new Array(params.length);
    for (var i = 0, l = params.length; i < l; i++) {
      param = params[i];
      handlebarsOptions.types[i] = calculateCompatType(param);
      args[i] = pathFor(param);
    }

    handlebarsOptions.legacyGetPath = function (path) {
      return env.hooks.get(env, scope, path).value();
    };

    handlebarsOptions.data = {
      view: scope.view
    };

    args.push(handlebarsOptions);

    fnResult = fn.apply(this, args);

    if (options.element) {
      _emberMetalCore2['default'].deprecate('Returning a string of attributes from a helper inside an element is deprecated.');
      applyAttributes(env.dom, options.element, fnResult);
    } else if (!options.template['yield']) {
      return fnResult;
    }
  };

  this.isHTMLBars = true;
}

HandlebarsCompatibleHelper.prototype = {
  preprocessArguments: function preprocessArguments() {}
};

function registerHandlebarsCompatibleHelper(name, value) {
  if (value && value.isLegacyViewHelper) {
    (0, _emberHtmlbarsKeywords.registerKeyword)(name, function (morph, env, scope, params, hash, template, inverse, visitor) {
      _emberMetalCore2['default'].assert('You can only pass attributes (such as name=value) not bare ' + 'values to a helper for a View found in \'' + value.viewClass + '\'', params.length === 0);

      env.hooks.keyword('view', morph, env, scope, [value.viewClass], hash, template, inverse, visitor);
      return true;
    });
    return;
  }

  var helper;

  if (value && value.isHTMLBars) {
    helper = value;
  } else {
    helper = new HandlebarsCompatibleHelper(value);
  }

  _emberHtmlbarsHelpers2['default'][name] = helper;
}

function handlebarsHelper(name, value) {
  _emberMetalCore2['default'].assert('You tried to register a component named \'' + name + '\', but component names must include a \'-\'', !_emberViewsViewsComponent2['default'].detect(value) || name.match(/-/));

  if (_emberViewsViewsView2['default'].detect(value)) {
    _emberHtmlbarsHelpers2['default'][name] = (0, _emberHtmlbarsSystemMakeViewHelper2['default'])(value);
  } else {
    var boundHelperArgs = slice.call(arguments, 1);
    var boundFn = _emberHtmlbarsCompatMakeBoundHelper2['default'].apply(this, boundHelperArgs);

    _emberHtmlbarsHelpers2['default'][name] = boundFn;
  }
}

function applyAttributes(dom, element, innerString) {
  var string = '<' + element.tagName + ' ' + innerString + '></div>';
  var fragment = dom.parseHTML(string, dom.createElement(element.tagName));

  var attrs = fragment.firstChild.attributes;

  for (var i = 0, l = attrs.length; i < l; i++) {
    element.setAttributeNode(attrs[i].cloneNode());
  }
}

exports['default'] = HandlebarsCompatibleHelper;