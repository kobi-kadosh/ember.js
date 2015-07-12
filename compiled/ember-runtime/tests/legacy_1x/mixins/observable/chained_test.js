'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalObserver = require('ember-metal/observer');

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * changed obj.set() and obj.get() to Ember.set() and Ember.get()
  * changed obj.addObserver() to addObserver()
*/

QUnit.module('Ember.Observable - Observing with @each');

QUnit.test('chained observers on enumerable properties are triggered when the observed property of any item changes', function () {
  var family = _emberRuntimeSystemObject2['default'].create({ momma: null });
  var momma = _emberRuntimeSystemObject2['default'].create({ children: [] });

  var child1 = _emberRuntimeSystemObject2['default'].create({ name: 'Bartholomew' });
  var child2 = _emberRuntimeSystemObject2['default'].create({ name: 'Agnes' });
  var child3 = _emberRuntimeSystemObject2['default'].create({ name: 'Dan' });
  var child4 = _emberRuntimeSystemObject2['default'].create({ name: 'Nancy' });

  (0, _emberMetalProperty_set.set)(family, 'momma', momma);
  (0, _emberMetalProperty_set.set)(momma, 'children', _emberMetalCore2['default'].A([child1, child2, child3]));

  var observerFiredCount = 0;
  (0, _emberMetalObserver.addObserver)(family, 'momma.children.@each.name', this, function () {
    observerFiredCount++;
  });

  observerFiredCount = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_get.get)(momma, 'children').setEach('name', 'Juan');
  });
  equal(observerFiredCount, 3, 'observer fired after changing child names');

  observerFiredCount = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_get.get)(momma, 'children').pushObject(child4);
  });
  equal(observerFiredCount, 1, 'observer fired after adding a new item');

  observerFiredCount = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(child4, 'name', 'Herbert');
  });
  equal(observerFiredCount, 1, 'observer fired after changing property on new object');

  (0, _emberMetalProperty_set.set)(momma, 'children', []);

  observerFiredCount = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(child1, 'name', 'Hanna');
  });
  equal(observerFiredCount, 0, 'observer did not fire after removing changing property on a removed object');
});