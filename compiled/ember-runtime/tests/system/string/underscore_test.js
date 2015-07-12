'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.underscore');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.underscore is not available without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.underscore, 'String.prototype helper disabled');
  });
}

QUnit.test('with normal string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('my favorite items'), 'my_favorite_items');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.underscore(), 'my_favorite_items');
  }
});

QUnit.test('with dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('css-class-name'), 'css_class_name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.underscore(), 'css_class_name');
  }
});

QUnit.test('does nothing with underscored string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('action_name'), 'action_name');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('action_name'.underscore(), 'action_name');
  }
});

QUnit.test('with camelcased string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('innerHTML'), 'inner_html');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.underscore(), 'inner_html');
  }
});

QUnit.test('underscore namespaced classified string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('PrivateDocs/OwnerInvoice'), 'private_docs/owner_invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('PrivateDocs/OwnerInvoice'.underscore(), 'private_docs/owner_invoice');
  }
});

QUnit.test('underscore namespaced camelized string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('privateDocs/ownerInvoice'), 'private_docs/owner_invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('privateDocs/ownerInvoice'.underscore(), 'private_docs/owner_invoice');
  }
});

QUnit.test('underscore namespaced dasherized string', function () {
  deepEqual((0, _emberRuntimeSystemString.underscore)('private-docs/owner-invoice'), 'private_docs/owner_invoice');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    deepEqual('private-docs/owner-invoice'.underscore(), 'private_docs/owner_invoice');
  }
});