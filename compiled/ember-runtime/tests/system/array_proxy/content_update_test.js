'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

QUnit.module('Ember.ArrayProxy - content update');

QUnit.test('The `contentArrayDidChange` method is invoked after `content` is updated.', function () {

  var proxy;
  var observerCalled = false;

  proxy = _emberRuntimeSystemArray_proxy2['default'].extend({
    arrangedContent: (0, _emberMetalComputed.computed)('content', function (key) {
      return _emberMetalCore2['default'].A(this.get('content').slice());
    }),

    contentArrayDidChange: function contentArrayDidChange(array, idx, removedCount, addedCount) {
      observerCalled = true;
      return this._super(array, idx, removedCount, addedCount);
    }
  }).create({
    content: _emberMetalCore2['default'].A()
  });

  proxy.pushObject(1);

  ok(observerCalled, 'contentArrayDidChange is invoked');
});