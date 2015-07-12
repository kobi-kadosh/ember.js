'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var precompile = _emberHtmlbarsCompat2['default'].precompile;
var template = 'Hello World';
var result;

QUnit.module('ember-htmlbars: compat - Ember.Handlebars.precompile');

QUnit.test('precompile creates an object when asObject isn\'t defined', function () {
  result = precompile(template);
  equal(typeof result, 'object');
});

QUnit.test('precompile creates an object when asObject is true', function () {
  result = precompile(template, true);
  equal(typeof result, 'object');
});

QUnit.test('precompile creates a string when asObject is false', function () {
  result = precompile(template, false);
  equal(typeof result, 'string');
});