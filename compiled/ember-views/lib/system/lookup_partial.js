'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = lookupPartial;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

function lookupPartial(env, templateName) {
  if (templateName == null) {
    return;
  }

  var nameParts = templateName.split('/');
  var lastPart = nameParts[nameParts.length - 1];

  nameParts[nameParts.length - 1] = '_' + lastPart;

  var underscoredName = nameParts.join('/');
  var template = templateFor(env, underscoredName, templateName);

  _emberMetalCore2['default'].assert('Unable to find partial with name "' + templateName + '"', !!template);

  return template;
}

function templateFor(env, underscored, name) {
  if (!name) {
    return;
  }
  _emberMetalCore2['default'].assert('templateNames are not allowed to contain periods: ' + name, name.indexOf('.') === -1);

  if (!env.container) {
    throw new _emberMetalError2['default']('Container was not found when looking up a views template. ' + 'This is most likely due to manually instantiating an Ember.View. ' + 'See: http://git.io/EKPpnA');
  }

  return env.container.lookup('template:' + underscored) || env.container.lookup('template:' + name);
}
module.exports = exports['default'];