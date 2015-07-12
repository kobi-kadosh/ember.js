'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetal = require('ember-metal');

var _emberMetal2 = _interopRequireDefault(_emberMetal);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

QUnit.module('system/run_loop/onerror_test');

QUnit.test('With Ember.onerror undefined, errors in Ember.run are thrown', function () {
  var thrown = new Error('Boom!');
  var caught;

  try {
    (0, _emberMetalRun_loop2['default'])(function () {
      throw thrown;
    });
  } catch (error) {
    caught = error;
  }

  deepEqual(caught, thrown);
});

QUnit.test('With Ember.onerror set, errors in Ember.run are caught', function () {
  var thrown = new Error('Boom!');
  var caught;

  _emberMetal2['default'].onerror = function (error) {
    caught = error;
  };

  (0, _emberMetalRun_loop2['default'])(function () {
    throw thrown;
  });

  deepEqual(caught, thrown);

  _emberMetal2['default'].onerror = undefined;
});