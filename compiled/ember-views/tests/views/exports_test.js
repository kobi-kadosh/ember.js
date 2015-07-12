'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViews = require('ember-views');

var _emberViews2 = _interopRequireDefault(_emberViews);

var originalSupport = undefined;

QUnit.module('ember-view exports', {
  setup: function setup() {
    originalSupport = _emberViews2['default'].ENV._ENABLE_LEGACY_VIEW_SUPPORT;
  },
  teardown: function teardown() {
    _emberViews2['default'].ENV._ENABLE_LEGACY_VIEW_SUPPORT = originalSupport;
  }
});

QUnit.test('should export a deprecated CoreView', function () {
  expectDeprecation(function () {
    _emberViews2['default'].CoreView.create();
  }, 'Ember.CoreView is deprecated. Please use Ember.View.');
});

QUnit.test('should export a deprecated View', function () {
  expectDeprecation(function () {
    _emberViews2['default'].View.create();
  }, /Ember.View is deprecated/);
});

QUnit.test('when legacy view support is enabled, Ember.View does not have deprecation', function () {
  _emberViews2['default'].ENV._ENABLE_LEGACY_VIEW_SUPPORT = true;

  expectNoDeprecation(function () {
    _emberViews2['default'].View.create();
  });
});