/**
@module ember
@submodule ember-routing-views
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberHtmlbarsTemplatesTopLevelView = require('ember-htmlbars/templates/top-level-view');

var _emberHtmlbarsTemplatesTopLevelView2 = _interopRequireDefault(_emberHtmlbarsTemplatesTopLevelView);

_emberHtmlbarsTemplatesTopLevelView2['default'].meta.revision = 'Ember@VERSION_STRING_PLACEHOLDER';

var CoreOutletView = _emberViewsViewsView2['default'].extend({
  defaultTemplate: _emberHtmlbarsTemplatesTopLevelView2['default'],

  init: function init() {
    this._super();
    this._outlets = [];
  },

  setOutletState: function setOutletState(state) {
    this.outletState = { main: state };

    if (this.env) {
      this.env.outletState = this.outletState;
    }

    if (this.lastResult) {
      this.dirtyOutlets();
      this._outlets = [];

      this.scheduleRevalidate(null, null);
    }
  },

  dirtyOutlets: function dirtyOutlets() {
    // Dirty any render nodes that correspond to outlets
    for (var i = 0; i < this._outlets.length; i++) {
      this._outlets[i].isDirty = true;
    }
  }
});

exports.CoreOutletView = CoreOutletView;
var OutletView = CoreOutletView.extend({ tagName: '' });
exports.OutletView = OutletView;