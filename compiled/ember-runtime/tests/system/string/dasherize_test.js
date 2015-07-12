'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.dasherize');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.dasherize is not modified without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.dasherize, 'String.prototype helper disabled');
  });
}

QUnit.test('dasherize normal string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('my favorite items'), 'my-favorite-items');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.dasherize(), 'my-favorite-items');
  }
});

QUnit.test('does nothing with dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('css-class-name'), 'css-class-name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.dasherize(), 'css-class-name');
  }
});

QUnit.test('dasherize underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('action_name'), 'action-name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action_name'.dasherize(), 'action-name');
  }
});

QUnit.test('dasherize camelcased string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('innerHTML'), 'inner-html');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.dasherize(), 'inner-html');
  }
});

QUnit.test('dasherize string that is the property name of Object.prototype', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('toString'), 'to-string');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('toString'.dasherize(), 'to-string');
  }
});

QUnit.test('dasherize namespaced classified string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('PrivateDocs/OwnerInvoice'), 'private-docs/owner-invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('PrivateDocs/OwnerInvoice'.dasherize(), 'private-docs/owner-invoice');
  }
});

QUnit.test('dasherize namespaced camelized string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('privateDocs/ownerInvoice'), 'private-docs/owner-invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('privateDocs/ownerInvoice'.dasherize(), 'private-docs/owner-invoice');
  }
});

QUnit.test('dasherize namespaced underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.dasherize)('private_docs/owner_invoice'), 'private-docs/owner-invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private_docs/owner_invoice'.dasherize(), 'private-docs/owner-invoice');
  }
});