'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.classify');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.classify is not modified without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.classify, 'String.prototype helper disabled');
  });
}

QUnit.test('classify normal string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('my favorite items'), 'MyFavoriteItems');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.classify(), 'MyFavoriteItems');
  }
});

QUnit.test('classify dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('css-class-name'), 'CssClassName');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.classify(), 'CssClassName');
  }
});

QUnit.test('classify underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('action_name'), 'ActionName');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action_name'.classify(), 'ActionName');
  }
});

QUnit.test('does nothing with classified string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('InnerHTML'), 'InnerHTML');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('InnerHTML'.classify(), 'InnerHTML');
  }
});

QUnit.test('classify namespaced camelized string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('privateDocs/ownerInvoice'), 'PrivateDocs/OwnerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('privateDocs/ownerInvoice'.classify(), 'PrivateDocs/OwnerInvoice');
  }
});

QUnit.test('classify namespaced underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('private_docs/owner_invoice'), 'PrivateDocs/OwnerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private_docs/owner_invoice'.classify(), 'PrivateDocs/OwnerInvoice');
  }
});

QUnit.test('classify namespaced dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.classify)('private-docs/owner-invoice'), 'PrivateDocs/OwnerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private-docs/owner-invoice'.classify(), 'PrivateDocs/OwnerInvoice');
  }
});