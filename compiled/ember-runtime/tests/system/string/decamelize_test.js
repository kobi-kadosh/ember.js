'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.decamelize');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.decamelize is not modified without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.decamelize, 'String.prototype helper disabled');
  });
}

QUnit.test('does nothing with normal string', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('my favorite items'), 'my favorite items');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.decamelize(), 'my favorite items');
  }
});

QUnit.test('does nothing with dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('css-class-name'), 'css-class-name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.decamelize(), 'css-class-name');
  }
});

QUnit.test('does nothing with underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('action_name'), 'action_name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action_name'.decamelize(), 'action_name');
  }
});

QUnit.test('converts a camelized string into all lower case separated by underscores.', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('innerHTML'), 'inner_html');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.decamelize(), 'inner_html');
  }
});

QUnit.test('decamelizes strings with numbers', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('size160Url'), 'size160_url');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('size160Url'.decamelize(), 'size160_url');
  }
});

QUnit.test('decamelize namespaced classified string', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('PrivateDocs/OwnerInvoice'), 'private_docs/owner_invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('PrivateDocs/OwnerInvoice'.decamelize(), 'private_docs/owner_invoice');
  }
});

QUnit.test('decamelize namespaced camelized string', function () {
  deepEqual((0, _emberRuntimeSystemString.decamelize)('privateDocs/ownerInvoice'), 'private_docs/owner_invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('privateDocs/ownerInvoice'.decamelize(), 'private_docs/owner_invoice');
  }
});