/*jshint newcap:false*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberViewsViewsCollection_view = require('ember-views/views/collection_view');

var _emberViewsViewsCollection_view2 = _interopRequireDefault(_emberViewsViewsCollection_view);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var trim = _emberViewsSystemJquery2['default'].trim;

var view;

var originalLookup = _emberMetalCore2['default'].lookup;
var TemplateTests, registry, container, lookup;

function nthChild(view, nth) {
  return (0, _emberMetalProperty_get.get)(view, 'childViews').objectAt(nth || 0);
}

var firstChild = nthChild;

function firstGrandchild(view) {
  return (0, _emberMetalProperty_get.get)((0, _emberMetalProperty_get.get)(view, 'childViews').objectAt(0), 'childViews').objectAt(0);
}

QUnit.module('collection helper', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
    lookup.TemplateTests = TemplateTests = _emberRuntimeSystemNamespace2['default'].create();
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();

    registry.optionsForType('template', { instantiate: false });
    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;

    _emberMetalCore2['default'].lookup = lookup = originalLookup;
    TemplateTests = null;
  }
});

QUnit.test('Collection views that specify an example view class have their children be of that class', function () {
  var ExampleViewCollection = _emberViewsViewsCollection_view2['default'].extend({
    itemViewClass: _emberViewsViewsView2['default'].extend({
      isCustom: true
    }),

    content: (0, _emberRuntimeSystemNative_array.A)(['foo'])
  });

  view = _emberViewsViewsView2['default'].create({
    exampleViewCollection: ExampleViewCollection,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.exampleViewCollection}}OHAI{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(firstGrandchild(view).isCustom, 'uses the example view class');
});

QUnit.test('itemViewClass works in the #collection helper with a global (DEPRECATED)', function () {
  TemplateTests.ExampleItemView = _emberViewsViewsView2['default'].extend({
    isAlsoCustom: true
  });

  view = _emberViewsViewsView2['default'].create({
    exampleController: _emberRuntimeSystemArray_proxy2['default'].create({
      content: (0, _emberRuntimeSystemNative_array.A)(['alpha'])
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection content=view.exampleController itemViewClass=TemplateTests.ExampleItemView}}beta{{/collection}}')
  });

  var deprecation = /Global lookup of TemplateTests from a Handlebars template is deprecated/;
  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, deprecation);

  ok(firstGrandchild(view).isAlsoCustom, 'uses the example view class specified in the #collection helper');
});

QUnit.test('itemViewClass works in the #collection helper with a property', function () {
  var ExampleItemView = _emberViewsViewsView2['default'].extend({
    isAlsoCustom: true
  });

  var ExampleCollectionView = _emberViewsViewsCollection_view2['default'];

  view = _emberViewsViewsView2['default'].create({
    possibleItemView: ExampleItemView,
    exampleCollectionView: ExampleCollectionView,
    exampleController: _emberRuntimeSystemArray_proxy2['default'].create({
      content: (0, _emberRuntimeSystemNative_array.A)(['alpha'])
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.exampleCollectionView content=view.exampleController itemViewClass=view.possibleItemView}}beta{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(firstGrandchild(view).isAlsoCustom, 'uses the example view class specified in the #collection helper');
});

QUnit.test('itemViewClass works in the #collection via container', function () {
  registry.register('view:example-item', _emberViewsViewsView2['default'].extend({
    isAlsoCustom: true
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    exampleCollectionView: _emberViewsViewsCollection_view2['default'].extend(),
    exampleController: _emberRuntimeSystemArray_proxy2['default'].create({
      content: (0, _emberRuntimeSystemNative_array.A)(['alpha'])
    }),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.exampleCollectionView content=view.exampleController itemViewClass="example-item"}}beta{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(firstGrandchild(view).isAlsoCustom, 'uses the example view class specified in the #collection helper');
});

QUnit.test('passing a block to the collection helper sets it as the template for example views', function () {
  var CollectionTestView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });

  view = _emberViewsViewsView2['default'].create({
    collectionTestView: CollectionTestView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collectionTestView}} <label></label> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('label').length, 3, 'one label element is created for each content item');
});

QUnit.test('collection helper should try to use container to resolve view', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  var ACollectionView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });

  registry.register('view:collectionTest', ACollectionView);

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection "collectionTest"}} <label></label> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('label').length, 3, 'one label element is created for each content item');
});

QUnit.test('collection helper should accept relative paths', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collection}} <label></label> {{/collection}}'),
    collection: _emberViewsViewsCollection_view2['default'].extend({
      tagName: 'ul',
      content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
    })
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('label').length, 3, 'one label element is created for each content item');
});

QUnit.test('empty views should be removed when content is added to the collection (regression, ht: msofaer)', function () {
  var EmptyView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<td>No Rows Yet</td>')
  });

  var ListView = _emberViewsViewsCollection_view2['default'].extend({
    emptyView: EmptyView
  });

  var listController = _emberRuntimeSystemArray_proxy2['default'].create({
    content: (0, _emberRuntimeSystemNative_array.A)()
  });

  view = _emberViewsViewsView2['default'].create({
    listView: ListView,
    listController: listController,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.listView content=view.listController tagName="table"}} <td>{{view.content.title}}</td> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('tr').length, 1, 'Make sure the empty view is there (regression)');

  (0, _emberMetalRun_loop2['default'])(function () {
    listController.pushObject({ title: 'Go Away, Placeholder Row!' });
  });

  equal(view.$('tr').length, 1, 'has one row');
  equal(view.$('tr:nth-child(1) td').text(), 'Go Away, Placeholder Row!', 'The content is the updated data.');
});

QUnit.test('should be able to specify which class should be used for the empty view', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var App;

  (0, _emberMetalRun_loop2['default'])(function () {
    lookup.App = App = _emberRuntimeSystemNamespace2['default'].create();
  });

  var EmptyView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('This is an empty view')
  });

  registry.register('view:empty-view', EmptyView);

  view = _emberViewsViewsView2['default'].create({
    container: registry.container(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{collection emptyViewClass="empty-view"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'This is an empty view', 'Empty view should be rendered.');

  (0, _emberRuntimeTestsUtils.runDestroy)(App);
});

QUnit.test('if no content is passed, and no \'else\' is specified, nothing is rendered', function () {
  var CollectionTestView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)()
  });

  view = _emberViewsViewsView2['default'].create({
    collectionTestView: CollectionTestView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collectionTestView}} <aside></aside> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('li').length, 0, 'if no "else" is specified, nothing is rendered');
});

QUnit.test('if no content is passed, and \'else\' is specified, the else block is rendered', function () {
  var CollectionTestView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)()
  });

  view = _emberViewsViewsView2['default'].create({
    collectionTestView: CollectionTestView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collectionTestView}} <aside></aside> {{ else }} <del></del> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('li:has(del)').length, 1, 'the else block is rendered');
});

QUnit.test('a block passed to a collection helper defaults to the content property of the context', function () {
  var CollectionTestView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });

  view = _emberViewsViewsView2['default'].create({
    collectionTestView: CollectionTestView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collectionTestView}} <label>{{view.content}}</label> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('li:nth-child(1) label').length, 1);
  equal(view.$('li:nth-child(1) label').text(), 'foo');
  equal(view.$('li:nth-child(2) label').length, 1);
  equal(view.$('li:nth-child(2) label').text(), 'bar');
  equal(view.$('li:nth-child(3) label').length, 1);
  equal(view.$('li:nth-child(3) label').text(), 'baz');
});

QUnit.test('a block passed to a collection helper defaults to the view', function () {
  var CollectionTestView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });

  view = _emberViewsViewsView2['default'].create({
    collectionTestView: CollectionTestView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collectionTestView}} <label>{{view.content}}</label> {{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  // Preconds
  equal(view.$('li:nth-child(1) label').length, 1);
  equal(view.$('li:nth-child(1) label').text(), 'foo');
  equal(view.$('li:nth-child(2) label').length, 1);
  equal(view.$('li:nth-child(2) label').text(), 'bar');
  equal(view.$('li:nth-child(3) label').length, 1);
  equal(view.$('li:nth-child(3) label').text(), 'baz');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(firstChild(view), 'content', (0, _emberRuntimeSystemNative_array.A)());
  });
  equal(view.$('label').length, 0, 'all list item views should be removed from DOM');
});

QUnit.test('should include an id attribute if id is set in the options hash', function () {
  var CollectionTestView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });

  view = _emberViewsViewsView2['default'].create({
    collectionTestView: CollectionTestView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.collectionTestView id="baz"}}foo{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul#baz').length, 1, 'adds an id attribute');
});

QUnit.test('should give its item views the class specified by itemClass', function () {
  var ItemClassTestCollectionView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar', 'baz'])
  });
  view = _emberViewsViewsView2['default'].create({
    itemClassTestCollectionView: ItemClassTestCollectionView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.itemClassTestCollectionView itemClass="baz"}}foo{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul li.baz').length, 3, 'adds class attribute');
});

QUnit.test('should give its item views the class specified by itemClass binding', function () {
  var ItemClassBindingTestCollectionView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)([_emberRuntimeSystemObject2['default'].create({ isBaz: false }), _emberRuntimeSystemObject2['default'].create({ isBaz: true }), _emberRuntimeSystemObject2['default'].create({ isBaz: true })])
  });

  view = _emberViewsViewsView2['default'].create({
    itemClassBindingTestCollectionView: ItemClassBindingTestCollectionView,
    isBar: true,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.itemClassBindingTestCollectionView itemClass=view.isBar}}foo{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul li.is-bar').length, 3, 'adds class on initial rendering');

  // NOTE: in order to bind an item's class to a property of the item itself (e.g. `isBaz` above), it will be necessary
  // to introduce a new keyword that could be used from within `itemClassBinding`. For instance, `itemClassBinding="item.isBaz"`.
});

QUnit.test('should give its item views the property specified by itemProperty', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();

  var ItemPropertyBindingTestItemView = _emberViewsViewsView2['default'].extend({
    tagName: 'li'
  });

  registry.register('view:item-property-binding-test-item-view', ItemPropertyBindingTestItemView);

  // Use preserveContext=false so the itemView handlebars context is the view context
  // Set itemView bindings using item*
  view = _emberViewsViewsView2['default'].create({
    baz: 'baz',
    content: (0, _emberRuntimeSystemNative_array.A)([_emberRuntimeSystemObject2['default'].create(), _emberRuntimeSystemObject2['default'].create(), _emberRuntimeSystemObject2['default'].create()]),
    container: registry.container(),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection content=view.content tagName="ul" itemViewClass="item-property-binding-test-item-view" itemProperty=view.baz preserveContext=false}}{{view.property}}{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul li').length, 3, 'adds 3 itemView');

  view.$('ul li').each(function (i, li) {
    equal((0, _emberViewsSystemJquery2['default'])(li).text(), 'baz', 'creates the li with the property = baz');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'baz', 'yobaz');
  });

  equal(view.$('ul li:first').text(), 'yobaz', 'change property of sub view');
});

QUnit.test('should work inside a bound {{#if}}', function () {
  var testData = (0, _emberRuntimeSystemNative_array.A)([_emberRuntimeSystemObject2['default'].create({ isBaz: false }), _emberRuntimeSystemObject2['default'].create({ isBaz: true }), _emberRuntimeSystemObject2['default'].create({ isBaz: true })]);
  var IfTestCollectionView = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: testData
  });

  view = _emberViewsViewsView2['default'].create({
    ifTestCollectionView: IfTestCollectionView,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.shouldDisplay}}{{#collection view.ifTestCollectionView}}{{content.isBaz}}{{/collection}}{{/if}}'),
    shouldDisplay: true
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul li').length, 3, 'renders collection when conditional is true');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'shouldDisplay', false);
  });
  equal(view.$('ul li').length, 0, 'removes collection when conditional changes to false');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'shouldDisplay', true);
  });
  equal(view.$('ul li').length, 3, 'collection renders when conditional changes to true');
});

QUnit.test('should pass content as context when using {{#each}} helper [DEPRECATED]', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.releases}}Mac OS X {{version}}: {{name}} {{/each}}'),

    releases: (0, _emberRuntimeSystemNative_array.A)([{ version: '10.7',
      name: 'Lion' }, { version: '10.6',
      name: 'Snow Leopard' }, { version: '10.5',
      name: 'Leopard' }])
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, 'Using the context switching form of {{each}} is deprecated. Please use the keyword form (`{{#each items as |item|}}`) instead.');

  equal(view.$().text(), 'Mac OS X 10.7: Lion Mac OS X 10.6: Snow Leopard Mac OS X 10.5: Leopard ', 'prints each item in sequence');
});

QUnit.test('should re-render when the content object changes', function () {
  var RerenderTest = _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)()
  });

  view = _emberViewsViewsView2['default'].create({
    rerenderTestView: RerenderTest,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.rerenderTestView}}{{view.content}}{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(firstChild(view), 'content', (0, _emberRuntimeSystemNative_array.A)(['bing', 'bat', 'bang']));
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(firstChild(view), 'content', (0, _emberRuntimeSystemNative_array.A)(['ramalamadingdong']));
  });

  equal(view.$('li').length, 1, 'rerenders with correct number of items');
  equal(trim(view.$('li:eq(0)').text()), 'ramalamadingdong');
});

QUnit.test('select tagName on collection helper automatically sets child tagName to option', function () {
  var RerenderTest = _emberViewsViewsCollection_view2['default'].extend({
    content: (0, _emberRuntimeSystemNative_array.A)(['foo'])
  });

  view = _emberViewsViewsView2['default'].create({
    rerenderTestView: RerenderTest,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.rerenderTestView tagName="select"}}{{view.content}}{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('option').length, 1, 'renders the correct child tag name');
});

QUnit.test('tagName works in the #collection helper', function () {
  var RerenderTest = _emberViewsViewsCollection_view2['default'].extend({
    content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar'])
  });

  view = _emberViewsViewsView2['default'].create({
    rerenderTestView: RerenderTest,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.rerenderTestView tagName="ol"}}{{view.content}}{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ol').length, 1, 'renders the correct tag name');
  equal(view.$('li').length, 2, 'rerenders with correct number of items');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(firstChild(view), 'content', (0, _emberRuntimeSystemNative_array.A)(['bing', 'bat', 'bang']));
  });

  equal(view.$('li').length, 3, 'rerenders with correct number of items');
  equal(trim(view.$('li:eq(0)').text()), 'bing');
});

QUnit.test('itemClassNames adds classes to items', function () {
  view = _emberViewsViewsView2['default'].create({
    context: { list: (0, _emberRuntimeSystemNative_array.A)(['one', 'two']) },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection content=list itemClassNames="some-class"}}{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('div > .some-class').length, 2, 'should have two items with the class');
});

QUnit.test('should render nested collections', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();
  registry.register('view:inner-list', _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['one', 'two', 'three'])
  }));

  registry.register('view:outer-list', _emberViewsViewsCollection_view2['default'].extend({
    tagName: 'ul',
    content: (0, _emberRuntimeSystemNative_array.A)(['foo'])
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection "outer-list" class="outer"}}{{content}}{{#collection "inner-list" class="inner"}}{{content}}{{/collection}}{{/collection}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul.outer > li').length, 1, 'renders the outer list with correct number of items');
  equal(view.$('ul.inner').length, 1, 'the inner list exsits');
  equal(view.$('ul.inner > li').length, 3, 'renders the inner list with correct number of items');
});

QUnit.test('should render multiple, bound nested collections (#68)', function () {
  var view;

  (0, _emberMetalRun_loop2['default'])(function () {
    TemplateTests.contentController = _emberRuntimeSystemArray_proxy2['default'].create({
      content: (0, _emberRuntimeSystemNative_array.A)(['foo', 'bar'])
    });

    var InnerList = _emberViewsViewsCollection_view2['default'].extend({
      tagName: 'ul',
      contentBinding: 'parentView.innerListContent'
    });

    var OuterListItem = _emberViewsViewsView2['default'].extend({
      innerListView: InnerList,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#collection view.innerListView class="inner"}}{{content}}{{/collection}}{{content}}'),
      innerListContent: (0, _emberMetalComputed.computed)(function () {
        return (0, _emberRuntimeSystemNative_array.A)([1, 2, 3]);
      })
    });

    var OuterList = _emberViewsViewsCollection_view2['default'].extend({
      tagName: 'ul',
      contentBinding: 'TemplateTests.contentController',
      itemViewClass: OuterListItem
    });

    view = _emberViewsViewsView2['default'].create({
      outerListView: OuterList,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{collection view.outerListView class="outer"}}')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('ul.outer > li').length, 2, 'renders the outer list with correct number of items');
  equal(view.$('ul.inner').length, 2, 'renders the correct number of inner lists');
  equal(view.$('ul.inner:first > li').length, 3, 'renders the first inner list with correct number of items');
  equal(view.$('ul.inner:last > li').length, 3, 'renders the second list with correct number of items');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('should allow view objects to be swapped out without throwing an error (#78)', function () {
  var view, dataset, secondDataset;

  (0, _emberMetalRun_loop2['default'])(function () {
    TemplateTests.datasetController = _emberRuntimeSystemObject2['default'].create();

    var ExampleCollectionView = _emberViewsViewsCollection_view2['default'].extend({
      contentBinding: 'parentView.items',
      tagName: 'ul',
      _itemViewTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    });

    var ReportingView = _emberViewsViewsView2['default'].extend({
      exampleCollectionView: ExampleCollectionView,
      datasetBinding: 'TemplateTests.datasetController.dataset',
      readyBinding: 'dataset.ready',
      itemsBinding: 'dataset.items',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#if view.ready}}{{collection view.exampleCollectionView}}{{else}}Loading{{/if}}')
    });

    view = ReportingView.create();
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Loading', 'renders the loading text when the dataset is not ready');

  (0, _emberMetalRun_loop2['default'])(function () {
    dataset = _emberRuntimeSystemObject2['default'].create({
      ready: true,
      items: (0, _emberRuntimeSystemNative_array.A)([1, 2, 3])
    });
    TemplateTests.datasetController.set('dataset', dataset);
  });

  equal(view.$('ul > li').length, 3, 'renders the collection with the correct number of items when the dataset is ready');

  (0, _emberMetalRun_loop2['default'])(function () {
    secondDataset = _emberRuntimeSystemObject2['default'].create({ ready: false });
    TemplateTests.datasetController.set('dataset', secondDataset);
  });

  equal(view.$().text(), 'Loading', 'renders the loading text when the second dataset is not ready');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});

QUnit.test('context should be content', function () {
  var view;

  registry = new _emberRuntimeSystemContainer.Registry();
  container = registry.container();

  var items = (0, _emberRuntimeSystemNative_array.A)([_emberRuntimeSystemObject2['default'].create({ name: 'Dave' }), _emberRuntimeSystemObject2['default'].create({ name: 'Mary' }), _emberRuntimeSystemObject2['default'].create({ name: 'Sara' })]);

  registry.register('view:an-item', _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('Greetings {{name}}')
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    controller: {
      items: items
    },
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{collection content=items itemViewClass="an-item"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'Greetings DaveGreetings MaryGreetings Sara');

  (0, _emberRuntimeTestsUtils.runDestroy)(view);
});