/**
@module ember
@submodule ember-views
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

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsSystemAction_manager = require('ember-views/system/action_manager');

var _emberViewsSystemAction_manager2 = _interopRequireDefault(_emberViewsSystemAction_manager);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

/**
  `Ember.EventDispatcher` handles delegating browser events to their
  corresponding `Ember.Views.` For example, when you click on a view,
  `Ember.EventDispatcher` ensures that that view's `mouseDown` method gets
  called.

  @class EventDispatcher
  @namespace Ember
  @private
  @extends Ember.Object
*/
exports['default'] = _emberRuntimeSystemObject2['default'].extend({

  /**
    The set of events names (and associated handler function names) to be setup
    and dispatched by the `EventDispatcher`. Custom events can added to this list at setup
    time, generally via the `Ember.Application.customEvents` hash. Only override this
    default set to prevent the EventDispatcher from listening on some events all together.
      This set will be modified by `setup` to also include any events added at that time.
      @property events
    @type Object
    @private
  */
  events: {
    touchstart: 'touchStart',
    touchmove: 'touchMove',
    touchend: 'touchEnd',
    touchcancel: 'touchCancel',
    keydown: 'keyDown',
    keyup: 'keyUp',
    keypress: 'keyPress',
    mousedown: 'mouseDown',
    mouseup: 'mouseUp',
    contextmenu: 'contextMenu',
    click: 'click',
    dblclick: 'doubleClick',
    mousemove: 'mouseMove',
    focusin: 'focusIn',
    focusout: 'focusOut',
    mouseenter: 'mouseEnter',
    mouseleave: 'mouseLeave',
    submit: 'submit',
    input: 'input',
    change: 'change',
    dragstart: 'dragStart',
    drag: 'drag',
    dragenter: 'dragEnter',
    dragleave: 'dragLeave',
    dragover: 'dragOver',
    drop: 'drop',
    dragend: 'dragEnd'
  },

  /**
    The root DOM element to which event listeners should be attached. Event
    listeners will be attached to the document unless this is overridden.
      Can be specified as a DOMElement or a selector string.
      The default body is a string since this may be evaluated before document.body
    exists in the DOM.
      @private
    @property rootElement
    @type DOMElement
    @default 'body'
  */
  rootElement: 'body',

  /**
    It enables events to be dispatched to the view's `eventManager.` When present,
    this object takes precedence over handling of events on the view itself.
      Note that most Ember applications do not use this feature. If your app also
    does not use it, consider setting this property to false to gain some performance
    improvement by allowing the EventDispatcher to skip the search for the
    `eventManager` on the view tree.
      ```javascript
    var EventDispatcher = Em.EventDispatcher.extend({
      events: {
          click       : 'click',
          focusin     : 'focusIn',
          focusout    : 'focusOut',
          change      : 'change'
      },
      canDispatchToEventManager: false
    });
    container.register('event_dispatcher:main', EventDispatcher);
    ```
      @property canDispatchToEventManager
    @type boolean
    @default 'true'
    @since 1.7.0
    @private
  */
  canDispatchToEventManager: true,

  /**
    Sets up event listeners for standard browser events.
      This will be called after the browser sends a `DOMContentReady` event. By
    default, it will set up all of the listeners on the document body. If you
    would like to register the listeners on a different element, set the event
    dispatcher's `root` property.
      @private
    @method setup
    @param addedEvents {Object}
  */
  setup: function setup(addedEvents, rootElement) {
    var event;
    var events = (0, _emberMetalProperty_get.get)(this, 'events');

    (0, _emberMetalMerge2['default'])(events, addedEvents || {});

    if (!(0, _emberMetalIs_none2['default'])(rootElement)) {
      (0, _emberMetalProperty_set.set)(this, 'rootElement', rootElement);
    }

    rootElement = (0, _emberViewsSystemJquery2['default'])((0, _emberMetalProperty_get.get)(this, 'rootElement'));

    _emberMetalCore2['default'].assert((0, _emberRuntimeSystemString.fmt)('You cannot use the same root element (%@) multiple times in an Ember.Application', [rootElement.selector || rootElement[0].tagName]), !rootElement.is('.ember-application'));
    _emberMetalCore2['default'].assert('You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application', !rootElement.closest('.ember-application').length);
    _emberMetalCore2['default'].assert('You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application', !rootElement.find('.ember-application').length);

    rootElement.addClass('ember-application');

    _emberMetalCore2['default'].assert('Unable to add "ember-application" class to rootElement. Make sure you set rootElement to the body or an element in the body.', rootElement.is('.ember-application'));

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event]);
      }
    }
  },

  /**
    Registers an event listener on the rootElement. If the given event is
    triggered, the provided event handler will be triggered on the target view.
      If the target view does not implement the event handler, or if the handler
    returns `false`, the parent view will be called. The event will continue to
    bubble to each successive parent view until it reaches the top.
      @private
    @method setupHandler
    @param {Element} rootElement
    @param {String} event the browser-originated event to listen to
    @param {String} eventName the name of the method to call on the view
  */
  setupHandler: function setupHandler(rootElement, event, eventName) {
    var self = this;
    var viewRegistry = this.container && this.container.lookup('-view-registry:main') || _emberViewsViewsView2['default'].views;

    rootElement.on(event + '.ember', '.ember-view', function (evt, triggeringManager) {
      var view = viewRegistry[this.id];
      var result = true;

      var manager = self.canDispatchToEventManager ? self._findNearestEventManager(view, eventName) : null;

      if (manager && manager !== triggeringManager) {
        result = self._dispatchEvent(manager, evt, eventName, view);
      } else if (view) {
        result = self._bubbleEvent(view, evt, eventName);
      }

      return result;
    });

    rootElement.on(event + '.ember', '[data-ember-action]', function (evt) {
      var actionId = (0, _emberViewsSystemJquery2['default'])(evt.currentTarget).attr('data-ember-action');
      var actions = _emberViewsSystemAction_manager2['default'].registeredActions[actionId];

      // We have to check for actions here since in some cases, jQuery will trigger
      // an event on `removeChild` (i.e. focusout) after we've already torn down the
      // action handlers for the view.
      if (!actions) {
        return;
      }

      for (var index = 0, _length = actions.length; index < _length; index++) {
        var action = actions[index];

        if (action && action.eventName === eventName) {
          return action.handler(evt);
        }
      }
    });
  },

  _findNearestEventManager: function _findNearestEventManager(view, eventName) {
    var manager = null;

    while (view) {
      manager = (0, _emberMetalProperty_get.get)(view, 'eventManager');
      if (manager && manager[eventName]) {
        break;
      }

      view = (0, _emberMetalProperty_get.get)(view, 'parentView');
    }

    return manager;
  },

  _dispatchEvent: function _dispatchEvent(object, evt, eventName, view) {
    var result = true;

    var handler = object[eventName];
    if (typeof handler === 'function') {
      result = (0, _emberMetalRun_loop2['default'])(object, handler, evt, view);
      // Do not preventDefault in eventManagers.
      evt.stopPropagation();
    } else {
      result = this._bubbleEvent(view, evt, eventName);
    }

    return result;
  },

  _bubbleEvent: function _bubbleEvent(view, evt, eventName) {
    return _emberMetalRun_loop2['default'].join(view, view.handleEvent, eventName, evt);
  },

  destroy: function destroy() {
    var rootElement = (0, _emberMetalProperty_get.get)(this, 'rootElement');
    (0, _emberViewsSystemJquery2['default'])(rootElement).off('.ember', '**').removeClass('ember-application');
    return this._super.apply(this, arguments);
  },

  toString: function toString() {
    return '(EventDispatcher)';
  }
});
module.exports = exports['default'];