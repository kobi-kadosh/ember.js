/*globals Ember */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

QUnit.module('Global API Tests');

function confirmExport(property) {
  QUnit.test('confirm ' + property + ' is exported', function () {
    ok(Ember.get(window, property) + ' is exported propertly');
  });
}

confirmExport('Ember.DefaultResolver');
confirmExport('Ember.generateController');
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-helper')) {
  confirmExport('Ember.Helper');
  confirmExport('Ember.Helper.helper');
}