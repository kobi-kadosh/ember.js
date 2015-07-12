'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _htmlbarsUtilSafeString = require('htmlbars-util/safe-string');

var _htmlbarsUtilSafeString2 = _interopRequireDefault(_htmlbarsUtilSafeString);

var _emberHtmlbarsUtilsString = require('ember-htmlbars/utils/string');

QUnit.module('ember-htmlbars: SafeString');

QUnit.test('htmlSafe should return an instance of SafeString', function () {
  var safeString = (0, _emberHtmlbarsUtilsString.htmlSafe)('you need to be more <b>bold</b>');

  ok(safeString instanceof _htmlbarsUtilSafeString2['default'], 'should return SafeString');
});

QUnit.test('htmlSafe should return an empty string for null', function () {
  equal((0, _emberHtmlbarsUtilsString.htmlSafe)(null).toString(), '', 'should return an empty string');
});

QUnit.test('htmlSafe should return an empty string for undefined', function () {
  equal((0, _emberHtmlbarsUtilsString.htmlSafe)().toString(), '', 'should return an empty string');
});