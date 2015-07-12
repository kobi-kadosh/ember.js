'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createOrUpdateComponent = createOrUpdateComponent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsSystemBuildComponentTemplate = require('ember-views/system/build-component-template');

var _emberViewsSystemBuildComponentTemplate2 = _interopRequireDefault(_emberViewsSystemBuildComponentTemplate);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalSet_properties = require('ember-metal/set_properties');

var _emberMetalSet_properties2 = _interopRequireDefault(_emberMetalSet_properties);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

var _emberHtmlbarsHooksGetCellOrValue = require('ember-htmlbars/hooks/get-cell-or-value');

var _emberHtmlbarsHooksGetCellOrValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetCellOrValue);

var _emberHtmlbarsSystemInstrumentationSupport = require('ember-htmlbars/system/instrumentation-support');

var _emberHtmlbarsNodeManagersComponentNodeManager = require('ember-htmlbars/node-managers/component-node-manager');

// In theory this should come through the env, but it should
// be safe to import this until we make the hook system public
// and it gets actively used in addons or other downstream
// libraries.

var _emberHtmlbarsHooksGetValue = require('ember-htmlbars/hooks/get-value');

var _emberHtmlbarsHooksGetValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetValue);

function ViewNodeManager(component, scope, renderNode, block, expectElement) {
  this.component = component;
  this.scope = scope;
  this.renderNode = renderNode;
  this.block = block;
  this.expectElement = expectElement;
}

exports['default'] = ViewNodeManager;

ViewNodeManager.create = function (renderNode, env, attrs, found, parentView, path, contentScope, contentTemplate) {
  _emberMetalCore2['default'].assert('HTMLBars error: Could not find component named "' + path + '" (no component or template with that name was found)', function () {
    if (path) {
      return found.component || found.layout;
    } else {
      return found.component || found.layout || contentTemplate;
    }
  });

  var component;
  var componentInfo = { layout: found.layout };

  if (found.component) {
    var options = { parentView: parentView };

    if (attrs && attrs.id) {
      options.elementId = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.id);
    }
    if (attrs && attrs.tagName) {
      options.tagName = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.tagName);
    }
    if (attrs && attrs._defaultTagName) {
      options._defaultTagName = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs._defaultTagName);
    }
    if (attrs && attrs.viewName) {
      options.viewName = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.viewName);
    }

    if (found.component.create && contentScope && contentScope.self) {
      options._context = (0, _emberHtmlbarsHooksGetValue2['default'])(contentScope.self);
    }

    if (found.self) {
      options._context = (0, _emberHtmlbarsHooksGetValue2['default'])(found.self);
    }

    component = componentInfo.component = createOrUpdateComponent(found.component, options, found.createOptions, renderNode, env, attrs);

    var layout = (0, _emberMetalProperty_get.get)(component, 'layout');
    if (layout) {
      componentInfo.layout = layout;
      if (!contentTemplate) {
        var template = getTemplate(component);

        if (template) {
          _emberMetalCore2['default'].deprecate('Using deprecated `template` property on a ' + (component.isView ? 'View' : 'Component') + '.');
          contentTemplate = template.raw;
        }
      }
    } else {
      componentInfo.layout = getTemplate(component) || componentInfo.layout;
    }

    renderNode.emberView = component;
  }

  _emberMetalCore2['default'].assert('BUG: ViewNodeManager.create can take a scope or a self, but not both', !(contentScope && found.self));

  var results = (0, _emberViewsSystemBuildComponentTemplate2['default'])(componentInfo, attrs, {
    templates: { 'default': contentTemplate },
    scope: contentScope,
    self: found.self
  });

  return new ViewNodeManager(component, contentScope, renderNode, results.block, results.createdElement);
};

ViewNodeManager.prototype.render = function (env, attrs, visitor) {
  var component = this.component;

  return (0, _emberHtmlbarsSystemInstrumentationSupport.instrument)(component, function () {

    var newEnv = env;
    if (component) {
      newEnv = env.childWithView(component);
    }

    if (component) {
      var snapshot = takeSnapshot(attrs);
      env.renderer.setAttrs(this.component, snapshot);
      env.renderer.willRender(component);
      env.renderedViews.push(component.elementId);
    }

    if (this.block) {
      this.block(newEnv, [], undefined, this.renderNode, this.scope, visitor);
    }

    if (component) {
      var element = this.expectElement && this.renderNode.firstNode;
      (0, _emberHtmlbarsNodeManagersComponentNodeManager.handleLegacyRender)(component, element);

      env.renderer.didCreateElement(component, element); // 2.0TODO: Remove legacy hooks.
      env.renderer.willInsertElement(component, element);
      env.lifecycleHooks.push({ type: 'didInsertElement', view: component });
    }
  }, this);
};

