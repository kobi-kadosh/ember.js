'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = makeBoundHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

/**
@module ember
@submodule ember-htmlbars
*/

//import Helper from "ember-htmlbars/system/helper";

/**
  A helper function used by `registerBoundHelper`. Takes the
  provided Handlebars helper function fn and returns it in wrapped
  bound helper form.

  The main use case for using this outside of `registerBoundHelper`
  is for registering helpers on the container:

  ```js
  var boundHelperFn = Ember.Handlebars.makeBoundHelper(function(word) {
    return word.toUpperCase();
  });

  container.register('helper:my-bound-helper', boundHelperFn);
  ```

  In the above example, if the helper function hadn't been wrapped in
  `makeBoundHelper`, the registered helper would be unbound.

  @method makeBoundHelper
  @for Ember.Handlebars
  @param {Function} fn
  @param {String} dependentKeys*
  @since 1.2.0
  @deprecated
  @private
*/

function makeBoundHelper(fn) {
  for (var _len = arguments.length, dependentKeys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    dependentKeys[_key - 1] = arguments[_key];
  }

  return {
    _dependentKeys: dependentKeys,

    isHandlebarsCompat: true,
    isHTMLBars: true,

    helperFunction: function helperFunction(params, hash, templates) {
      _emberMetalCore2['default'].assert('registerBoundHelper-generated helpers do not support use with Handlebars blocks.', !templates.template['yield']);

      var args = (0, _emberMetalStreamsUtils.readArray)(params);
      var properties = new Array(params.length);

      for (var i = 0, l = params.length; i < l; i++) {
        var param = params[i];

        if ((0, _emberMetalStreamsUtils.isStream)(param)) {
          properties[i] = param.label;
        } else {
          properties[i] = param;
        }
      }

      args.push({ hash: (0, _emberMetalStreamsUtils.readHash)(hash), templates: templates, data: { properties: properties } });
      return fn.apply(undefined, args);
    }
  };
}

module.exports = exports['default'];