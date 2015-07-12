'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeMixinsMutable_array = require('ember-runtime/mixins/mutable_array');

var _emberRuntimeMixinsMutable_array2 = _interopRequireDefault(_emberRuntimeMixinsMutable_array);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalEvents = require('ember-metal/events');

var _emberHtmlbarsTemplatesContainerView = require('ember-htmlbars/templates/container-view');

var _emberHtmlbarsTemplatesContainerView2 = _interopRequireDefault(_emberHtmlbarsTemplatesContainerView);

_emberHtmlbarsTemplatesContainerView2['default'].meta.revision = 'Ember@VERSION_STRING_PLACEHOLDER';

/**
@module ember
@submodule ember-views
*/

/**
  A `ContainerView` is an `Ember.View` subclass that implements `Ember.MutableArray`
  allowing programmatic management of its child views.

  ## Setting Initial Child Views

  The initial array of child views can be set in one of two ways. You can
  provide a `childViews` property at creation time that contains instance of
  `Ember.View`:

  ```javascript
  aContainer = Ember.ContainerView.create({
    childViews: [Ember.View.create(), Ember.View.create()]
  });
  ```

  You can also provide a list of property names whose values are instances of
  `Ember.View`:

  ```javascript
  aContainer = Ember.ContainerView.create({
    childViews: ['aView', 'bView', 'cView'],
    aView: Ember.View.create(),
    bView: Ember.View.create(),
    cView: Ember.View.create()
  });
  ```

  The two strategies can be combined:

  ```javascript
  aContainer = Ember.ContainerView.create({
    childViews: ['aView', Ember.View.create()],
    aView: Ember.View.create()
  });
  ```

  Each child view's rendering will be inserted into the container's rendered
  HTML in the same order as its position in the `childViews` property.

  ## Adding and Removing Child Views

  The container view implements `Ember.MutableArray` allowing programmatic management of its child views.

  To remove a view, pass that view into a `removeObject` call on the container view.

  Given an empty `<body>` the following code

  ```javascript
  aContainer = Ember.ContainerView.create({
    classNames: ['the-container'],
    childViews: ['aView', 'bView'],
    aView: Ember.View.create({
      template: Ember.Handlebars.compile("A")
    }),
    bView: Ember.View.create({
      template: Ember.Handlebars.compile("B")
    })
  });

  aContainer.appendTo('body');
  ```

  Results in the HTML

  ```html
  <div class="ember-view the-container">
    <div class="ember-view">A</div>
    <div class="ember-view">B</div>
  </div>
  ```

  Removing a view

  ```javascript
  aContainer.toArray();  // [aContainer.aView, aContainer.bView]
  aContainer.removeObject(aContainer.get('bView'));
  aContainer.toArray();  // [aContainer.aView]
  ```

  Will result in the following HTML

  ```html
  <div class="ember-view the-container">
    <div class="ember-view">A</div>
  </div>
  ```

  Similarly, adding a child view is accomplished by adding `Ember.View` instances to the
  container view.

  Given an empty `<body>` the following code

  ```javascript
  aContainer = Ember.ContainerView.create({
    classNames: ['the-container'],
    childViews: ['aView', 'bView'],
    aView: Ember.View.create({
      template: Ember.Handlebars.compile("A")
    }),
    bView: Ember.View.create({
      template: Ember.Handlebars.compile("B")
    })
  });

  aContainer.appendTo('body');
  ```

  Results in the HTML

  ```html
  <div class="ember-view the-container">
    <div class="ember-view">A</div>
    <div class="ember-view">B</div>
  </div>
  ```

  Adding a view

  ```javascript
  AnotherViewClass = Ember.View.extend({
    template: Ember.Handlebars.compile("Another view")
  });

  aContainer.toArray();  // [aContainer.aView, aContainer.bView]
  aContainer.pushObject(AnotherViewClass.create());
  aContainer.toArray(); // [aContainer.aView, aContainer.bView, <AnotherViewClass instance>]
  ```

  Will result in the following HTML

  ```html
  <div class="ember-view the-container">
    <div class="ember-view">A</div>
    <div class="ember-view">B</div>
    <div class="ember-view">Another view</div>
  </div>
  ```

  ## Templates and Layout

  A `template`, `templateName`, `defaultTemplate`, `layout`, `layoutName` or
  `defaultLayout` property on a container view will not result in the template
  or layout being rendered. The HTML contents of a `Ember.ContainerView`'s DOM
  representation will only be the rendered HTML of its child views.

  @class ContainerView
  @namespace Ember
  @extends Ember.View
  @private
*/
var ContainerView = _emberViewsViewsView2['default'].extend(_emberRuntimeMixinsMutable_array2['default'], {
  willWatchProperty: function willWatchProperty(prop) {
    _emberMetalCore2['default'].deprecate('ContainerViews should not be observed as arrays. This behavior will change in future implementations of ContainerView.', !prop.match(/\[]/) && prop.indexOf('@') !== 0);
  },

  init: function init() {
    var _this = this;

    this._super.apply(this, arguments);

    var userChildViews = (0, _emberMetalProperty_get.get)(this, 'childViews');
    _emberMetalCore2['default'].deprecate('Setting `childViews` on a Container is deprecated.', _emberMetalCore2['default'].isEmpty(userChildViews));

    // redefine view's childViews property that was obliterated
    // 2.0TODO: Don't Ember.A() this so users disabling prototype extensions
    // don't pay a penalty.
    var childViews = this.childViews = _emberMetalCore2['default'].A([]);

    userChildViews.forEach(function (viewName, idx) {
      var view;

      if ('string' === typeof viewName) {
        view = (0, _emberMetalProperty_get.get)(_this, viewName);
        view = _this.createChildView(view);
        (0, _emberMetalProperty_set.set)(_this, viewName, view);
      } else {
        view = _this.createChildView(viewName);
      }

      childViews[idx] = view;
    });

    var currentView = (0, _emberMetalProperty_get.get)(this, 'currentView');
    if (currentView) {
      if (!childViews.length) {
        childViews = this.childViews = _emberMetalCore2['default'].A(this.childViews.slice());
      }
      childViews.push(this.createChildView(currentView));
    }

    (0, _emberMetalProperty_set.set)(this, 'length', childViews.length);
  },

  // Normally parentView and childViews are managed at render time.  However,
  // the ContainerView is an unusual legacy case. People expect to be able to
  // push a child view into the ContainerView and have its parentView set
  // appropriately. As a result, we link the child nodes ahead of time and
  // ignore render-time linking.
  appendChild: function appendChild(view) {
    // This occurs if the view being appended is the empty view, rather than
    // a view eagerly inserted into the childViews array.
    if (view.parentView !== this) {
      this.linkChild(view);
    }
  },

  _currentViewWillChange: (0, _emberMetalMixin.beforeObserver)('currentView', function () {
    var currentView = (0, _emberMetalProperty_get.get)(this, 'currentView');
    if (currentView) {
      currentView.destroy();
    }
  }),

  _currentViewDidChange: (0, _emberMetalMixin.observer)('currentView', function () {
    var currentView = (0, _emberMetalProperty_get.get)(this, 'currentView');
    if (currentView) {
      _emberMetalCore2['default'].assert('You tried to set a current view that already has a parent. Make sure you don\'t have multiple outlets in the same view.', !currentView.parentView);
      this.pushObject(currentView);
    }
  }),

  layout: _emberHtmlbarsTemplatesContainerView2['default'],

  replace: function replace(idx, removedCount) {
    var _this2 = this;

    var addedViews = arguments[2] === undefined ? [] : arguments[2];

    var addedCount = (0, _emberMetalProperty_get.get)(addedViews, 'length');
    var childViews = (0, _emberMetalProperty_get.get)(this, 'childViews');

    _emberMetalCore2['default'].assert('You can\'t add a child to a container - the child is already a child of another view', function () {
      for (var i = 0, l = addedViews.length; i < l; i++) {
        var item = addedViews[i];
        if (item.parentView && item.parentView !== _this2) {
          return false;
        }
      }
      return true;
    });

    this.arrayContentWillChange(idx, removedCount, addedCount);

    // Normally parentView and childViews are managed at render time.  However,
    // the ContainerView is an unusual legacy case. People expect to be able to
    // push a child view into the ContainerView and have its parentView set
    // appropriately.
    //
    // Because of this, we synchronously fix up the parentView/childViews tree
    // as soon as views are added or removed, despite the fact that this will
    // happen automatically when we render.
    var removedViews = childViews.slice(idx, idx + removedCount);
    removedViews.forEach(function (view) {
      return _this2.unlinkChild(view);
    });
    addedViews.forEach(function (view) {
      return _this2.linkChild(view);
    });

    childViews.splice.apply(childViews, [idx, removedCount].concat(_toConsumableArray(addedViews)));

    this.notifyPropertyChange('childViews');
    this.arrayContentDidChange(idx, removedCount, addedCount);

    //Ember.assert("You can't add a child to a container - the child is already a child of another view", emberA(addedViews).every(function(item) { return !item.parentView || item.parentView === self; }));

    (0, _emberMetalProperty_set.set)(this, 'length', childViews.length);

    return this;
  },

  objectAt: function objectAt(idx) {
    return this.childViews[idx];
  },

  _triggerChildWillDestroyElement: (0, _emberMetalEvents.on)('willDestroyElement', function () {
    var childViews = this.childViews;
    if (childViews) {
      for (var i = 0; i < childViews.length; i++) {
        this.renderer.willDestroyElement(childViews[i]);
      }
    }
  }),

  _triggerChildDidDestroyElement: (0, _emberMetalEvents.on)('didDestroyElement', function () {
    var childViews = this.childViews;
    if (childViews) {
      for (var i = 0; i < childViews.length; i++) {
        this.renderer.didDestroyElement(childViews[i]);
      }
    }
  })
});

exports['default'] = ContainerView;
module.exports = exports['default'];