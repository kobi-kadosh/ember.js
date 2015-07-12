'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.handleLegacyRender = handleLegacyRender;
exports.createComponent = createComponent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

var _emberViewsSystemBuildComponentTemplate = require('ember-views/system/build-component-template');

var _emberViewsSystemBuildComponentTemplate2 = _interopRequireDefault(_emberViewsSystemBuildComponentTemplate);

var _emberHtmlbarsUtilsLookupComponent = require('ember-htmlbars/utils/lookup-component');

var _emberHtmlbarsUtilsLookupComponent2 = _interopRequireDefault(_emberHtmlbarsUtilsLookupComponent);

var _emberHtmlbarsHooksGetCellOrValue = require('ember-htmlbars/hooks/get-cell-or-value');

var _emberHtmlbarsHooksGetCellOrValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetCellOrValue);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalSet_properties = require('ember-metal/set_properties');

var _emberMetalSet_properties2 = _interopRequireDefault(_emberMetalSet_properties);

var _emberViewsCompatAttrsProxy = require('ember-views/compat/attrs-proxy');

var _htmlbarsUtilSafeString = require('htmlbars-util/safe-string');

var _htmlbarsUtilSafeString2 = _interopRequireDefault(_htmlbarsUtilSafeString);

var _emberHtmlbarsSystemInstrumentationSupport = require('ember-htmlbars/system/instrumentation-support');

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

// In theory this should come through the env, but it should
// be safe to import this until we make the hook system public
// and it gets actively used in addons or other downstream
// libraries.

var _emberHtmlbarsHooksGetValue = require('ember-htmlbars/hooks/get-value');

var _emberHtmlbarsHooksGetValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetValue);

function ComponentNodeManager(component, isAngleBracket, scope, renderNode, attrs, block, expectElement) {
  this.component = component;
  this.isAngleBracket = isAngleBracket;
  this.scope = scope;
  this.renderNode = renderNode;
  this.attrs = attrs;
  this.block = block;
  this.expectElement = expectElement;
}

exports['default'] = ComponentNodeManager;

ComponentNodeManager.create = function (renderNode, env, options) {
  var tagName = options.tagName;
  var params = options.params;
  var attrs = options.attrs;
  var parentView = options.parentView;
  var parentScope = options.parentScope;
  var isAngleBracket = options.isAngleBracket;
  var templates = options.templates;

  attrs = attrs || {};

  // Try to find the Component class and/or template for this component name in
  // the container.

  var _lookupComponent = (0, _emberHtmlbarsUtilsLookupComponent2['default'])(env.container, tagName);

  var component = _lookupComponent.component;
  var layout = _lookupComponent.layout;

  _emberMetalCore2['default'].assert('HTMLBars error: Could not find component named "' + tagName + '" (no component or template with that name was found)', function () {
    return component || layout;
  });

  component = component || _emberViewsViewsComponent2['default'];

  var createOptions = { parentView: parentView };

  configureTagName(attrs, tagName, component, isAngleBracket, createOptions);

  // Map passed attributes (e.g. <my-component id="foo">) to component
  // properties ({ id: "foo" }).
  configureCreateOptions(attrs, createOptions);

  // If there is a controller on the scope, pluck it off and save it on the
  // component. This allows the component to target actions sent via
  // `sendAction` correctly.
  if (parentScope.locals.controller) {
    createOptions._controller = (0, _emberHtmlbarsHooksGetValue2['default'])(parentScope.locals.controller);
  }

  // this flag is set when a block was provided so that components can see if
  // `this.get('template')` is truthy.  this is added for backwards compat only
  // and accessing `template` prop on a component will trigger a deprecation
  // 2.0TODO: remove
  if (templates['default']) {
    createOptions._deprecatedFlagForBlockProvided = true;
  }

  // Instantiate the component
  component = createComponent(component, isAngleBracket, createOptions, renderNode, env, attrs);

  // If the component specifies its template via the `layout` or `template`
  // properties instead of using the template looked up in the container, get
  // them now that we have the component instance.
  var result = extractComponentTemplates(component, templates);
  layout = result.layout || layout;
  templates = result.templates || templates;

  extractPositionalParams(renderNode, component, params, attrs);

  var results = (0, _emberViewsSystemBuildComponentTemplate2['default'])({ layout: layout, component: component, isAngleBracket: isAngleBracket }, attrs, { templates: templates, scope: parentScope });

  return new ComponentNodeManager(component, isAngleBracket, parentScope, renderNode, attrs, results.block, results.createdElement);
};

