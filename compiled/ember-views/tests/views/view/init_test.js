'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

var originalLookup = _emberMetalCore2['default'].lookup;
var lookup, view;

QUnit.module('EmberView.create', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });

    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('registers view in the global views hash using layerId for event targeted', function () {
  view = _emberViewsViewsView2['default'].create();
  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });
  equal(_emberViewsViewsView2['default'].views[(0, _emberMetalProperty_get.get)(view, 'elementId')], view, 'registers view');
});

QUnit.module('EmberView.extend');

QUnit.test('should warn if a computed property is used for classNames', function () {
  expectAssertion(function () {
    _emberViewsViewsView2['default'].extend({
      elementId: 'test',
      classNames: (0, _emberMetalComputed.computed)(function () {
        return ['className'];
      }).volatile()
    }).create();
  }, /Only arrays of static class strings.*For dynamic classes/i);
});

QUnit.test('should warn if a non-array is used for classNameBindings', function () {
  expectAssertion(function () {
    _emberViewsViewsView2['default'].extend({
      elementId: 'test',
      classNameBindings: (0, _emberMetalComputed.computed)(function () {
        return ['className'];
      }).volatile()
    }).create();
  }, /Only arrays are allowed/i);
});

QUnit.test('creates a renderer if one is not provided', function () {
  var childView;

  childView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompiler.compile)('ber')
  });

  view = _emberViewsViewsView2['default'].create({
    childView: childView,
    template: (0, _emberTemplateCompiler.compile)('Em{{view.childView}}')
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    ok((0, _emberMetalProperty_get.get)(view, 'renderer'), 'view created without container receives a renderer');
    strictEqual((0, _emberMetalProperty_get.get)(view, 'renderer'), (0, _emberMetalProperty_get.get)(childView, 'renderer'), 'parent and child share a renderer');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
    childView.destroy();
  });
});