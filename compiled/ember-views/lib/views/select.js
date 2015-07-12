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

var _emberMetalReplace = require('ember-metal/replace');

var _emberMetalReplace2 = _interopRequireDefault(_emberMetalReplace);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalProperties = require('ember-metal/properties');

var _emberHtmlbarsTemplatesSelect = require('ember-htmlbars/templates/select');

var _emberHtmlbarsTemplatesSelect2 = _interopRequireDefault(_emberHtmlbarsTemplatesSelect);

var _emberHtmlbarsTemplatesSelectOption = require('ember-htmlbars/templates/select-option');

var _emberHtmlbarsTemplatesSelectOption2 = _interopRequireDefault(_emberHtmlbarsTemplatesSelectOption);

var _emberHtmlbarsTemplatesSelectOptgroup = require('ember-htmlbars/templates/select-optgroup');

var _emberHtmlbarsTemplatesSelectOptgroup2 = _interopRequireDefault(_emberHtmlbarsTemplatesSelectOptgroup);

var defaultTemplate = _emberHtmlbarsTemplatesSelect2['default'];

var SelectOption = _emberViewsViewsView2['default'].extend({
  instrumentDisplay: 'Ember.SelectOption',

  tagName: 'option',
  attributeBindings: ['value', 'selected'],

  defaultTemplate: _emberHtmlbarsTemplatesSelectOption2['default'],

  content: null,

  _willRender: function _willRender() {
    this.labelPathDidChange();
    this.valuePathDidChange();
  },

  selected: (0, _emberMetalComputed.computed)('attrs.content', 'attrs.selection', function () {
    var value = (0, _emberMetalProperty_get.get)(this, 'value');
    var selection = (0, _emberMetalProperty_get.get)(this, 'attrs.selection');
    if ((0, _emberMetalProperty_get.get)(this, 'attrs.multiple')) {
      return selection && selection.indexOf(value) > -1;
    } else {
      // Primitives get passed through bindings as objects... since
      // `new Number(4) !== 4`, we use `==` below
      return value == (0, _emberMetalProperty_get.get)(this, 'attrs.parentValue'); // jshint ignore:line
    }
  }),

  labelPathDidChange: (0, _emberMetalMixin.observer)('attrs.optionLabelPath', function () {
    var labelPath = (0, _emberMetalProperty_get.get)(this, 'attrs.optionLabelPath');
    (0, _emberMetalProperties.defineProperty)(this, 'label', _emberMetalComputed.computed.alias(labelPath));
  }),

  valuePathDidChange: (0, _emberMetalMixin.observer)('attrs.optionValuePath', function () {
    var valuePath = (0, _emberMetalProperty_get.get)(this, 'attrs.optionValuePath');
    (0, _emberMetalProperties.defineProperty)(this, 'value', _emberMetalComputed.computed.alias(valuePath));
  })
});

var SelectOptgroup = _emberViewsViewsView2['default'].extend({
  instrumentDisplay: 'Ember.SelectOptgroup',

  tagName: 'optgroup',
  defaultTemplate: _emberHtmlbarsTemplatesSelectOptgroup2['default'],
  attributeBindings: ['label']
});

