'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = buildComponentTemplate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalPath_cache = require('ember-metal/path_cache');

var _htmlbarsRuntime = require('htmlbars-runtime');

var _emberHtmlbarsHooksGetValue = require('ember-htmlbars/hooks/get-value');

var _emberHtmlbarsHooksGetValue2 = _interopRequireDefault(_emberHtmlbarsHooksGetValue);

function buildComponentTemplate(_ref, attrs, content) {
  var component = _ref.component;
  var layout = _ref.layout;
  var isAngleBracket = _ref.isAngleBracket;

  var blockToRender, tagName, meta;

  if (component === undefined) {
    component = null;
  }

  if (layout && layout.raw) {
    var yieldTo = createContentBlocks(content.templates, content.scope, content.self, component);
    blockToRender = createLayoutBlock(layout.raw, yieldTo, content.self, component, attrs);
    meta = layout.raw.meta;
  } else if (content.templates && content.templates['default']) {
    blockToRender = createContentBlock(content.templates['default'], content.scope, content.self, component);
    meta = content.templates['default'].meta;
  }

  if (component) {
    tagName = tagNameFor(component);

    // If this is not a tagless component, we need to create the wrapping
    // element. We use `manualElement` to create a template that represents
    // the wrapping element and yields to the previous block.
    if (tagName !== '') {
      var attributes = normalizeComponentAttributes(component, isAngleBracket, attrs);
      var elementTemplate = _htmlbarsRuntime.internal.manualElement(tagName, attributes);
      elementTemplate.meta = meta;

      blockToRender = createElementBlock(elementTemplate, blockToRender, component);
    } else {
      validateTaglessComponent(component);
    }
  }

  // tagName is one of:
  //   * `undefined` if no component is present
  //   * the falsy value "" if set explicitly on the component
  //   * an actual tagName set explicitly on the component
  return { createdElement: !!tagName, block: blockToRender };
}

function blockFor(template, options) {
  _emberMetalCore2['default'].assert('BUG: Must pass a template to blockFor', !!template);
  return _htmlbarsRuntime.internal.blockFor(_htmlbarsRuntime.render, template, options);
}

function createContentBlock(template, scope, self, component) {
  _emberMetalCore2['default'].assert('BUG: buildComponentTemplate can take a scope or a self, but not both', !(scope && self));

  return blockFor(template, {
    scope: scope,
    self: self,
    options: { view: component }
  });
}

function createContentBlocks(templates, scope, self, component) {
  if (!templates) {
    return;
  }
  var output = {};
  for (var name in templates) {
    if (templates.hasOwnProperty(name)) {
      var template = templates[name];
      if (template) {
        output[name] = createContentBlock(templates[name], scope, self, component);
      }
    }
  }
  return output;
}

function createLayoutBlock(template, yieldTo, self, component, attrs) {
  return blockFor(template, {
    yieldTo: yieldTo,

    // If we have an old-style Controller with a template it will be
    // passed as our `self` argument, and it should be the context for
    // the template. Otherwise, we must have a real Component and it
    // should be its own template context.
    self: self || component,

    options: { view: component, attrs: attrs }
  });
}

function createElementBlock(template, yieldTo, component) {
  return blockFor(template, {
    yieldTo: yieldTo,
    self: component,
    options: { view: component }
  });
}

function tagNameFor(view) {
  var tagName = view.tagName;

  if (tagName !== null && typeof tagName === 'object' && tagName.isDescriptor) {
    tagName = (0, _emberMetalProperty_get.get)(view, 'tagName');
    _emberMetalCore2['default'].deprecate('In the future using a computed property to define tagName will not be permitted. That value will be respected, but changing it will not update the element.', !tagName);
  }

  if (tagName === null || tagName === undefined) {
    tagName = view._defaultTagName || 'div';
  }

  return tagName;
}

