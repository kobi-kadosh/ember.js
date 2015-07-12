'use strict';

var _emberMetalUtils = require('ember-metal/utils');

QUnit.module('Ember Metal Utils');

QUnit.test('inspect outputs the toString() representation of Symbols', function () {
  // Symbol is not defined on pre-ES2015 runtimes, so this let's us safely test
  // for it's existence (where a simple `if (Symbol)` would ReferenceError)
  var Symbol = Symbol || null;

  if (Symbol) {
    var symbol = Symbol('test');
    equal((0, _emberMetalUtils.inspect)(symbol), 'Symbol(test)');
  } else {
    expect(0);
  }
});