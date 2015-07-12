'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var oldString;

QUnit.module('EmberStringUtils.loc', {
  setup: function setup() {
    oldString = _emberMetalCore2['default'].STRINGS;
    _emberMetalCore2['default'].STRINGS = {
      '_Hello World': 'Bonjour le monde',
      '_Hello %@': 'Bonjour %@',
      '_Hello %@ %@': 'Bonjour %@ %@',
      '_Hello %@# %@#': 'Bonjour %@2 %@1'
    };
  },

  teardown: function teardown() {
    _emberMetalCore2['default'].STRINGS = oldString;
  }
});

if (!_emberMetalCore2['default'].EXTEND_PROTOTYPES && !_emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {
  QUnit.test('String.prototype.loc is not available without EXTEND_PROTOTYPES', function () {
    ok('undefined' === typeof String.prototype.loc, 'String.prototype helper disabled');
  });
}

QUnit.test('\'_Hello World\'.loc() => \'Bonjour le monde\'', function () {
  equal((0, _emberRuntimeSystemString.loc)('_Hello World'), 'Bonjour le monde');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('_Hello World'.loc(), 'Bonjour le monde');
  }
});

QUnit.test('\'_Hello %@ %@\'.loc(\'John\', \'Doe\') => \'Bonjour John Doe\'', function () {
  equal((0, _emberRuntimeSystemString.loc)('_Hello %@ %@', ['John', 'Doe']), 'Bonjour John Doe');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('_Hello %@ %@'.loc('John', 'Doe'), 'Bonjour John Doe');
  }
});

QUnit.test('\'_Hello %@# %@#\'.loc(\'John\', \'Doe\') => \'Bonjour Doe John\'', function () {
  equal((0, _emberRuntimeSystemString.loc)('_Hello %@# %@#', ['John', 'Doe']), 'Bonjour Doe John');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('_Hello %@# %@#'.loc('John', 'Doe'), 'Bonjour Doe John');
  }
});

QUnit.test('\'_Not In Strings\'.loc() => \'_Not In Strings\'', function () {
  equal((0, _emberRuntimeSystemString.loc)('_Not In Strings'), '_Not In Strings');
  if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
    equal('_Not In Strings'.loc(), '_Not In Strings');
  }
});

QUnit.test('works with argument form', function () {
  equal((0, _emberRuntimeSystemString.loc)('_Hello %@', 'John'), 'Bonjour John');
  equal((0, _emberRuntimeSystemString.loc)('_Hello %@ %@', ['John'], 'Doe'), 'Bonjour [John] Doe');
});