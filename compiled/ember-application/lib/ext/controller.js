/**
@module ember
@submodule ember-application
@public
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

var _emberRoutingSystemController_for = require('ember-routing/system/controller_for');

var _emberRoutingSystemController_for2 = _interopRequireDefault(_emberRoutingSystemController_for);

function verifyNeedsDependencies(controller, container, needs) {
  var dependency, i, l;
  var missing = [];

  for (i = 0, l = needs.length; i < l; i++) {
    dependency = needs[i];

    _emberMetalCore2['default'].assert((0, _emberMetalUtils.inspect)(controller) + '#needs must not specify dependencies with periods in their names (' + dependency + ')', dependency.indexOf('.') === -1);

    if (dependency.indexOf(':') === -1) {
      dependency = 'controller:' + dependency;
    }

    // Structure assert to still do verification but not string concat in production
    if (!container._registry.has(dependency)) {
      missing.push(dependency);
    }
  }
  if (missing.length) {
    throw new _emberMetalError2['default']((0, _emberMetalUtils.inspect)(controller) + ' needs [ ' + missing.join(', ') + ' ] but ' + (missing.length > 1 ? 'they' : 'it') + ' could not be found');
  }
}

var defaultControllersComputedProperty = (0, _emberMetalComputed.computed)(function () {
  var controller = this;

  return {
    needs: (0, _emberMetalProperty_get.get)(controller, 'needs'),
    container: (0, _emberMetalProperty_get.get)(controller, 'container'),
    unknownProperty: function unknownProperty(controllerName) {
      var needs = this.needs;
      var dependency, i, l;

      for (i = 0, l = needs.length; i < l; i++) {
        dependency = needs[i];
        if (dependency === controllerName) {
          return this.container.lookup('controller:' + controllerName);
        }
      }

      var errorMessage = (0, _emberMetalUtils.inspect)(controller) + '#needs does not include `' + controllerName + '`. To access the ' + controllerName + ' controller from ' + (0, _emberMetalUtils.inspect)(controller) + ', ' + (0, _emberMetalUtils.inspect)(controller) + ' should have a `needs` property that is an array of the controllers it has access to.';
      throw new ReferenceError(errorMessage);
    },
    setUnknownProperty: function setUnknownProperty(key, value) {
      throw new Error('You cannot overwrite the value of `controllers.' + key + '` of ' + (0, _emberMetalUtils.inspect)(controller));
    }
  };
});

/**
  @class ControllerMixin
  @namespace Ember
  @public
*/
_emberRuntimeMixinsController2['default'].reopen({
  concatenatedProperties: ['needs'],

  /**
    An array of other controller objects available inside
    instances of this controller via the `controllers`
    property:
      For example, when you define a controller:
      ```javascript
    App.CommentsController = Ember.ArrayController.extend({
      needs: ['post']
    });
    ```
      The application's single instance of these other
    controllers are accessible by name through the
    `controllers` property:
      ```javascript
    this.get('controllers.post'); // instance of App.PostController
    ```
      Given that you have a nested controller (nested routes):
      ```javascript
    App.CommentsNewController = Ember.ObjectController.extend({
    });
    ```
      When you define a controller that requires access to a nested one:
      ```javascript
    App.IndexController = Ember.ObjectController.extend({
      needs: ['commentsNew']
    });
    ```
      You will be able to get access to it:
      ```javascript
    this.get('controllers.commentsNew'); // instance of App.CommentsNewController
    ```
      This is only available for singleton controllers.
      @deprecated Use `Ember.inject.controller()` instead.
    @property {Array} needs
    @default []
    @public
  */
  needs: [],

  init: function init() {
    var needs = (0, _emberMetalProperty_get.get)(this, 'needs');
    var length = (0, _emberMetalProperty_get.get)(needs, 'length');

    if (length > 0) {
      _emberMetalCore2['default'].assert(' `' + (0, _emberMetalUtils.inspect)(this) + ' specifies `needs`, but does ' + 'not have a container. Please ensure this controller was ' + 'instantiated with a container.', this.container || this.controllers !== defaultControllersComputedProperty);

      if (this.container) {
        verifyNeedsDependencies(this, this.container, needs);
      }

      // if needs then initialize controllers proxy
      (0, _emberMetalProperty_get.get)(this, 'controllers');
    }

    this._super.apply(this, arguments);
  },

  /**
    @method controllerFor
    @see {Ember.Route#controllerFor}
    @deprecated Use `needs` instead
    @public
  */
  controllerFor: function controllerFor(controllerName) {
    _emberMetalCore2['default'].deprecate('Controller#controllerFor is deprecated, please use Controller#needs instead');
    return (0, _emberRoutingSystemController_for2['default'])((0, _emberMetalProperty_get.get)(this, 'container'), controllerName);
  },

  /**
    Stores the instances of other controllers available from within
    this controller. Any controller listed by name in the `needs`
    property will be accessible by name through this property.
      ```javascript
    App.CommentsController = Ember.ArrayController.extend({
      needs: ['post'],
      postTitle: function() {
        var currentPost = this.get('controllers.post'); // instance of App.PostController
        return currentPost.get('title');
      }.property('controllers.post.title')
    });
    ```
      @see {Ember.ControllerMixin#needs}
    @property {Object} controllers
    @default null
    @public
  */
  controllers: defaultControllersComputedProperty
});

exports['default'] = _emberRuntimeMixinsController2['default'];
module.exports = exports['default'];