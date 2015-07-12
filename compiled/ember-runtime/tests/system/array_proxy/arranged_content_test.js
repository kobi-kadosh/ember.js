'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var array;

QUnit.module('ArrayProxy - arrangedContent', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      array = _emberRuntimeSystemArray_proxy2['default'].extend({
        arrangedContent: (0, _emberMetalComputed.computed)('content.[]', function () {
          var content = this.get('content');
          return content && _emberMetalCore2['default'].A(content.slice().sort(function (a, b) {
            if (a == null) {
              a = -1;
            }
            if (b == null) {
              b = -1;
            }
            return b - a;
          }));
        })
      }).create({
        content: _emberMetalCore2['default'].A([1, 2, 4, 5])
      });
    });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      array.destroy();
    });
  }
});

QUnit.test('addObject - adds to end of \'content\' if not present', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.addObject(3);
  });
  deepEqual(array.get('content'), [1, 2, 4, 5, 3], 'adds to end of content');
  deepEqual(array.get('arrangedContent'), [5, 4, 3, 2, 1], 'arrangedContent stays sorted');

  (0, _emberMetalRun_loop2['default'])(function () {
    array.addObject(1);
  });
  deepEqual(array.get('content'), [1, 2, 4, 5, 3], 'does not add existing number to content');
});

QUnit.test('addObjects - adds to end of \'content\' if not present', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.addObjects([1, 3, 6]);
  });
  deepEqual(array.get('content'), [1, 2, 4, 5, 3, 6], 'adds to end of content');
  deepEqual(array.get('arrangedContent'), [6, 5, 4, 3, 2, 1], 'arrangedContent stays sorted');
});

QUnit.test('compact - returns arrangedContent without nulls and undefined', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.set('content', _emberMetalCore2['default'].A([1, 3, null, 2, undefined]));
  });
  deepEqual(array.compact(), [3, 2, 1]);
});

QUnit.test('indexOf - returns index of object in arrangedContent', function () {
  equal(array.indexOf(4), 1, 'returns arranged index');
});

QUnit.test('insertAt - raises, indeterminate behavior', function () {
  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      array.insertAt(2, 3);
    });
  });
});

QUnit.test('lastIndexOf - returns last index of object in arrangedContent', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.pushObject(4);
  });
  equal(array.lastIndexOf(4), 2, 'returns last arranged index');
});

QUnit.test('nextObject - returns object at index in arrangedContent', function () {
  equal(array.nextObject(1), 4, 'returns object at index');
});

QUnit.test('objectAt - returns object at index in arrangedContent', function () {
  equal(array.objectAt(1), 4, 'returns object at index');
});

// Not sure if we need a specific test for it, since it's internal
QUnit.test('objectAtContent - returns object at index in arrangedContent', function () {
  equal(array.objectAtContent(1), 4, 'returns object at index');
});

QUnit.test('objectsAt - returns objects at indices in arrangedContent', function () {
  deepEqual(array.objectsAt([0, 2, 4]), [5, 2, undefined], 'returns objects at indices');
});

QUnit.test('popObject - removes last object in arrangedContent', function () {
  var popped;
  (0, _emberMetalRun_loop2['default'])(function () {
    popped = array.popObject();
  });
  equal(popped, 1, 'returns last object');
  deepEqual(array.get('content'), [2, 4, 5], 'removes from content');
});

QUnit.test('pushObject - adds to end of content even if it already exists', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.pushObject(1);
  });
  deepEqual(array.get('content'), [1, 2, 4, 5, 1], 'adds to end of content');
});

QUnit.test('pushObjects - adds multiple to end of content even if it already exists', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.pushObjects([1, 2, 4]);
  });
  deepEqual(array.get('content'), [1, 2, 4, 5, 1, 2, 4], 'adds to end of content');
});

QUnit.test('removeAt - removes from index in arrangedContent', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.removeAt(1, 2);
  });
  deepEqual(array.get('content'), [1, 5]);
});

QUnit.test('removeObject - removes object from content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.removeObject(2);
  });
  deepEqual(array.get('content'), [1, 4, 5]);
});

QUnit.test('removeObjects - removes objects from content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.removeObjects([2, 4, 6]);
  });
  deepEqual(array.get('content'), [1, 5]);
});

QUnit.test('replace - raises, indeterminate behavior', function () {
  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      array.replace(1, 2, [3]);
    });
  });
});

QUnit.test('replaceContent - does a standard array replace on content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.replaceContent(1, 2, [3]);
  });
  deepEqual(array.get('content'), [1, 3, 5]);
});

QUnit.test('reverseObjects - raises, use Sortable#sortAscending', function () {
  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      array.reverseObjects();
    });
  });
});

QUnit.test('setObjects - replaces entire content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.setObjects([6, 7, 8]);
  });
  deepEqual(array.get('content'), [6, 7, 8], 'replaces content');
});

QUnit.test('shiftObject - removes from start of arrangedContent', function () {
  var shifted;
  (0, _emberMetalRun_loop2['default'])(function () {
    shifted = array.shiftObject();
  });
  equal(shifted, 5, 'returns first object');
  deepEqual(array.get('content'), [1, 2, 4], 'removes object from content');
});

QUnit.test('slice - returns a slice of the arrangedContent', function () {
  deepEqual(array.slice(1, 3), [4, 2], 'returns sliced arrangedContent');
});

