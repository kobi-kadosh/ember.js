'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.buildHelperStream = buildHelperStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberHtmlbarsStreamsHelperInstance = require('ember-htmlbars/streams/helper-instance');

var _emberHtmlbarsStreamsHelperInstance2 = _interopRequireDefault(_emberHtmlbarsStreamsHelperInstance);

var _emberHtmlbarsStreamsHelperFactory = require('ember-htmlbars/streams/helper-factory');

var _emberHtmlbarsStreamsHelperFactory2 = _interopRequireDefault(_emberHtmlbarsStreamsHelperFactory);

var _emberHtmlbarsStreamsBuiltInHelper = require('ember-htmlbars/streams/built-in-helper');

var _emberHtmlbarsStreamsBuiltInHelper2 = _interopRequireDefault(_emberHtmlbarsStreamsBuiltInHelper);

var _emberHtmlbarsStreamsCompatHelper = require('ember-htmlbars/streams/compat-helper');

var _emberHtmlbarsStreamsCompatHelper2 = _interopRequireDefault(_emberHtmlbarsStreamsCompatHelper);

function buildHelperStream(helper, params, hash, templates, env, scope, context, label) {
  _emberMetalCore2['default'].assert('Helpers may not be used in the block form, for example {{#my-helper}}{{/my-helper}}. Please use a component, or alternatively use the helper in combination with a built-in Ember helper, for example {{#if (my-helper)}}{{/if}}.', !helper.isHelperInstance || !helper.isHelperFactory && !templates.template.meta);
  if (helper.isHelperFactory) {
    return new _emberHtmlbarsStreamsHelperFactory2['default'](helper, params, hash, label);
  } else if (helper.isHelperInstance) {
    return new _emberHtmlbarsStreamsHelperInstance2['default'](helper, params, hash, label);
  } else if (helper.helperFunction) {
    return new _emberHtmlbarsStreamsCompatHelper2['default'](helper, params, hash, templates, env, scope, label);
  } else {
    return new _emberHtmlbarsStreamsBuiltInHelper2['default'](helper, params, hash, templates, env, scope, context, label);
  }
}