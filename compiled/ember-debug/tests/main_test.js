'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberDebugDeprecationManager = require('ember-debug/deprecation-manager');

var _emberDebugDeprecationManager2 = _interopRequireDefault(_emberDebugDeprecationManager);

var originalEnvValue = undefined;
var originalDeprecationDefault = undefined;
var originalDeprecationLevels = undefined;

QUnit.module('ember-debug', {
  setup: function setup() {
    originalDeprecationDefault = _emberDebugDeprecationManager2['default'].defaultLevel;
    originalDeprecationLevels = _emberDebugDeprecationManager2['default'].individualLevels;
    originalEnvValue = _emberMetalCore2['default'].ENV.RAISE_ON_DEPRECATION;

    _emberMetalCore2['default'].ENV.RAISE_ON_DEPRECATION = false;
    _emberDebugDeprecationManager2['default'].setDefaultLevel(_emberDebugDeprecationManager.deprecationLevels.RAISE);
  },

  teardown: function teardown() {
    _emberDebugDeprecationManager2['default'].defaultLevel = originalDeprecationDefault;
    _emberDebugDeprecationManager2['default'].individualLevels = originalDeprecationLevels;
    _emberMetalCore2['default'].ENV.RAISE_ON_DEPRECATION = originalEnvValue;
  }
});

QUnit.test('Ember.deprecate does not throw if default level is silence', function (assert) {
  assert.expect(1);
  _emberDebugDeprecationManager2['default'].setDefaultLevel(_emberDebugDeprecationManager.deprecationLevels.SILENCE);

  try {
    _emberMetalCore2['default'].deprecate('Should not throw', false);
    assert.ok(true, 'Ember.deprecate did not throw');
  } catch (e) {
    assert.ok(false, 'Expected Ember.deprecate not to throw but it did: ' + e.message);
  }
});

QUnit.test('Ember.deprecate re-sets deprecation level to RAISE if ENV.RAISE_ON_DEPRECATION is set', function (assert) {
  assert.expect(2);

  _emberDebugDeprecationManager2['default'].setDefaultLevel(_emberDebugDeprecationManager.deprecationLevels.SILENCE);

  _emberMetalCore2['default'].ENV.RAISE_ON_DEPRECATION = true;

  assert.throws(function () {
    _emberMetalCore2['default'].deprecate('Should throw', false);
  }, /Should throw/);

  assert.equal(_emberDebugDeprecationManager2['default'].defaultLevel, _emberDebugDeprecationManager.deprecationLevels.RAISE, 'default level re-set to RAISE');
});

QUnit.test('When ENV.RAISE_ON_DEPRECATION is true, it is still possible to silence a deprecation by id', function (assert) {
  assert.expect(3);

  _emberMetalCore2['default'].ENV.RAISE_ON_DEPRECATION = true;
  _emberDebugDeprecationManager2['default'].setLevel('my-deprecation', _emberDebugDeprecationManager.deprecationLevels.SILENCE);

  try {
    _emberMetalCore2['default'].deprecate('should be silenced with matching id', false, { id: 'my-deprecation' });
    assert.ok(true, 'Did not throw when level is set by id');
  } catch (e) {
    assert.ok(false, 'Expected Ember.deprecate not to throw but it did: ' + e.message);
  }

  assert.throws(function () {
    _emberMetalCore2['default'].deprecate('Should throw with no id', false);
  }, /Should throw with no id/);

  assert.throws(function () {
    _emberMetalCore2['default'].deprecate('Should throw with non-matching id', false, { id: 'other-id' });
  }, /Should throw with non-matching id/);
});

QUnit.test('Ember.deprecate throws deprecation if second argument is falsy', function () {
  expect(3);

  throws(function () {
    _emberMetalCore2['default'].deprecate('Deprecation is thrown', false);
  });

  throws(function () {
    _emberMetalCore2['default'].deprecate('Deprecation is thrown', '');
  });

  throws(function () {
    _emberMetalCore2['default'].deprecate('Deprecation is thrown', 0);
  });
});

