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

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeMixinsArray = require('ember-runtime/mixins/array');

var _emberRuntimeMixinsArray2 = _interopRequireDefault(_emberRuntimeMixinsArray);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberViewsStreamsUtils = require('ember-views/streams/utils');

var _emberViewsMixinsEmpty_view_support = require('ember-views/mixins/empty_view_support');

var _emberViewsMixinsEmpty_view_support2 = _interopRequireDefault(_emberViewsMixinsEmpty_view_support);

/**
  `Ember.CollectionView` is an `Ember.View` descendent responsible for managing
  a collection (an array or array-like object) by maintaining a child view object
  and associated DOM representation for each item in the array and ensuring
  that child views and their associated rendered HTML are updated when items in
  the array are added, removed, or replaced.

  ## Setting content

  The managed collection of objects is referenced as the `Ember.CollectionView`
  instance's `content` property.

  ```javascript
  someItemsView = Ember.CollectionView.create({
    content: ['A', 'B','C']
  })
  ```

  The view for each item in the collection will have its `content` property set
  to the item.

  ## Specifying `itemViewClass`

  By default the view class for each item in the managed collection will be an
  instance of `Ember.View`. You can supply a different class by setting the
  `CollectionView`'s `itemViewClass` property.

  Given the following application code:

  ```javascript
  var App = Ember.Application.create();
  App.ItemListView = Ember.CollectionView.extend({
    classNames: ['a-collection'],
    content: ['A','B','C'],
    itemViewClass: Ember.View.extend({
      template: Ember.Handlebars.compile("the letter: {{view.content}}")
    })
  });
  ```

  And a simple application template:

  ```handlebars
  {{view 'item-list'}}
  ```

  The following HTML will result:

  ```html
  <div class="ember-view a-collection">
    <div class="ember-view">the letter: A</div>
    <div class="ember-view">the letter: B</div>
    <div class="ember-view">the letter: C</div>
  </div>
  ```

  ## Automatic matching of parent/child tagNames

  Setting the `tagName` property of a `CollectionView` to any of
  "ul", "ol", "table", "thead", "tbody", "tfoot", "tr", or "select" will result
  in the item views receiving an appropriately matched `tagName` property.

  Given the following application code:

  ```javascript
  var App = Ember.Application.create();
  App.UnorderedListView = Ember.CollectionView.create({
    tagName: 'ul',
    content: ['A','B','C'],
    itemViewClass: Ember.View.extend({
      template: Ember.Handlebars.compile("the letter: {{view.content}}")
    })
  });
  ```

  And a simple application template:

  ```handlebars
  {{view 'unordered-list-view'}}
  ```

  The following HTML will result:

  ```html
  <ul class="ember-view a-collection">
    <li class="ember-view">the letter: A</li>
    <li class="ember-view">the letter: B</li>
    <li class="ember-view">the letter: C</li>
  </ul>
  ```

  Additional `tagName` pairs can be provided by adding to
  `Ember.CollectionView.CONTAINER_MAP`. For example:

  ```javascript
  Ember.CollectionView.CONTAINER_MAP['article'] = 'section'
  ```

  ## Programmatic creation of child views

  For cases where additional customization beyond the use of a single
  `itemViewClass` or `tagName` matching is required CollectionView's
  `createChildView` method can be overridden:

  ```javascript
  App.CustomCollectionView = Ember.CollectionView.extend({
    createChildView: function(viewClass, attrs) {
      if (attrs.content.kind == 'album') {
        viewClass = App.AlbumView;
      } else {
        viewClass = App.SongView;
      }
      return this._super(viewClass, attrs);
    }
  });
  ```

  ## Empty View

  You can provide an `Ember.View` subclass to the `Ember.CollectionView`
  instance as its `emptyView` property. If the `content` property of a
  `CollectionView` is set to `null` or an empty array, an instance of this view
  will be the `CollectionView`s only child.

  ```javascript
  var App = Ember.Application.create();
  App.ListWithNothing = Ember.CollectionView.create({
    classNames: ['nothing'],
    content: null,
    emptyView: Ember.View.extend({
      template: Ember.Handlebars.compile("The collection is empty")
    })
  });
  ```

  And a simple application template:

  ```handlebars
  {{view 'list-with-nothing'}}
  ```

  The following HTML will result:

  ```html
  <div class="ember-view nothing">
    <div class="ember-view">
      The collection is empty
    </div>
  </div>
  ```

  ## Adding and Removing items

  The `childViews` property of a `CollectionView` should not be directly
  manipulated. Instead, add, remove, replace items from its `content` property.
  This will trigger appropriate changes to its rendered HTML.


  @class CollectionView
  @namespace Ember
  @extends Ember.ContainerView
  @uses Ember.EmptyViewSupport
  @since Ember 0.9
  @private
*/
var CollectionView = _emberViewsViewsContainer_view2['default'].extend(_emberViewsMixinsEmpty_view_support2['default'], {

  /**
    A list of items to be displayed by the `Ember.CollectionView`.
      @property content
    @type Ember.Array
    @default null
    @private
  */
  content: null,

  /**
    @property itemViewClass
    @type Ember.View
    @default Ember.View
    @private
  */
  itemViewClass: _emberViewsViewsView2['default'],

  /**
    Setup a CollectionView
      @method init
    @private
  */
  init: function init() {
    var ret = this._super.apply(this, arguments);
    this._contentDidChange();
    return ret;
  },

  /**
    Invoked when the content property is about to change. Notifies observers that the
    entire array content will change.
      @private
    @method _contentWillChange
  */
  _contentWillChange: (0, _emberMetalMixin.beforeObserver)('content', function () {
    var content = this.get('content');

    if (content) {
      content.removeArrayObserver(this);
    }
    var len = content ? (0, _emberMetalProperty_get.get)(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }),

  /**
    Check to make sure that the content has changed, and if so,
    update the children directly. This is always scheduled
    asynchronously, to allow the element to be created before
    bindings have synchronized and vice versa.
      @private
    @method _contentDidChange
  */
  _contentDidChange: (0, _emberMetalMixin.observer)('content', function () {
    var content = (0, _emberMetalProperty_get.get)(this, 'content');

    if (content) {
      this._assertArrayLike(content);
      content.addArrayObserver(this);
    }

    var len = content ? (0, _emberMetalProperty_get.get)(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);
  }),

  /**
    Ensure that the content implements Ember.Array
      @private
    @method _assertArrayLike
  */
  _assertArrayLike: function _assertArrayLike(content) {
    _emberMetalCore2['default'].assert((0, _emberRuntimeSystemString.fmt)('an Ember.CollectionView\'s content must implement Ember.Array. You passed %@', [content]), _emberRuntimeMixinsArray2['default'].detect(content));
  },

  /**
    Removes the content and content observers.
      @method destroy
    @private
  */
  destroy: function destroy() {
    if (!this._super.apply(this, arguments)) {
      return;
    }

    var content = (0, _emberMetalProperty_get.get)(this, 'content');
    if (content) {
      content.removeArrayObserver(this);
    }

    if (this._createdEmptyView) {
      this._createdEmptyView.destroy();
    }

    return this;
  },

  /**
    Called when a mutation to the underlying content array will occur.
      This method will remove any views that are no longer in the underlying
    content array.
      Invokes whenever the content array itself will change.
      @method arrayWillChange
    @param {Array} content the managed collection of objects
    @param {Number} start the index at which the changes will occur
    @param {Number} removed number of object to be removed from content
    @private
  */
  arrayWillChange: function arrayWillChange(content, start, removedCount) {
    this.replace(start, removedCount, []);
  },

  /**
    Called when a mutation to the underlying content array occurs.
      This method will replay that mutation against the views that compose the
    `Ember.CollectionView`, ensuring that the view reflects the model.
      This array observer is added in `contentDidChange`.
      @method arrayDidChange
    @param {Array} content the managed collection of objects
    @param {Number} start the index at which the changes occurred
    @param {Number} removed number of object removed from content
    @param {Number} added number of object added to content
    @private
  */
  arrayDidChange: function arrayDidChange(content, start, removed, added) {
    var addedViews = [];
    var view, item, idx, len, itemViewClass, itemViewProps;

    len = content ? (0, _emberMetalProperty_get.get)(content, 'length') : 0;

    if (len) {
      itemViewProps = this._itemViewProps || {};
      itemViewClass = this.getAttr('itemViewClass') || (0, _emberMetalProperty_get.get)(this, 'itemViewClass');

      itemViewClass = (0, _emberViewsStreamsUtils.readViewFactory)(itemViewClass, this.container);

      for (idx = start; idx < start + added; idx++) {
        item = content.objectAt(idx);
        itemViewProps._context = this.keyword ? this.get('context') : item;
        itemViewProps.content = item;
        itemViewProps.contentIndex = idx;

        view = this.createChildView(itemViewClass, itemViewProps);

        addedViews.push(view);
      }

      this.replace(start, 0, addedViews);
    }
  },

  /**
    Instantiates a view to be added to the childViews array during view
    initialization. You generally will not call this method directly unless
    you are overriding `createChildViews()`. Note that this method will
    automatically configure the correct settings on the new view instance to
    act as a child of the parent.
      The tag name for the view will be set to the tagName of the viewClass
    passed in.
      @method createChildView
    @param {Class} viewClass
    @param {Object} [attrs] Attributes to add
    @return {Ember.View} new instance
    @private
  */
  createChildView: function createChildView(_view, attrs) {
    var view = this._super(_view, attrs);

    var itemTagName = (0, _emberMetalProperty_get.get)(view, 'tagName');

    if (itemTagName === null || itemTagName === undefined) {
      itemTagName = CollectionView.CONTAINER_MAP[(0, _emberMetalProperty_get.get)(this, 'tagName')];
      (0, _emberMetalProperty_set.set)(view, 'tagName', itemTagName);
    }

    return view;
  },

  _willRender: function _willRender() {
    var attrs = this.attrs;
    var itemProps = buildItemViewProps(this._itemViewTemplate, attrs);
    this._itemViewProps = itemProps;
    var childViews = (0, _emberMetalProperty_get.get)(this, 'childViews');

    for (var i = 0, l = childViews.length; i < l; i++) {
      childViews[i].setProperties(itemProps);
    }

    if ('content' in attrs) {
      (0, _emberMetalProperty_set.set)(this, 'content', this.getAttr('content'));
    }

    if ('emptyView' in attrs) {
      (0, _emberMetalProperty_set.set)(this, 'emptyView', this.getAttr('emptyView'));
    }
  },

  _emptyViewTagName: (0, _emberMetalComputed.computed)('tagName', function () {
    var tagName = (0, _emberMetalProperty_get.get)(this, 'tagName');
    return CollectionView.CONTAINER_MAP[tagName] || 'div';
  })
});

/**
  A map of parent tags to their default child tags. You can add
  additional parent tags if you want collection views that use
  a particular parent tag to default to a child tag.

  @property CONTAINER_MAP
  @type Object
  @static
  @final
  @private
*/
CollectionView.CONTAINER_MAP = {
  ul: 'li',
  ol: 'li',
  table: 'tr',
  thead: 'tr',
  tbody: 'tr',
  tfoot: 'tr',
  tr: 'td',
  select: 'option'
};

var CONTAINER_MAP = CollectionView.CONTAINER_MAP;

exports.CONTAINER_MAP = CONTAINER_MAP;
function buildItemViewProps(template, attrs) {
  var props = {};

  // Go through options passed to the {{collection}} helper and extract options
  // that configure item views instead of the collection itself.
  for (var prop in attrs) {
    if (prop === 'itemViewClass' || prop === 'itemController' || prop === 'itemClassBinding') {
      continue;
    }
    if (attrs.hasOwnProperty(prop)) {
      var match = prop.match(/^item(.)(.*)$/);
      if (match) {
        var childProp = match[1].toLowerCase() + match[2];

        if (childProp === 'class' || childProp === 'classNames') {
          props.classNames = [attrs[prop]];
        } else {
          props[childProp] = attrs[prop];
        }

        delete attrs[prop];
      }
    }
  }

  if (template) {
    props.template = template;
  }

  return props;
}

exports['default'] = CollectionView;