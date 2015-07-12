'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.camelize');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.camelize is not modified without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.camelize, 'String.prototype helper disabled');
  });
}

QUnit.test('camelize normal string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('my favorite items'), 'myFavoriteItems');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.camelize(), 'myFavoriteItems');
  }
});

QUnit.test('camelize capitalized string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('I Love Ramen'), 'iLoveRamen');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('I Love Ramen'.camelize(), 'iLoveRamen');
  }
});

QUnit.test('camelize dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('css-class-name'), 'cssClassName');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.camelize(), 'cssClassName');
  }
});

QUnit.test('camelize underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('action_name'), 'actionName');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action_name'.camelize(), 'actionName');
  }
});

QUnit.test('camelize dot notation string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('action.name'), 'actionName');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action.name'.camelize(), 'actionName');
  }
});

QUnit.test('does nothing with camelcased string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('innerHTML'), 'innerHTML');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.camelize(), 'innerHTML');
  }
});

QUnit.test('camelize namespaced classified string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('PrivateDocs/OwnerInvoice'), 'privateDocs/ownerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('PrivateDocs/OwnerInvoice'.camelize(), 'privateDocs/ownerInvoice');
  }
});

QUnit.test('camelize namespaced underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('private_docs/owner_invoice'), 'privateDocs/ownerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private_docs/owner_invoice'.camelize(), 'privateDocs/ownerInvoice');
  }
});

QUnit.test('camelize namespaced dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.camelize)('private-docs/owner-invoice'), 'privateDocs/ownerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private-docs/owner-invoice'.camelize(), 'privateDocs/ownerInvoice');
  }
});