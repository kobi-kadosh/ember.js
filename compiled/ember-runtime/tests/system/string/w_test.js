'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.w');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.w is not available without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.w, 'String.prototype helper disabled');
  });
}

QUnit.test('\'one two three\'.w() => [\'one\',\'two\',\'three\']', function () {
  deepEqual((0, _emberRuntimeSystemString.w)('one two three'), ['one', 'two', 'three']);
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('one two three'.w(), ['one', 'two', 'three']);
  }
});

QUnit.test('\'one    two    three\'.w() with extra spaces between words => [\'one\',\'two\',\'three\']', function () {
  deepEqual((0, _emberRuntimeSystemString.w)('one   two  three'), ['one', 'two', 'three']);
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('one   two  three'.w(), ['one', 'two', 'three']);
  }
});

QUnit.test('\'one two three\'.w() with tabs', function () {
  deepEqual((0, _emberRuntimeSystemString.w)('one\ttwo  three'), ['one', 'two', 'three']);
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('one\ttwo  three'.w(), ['one', 'two', 'three']);
  }
});