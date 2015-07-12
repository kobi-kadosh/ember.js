'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

require('ember-testing/initializers');

// to setup initializer

require('ember-testing/support');

// to handle various edge cases

var _emberTestingSetup_for_testing = require('ember-testing/setup_for_testing');

var _emberTestingSetup_for_testing2 = _interopRequireDefault(_emberTestingSetup_for_testing);

var _emberTestingTest = require('ember-testing/test');

var _emberTestingTest2 = _interopRequireDefault(_emberTestingTest);

var _emberTestingAdaptersAdapter = require('ember-testing/adapters/adapter');

var _emberTestingAdaptersAdapter2 = _interopRequireDefault(_emberTestingAdaptersAdapter);

var _emberTestingAdaptersQunit = require('ember-testing/adapters/qunit');

var _emberTestingAdaptersQunit2 = _interopRequireDefault(_emberTestingAdaptersQunit);

require('ember-testing/helpers');

// adds helpers to helpers object in Test

/**
  @module ember
  @submodule ember-testing
*/

_emberMetalCore2['default'].Test = _emberTestingTest2['default'];
_emberMetalCore2['default'].Test.Adapter = _emberTestingAdaptersAdapter2['default'];
_emberMetalCore2['default'].Test.QUnitAdapter = _emberTestingAdaptersQunit2['default'];
_emberMetalCore2['default'].setupForTesting = _emberTestingSetup_for_testing2['default'];