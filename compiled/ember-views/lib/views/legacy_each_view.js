//2.0TODO: Remove this in 2.0
//This is a fallback path for the `{{#each}}` helper that supports deprecated
//behavior such as itemController.

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsTemplatesLegacyEach = require('ember-htmlbars/templates/legacy-each');

var _emberHtmlbarsTemplatesLegacyEach2 = _interopRequireDefault(_emberHtmlbarsTemplatesLegacyEach);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalComputed = require('ember-metal/computed');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsCollection_view = require('ember-views/views/collection_view');

var _emberViewsMixinsEmpty_view_support = require('ember-views/mixins/empty_view_support');

var _emberViewsMixinsEmpty_view_support2 = _interopRequireDefault(_emberViewsMixinsEmpty_view_support);

exports['default'] = _emberViewsViewsView2['default'].extend(_emberViewsMixinsEmpty_view_support2['default'], {
  template: _emberHtmlbarsTemplatesLegacyEach2['default'],
  tagName: '',

  _arrayController: (0, _emberMetalComputed.computed)(function () {
    var itemController = this.getAttr('itemController');
    var controller = (0, _emberMetalProperty_get.get)(this, 'container').lookupFactory('controller:array').create({
      _isVirtual: true,
      parentController: (0, _emberMetalProperty_get.get)(this, 'controller'),
      itemController: itemController,
      target: (0, _emberMetalProperty_get.get)(this, 'controller'),
      _eachView: this,
      content: this.getAttr('content')
    });

    return controller;
  }),

  _willUpdate: function _willUpdate(attrs) {
    var itemController = this.getAttrFor(attrs, 'itemController');

    if (itemController) {
      var arrayController = (0, _emberMetalProperty_get.get)(this, '_arrayController');
      (0, _emberMetalProperty_set.set)(arrayController, 'content', this.getAttrFor(attrs, 'content'));
    }
  },

  _arrangedContent: (0, _emberMetalComputed.computed)('attrs.content', function () {
    if (this.getAttr('itemController')) {
      return (0, _emberMetalProperty_get.get)(this, '_arrayController');
    }

    return this.getAttr('content');
  }),

  _itemTagName: (0, _emberMetalComputed.computed)(function () {
    var tagName = (0, _emberMetalProperty_get.get)(this, 'tagName');
    return _emberViewsViewsCollection_view.CONTAINER_MAP[tagName];
  })
});
module.exports = exports['default'];