/**
  The `Ember.Select` view class renders a
  [select](https://developer.mozilla.org/en/HTML/Element/select) HTML element,
  allowing the user to choose from a list of options.

  The text and `value` property of each `<option>` element within the
  `<select>` element are populated from the objects in the `Element.Select`'s
  `content` property. The underlying data object of the selected `<option>` is
  stored in the `Element.Select`'s `value` property.

  ## The Content Property (array of strings)

  The simplest version of an `Ember.Select` takes an array of strings as its
  `content` property. The string will be used as both the `value` property and
  the inner text of each `<option>` element inside the rendered `<select>`.

  Example:

  ```javascript
  App.ApplicationController = Ember.Controller.extend({
    names: ["Yehuda", "Tom"]
  });
  ```

  ```handlebars
  {{view "select" content=names}}
  ```

  Would result in the following HTML:

  ```html
  <select class="ember-select">
    <option value="Yehuda">Yehuda</option>
    <option value="Tom">Tom</option>
  </select>
  ```

  You can control which `<option>` is selected through the `Ember.Select`'s
  `value` property:

  ```javascript
  App.ApplicationController = Ember.Controller.extend({
    selectedName: 'Tom',
    names: ["Yehuda", "Tom"]
  });
  ```

  ```handlebars
  {{view "select" content=names value=selectedName}}
  ```

  Would result in the following HTML with the `<option>` for 'Tom' selected:

  ```html
  <select class="ember-select">
    <option value="Yehuda">Yehuda</option>
    <option value="Tom" selected="selected">Tom</option>
  </select>
  ```

  A user interacting with the rendered `<select>` to choose "Yehuda" would
  update the value of `selectedName` to "Yehuda".

  ## The Content Property (array of Objects)

  An `Ember.Select` can also take an array of JavaScript or Ember objects as
  its `content` property.

  When using objects you need to tell the `Ember.Select` which property should
  be accessed on each object to supply the `value` attribute of the `<option>`
  and which property should be used to supply the element text.

  The `optionValuePath` option is used to specify the path on each object to
  the desired property for the `value` attribute. The `optionLabelPath`
  specifies the path on each object to the desired property for the
  element's text. Both paths must reference each object itself as `content`:

  ```javascript
  App.ApplicationController = Ember.Controller.extend({
    programmers: [
      {firstName: "Yehuda", id: 1},
      {firstName: "Tom",    id: 2}
    ]
  });
  ```

  ```handlebars
  {{view "select"
         content=programmers
         optionValuePath="content.id"
         optionLabelPath="content.firstName"}}
  ```

  Would result in the following HTML:

  ```html
  <select class="ember-select">
    <option value="1">Yehuda</option>
    <option value="2">Tom</option>
  </select>
  ```

  The `value` attribute of the selected `<option>` within an `Ember.Select`
  can be bound to a property on another object:

  ```javascript
  App.ApplicationController = Ember.Controller.extend({
    programmers: [
      {firstName: "Yehuda", id: 1},
      {firstName: "Tom",    id: 2}
    ],
    currentProgrammer: {
      id: 2
    }
  });
  ```

  ```handlebars
  {{view "select"
         content=programmers
         optionValuePath="content.id"
         optionLabelPath="content.firstName"
         value=currentProgrammer.id}}
  ```

  Would result in the following HTML with a selected option:

  ```html
  <select class="ember-select">
    <option value="1">Yehuda</option>
    <option value="2" selected="selected">Tom</option>
  </select>
  ```

  Interacting with the rendered element by selecting the first option
  ('Yehuda') will update the `id` of `currentProgrammer`
  to match the `value` property of the newly selected `<option>`.

  Alternatively, you can control selection through the underlying objects
  used to render each object by binding the `selection` option. When the selected
  `<option>` is changed, the property path provided to `selection`
  will be updated to match the content object of the rendered `<option>`
  element:

  ```javascript

  var yehuda = {firstName: "Yehuda", id: 1, bff4eva: 'tom'}
  var tom = {firstName: "Tom", id: 2, bff4eva: 'yehuda'};

  App.ApplicationController = Ember.Controller.extend({
    selectedPerson: tom,
    programmers: [ yehuda, tom ]
  });
  ```

  ```handlebars
  {{view "select"
         content=programmers
         optionValuePath="content.id"
         optionLabelPath="content.firstName"
         selection=selectedPerson}}
  ```

  Would result in the following HTML with a selected option:

  ```html
  <select class="ember-select">
    <option value="1">Yehuda</option>
    <option value="2" selected="selected">Tom</option>
  </select>
  ```

  Interacting with the rendered element by selecting the first option
  ('Yehuda') will update the `selectedPerson` to match the object of
  the newly selected `<option>`. In this case it is the first object
  in the `programmers`

  ## Supplying a Prompt

  A `null` value for the `Ember.Select`'s `value` or `selection` property
  results in there being no `<option>` with a `selected` attribute:

  ```javascript
  App.ApplicationController = Ember.Controller.extend({
    selectedProgrammer: null,
    programmers: ["Yehuda", "Tom"]
  });
  ```

  ``` handlebars
  {{view "select"
         content=programmers
         value=selectedProgrammer
  }}
  ```

  Would result in the following HTML:

  ```html
  <select class="ember-select">
    <option value="Yehuda">Yehuda</option>
    <option value="Tom">Tom</option>
  </select>
  ```

  Although `selectedProgrammer` is `null` and no `<option>`
  has a `selected` attribute the rendered HTML will display the
  first item as though it were selected. You can supply a string
  value for the `Ember.Select` to display when there is no selection
  with the `prompt` option:

  ```javascript
  App.ApplicationController = Ember.Controller.extend({
    selectedProgrammer: null,
    programmers: [ "Yehuda", "Tom" ]
  });
  ```

  ```handlebars
  {{view "select"
         content=programmers
         value=selectedProgrammer
         prompt="Please select a name"
  }}
  ```

  Would result in the following HTML:

  ```html
  <select class="ember-select">
    <option>Please select a name</option>
    <option value="Yehuda">Yehuda</option>
    <option value="Tom">Tom</option>
  </select>
  ```

  @class Select
  @namespace Ember
  @extends Ember.View
  @public
  @deprecated See http://emberjs.com/deprecations/v1.x/#toc_ember-select
*/
var Select = _emberViewsViewsView2['default'].extend({
  instrumentDisplay: 'Ember.Select',

  tagName: 'select',
  classNames: ['ember-select'],
  defaultTemplate: defaultTemplate,
  attributeBindings: ['autofocus', 'autocomplete', 'disabled', 'form', 'multiple', 'name', 'required', 'size', 'tabindex'],

  /**
    The `multiple` attribute of the select element. Indicates whether multiple
    options can be selected.
      @property multiple
    @type Boolean
    @default false
    @public
  */
  multiple: false,

  /**
    The `disabled` attribute of the select element. Indicates whether
    the element is disabled from interactions.
      @property disabled
    @type Boolean
    @default false
    @public
  */
  disabled: false,

  /**
    The `required` attribute of the select element. Indicates whether
    a selected option is required for form validation.
      @property required
    @type Boolean
    @default false
    @since 1.5.0
    @public
  */
  required: false,

  /**
    The list of options.
      If `optionLabelPath` and `optionValuePath` are not overridden, this should
    be a list of strings, which will serve simultaneously as labels and values.
      Otherwise, this should be a list of objects. For instance:
      ```javascript
    var App = Ember.Application.create();
    var App.MySelect = Ember.Select.extend({
      content: Ember.A([
          { id: 1, firstName: 'Yehuda' },
          { id: 2, firstName: 'Tom' }
        ]),
      optionLabelPath: 'content.firstName',
      optionValuePath: 'content.id'
    });
    ```
      @property content
    @type Array
    @default null
    @public
  */
  content: null,

  /**
    When `multiple` is `false`, the element of `content` that is currently
    selected, if any.
      When `multiple` is `true`, an array of such elements.
      @property selection
    @type Object or Array
    @default null
    @public
  */
  selection: null,

  /**
    In single selection mode (when `multiple` is `false`), value can be used to
    get the current selection's value or set the selection by its value.
      It is not currently supported in multiple selection mode.
      @property value
    @type String
    @default null
    @public
  */
  value: (0, _emberMetalComputed.computed)('_valuePath', 'selection', {
    get: function get(key) {
      var valuePath = (0, _emberMetalProperty_get.get)(this, '_valuePath');
      return valuePath ? (0, _emberMetalProperty_get.get)(this, 'selection.' + valuePath) : (0, _emberMetalProperty_get.get)(this, 'selection');
    },
    set: function set(key, value) {
      return value;
    }
  }),

  /**
    If given, a top-most dummy option will be rendered to serve as a user
    prompt.
      @property prompt
    @type String
    @default null
    @public
  */
  prompt: null,

  /**
    The path of the option labels. See [content](/api/classes/Ember.Select.html#property_content).
      @property optionLabelPath
    @type String
    @default 'content'
    @public
  */
  optionLabelPath: 'content',

  /**
    The path of the option values. See [content](/api/classes/Ember.Select.html#property_content).
      @property optionValuePath
    @type String
    @default 'content'
    @public
  */
  optionValuePath: 'content',

  /**
    The path of the option group.
    When this property is used, `content` should be sorted by `optionGroupPath`.
      @property optionGroupPath
    @type String
    @default null
    @public
  */
  optionGroupPath: null,

  /**
    The view class for optgroup.
      @property groupView
    @type Ember.View
    @default Ember.SelectOptgroup
    @public
  */
  groupView: SelectOptgroup,

  groupedContent: (0, _emberMetalComputed.computed)('optionGroupPath', 'content.@each', function () {
    var groupPath = (0, _emberMetalProperty_get.get)(this, 'optionGroupPath');
    var groupedContent = (0, _emberRuntimeSystemNative_array.A)();
    var content = (0, _emberMetalProperty_get.get)(this, 'content') || [];

    content.forEach(function (item) {
      var label = (0, _emberMetalProperty_get.get)(item, groupPath);

      if ((0, _emberMetalProperty_get.get)(groupedContent, 'lastObject.label') !== label) {
        groupedContent.pushObject({
          label: label,
          content: (0, _emberRuntimeSystemNative_array.A)()
        });
      }

      (0, _emberMetalProperty_get.get)(groupedContent, 'lastObject.content').push(item);
    });

    return groupedContent;
  }),

  /**
    The view class for option.
      @property optionView
    @type Ember.View
    @default Ember.SelectOption
    @private
  */
  optionView: SelectOption,

  _change: function _change(hasDOM) {
    if ((0, _emberMetalProperty_get.get)(this, 'multiple')) {
      this._changeMultiple(hasDOM);
    } else {
      this._changeSingle(hasDOM);
    }
  },

  selectionDidChange: (0, _emberMetalMixin.observer)('selection.@each', function () {
    var selection = (0, _emberMetalProperty_get.get)(this, 'selection');
    if ((0, _emberMetalProperty_get.get)(this, 'multiple')) {
      if (!(0, _emberRuntimeUtils.isArray)(selection)) {
        (0, _emberMetalProperty_set.set)(this, 'selection', (0, _emberRuntimeSystemNative_array.A)([selection]));
        return;
      }
      this._selectionDidChangeMultiple();
    } else {
      this._selectionDidChangeSingle();
    }
  }),

  valueDidChange: (0, _emberMetalMixin.observer)('value', function () {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    var value = (0, _emberMetalProperty_get.get)(this, 'value');
    var valuePath = (0, _emberMetalProperty_get.get)(this, 'optionValuePath').replace(/^content\.?/, '');
    var selectedValue = valuePath ? (0, _emberMetalProperty_get.get)(this, 'selection.' + valuePath) : (0, _emberMetalProperty_get.get)(this, 'selection');
    var selection;

    if (value !== selectedValue) {
      selection = content ? content.find(function (obj) {
        return value === (valuePath ? (0, _emberMetalProperty_get.get)(obj, valuePath) : obj);
      }) : null;

      this.set('selection', selection);
    }
  }),

  _setDefaults: function _setDefaults() {
    var selection = (0, _emberMetalProperty_get.get)(this, 'selection');
    var value = (0, _emberMetalProperty_get.get)(this, 'value');

    if (!(0, _emberMetalIs_none2['default'])(selection)) {
      this.selectionDidChange();
    }
    if (!(0, _emberMetalIs_none2['default'])(value)) {
      this.valueDidChange();
    }
    if ((0, _emberMetalIs_none2['default'])(selection)) {
      this._change(false);
    }
  },

  _changeSingle: function _changeSingle(hasDOM) {
    var value = this.get('value');
    var selectedIndex = hasDOM !== false ? this.$()[0].selectedIndex : this._selectedIndex(value);
    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    var prompt = (0, _emberMetalProperty_get.get)(this, 'prompt');

    if (!content || !(0, _emberMetalProperty_get.get)(content, 'length')) {
      return;
    }
    if (prompt && selectedIndex === 0) {
      (0, _emberMetalProperty_set.set)(this, 'selection', null);
      return;
    }

    if (prompt) {
      selectedIndex -= 1;
    }
    (0, _emberMetalProperty_set.set)(this, 'selection', content.objectAt(selectedIndex));
  },

  _selectedIndex: function _selectedIndex(value) {
    var defaultIndex = arguments[1] === undefined ? 0 : arguments[1];

    var content = (0, _emberMetalProperty_get.get)(this, 'contentValues');

    var selectionIndex = content.indexOf(value);

    var prompt = (0, _emberMetalProperty_get.get)(this, 'prompt');
    if (prompt) {
      selectionIndex += 1;
    }

    if (selectionIndex < 0) {
      selectionIndex = defaultIndex;
    }

    return selectionIndex;
  },

  _changeMultiple: function _changeMultiple(hasDOM) {
    var options = hasDOM !== false ? this.$('option:selected') : [];
    var prompt = (0, _emberMetalProperty_get.get)(this, 'prompt');
    var offset = prompt ? 1 : 0;
    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    var selection = (0, _emberMetalProperty_get.get)(this, 'selection');

    if (!content) {
      return;
    }
    if (options) {
      var selectedIndexes = options.map(function () {
        return this.index - offset;
      });
      var newSelection = content.objectsAt([].slice.call(selectedIndexes));

      if ((0, _emberRuntimeUtils.isArray)(selection)) {
        (0, _emberMetalReplace2['default'])(selection, 0, (0, _emberMetalProperty_get.get)(selection, 'length'), newSelection);
      } else {
        (0, _emberMetalProperty_set.set)(this, 'selection', newSelection);
      }
    }
  },

  _selectionDidChangeSingle: function _selectionDidChangeSingle() {
    var value = (0, _emberMetalProperty_get.get)(this, 'value');
    var self = this;
    if (value && value.then) {
      value.then(function (resolved) {
        // Ensure that we don't overwrite new value
        if ((0, _emberMetalProperty_get.get)(self, 'value') === value) {
          self._setSelectedIndex(resolved);
        }
      });
    } else {
      this._setSelectedIndex(value);
    }
  },

  _setSelectedIndex: function _setSelectedIndex(selectionValue) {
    var el = (0, _emberMetalProperty_get.get)(this, 'element');
    if (!el) {
      return;
    }

    el.selectedIndex = this._selectedIndex(selectionValue, -1);
  },

  _valuePath: (0, _emberMetalComputed.computed)('optionValuePath', function () {
    var optionValuePath = (0, _emberMetalProperty_get.get)(this, 'optionValuePath');
    return optionValuePath.replace(/^content\.?/, '');
  }),

  contentValues: (0, _emberMetalComputed.computed)('content.[]', '_valuePath', function () {
    var valuePath = (0, _emberMetalProperty_get.get)(this, '_valuePath');
    var content = (0, _emberMetalProperty_get.get)(this, 'content') || [];

    if (valuePath) {
      return content.map(function (el) {
        return (0, _emberMetalProperty_get.get)(el, valuePath);
      });
    } else {
      return content.slice();
    }
  }),

  _selectionDidChangeMultiple: function _selectionDidChangeMultiple() {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    var selection = (0, _emberMetalProperty_get.get)(this, 'selection');
    var selectedIndexes = content ? indexesOf(content, selection) : [-1];
    var prompt = (0, _emberMetalProperty_get.get)(this, 'prompt');
    var offset = prompt ? 1 : 0;
    var options = this.$('option');
    var adjusted;

    if (options) {
      options.each(function () {
        adjusted = this.index > -1 ? this.index - offset : -1;
        this.selected = selectedIndexes.indexOf(adjusted) > -1;
      });
    }
  },

  _willRender: function _willRender() {
    this._setDefaults();
  },

  init: function init() {
    this._super.apply(this, arguments);
    this.on('change', this, this._change);
  }
});

var DeprecatedSelect = Select.extend({
  init: function init() {
    this._super.apply(this, arguments);
    _emberMetalCore2['default'].deprecate('Ember.Select is deprecated. Consult the Deprecations Guide for a migration strategy.', !!_emberMetalCore2['default'].ENV._ENABLE_LEGACY_VIEW_SUPPORT, { url: 'http://emberjs.com/deprecations/v1.x/#toc_ember-select' });
  }
});

function indexesOf(iterable, elements) {
  return elements === undefined ? [] : elements.map(function (item) {
    return iterable.indexOf(item);
  });
}

exports['default'] = Select;
exports.Select = Select;
exports.DeprecatedSelect = DeprecatedSelect;
exports.SelectOption = SelectOption;
exports.SelectOptgroup = SelectOptgroup;