function extractPositionalParams(renderNode, component, params, attrs) {
  if (component.positionalParams) {
    (function () {
      // if the component is rendered via {{component}} helper, the first
      // element of `params` is the name of the component, so we need to
      // skip that when the positional parameters are constructed
      var paramsStartIndex = renderNode.state.isComponentHelper ? 1 : 0;
      var positionalParams = component.positionalParams;
      var isNamed = typeof positionalParams === 'string';
      var paramsStream = undefined;

      if (isNamed) {
        paramsStream = new _emberMetalStreamsStream2['default'](function () {
          return (0, _emberMetalStreamsUtils.readArray)(params.slice(paramsStartIndex));
        }, 'params');

        attrs[positionalParams] = paramsStream;
      }

      for (var i = 0; i < positionalParams.length; i++) {
        var param = params[paramsStartIndex + i];
        if (isNamed) {
          paramsStream.addDependency(param);
        } else {
          attrs[positionalParams[i]] = param;
        }
      }
    })();
  }
}

function extractComponentTemplates(component, _templates) {
  // Even though we looked up a layout from the container earlier, the
  // component may specify a `layout` property that overrides that.
  // The component may also provide a `template` property we should
  // respect (though this behavior is deprecated).
  var componentLayout = (0, _emberMetalProperty_get.get)(component, 'layout');
  var hasBlock = _templates && _templates['default'];
  var layout = undefined,
      templates = undefined,
      componentTemplate = undefined;
  if (hasBlock) {
    componentTemplate = null;
  } else if (component.isComponent) {
    componentTemplate = (0, _emberMetalProperty_get.get)(component, '_template');
  } else {
    componentTemplate = (0, _emberMetalProperty_get.get)(component, 'template');
  }

  if (componentLayout) {
    layout = componentLayout;
    templates = extractLegacyTemplate(_templates, componentTemplate);
  } else if (componentTemplate) {
    // If the component has a `template` but no `layout`, use the template
    // as the layout.
    layout = componentTemplate;
    templates = _templates;
    _emberMetalCore2['default'].deprecate('Using deprecated `template` property on a Component.');
  }

  return { layout: layout, templates: templates };
}

// 2.0TODO: Remove legacy behavior
function extractLegacyTemplate(_templates, componentTemplate) {
  var templates = undefined;

  // There is no block template provided but the component has a
  // `template` property.
  if ((!_templates || !_templates['default']) && componentTemplate) {
    _emberMetalCore2['default'].deprecate('Using deprecated `template` property on a Component.');
    templates = { 'default': componentTemplate.raw };
  } else {
    templates = _templates;
  }

  return templates;
}

function configureTagName(attrs, tagName, component, isAngleBracket, createOptions) {
  if (isAngleBracket) {
    createOptions.tagName = tagName;
  } else if (attrs.tagName) {
    createOptions.tagName = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.tagName);
  }
}

function configureCreateOptions(attrs, createOptions) {
  // Some attrs are special and need to be set as properties on the component
  // instance. Make sure we use getValue() to get them from `attrs` since
  // they are still streams.
  if (attrs.id) {
    createOptions.elementId = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.id);
  }
  if (attrs._defaultTagName) {
    createOptions._defaultTagName = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs._defaultTagName);
  }
  if (attrs.viewName) {
    createOptions.viewName = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.viewName);
  }
}

