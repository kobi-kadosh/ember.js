'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domHelper = require('dom-helper');

var _domHelper2 = _interopRequireDefault(_domHelper);

var _emberHtmlbarsMorphsMorph = require('ember-htmlbars/morphs/morph');

var _emberHtmlbarsMorphsMorph2 = _interopRequireDefault(_emberHtmlbarsMorphsMorph);

var _emberHtmlbarsMorphsAttrMorph = require('ember-htmlbars/morphs/attr-morph');

var _emberHtmlbarsMorphsAttrMorph2 = _interopRequireDefault(_emberHtmlbarsMorphsAttrMorph);

function EmberDOMHelper(_document) {
  _domHelper2['default'].call(this, _document);
}

var proto = EmberDOMHelper.prototype = Object.create(_domHelper2['default'].prototype);
proto.MorphClass = _emberHtmlbarsMorphsMorph2['default'];
proto.AttrMorphClass = _emberHtmlbarsMorphsAttrMorph2['default'];

exports['default'] = EmberDOMHelper;
module.exports = exports['default'];