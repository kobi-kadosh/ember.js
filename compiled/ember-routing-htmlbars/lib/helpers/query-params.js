/**
@module ember
@submodule ember-routing-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.queryParamsHelper = queryParamsHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// assert

var _emberRoutingSystemQuery_params = require('ember-routing/system/query_params');

var _emberRoutingSystemQuery_params2 = _interopRequireDefault(_emberRoutingSystemQuery_params);

/**
  This is a sub-expression to be used in conjunction with the link-to helper.
  It will supply url query parameters to the target route.

  Example

  {{#link-to 'posts' (query-params direction="asc")}}Sort{{/link-to}}

  @method query-params
  @for Ember.Handlebars.helpers
  @param {Object} hash takes a hash of query parameters
  @return {String} HTML string
  @public
*/

function queryParamsHelper(params, hash) {
  _emberMetalCore2['default'].assert('The `query-params` helper only accepts hash parameters, e.g. (query-params queryParamPropertyName=\'foo\') as opposed to just (query-params \'foo\')', params.length === 0);

  return _emberRoutingSystemQuery_params2['default'].create({
    values: hash
  });
}