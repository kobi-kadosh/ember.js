/**
@module ember
@submodule ember-runtime
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.lookup, Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalComputed = require('ember-metal/computed');

/**
`Ember.TargetActionSupport` is a mixin that can be included in a class
to add a `triggerAction` method with semantics similar to the Handlebars
`{{action}}` helper. In normal Ember usage, the `{{action}}` helper is
usually the best choice. This mixin is most often useful when you are
doing more complex event handling in View objects.

See also `Ember.ViewTargetActionSupport`, which has
view-aware defaults for target and actionContext.

@class TargetActionSupport
@namespace Ember
@extends Ember.Mixin
@private
*/
var TargetActionSupport = _emberMetalMixin.Mixin.create({
  target: null,
  action: null,
  actionContext: null,

  targetObject: (0, _emberMetalComputed.computed)('target', function () {
    if (this._targetObject) {
      return this._targetObject;
    }

    var target = (0, _emberMetalProperty_get.get)(this, 'target');

    if (typeof target === 'string') {
      var value = (0, _emberMetalProperty_get.get)(this, target);
      if (value === undefined) {
        value = (0, _emberMetalProperty_get.get)(_emberMetalCore2['default'].lookup, target);
      }

      return value;
    } else {
      return target;
    }
  }),

  actionContextObject: (0, _emberMetalComputed.computed)(function () {
    var actionContext = (0, _emberMetalProperty_get.get)(this, 'actionContext');

    if (typeof actionContext === 'string') {
      var value = (0, _emberMetalProperty_get.get)(this, actionContext);
      if (value === undefined) {
        value = (0, _emberMetalProperty_get.get)(_emberMetalCore2['default'].lookup, actionContext);
      }
      return value;
    } else {
      return actionContext;
    }
  }).property('actionContext'),

  /**
  Send an `action` with an `actionContext` to a `target`. The action, actionContext
  and target will be retrieved from properties of the object. For example:
    ```javascript
  App.SaveButtonView = Ember.View.extend(Ember.TargetActionSupport, {
    target: Ember.computed.alias('controller'),
    action: 'save',
    actionContext: Ember.computed.alias('context'),
    click: function() {
      this.triggerAction(); // Sends the `save` action, along with the current context
                            // to the current controller
    }
  });
  ```
    The `target`, `action`, and `actionContext` can be provided as properties of
  an optional object argument to `triggerAction` as well.
    ```javascript
  App.SaveButtonView = Ember.View.extend(Ember.TargetActionSupport, {
    click: function() {
      this.triggerAction({
        action: 'save',
        target: this.get('controller'),
        actionContext: this.get('context')
      }); // Sends the `save` action, along with the current context
          // to the current controller
    }
  });
  ```
    The `actionContext` defaults to the object you are mixing `TargetActionSupport` into.
  But `target` and `action` must be specified either as properties or with the argument
  to `triggerAction`, or a combination:
    ```javascript
  App.SaveButtonView = Ember.View.extend(Ember.TargetActionSupport, {
    target: Ember.computed.alias('controller'),
    click: function() {
      this.triggerAction({
        action: 'save'
      }); // Sends the `save` action, along with a reference to `this`,
          // to the current controller
    }
  });
  ```
    @method triggerAction
  @param opts {Object} (optional, with the optional keys action, target and/or actionContext)
  @return {Boolean} true if the action was sent successfully and did not return false
  @private
  */
  triggerAction: function triggerAction(opts) {
    opts = opts || {};
    var action = opts.action || (0, _emberMetalProperty_get.get)(this, 'action');
    var target = opts.target || (0, _emberMetalProperty_get.get)(this, 'targetObject');
    var actionContext = opts.actionContext;

    function args(options, actionName) {
      var ret = [];
      if (actionName) {
        ret.push(actionName);
      }

      return ret.concat(options);
    }

    if (typeof actionContext === 'undefined') {
      actionContext = (0, _emberMetalProperty_get.get)(this, 'actionContextObject') || this;
    }

    if (target && action) {
      var ret;

      if (target.send) {
        ret = target.send.apply(target, args(actionContext, action));
      } else {
        _emberMetalCore2['default'].assert('The action \'' + action + '\' did not exist on ' + target, typeof target[action] === 'function');
        ret = target[action].apply(target, args(actionContext));
      }

      if (ret !== false) {
        ret = true;
      }

      return ret;
    } else {
      return false;
    }
  }
});

exports['default'] = TargetActionSupport;
module.exports = exports['default'];