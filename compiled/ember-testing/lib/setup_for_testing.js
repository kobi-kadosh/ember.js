'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setupForTesting;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// import Test from "ember-testing/test";  // ES6TODO: fix when cycles are supported

var _emberTestingAdaptersQunit = require('ember-testing/adapters/qunit');

var _emberTestingAdaptersQunit2 = _interopRequireDefault(_emberTestingAdaptersQunit);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var Test, requests;

function incrementAjaxPendingRequests(_, xhr) {
  requests.push(xhr);
  Test.pendingAjaxRequests = requests.length;
}

function decrementAjaxPendingRequests(_, xhr) {
  for (var i = 0; i < requests.length; i++) {
    if (xhr === requests[i]) {
      requests.splice(i, 1);
    }
  }
  Test.pendingAjaxRequests = requests.length;
}

/**
  Sets Ember up for testing. This is useful to perform
  basic setup steps in order to unit test.

  Use `App.setupForTesting` to perform integration tests (full
  application testing).

  @method setupForTesting
  @namespace Ember
  @since 1.5.0
  @private
*/

function setupForTesting() {
  if (!Test) {
    Test = requireModule('ember-testing/test')['default'];
  }

  _emberMetalCore2['default'].testing = true;

  // if adapter is not manually set default to QUnit
  if (!Test.adapter) {
    Test.adapter = _emberTestingAdaptersQunit2['default'].create();
  }

  requests = [];
  Test.pendingAjaxRequests = requests.length;

  (0, _emberViewsSystemJquery2['default'])(document).off('ajaxSend', incrementAjaxPendingRequests);
  (0, _emberViewsSystemJquery2['default'])(document).off('ajaxComplete', decrementAjaxPendingRequests);
  (0, _emberViewsSystemJquery2['default'])(document).on('ajaxSend', incrementAjaxPendingRequests);
  (0, _emberViewsSystemJquery2['default'])(document).on('ajaxComplete', decrementAjaxPendingRequests);
}

module.exports = exports['default'];