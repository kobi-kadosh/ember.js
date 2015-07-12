'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert, Ember.Handlebars

var _emberViewsMixinsComponent_template_deprecation = require('ember-views/mixins/component_template_deprecation');

var _emberViewsMixinsComponent_template_deprecation2 = _interopRequireDefault(_emberViewsMixinsComponent_template_deprecation);

var _emberRuntimeMixinsTarget_action_support = require('ember-runtime/mixins/target_action_support');

var _emberRuntimeMixinsTarget_action_support2 = _interopRequireDefault(_emberRuntimeMixinsTarget_action_support);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

var _emberMetalComputed = require('ember-metal/computed');

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

function validateAction(component, actionName) {
  if (actionName && actionName[_emberViewsCompatAttrsProxy.MUTABLE_CELL]) {
    actionName = actionName.value;
  }
  _emberMetalCore2['default'].assert('The default action was triggered on the component ' + component.toString() + ', but the action name (' + actionName + ') was not a string.', (0, _emberMetalIs_none2['default'])(actionName) || typeof actionName === 'string' || typeof actionName === 'function');
  return actionName;
}

/**
@module ember
@submodule ember-views
*/

/**
  An `Ember.Component` is a view that is completely
  isolated. Properties accessed in its templates go
  to the view object and actions are targeted at
  the view object. There is no access to the
  surrounding context or outer controller; all
  contextual information must be passed in.

  The easiest way to create an `Ember.Component` is via
  a template. If you name a template
  `components/my-foo`, you will be able to use
  `{{my-foo}}` in other templates, which will make
  an instance of the isolated component.

  ```handlebars
  {{app-profile person=currentUser}}
  ```

  ```handlebars
  <!-- app-profile template -->
  <h1>{{person.title}}</h1>
  <img src={{person.avatar}}>
  <p class='signature'>{{person.signature}}</p>
  ```

  You can use `yield` inside a template to
  include the **contents** of any block attached to
  the component. The block will be executed in the
  context of the surrounding context or outer controller:

  ```handlebars
  {{#app-profile person=currentUser}}
    <p>Admin mode</p>
    {{! Executed in the controller's context. }}
  {{/app-profile}}
  ```

  ```handlebars
  <!-- app-profile template -->
  <h1>{{person.title}}</h1>
  {{! Executed in the components context. }}
  {{yield}} {{! block contents }}
  ```

  If you want to customize the component, in order to
  handle events or actions, you implement a subclass
  of `Ember.Component` named after the name of the
  component. Note that `Component` needs to be appended to the name of
  your subclass like `AppProfileComponent`.

  For example, you could implement the action
  `hello` for the `app-profile` component:

  ```javascript
  App.AppProfileComponent = Ember.Component.extend({
    actions: {
      hello: function(name) {
        console.log("Hello", name);
      }
    }
  });
  ```

  And then use it in the component's template:

  ```handlebars
  <!-- app-profile template -->

  <h1>{{person.title}}</h1>
  {{yield}} <!-- block contents -->

  <button {{action 'hello' person.name}}>
    Say Hello to {{person.name}}
  </button>
  ```

  Components must have a `-` in their name to avoid
  conflicts with built-in controls that wrap HTML
  elements. This is consistent with the same
  requirement in web components.

  @class Component
  @namespace Ember
  @extends Ember.View
  @public
*/
var Component = _emberViewsViewsView2['default'].extend(_emberRuntimeMixinsTarget_action_support2['default'], _emberViewsMixinsComponent_template_deprecation2['default'], {
  isComponent: true,
  /*
    This is set so that the proto inspection in appendTemplatedView does not
    think that it should set the components `context` to that of the parent view.
  */
  controller: null,
  context: null,

  instrumentName: 'component',
  instrumentDisplay: (0, _emberMetalComputed.computed)(function () {
    if (this._debugContainerKey) {
      return '{{' + this._debugContainerKey.split(':')[1] + '}}';
    }
  }),

  init: function init() {
    this._super.apply(this, arguments);
    (0, _emberMetalProperty_set.set)(this, 'controller', this);
    (0, _emberMetalProperty_set.set)(this, 'context', this);
  },

  /**
  A components template property is set by passing a block
  during its invocation. It is executed within the parent context.
    Example:
    ```handlebars
  {{#my-component}}
    // something that is run in the context
    // of the parent context
  {{/my-component}}
  ```
    Specifying a template directly to a component is deprecated without
  also specifying the layout property.
    @deprecated
  @property template
  @public
  */
  template: (0, _emberMetalComputed.computed)('_template', {
    get: function get() {
      _emberMetalCore2['default'].deprecate('Accessing \'template\' in ' + this + ' is deprecated. To determine if a block was specified to ' + this + ' please use \'{{#if hasBlock}}\' in the components layout.');

      return (0, _emberMetalProperty_get.get)(this, '_template');
    },

    set: function set(key, value) {
      return (0, _emberMetalProperty_set.set)(this, '_template', value);
    }
  }),

  _template: (0, _emberMetalComputed.computed)('templateName', {
    get: function get() {
      if ((0, _emberMetalProperty_get.get)(this, '_deprecatedFlagForBlockProvided')) {
        return true;
      }
      var templateName = (0, _emberMetalProperty_get.get)(this, 'templateName');
      var template = this.templateForName(templateName, 'template');

      _emberMetalCore2['default'].assert('You specified the templateName ' + templateName + ' for ' + this + ', but it did not exist.', !templateName || !!template);
      return template || (0, _emberMetalProperty_get.get)(this, 'defaultTemplate');
    },
    set: function set(key, value) {
      return value;
    }
  }),

  /**
  Specifying a components `templateName` is deprecated without also
  providing the `layout` or `layoutName` properties.
    @deprecated
  @property templateName
  @public
  */
  templateName: null,

  /**
    If the component is currently inserted into the DOM of a parent view, this
    property will point to the controller of the parent view.
      @property targetObject
    @type Ember.Controller
    @default null
    @private
  */
  targetObject: (0, _emberMetalComputed.computed)('controller', function (key) {
    if (this._targetObject) {
      return this._targetObject;
    }
    if (this._controller) {
      return this._controller;
    }
    var parentView = (0, _emberMetalProperty_get.get)(this, 'parentView');
    return parentView ? (0, _emberMetalProperty_get.get)(parentView, 'controller') : null;
  }),

  /**
    Triggers a named action on the controller context where the component is used if
    this controller has registered for notifications of the action.
      For example a component for playing or pausing music may translate click events
    into action notifications of "play" or "stop" depending on some internal state
    of the component:
  
    ```javascript
    App.PlayButtonComponent = Ember.Component.extend({
      click: function() {
        if (this.get('isPlaying')) {
          this.sendAction('play');
        } else {
          this.sendAction('stop');
        }
      }
    });
    ```
      When used inside a template these component actions are configured to
    trigger actions in the outer application context:
      ```handlebars
    {{! application.hbs }}
    {{play-button play="musicStarted" stop="musicStopped"}}
    ```
      When the component receives a browser `click` event it translate this
    interaction into application-specific semantics ("play" or "stop") and
    triggers the specified action name on the controller for the template
    where the component is used:
  
    ```javascript
    App.ApplicationController = Ember.Controller.extend({
      actions: {
        musicStarted: function() {
          // called when the play button is clicked
          // and the music started playing
        },
        musicStopped: function() {
          // called when the play button is clicked
          // and the music stopped playing
        }
      }
    });
    ```
      If no action name is passed to `sendAction` a default name of "action"
    is assumed.
      ```javascript
    App.NextButtonComponent = Ember.Component.extend({
      click: function() {
        this.sendAction();
      }
    });
    ```
      ```handlebars
    {{! application.hbs }}
    {{next-button action="playNextSongInAlbum"}}
    ```
      ```javascript
    App.ApplicationController = Ember.Controller.extend({
      actions: {
        playNextSongInAlbum: function() {
          ...
        }
      }
    });
    ```
      @method sendAction
    @param [action] {String} the action to trigger
    @param [context] {*} a context to send with the action
    @public
  */
  sendAction: function sendAction(action) {
    var actionName;

    // Send the default action
    if (action === undefined) {
      action = 'action';
    }
    actionName = (0, _emberMetalProperty_get.get)(this, 'attrs.' + action) || (0, _emberMetalProperty_get.get)(this, action);
    actionName = validateAction(this, actionName);

    // If no action name for that action could be found, just abort.
    if (actionName === undefined) {
      return;
    }

    for (var _len = arguments.length, contexts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contexts[_key - 1] = arguments[_key];
    }

    if (typeof actionName === 'function') {
      actionName.apply(null, contexts);
    } else {
      this.triggerAction({
        action: actionName,
        actionContext: contexts
      });
    }
  },

  send: function send(actionName) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var target;
    var hasAction = this._actions && this._actions[actionName];

    if (hasAction) {
      var shouldBubble = this._actions[actionName].apply(this, args) === true;
      if (!shouldBubble) {
        return;
      }
    }

    if (target = (0, _emberMetalProperty_get.get)(this, 'target')) {
      _emberMetalCore2['default'].assert('The `target` for ' + this + ' (' + target + ') does not have a `send` method', typeof target.send === 'function');
      target.send.apply(target, arguments);
    } else {
      if (!hasAction) {
        throw new Error(_emberMetalCore2['default'].inspect(this) + ' had no action handler for: ' + actionName);
      }
    }
  }

  /**
    Returns true when the component was invoked with a block template.
      Example (`hasBlock` will be `false`):
      ```hbs
    {{! templates/application.hbs }}
      {{foo-bar}}
      {{! templates/components/foo-bar.js }}
    {{#if hasBlock}}
      This will not be printed, because no block was provided
    {{/if}}
    ```
      Example (`hasBlock` will be `true`):
      ```hbs
    {{! templates/application.hbs }}
      {{#foo-bar}}
      Hi!
    {{/foo-bar}}
      {{! templates/components/foo-bar.js }}
    {{#if hasBlock}}
      This will be printed because a block was provided
      {{yield}}
    {{/if}}
    ```
      @public
    @property hasBlock
    @returns Boolean
  */

  /**
    Returns true when the component was invoked with a block parameter
    supplied.
      Example (`hasBlockParams` will be `false`):
      ```hbs
    {{! templates/application.hbs }}
      {{#foo-bar}}
      No block parameter.
    {{/foo-bar}}
      {{! templates/components/foo-bar.js }}
    {{#if hasBlockParams}}
      This will not be printed, because no block was provided
      {{yield this}}
    {{/if}}
    ```
      Example (`hasBlockParams` will be `true`):
      ```hbs
    {{! templates/application.hbs }}
      {{#foo-bar as |foo|}}
      Hi!
    {{/foo-bar}}
      {{! templates/components/foo-bar.js }}
    {{#if hasBlockParams}}
      This will be printed because a block was provided
      {{yield this}}
    {{/if}}
    ```
    @public
    @property hasBlockParams
    @returns Boolean
  */
});

Component.reopenClass({
  isComponentFactory: true
});

exports['default'] = Component;
module.exports = exports['default'];