'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.capitalize');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.capitalize is not modified without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.capitalize, 'String.prototype helper disabled');
  });
}

QUnit.test('capitalize normal string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('my favorite items'), 'My favorite items');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.capitalize(), 'My favorite items');
  }
});

QUnit.test('capitalize dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('css-class-name'), 'Css-class-name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.capitalize(), 'Css-class-name');
  }
});

QUnit.test('capitalize underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('action_name'), 'Action_name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action_name'.capitalize(), 'Action_name');
  }
});

QUnit.test('capitalize camelcased string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('innerHTML'), 'InnerHTML');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.capitalize(), 'InnerHTML');
  }
});

QUnit.test('does nothing with capitalized string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('Capitalized string'), 'Capitalized string');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('Capitalized string'.capitalize(), 'Capitalized string');
  }
});

QUnit.test('capitalize namespaced camelized string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('privateDocs/ownerInvoice'), 'PrivateDocs/OwnerInvoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('privateDocs/ownerInvoice'.capitalize(), 'PrivateDocs/OwnerInvoice');
  }
});

QUnit.test('capitalize namespaced underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('private_docs/owner_invoice'), 'Private_docs/Owner_invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private_docs/owner_invoice'.capitalize(), 'Private_docs/Owner_invoice');
  }
});

QUnit.test('capitalize namespaced dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.capitalize)('private-docs/owner-invoice'), 'Private-docs/Owner-invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private-docs/owner-invoice'.capitalize(), 'Private-docs/Owner-invoice');
  }
});