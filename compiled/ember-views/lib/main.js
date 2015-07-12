/**
@module ember
@submodule ember-views
*/

// BEGIN IMPORTS
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntime = require('ember-runtime');

var _emberRuntime2 = _interopRequireDefault(_emberRuntime);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsSystemUtils = require('ember-views/system/utils');

var _emberViewsCompatRender_buffer = require('ember-views/compat/render_buffer');

var _emberViewsCompatRender_buffer2 = _interopRequireDefault(_emberViewsCompatRender_buffer);

require('ember-views/system/ext');

// for the side effect of extending Ember.run.queues

var _emberViewsViewsStates = require('ember-views/views/states');

var _emberMetalViewsRenderer = require('ember-metal-views/renderer');

var _emberMetalViewsRenderer2 = _interopRequireDefault(_emberMetalViewsRenderer);

var _emberViewsViewsCore_view = require('ember-views/views/core_view');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _emberViewsViewsCollection_view = require('ember-views/views/collection_view');

var _emberViewsViewsCollection_view2 = _interopRequireDefault(_emberViewsViewsCollection_view);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberViewsMixinsView_target_action_support = require('ember-views/mixins/view_target_action_support');

var _emberViewsMixinsView_target_action_support2 = _interopRequireDefault(_emberViewsMixinsView_target_action_support);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsCheckbox = require('ember-views/views/checkbox');

var _emberViewsViewsCheckbox2 = _interopRequireDefault(_emberViewsViewsCheckbox);

var _emberViewsMixinsText_support = require('ember-views/mixins/text_support');

var _emberViewsMixinsText_support2 = _interopRequireDefault(_emberViewsMixinsText_support);

var _emberViewsViewsText_field = require('ember-views/views/text_field');

var _emberViewsViewsText_field2 = _interopRequireDefault(_emberViewsViewsText_field);

var _emberViewsViewsText_area = require('ember-views/views/text_area');

var _emberViewsViewsText_area2 = _interopRequireDefault(_emberViewsViewsText_area);

var _emberViewsViewsSelect = require('ember-views/views/select');

var _emberViewsCompatMetamorph_view = require('ember-views/compat/metamorph_view');

var _emberViewsCompatMetamorph_view2 = _interopRequireDefault(_emberViewsCompatMetamorph_view);

var _emberViewsViewsLegacy_each_view = require('ember-views/views/legacy_each_view');

var _emberViewsViewsLegacy_each_view2 = _interopRequireDefault(_emberViewsViewsLegacy_each_view);

// END IMPORTS

/**
  Alias for jQuery

  @method $
  @for Ember
 @public
*/

// BEGIN EXPORTS
_emberRuntime2['default'].$ = _emberViewsSystemJquery2['default'];

_emberRuntime2['default'].ViewTargetActionSupport = _emberViewsMixinsView_target_action_support2['default'];
_emberRuntime2['default'].RenderBuffer = _emberViewsCompatRender_buffer2['default'];

var ViewUtils = _emberRuntime2['default'].ViewUtils = {};
ViewUtils.isSimpleClick = _emberViewsSystemUtils.isSimpleClick;
ViewUtils.getViewClientRects = _emberViewsSystemUtils.getViewClientRects;
ViewUtils.getViewBoundingClientRect = _emberViewsSystemUtils.getViewBoundingClientRect;

_emberRuntime2['default'].CoreView = _emberViewsViewsCore_view.DeprecatedCoreView;
_emberRuntime2['default'].View = _emberViewsViewsView.DeprecatedView;
_emberRuntime2['default'].View.states = _emberViewsViewsStates.states;
_emberRuntime2['default'].View.cloneStates = _emberViewsViewsStates.cloneStates;
_emberRuntime2['default'].View._Renderer = _emberMetalViewsRenderer2['default'];
_emberRuntime2['default'].Checkbox = _emberViewsViewsCheckbox2['default'];
_emberRuntime2['default'].TextField = _emberViewsViewsText_field2['default'];
_emberRuntime2['default'].TextArea = _emberViewsViewsText_area2['default'];

_emberRuntime2['default'].Select = _emberViewsViewsSelect.DeprecatedSelect;
_emberRuntime2['default'].SelectOption = _emberViewsViewsSelect.SelectOption;
_emberRuntime2['default'].SelectOptgroup = _emberViewsViewsSelect.SelectOptgroup;

_emberRuntime2['default'].TextSupport = _emberViewsMixinsText_support2['default'];
_emberRuntime2['default'].ComponentLookup = _emberViewsComponent_lookup2['default'];
_emberRuntime2['default'].ContainerView = _emberViewsViewsContainer_view2['default'];
_emberRuntime2['default'].CollectionView = _emberViewsViewsCollection_view2['default'];
_emberRuntime2['default'].Component = _emberViewsViewsComponent2['default'];
_emberRuntime2['default'].EventDispatcher = _emberViewsSystemEvent_dispatcher2['default'];

// Deprecated:
_emberRuntime2['default']._Metamorph = _emberViewsCompatMetamorph_view._Metamorph;
_emberRuntime2['default']._MetamorphView = _emberViewsCompatMetamorph_view2['default'];
_emberRuntime2['default']._LegacyEachView = _emberViewsViewsLegacy_each_view2['default'];

// END EXPORTS

exports['default'] = _emberRuntime2['default'];
module.exports = exports['default'];