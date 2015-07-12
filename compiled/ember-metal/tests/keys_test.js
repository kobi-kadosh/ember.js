'use strict';

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalObserver = require('ember-metal/observer');

function K() {
  return this;
}

QUnit.module('Fetch Keys ');

QUnit.test('should get a key array for a specified object', function () {
  var object1 = {};

  object1.names = 'Rahul';
  object1.age = '23';
  object1.place = 'Mangalore';

  var object2 = Object.keys(object1);

  deepEqual(object2, ['names', 'age', 'place']);
});

// This test is for IE8.
QUnit.test('should get a key array for property that is named the same as prototype property', function () {
  var object1 = {
    toString: function toString() {}
  };

  var object2 = Object.keys(object1);

  deepEqual(object2, ['toString']);
});

QUnit.test('should not contain properties declared in the prototype', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  deepEqual(Object.keys(beer), []);
});

QUnit.test('should return properties that were set after object creation', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  (0, _emberMetalProperty_set.set)(beer, 'brand', 'big daddy');

  deepEqual(Object.keys(beer), ['brand']);
});

QUnit.module('Keys behavior with observers');

QUnit.test('should not leak properties on the prototype', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  (0, _emberMetalObserver.addObserver)(beer, 'type', K);
  deepEqual(Object.keys(beer), []);
  (0, _emberMetalObserver.removeObserver)(beer, 'type', K);
});

QUnit.test('observing a non existent property', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  (0, _emberMetalObserver.addObserver)(beer, 'brand', K);

  deepEqual(Object.keys(beer), []);

  (0, _emberMetalProperty_set.set)(beer, 'brand', 'Corona');
  deepEqual(Object.keys(beer), ['brand']);

  (0, _emberMetalObserver.removeObserver)(beer, 'brand', K);
});

QUnit.test('with observers switched on and off', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  (0, _emberMetalObserver.addObserver)(beer, 'type', K);
  (0, _emberMetalObserver.removeObserver)(beer, 'type', K);

  deepEqual(Object.keys(beer), []);
});

QUnit.test('observers switched on and off with setter in between', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  (0, _emberMetalObserver.addObserver)(beer, 'type', K);
  (0, _emberMetalProperty_set.set)(beer, 'type', 'ale');
  (0, _emberMetalObserver.removeObserver)(beer, 'type', K);

  deepEqual(Object.keys(beer), ['type']);
});

QUnit.test('observer switched on and off and then setter', function () {
  function Beer() {}
  Beer.prototype.type = 'ipa';

  var beer = new Beer();

  (0, _emberMetalObserver.addObserver)(beer, 'type', K);
  (0, _emberMetalObserver.removeObserver)(beer, 'type', K);
  (0, _emberMetalProperty_set.set)(beer, 'type', 'ale');

  deepEqual(Object.keys(beer), ['type']);
});