ComponentNodeManager.prototype.render = function (_env, visitor) {
  var component = this.component;
  var attrs = this.attrs;

  return (0, _emberHtmlbarsSystemInstrumentationSupport.instrument)(component, function () {
    var env = _env.childWithView(component);

    var snapshot = takeSnapshot(attrs);
    env.renderer.componentInitAttrs(this.component, snapshot);
    env.renderer.componentWillRender(component);
    env.renderedViews.push(component.elementId);

    if (this.block) {
      this.block(env, [], undefined, this.renderNode, this.scope, visitor);
    }

    var element = this.expectElement && this.renderNode.firstNode;

    handleLegacyRender(component, element);
    env.renderer.didCreateElement(component, element);
    env.renderer.willInsertElement(component, element); // 2.0TODO remove legacy hook

    env.lifecycleHooks.push({ type: 'didInsertElement', view: component });
  }, this);
};

function handleLegacyRender(component, element) {
  if (!component.render) {
    return;
  }

  _emberMetalCore2['default'].assert('Legacy render functions are not supported with angle-bracket components', !component._isAngleBracket);

  var content, node, lastChildIndex;
  var buffer = [];
  var renderNode = component._renderNode;
  component.render(buffer);
  content = buffer.join('');
  if (element) {
    lastChildIndex = renderNode.childNodes.length - 1;
    node = renderNode.childNodes[lastChildIndex];
  } else {
    node = renderNode;
  }
  node.setContent(new _htmlbarsUtilSafeString2['default'](content));
}

ComponentNodeManager.prototype.rerender = function (_env, attrs, visitor) {
  var component = this.component;

  return (0, _emberHtmlbarsSystemInstrumentationSupport.instrument)(component, function () {
    var env = _env.childWithView(component);

    var snapshot = takeSnapshot(attrs);

    if (component._renderNode.shouldReceiveAttrs) {
      env.renderer.componentUpdateAttrs(component, snapshot);

      if (!component._isAngleBracket) {
        (0, _emberMetalSet_properties2['default'])(component, mergeBindings({}, shadowedAttrs(component, snapshot)));
      }

      component._renderNode.shouldReceiveAttrs = false;
    }

    // Notify component that it has become dirty and is about to change.
    env.renderer.componentWillUpdate(component, snapshot);
    env.renderer.componentWillRender(component);

    env.renderedViews.push(component.elementId);

    if (this.block) {
      this.block(env, [], undefined, this.renderNode, this.scope, visitor);
    }

    env.lifecycleHooks.push({ type: 'didUpdate', view: component });

    return env;
  }, this);
};

ComponentNodeManager.prototype.destroy = function () {
  var component = this.component;

  // Clear component's render node. Normally this gets cleared
  // during view destruction, but in this case we're re-assigning the
  // node to a different view and it will get cleaned up automatically.
  component._renderNode = null;
  component.destroy();
};

function createComponent(_component, isAngleBracket, _props, renderNode, env) {
  var attrs = arguments[5] === undefined ? {} : arguments[5];

  var props = (0, _emberMetalMerge.assign)({}, _props);

  if (!isAngleBracket) {
    var hasSuppliedController = ('controller' in attrs); // 2.0TODO remove
    _emberMetalCore2['default'].deprecate('controller= is deprecated', !hasSuppliedController);

    var snapshot = takeSnapshot(attrs);
    props.attrs = snapshot;

    var proto = _component.proto();
    mergeBindings(props, shadowedAttrs(proto, snapshot));
  } else {
    props._isAngleBracket = true;
  }

  props.renderer = props.parentView ? props.parentView.renderer : env.container.lookup('renderer:-dom');
  props._viewRegistry = props.parentView ? props.parentView._viewRegistry : env.container.lookup('-view-registry:main');

  var component = _component.create(props);

  // for the fallback case
  component.container = component.container || env.container;

  if (props.parentView) {
    props.parentView.appendChild(component);

    if (props.viewName) {
      (0, _emberMetalProperty_set.set)(props.parentView, props.viewName, component);
    }
  }

  component._renderNode = renderNode;
  renderNode.emberView = component;
  renderNode.buildChildEnv = buildChildEnv;
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

function buildChildEnv(state, env) {
  return env.childWithView(this.emberView);
}