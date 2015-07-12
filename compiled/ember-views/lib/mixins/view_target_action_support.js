'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeMixinsTarget_action_support = require('ember-runtime/mixins/target_action_support');

var _emberRuntimeMixinsTarget_action_support2 = _interopRequireDefault(_emberRuntimeMixinsTarget_action_support);

var _emberMetalAlias = require('ember-metal/alias');

var _emberMetalAlias2 = _interopRequireDefault(_emberMetalAlias);

/**
`Ember.ViewTargetActionSupport` is a mixin that can be included in a
view class to add a `triggerAction` method with semantics similar to
the Handlebars `{{action}}` helper. It provides intelligent defaults
for the action's target: the view's controller; and the context that is
sent with the action: the view's context.

Note: In normal Ember usage, the `{{action}}` helper is usually the best
choice. This mixin is most often useful when you are doing more complex
event handling in custom View subclasses.

For example:

```javascript
App.SaveButtonView = Ember.View.extend(Ember.ViewTargetActionSupport, {
  action: 'save',
  click: function() {
    this.triggerAction(); // Sends the `save` action, along with the current context
                          // to the current controller
  }
});
```

The `action` can be provided as properties of an optional object argument
to `triggerAction` as well.

```javascript
App.SaveButtonView = Ember.View.extend(Ember.ViewTargetActionSupport, {
  click: function() {
    this.triggerAction({
      action: 'save'
    }); // Sends the `save` action, along with the current context
        // to the current controller
  }
});
```

@class ViewTargetActionSupport
@namespace Ember
@extends Ember.TargetActionSupport
@private
*/
exports['default'] = _emberMetalMixin.Mixin.create(_emberRuntimeMixinsTarget_action_support2['default'], {
  /**
   @property target
   @private
  */
  target: (0, _emberMetalAlias2['default'])('controller'),
  /**
   @property actionContext
   @private
  */
  actionContext: (0, _emberMetalAlias2['default'])('context')
});
module.exports = exports['default'];