QUnit.test('Ember.deprecate does not throw deprecation if second argument is a function and it returns true', function () {
  expect(1);

  _emberMetalCore2['default'].deprecate('Deprecation is thrown', function () {
    return true;
  });

  ok(true, 'deprecation was not thrown');
});

QUnit.test('Ember.deprecate throws if second argument is a function and it returns false', function () {
  expect(1);
  throws(function () {
    _emberMetalCore2['default'].deprecate('Deprecation is thrown', function () {
      return false;
    });
  });
});

QUnit.test('Ember.deprecate does not throw deprecations if second argument is truthy', function () {
  expect(1);

  _emberMetalCore2['default'].deprecate('Deprecation is thrown', true);
  _emberMetalCore2['default'].deprecate('Deprecation is thrown', '1');
  _emberMetalCore2['default'].deprecate('Deprecation is thrown', 1);

  ok(true, 'deprecations were not thrown');
});

QUnit.test('Ember.assert throws if second argument is falsy', function () {
  expect(3);

  throws(function () {
    _emberMetalCore2['default'].assert('Assertion is thrown', false);
  });

  throws(function () {
    _emberMetalCore2['default'].assert('Assertion is thrown', '');
  });

  throws(function () {
    _emberMetalCore2['default'].assert('Assertion is thrown', 0);
  });
});

QUnit.test('Ember.assert does not throw if second argument is a function and it returns true', function () {
  expect(1);

  _emberMetalCore2['default'].assert('Assertion is thrown', function () {
    return true;
  });

  ok(true, 'assertion was not thrown');
});

QUnit.test('Ember.assert throws if second argument is a function and it returns false', function () {
  expect(1);
  throws(function () {
    _emberMetalCore2['default'].assert('Assertion is thrown', function () {
      return false;
    });
  });
});

QUnit.test('Ember.assert does not throw if second argument is truthy', function () {
  expect(1);

  _emberMetalCore2['default'].assert('Assertion is thrown', true);
  _emberMetalCore2['default'].assert('Assertion is thrown', '1');
  _emberMetalCore2['default'].assert('Assertion is thrown', 1);

  ok(true, 'assertions were not thrown');
});

QUnit.test('Ember.assert does not throw if second argument is an object', function () {
  expect(1);
  var Igor = _emberMetalCore2['default'].Object.extend();

  _emberMetalCore2['default'].assert('is truthy', Igor);
  _emberMetalCore2['default'].assert('is truthy', Igor.create());

  ok(true, 'assertions were not thrown');
});

QUnit.test('Ember.deprecate does not throw a deprecation at log and silence levels', function () {
  expect(4);
  var id = 'ABC';

  _emberDebugDeprecationManager2['default'].setLevel(id, _emberDebugDeprecationManager.deprecationLevels.LOG);
  try {
    _emberMetalCore2['default'].deprecate('Deprecation for testing purposes', false, { id: id });
    ok(true, 'Deprecation did not throw');
  } catch (e) {
    ok(false, 'Deprecation was thrown despite being added to blacklist');
  }

  _emberDebugDeprecationManager2['default'].setLevel(id, _emberDebugDeprecationManager.deprecationLevels.SILENCE);
  try {
    _emberMetalCore2['default'].deprecate('Deprecation for testing purposes', false, { id: id });
    ok(true, 'Deprecation did not throw');
  } catch (e) {
    ok(false, 'Deprecation was thrown despite being added to blacklist');
  }

  _emberDebugDeprecationManager2['default'].setLevel(id, _emberDebugDeprecationManager.deprecationLevels.RAISE);

  throws(function () {
    _emberMetalCore2['default'].deprecate('Deprecation is thrown', false, { id: id });
  });

  _emberDebugDeprecationManager2['default'].setLevel(id, null);

  throws(function () {
    _emberMetalCore2['default'].deprecate('Deprecation is thrown', false, { id: id });
  });
});