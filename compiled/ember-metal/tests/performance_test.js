'use strict';

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalObserver = require('ember-metal/observer');

/*
  This test file is designed to capture performance regressions related to
  deferred computation. Things like run loops, computed properties, and bindings
  should run the minimum amount of times to achieve best performance, so any
  bugs that cause them to get evaluated more than necessary should be put here.
*/

QUnit.module('Computed Properties - Number of times evaluated');

QUnit.test('computed properties that depend on multiple properties should run only once per run loop', function () {
  var obj = { a: 'a', b: 'b', c: 'c' };
  var cpCount = 0;
  var obsCount = 0;

  (0, _emberMetalProperties.defineProperty)(obj, 'abc', (0, _emberMetalComputed.computed)(function (key) {
    cpCount++;
    return 'computed ' + key;
  }).property('a', 'b', 'c'));

  (0, _emberMetalProperty_get.get)(obj, 'abc');

  cpCount = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'abc', function () {
    obsCount++;
  });

  (0, _emberMetalProperty_events.beginPropertyChanges)();
  (0, _emberMetalProperty_set.set)(obj, 'a', 'aa');
  (0, _emberMetalProperty_set.set)(obj, 'b', 'bb');
  (0, _emberMetalProperty_set.set)(obj, 'c', 'cc');
  (0, _emberMetalProperty_events.endPropertyChanges)();

  (0, _emberMetalProperty_get.get)(obj, 'abc');

  equal(cpCount, 1, 'The computed property is only invoked once');
  equal(obsCount, 1, 'The observer is only invoked once');
});

QUnit.test('computed properties are not executed if they are the last segment of an observer chain pain', function () {
  var foo = { bar: { baz: {} } };

  var count = 0;

  (0, _emberMetalProperties.defineProperty)(foo.bar.baz, 'bam', (0, _emberMetalComputed.computed)(function () {
    count++;
  }));

  (0, _emberMetalObserver.addObserver)(foo, 'bar.baz.bam', function () {});

  (0, _emberMetalProperty_events.propertyDidChange)((0, _emberMetalProperty_get.get)(foo, 'bar.baz'), 'bam');

  equal(count, 0, 'should not have recomputed property');
});