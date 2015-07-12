'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalChains = require('ember-metal/chains');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalComputed2 = _interopRequireDefault(_emberMetalComputed);

var _emberMetalProperty_events = require('ember-metal/property_events');

QUnit.module('Chains');

QUnit.test('finishChains should properly copy chains from prototypes to instances', function () {
  function didChange() {}

  var obj = {};
  (0, _emberMetalObserver.addObserver)(obj, 'foo.bar', null, didChange);

  var childObj = Object.create(obj);
  (0, _emberMetalChains.finishChains)(childObj);

  ok(obj['__ember_meta__'].chains !== childObj['__ember_meta__'].chains, 'The chains object is copied');
});

QUnit.test('observer and CP chains', function () {
  var obj = {};

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed2['default'])('qux.[]', function () {}));
  (0, _emberMetalProperties.defineProperty)(obj, 'qux', (0, _emberMetalComputed2['default'])(function () {}));

  // create DK chains
  (0, _emberMetalProperty_get.get)(obj, 'foo');

  // create observer chain
  (0, _emberMetalObserver.addObserver)(obj, 'qux.length', function () {});

  /*
             +-----+
             | qux |   root CP
             +-----+
                ^
         +------+-----+
         |            |
     +--------+    +----+
     | length |    | [] |  chainWatchers
     +--------+    +----+
      observer       CP(foo, 'qux.[]')
  */

  // invalidate qux
  (0, _emberMetalProperty_events.propertyDidChange)(obj, 'qux');

  // CP chain is blown away

  /*
             +-----+
             | qux |   root CP
             +-----+
                ^
         +------+xxxxxx
         |            x
     +--------+    xxxxxx
     | length |    x [] x  chainWatchers
     +--------+    xxxxxx
      observer       CP(foo, 'qux.[]')
  */

  (0, _emberMetalProperty_get.get)(obj, 'qux'); // CP chain re-recreated
  ok(true, 'no crash');
});