QUnit.test('toArray - returns copy of arrangedContent', function () {
  deepEqual(array.toArray(), [5, 4, 2, 1]);
});

QUnit.test('unshiftObject - adds to start of content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.unshiftObject(6);
  });
  deepEqual(array.get('content'), [6, 1, 2, 4, 5], 'adds to start of content');
});

QUnit.test('unshiftObjects - adds to start of content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.unshiftObjects([6, 7]);
  });
  deepEqual(array.get('content'), [6, 7, 1, 2, 4, 5], 'adds to start of content');
});

QUnit.test('without - returns arrangedContent without object', function () {
  deepEqual(array.without(2), [5, 4, 1], 'returns arranged without object');
});

QUnit.test('lastObject - returns last arranged object', function () {
  equal(array.get('lastObject'), 1, 'returns last arranged object');
});

QUnit.test('firstObject - returns first arranged object', function () {
  equal(array.get('firstObject'), 5, 'returns first arranged object');
});

QUnit.module('ArrayProxy - arrangedContent matching content', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      array = _emberRuntimeSystemArray_proxy2['default'].create({
        content: _emberMetalCore2['default'].A([1, 2, 4, 5])
      });
    });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      array.destroy();
    });
  }
});

QUnit.test('insertAt - inserts object at specified index', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.insertAt(2, 3);
  });
  deepEqual(array.get('content'), [1, 2, 3, 4, 5]);
});

QUnit.test('replace - does a standard array replace', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.replace(1, 2, [3]);
  });
  deepEqual(array.get('content'), [1, 3, 5]);
});

QUnit.test('reverseObjects - reverses content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.reverseObjects();
  });
  deepEqual(array.get('content'), [5, 4, 2, 1]);
});

QUnit.module('ArrayProxy - arrangedContent with transforms', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      array = _emberRuntimeSystemArray_proxy2['default'].extend({
        arrangedContent: (0, _emberMetalComputed.computed)(function () {
          var content = this.get('content');
          return content && _emberMetalCore2['default'].A(content.slice().sort(function (a, b) {
            if (a == null) {
              a = -1;
            }
            if (b == null) {
              b = -1;
            }
            return b - a;
          }));
        }).property('content.[]'),

        objectAtContent: function objectAtContent(idx) {
          var obj = this.get('arrangedContent').objectAt(idx);
          return obj && obj.toString();
        }
      }).create({
        content: _emberMetalCore2['default'].A([1, 2, 4, 5])
      });
    });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      array.destroy();
    });
  }
});

QUnit.test('indexOf - returns index of object in arrangedContent', function () {
  equal(array.indexOf('4'), 1, 'returns arranged index');
});

QUnit.test('lastIndexOf - returns last index of object in arrangedContent', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.pushObject(4);
  });
  equal(array.lastIndexOf('4'), 2, 'returns last arranged index');
});

QUnit.test('nextObject - returns object at index in arrangedContent', function () {
  equal(array.nextObject(1), '4', 'returns object at index');
});

QUnit.test('objectAt - returns object at index in arrangedContent', function () {
  equal(array.objectAt(1), '4', 'returns object at index');
});

// Not sure if we need a specific test for it, since it's internal
QUnit.test('objectAtContent - returns object at index in arrangedContent', function () {
  equal(array.objectAtContent(1), '4', 'returns object at index');
});

QUnit.test('objectsAt - returns objects at indices in arrangedContent', function () {
  deepEqual(array.objectsAt([0, 2, 4]), ['5', '2', undefined], 'returns objects at indices');
});

QUnit.test('popObject - removes last object in arrangedContent', function () {
  var popped;
  (0, _emberMetalRun_loop2['default'])(function () {
    popped = array.popObject();
  });
  equal(popped, '1', 'returns last object');
  deepEqual(array.get('content'), [2, 4, 5], 'removes from content');
});

QUnit.test('removeObject - removes object from content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.removeObject('2');
  });
  deepEqual(array.get('content'), [1, 4, 5]);
});

QUnit.test('removeObjects - removes objects from content', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    array.removeObjects(['2', '4', '6']);
  });
  deepEqual(array.get('content'), [1, 5]);
});

QUnit.test('shiftObject - removes from start of arrangedContent', function () {
  var shifted;
  (0, _emberMetalRun_loop2['default'])(function () {
    shifted = array.shiftObject();
  });
  equal(shifted, '5', 'returns first object');
  deepEqual(array.get('content'), [1, 2, 4], 'removes object from content');
});

QUnit.test('slice - returns a slice of the arrangedContent', function () {
  deepEqual(array.slice(1, 3), ['4', '2'], 'returns sliced arrangedContent');
});

QUnit.test('toArray - returns copy of arrangedContent', function () {
  deepEqual(array.toArray(), ['5', '4', '2', '1']);
});

QUnit.test('without - returns arrangedContent without object', function () {
  deepEqual(array.without('2'), ['5', '4', '1'], 'returns arranged without object');
});

QUnit.test('lastObject - returns last arranged object', function () {
  equal(array.get('lastObject'), '1', 'returns last arranged object');
});

QUnit.test('firstObject - returns first arranged object', function () {
  equal(array.get('firstObject'), '5', 'returns first arranged object');
});