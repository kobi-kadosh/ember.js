'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var view, myViewClass, newView, container;

QUnit.module('EmberView#createChildView', {
  setup: function setup() {
    container = {};

    view = _emberViewsViewsView2['default'].create({
      container: container
    });

    myViewClass = _emberViewsViewsView2['default'].extend({ isMyView: true, foo: 'bar' });
  },

  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
      if (newView) {
        newView.destroy();
      }
    });
  }
});

QUnit.test('should create view from class with any passed attributes', function () {
  var attrs = {
    foo: 'baz'
  };

  newView = view.createChildView(myViewClass, attrs);

  equal(newView.container, container, 'expects to share container with parent');
  ok((0, _emberMetalProperty_get.get)(newView, 'isMyView'), 'newView is instance of myView');
  equal((0, _emberMetalProperty_get.get)(newView, 'foo'), 'baz', 'view did get custom attributes');
  ok(!attrs.parentView, 'the original attributes hash was not mutated');
});

QUnit.test('should set newView.parentView to receiver', function () {
  newView = view.createChildView(myViewClass);

  equal(newView.container, container, 'expects to share container with parent');
  equal((0, _emberMetalProperty_get.get)(newView, 'parentView'), view, 'newView.parentView == view');
});

QUnit.test('should create property on parentView to a childView instance if provided a viewName', function () {
  var attrs = {
    viewName: 'someChildView'
  };

  newView = view.createChildView(myViewClass, attrs);
  equal(newView.container, container, 'expects to share container with parent');

  equal((0, _emberMetalProperty_get.get)(view, 'someChildView'), newView);
});

QUnit.test('should update a view instances attributes, including the parentView and container properties', function () {
  var attrs = {
    foo: 'baz'
  };

  var myView = myViewClass.create();
  newView = view.createChildView(myView, attrs);

  equal(newView.container, container, 'expects to share container with parent');
  equal(newView.parentView, view, 'expects to have the correct parent');
  equal((0, _emberMetalProperty_get.get)(newView, 'foo'), 'baz', 'view did get custom attributes');

  deepEqual(newView, myView);
});

QUnit.test('should create from string via container lookup', function () {
  var ChildViewClass = _emberViewsViewsView2['default'].extend();
  var fullName = 'view:bro';

  view.container.lookupFactory = function (viewName) {
    equal(fullName, viewName);

    return ChildViewClass.extend({
      container: container
    });
  };

  newView = view.createChildView('bro');

  equal(newView.container, container, 'expects to share container with parent');
  equal(newView.parentView, view, 'expects to have the correct parent');
});

QUnit.test('should assert when trying to create childView from string, but no such view is registered', function () {
  view.container.lookupFactory = function () {};

  expectAssertion(function () {
    view.createChildView('bro');
  });
});