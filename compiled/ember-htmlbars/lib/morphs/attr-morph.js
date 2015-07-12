'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _domHelper = require('dom-helper');

var _domHelper2 = _interopRequireDefault(_domHelper);

var HTMLBarsAttrMorph = _domHelper2['default'].prototype.AttrMorphClass;

var styleWarning = '' + 'Binding style attributes may introduce cross-site scripting vulnerabilities; ' + 'please ensure that values being bound are properly escaped. For more information, ' + 'including how to disable this warning, see ' + 'http://emberjs.com/deprecations/v1.x/#toc_binding-style-attributes.';

exports.styleWarning = styleWarning;
function EmberAttrMorph(element, attrName, domHelper, namespace) {
  HTMLBarsAttrMorph.call(this, element, attrName, domHelper, namespace);

  this.streamUnsubscribers = null;
}

var proto = EmberAttrMorph.prototype = Object.create(HTMLBarsAttrMorph.prototype);
proto.HTMLBarsAttrMorph$setContent = HTMLBarsAttrMorph.prototype.setContent;

proto._deprecateEscapedStyle = function EmberAttrMorph_deprecateEscapedStyle(value) {
  _emberMetalCore2['default'].warn(styleWarning, (function (name, value, escaped) {
    // SafeString
    if (value && value.toHTML) {
      return true;
    }

    if (name !== 'style') {
      return true;
    }

    return !escaped;
  })(this.attrName, value, this.escaped));
};

proto.setContent = function EmberAttrMorph_setContent(value) {
  this._deprecateEscapedStyle(value);
  this.HTMLBarsAttrMorph$setContent(value);
};

exports['default'] = EmberAttrMorph;