ViewNodeManager.prototype.rerender = function (env, attrs, visitor) {
  var component = this.component;

  return (0, _emberHtmlbarsSystemInstrumentationSupport.instrument)(component, function () {
    var newEnv = env;
    if (component) {
      newEnv = env.childWithView(component);

      var snapshot = takeSnapshot(attrs);

      // Notify component that it has become dirty and is about to change.
      env.renderer.willUpdate(component, snapshot);

      if (component._renderNode.shouldReceiveAttrs) {
        env.renderer.updateAttrs(component, snapshot);
        (0, _emberMetalSet_properties2['default'])(component, mergeBindings({}, shadowedAttrs(component, snapshot)));
        component._renderNode.shouldReceiveAttrs = false;
      }

      env.renderer.willRender(component);

      env.renderedViews.push(component.elementId);
    }
    if (this.block) {
      this.block(newEnv, [], undefined, this.renderNode, this.scope, visitor);
    }

    return newEnv;
  }, this);
};

ViewNodeManager.prototype.destroy = function () {
  if (this.component) {
    this.component.destroy();
    this.component = null;
  }
};

function getTemplate(componentOrView) {
  return componentOrView.isComponent ? (0, _emberMetalProperty_get.get)(componentOrView, '_template') : (0, _emberMetalProperty_get.get)(componentOrView, 'template');
}

function createOrUpdateComponent(component, options, createOptions, renderNode, env) {
  var attrs = arguments[5] === undefined ? {} : arguments[5];

  var snapshot = takeSnapshot(attrs);
  var props = (0, _emberMetalMerge2['default'])({}, options);
  var defaultController = _emberViewsViewsView2['default'].proto().controller;
  var hasSuppliedController = 'controller' in attrs || 'controller' in props;

  props.attrs = snapshot;
  if (component.create) {
    var proto = component.proto();

    if (createOptions) {
      (0, _emberMetalMerge2['default'])(props, createOptions);
    }

    mergeBindings(props, shadowedAttrs(proto, snapshot));
    props.container = options.parentView ? options.parentView.container : env.container;
    props.renderer = options.parentView ? options.parentView.renderer : props.container && props.container.lookup('renderer:-dom');
    props._viewRegistry = options.parentView ? options.parentView._viewRegistry : props.container && props.container.lookup('-view-registry:main');

    if (proto.controller !== defaultController || hasSuppliedController) {
      delete props._context;
    }

    component = component.create(props);
  } else {
    mergeBindings(props, shadowedAttrs(component, snapshot));
    (0, _emberMetalSet_properties2['default'])(component, props);
  }

  if (options.parentView) {
    options.parentView.appendChild(component);

    if (options.viewName) {
      (0, _emberMetalProperty_set.set)(options.parentView, options.viewName, component);
    }
  }

  component._renderNode = renderNode;

  renderNode.emberView = component;
  return component;
}

function shadowedAttrs(target, attrs) {
  var shadowed = {};

  // For backwards compatibility, set the component property
  // if it has an attr with that name. Undefined attributes
  // are handled on demand via the `unknownProperty` hook.
  for (var attr in attrs) {
    if (attr in target) {
      // TODO: Should we issue a deprecation here?
      //Ember.deprecate(deprecation(attr));
      shadowed[attr] = attrs[attr];
    }
  }

  return shadowed;
}

function takeSnapshot(attrs) {
  var hash = {};

  for (var prop in attrs) {
    hash[prop] = (0, _emberHtmlbarsHooksGetCellOrValue2['default'])(attrs[prop]);
  }

  return hash;
}

function mergeBindings(target, attrs) {
  for (var prop in attrs) {
    if (!attrs.hasOwnProperty(prop)) {
      continue;
    }
    // when `attrs` is an actual value being set in the
    // attrs hash (`{{foo-bar attrs="blah"}}`) we cannot
    // set `"blah"` to the root of the target because
    // that would replace all attrs with `attrs.attrs`
    if (prop === 'attrs') {
      _emberMetalCore2['default'].warn('Invoking a component with a hash attribute named `attrs` is not supported. Please refactor usage of ' + target + ' to avoid passing `attrs` as a hash parameter.');
      continue;
    }
    var value = attrs[prop];

    if (value && value[_emberViewsCompatAttrsProxy.MUTABLE_CELL]) {
      target[prop] = value.value;
    } else {
      target[prop] = value;
    }
  }

  return target;
}