// Takes a component and builds a normalized set of attribute
// bindings consumable by HTMLBars' `attribute` hook.
function normalizeComponentAttributes(component, isAngleBracket, attrs) {
  var normalized = {};
  var attributeBindings = component.attributeBindings;
  var i, l;

  if (attributeBindings) {
    for (i = 0, l = attributeBindings.length; i < l; i++) {
      var attr = attributeBindings[i];
      var colonIndex = attr.indexOf(':');

      var attrName, expression;
      if (colonIndex !== -1) {
        var attrProperty = attr.substring(0, colonIndex);
        attrName = attr.substring(colonIndex + 1);
        expression = ['get', 'view.' + attrProperty];
      } else if (attrs[attr]) {
        // TODO: For compatibility with 1.x, we probably need to `set`
        // the component's attribute here if it is a CP, but we also
        // probably want to suspend observers and allow the
        // willUpdateAttrs logic to trigger observers at the correct time.
        attrName = attr;
        expression = ['value', attrs[attr]];
      } else {
        attrName = attr;
        expression = ['get', 'view.' + attr];
      }

      _emberMetalCore2['default'].assert('You cannot use class as an attributeBinding, use classNameBindings instead.', attrName !== 'class');

      normalized[attrName] = expression;
    }
  }

  if (isAngleBracket) {
    for (var prop in attrs) {
      var val = attrs[prop];
      if (!val) {
        continue;
      }

      if (typeof val === 'string' || val.isConcat) {
        normalized[prop] = ['value', val];
      }
    }
  }

  if (attrs.id && (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.id)) {
    // Do not allow binding to the `id`
    normalized.id = (0, _emberHtmlbarsHooksGetValue2['default'])(attrs.id);
    component.elementId = normalized.id;
  } else {
    normalized.id = component.elementId;
  }

  if (attrs.tagName) {
    component.tagName = attrs.tagName;
  }

  var normalizedClass = normalizeClass(component, attrs);

  if (normalizedClass) {
    normalized['class'] = normalizedClass;
  }

  if ((0, _emberMetalProperty_get.get)(component, 'isVisible') === false) {
    var hiddenStyle = ['subexpr', '-html-safe', ['display: none;'], []];
    var existingStyle = normalized.style;

    if (existingStyle) {
      normalized.style = ['subexpr', 'concat', [existingStyle, ' ', hiddenStyle], []];
    } else {
      normalized.style = hiddenStyle;
    }
  }

  return normalized;
}

function normalizeClass(component, attrs) {
  var i, l;
  var normalizedClass = [];
  var classNames = (0, _emberMetalProperty_get.get)(component, 'classNames');
  var classNameBindings = (0, _emberMetalProperty_get.get)(component, 'classNameBindings');

  if (attrs['class']) {
    if (typeof attrs['class'] === 'string') {
      normalizedClass.push(attrs['class']);
    } else {
      normalizedClass.push(['subexpr', '-normalize-class', [['value', attrs['class'].path], ['value', attrs['class']]], []]);
    }
  }

  if (attrs.classBinding) {
    normalizeClasses(attrs.classBinding.split(' '), normalizedClass);
  }

  if (attrs.classNames) {
    normalizedClass.push(['value', attrs.classNames]);
  }

  if (classNames) {
    for (i = 0, l = classNames.length; i < l; i++) {
      normalizedClass.push(classNames[i]);
    }
  }

  if (classNameBindings) {
    normalizeClasses(classNameBindings, normalizedClass);
  }

  if (normalizeClass.length) {
    return ['subexpr', '-join-classes', normalizedClass, []];
  }
}

function normalizeClasses(classes, output) {
  var i, l;

  for (i = 0, l = classes.length; i < l; i++) {
    var className = classes[i];
    _emberMetalCore2['default'].assert('classNameBindings must not have spaces in them. Multiple class name bindings can be provided as elements of an array, e.g. [\'foo\', \':bar\']', className.indexOf(' ') === -1);

    var _className$split = className.split(':');

    var _className$split2 = _slicedToArray(_className$split, 3);

    var propName = _className$split2[0];
    var activeClass = _className$split2[1];
    var inactiveClass = _className$split2[2];

    // Legacy :class microsyntax for static class names
    if (propName === '') {
      output.push(activeClass);
      continue;
    }

    // 2.0TODO: Remove deprecated global path
    var prop = (0, _emberMetalPath_cache.isGlobal)(propName) ? propName : 'view.' + propName;

    output.push(['subexpr', '-normalize-class', [
    // params
    ['value', propName], ['get', prop]], [
    // hash
    'activeClass', activeClass, 'inactiveClass', inactiveClass]]);
  }
}

function validateTaglessComponent(component) {
  _emberMetalCore2['default'].assert('You cannot use `classNameBindings` on a tag-less component: ' + component.toString(), function () {
    var classNameBindings = component.classNameBindings;
    return !classNameBindings || classNameBindings.length === 0;
  });
}
module.exports = exports['default'];