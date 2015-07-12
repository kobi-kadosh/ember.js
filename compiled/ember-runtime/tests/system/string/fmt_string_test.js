'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

QUnit.module('EmberStringUtils.fmt');

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.fmt is not modified without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.fmt, 'String.prototype helper disabled');
  });
}

QUnit.test('\'Hello %@ %@\'.fmt(\'John\', \'Doe\') => \'Hello John Doe\'', function () {
  equal((0, _emberRuntimeSystemString.fmt)('Hello %@ %@', ['John', 'Doe']), 'Hello John Doe');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('Hello %@ %@'.fmt('John', 'Doe'), 'Hello John Doe');
  }
});

QUnit.test('\'Hello %@2 %@1\'.fmt(\'John\', \'Doe\') => \'Hello Doe John\'', function () {
  equal((0, _emberRuntimeSystemString.fmt)('Hello %@2 %@1', ['John', 'Doe']), 'Hello Doe John');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('Hello %@2 %@1'.fmt('John', 'Doe'), 'Hello Doe John');
  }
});

QUnit.test('\'%@08 %@07 %@06 %@05 %@04 %@03 %@02 %@01\'.fmt(\'One\', \'Two\', \'Three\', \'Four\', \'Five\', \'Six\', \'Seven\', \'Eight\') => \'Eight Seven Six Five Four Three Two One\'', function () {
  equal((0, _emberRuntimeSystemString.fmt)('%@08 %@07 %@06 %@05 %@04 %@03 %@02 %@01', ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']), 'Eight Seven Six Five Four Three Two One');

  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('%@08 %@07 %@06 %@05 %@04 %@03 %@02 %@01'.fmt('One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'), 'Eight Seven Six Five Four Three Two One');
  }
});

QUnit.test('\'data: %@\'.fmt({ id: 3 }) => \'data: {id: 3}\'', function () {
  equal((0, _emberRuntimeSystemString.fmt)('data: %@', [{ id: 3 }]), 'data: {id: 3}');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('data: %@'.fmt({ id: 3 }), 'data: {id: 3}');
  }
});

QUnit.test('works with argument form', function () {
  equal((0, _emberRuntimeSystemString.fmt)('%@', 'John'), 'John');
  equal((0, _emberRuntimeSystemString.fmt)('%@ %@', ['John'], 'Doe'), '[John] Doe');
});