'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.A

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalMixin = require('ember-metal/mixin');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemArray_proxy = require('ember-runtime/system/array_proxy');

var _emberRuntimeSystemArray_proxy2 = _interopRequireDefault(_emberRuntimeSystemArray_proxy);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsCollection_view = require('ember-views/views/collection_view');

var _emberViewsViewsCollection_view2 = _interopRequireDefault(_emberViewsViewsCollection_view);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsTestsTestHelpersGetElementStyle = require('ember-views/tests/test-helpers/get-element-style');

var _emberViewsTestsTestHelpersGetElementStyle2 = _interopRequireDefault(_emberViewsTestsTestHelpersGetElementStyle);

var trim = _emberViewsSystemJquery2['default'].trim;
var registry;
var view;

var originalLookup;

QUnit.module('CollectionView', {
  setup: function setup() {
    _emberViewsViewsCollection_view2['default'].CONTAINER_MAP.del = 'em';
    originalLookup = _emberMetalCore2['default'].lookup;
    registry = new _containerRegistry2['default']();
  },
  teardown: function teardown() {
    delete _emberViewsViewsCollection_view2['default'].CONTAINER_MAP.del;
    (0, _emberMetalRun_loop2['default'])(function () {
      if (view) {
        view.destroy();
      }
    });

    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should render a view for each item in its content array', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    content: _emberMetalCore2['default'].A([1, 2, 3, 4])
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });
  equal(view.$('div').length, 4);
});

QUnit.test('should render the emptyView if content array is empty (view class)', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    content: _emberMetalCore2['default'].A(),

    emptyView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('OY SORRY GUVNAH NO NEWS TODAY EH')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('div:contains("OY SORRY GUVNAH")').length, 'displays empty view');
});

QUnit.test('should render the emptyView if content array is empty (view class with custom tagName)', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    tagName: 'del',
    content: _emberMetalCore2['default'].A(),

    emptyView: _emberViewsViewsView2['default'].extend({
      tagName: 'kbd',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('OY SORRY GUVNAH NO NEWS TODAY EH')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('kbd:contains("OY SORRY GUVNAH")').length, 'displays empty view');
});

QUnit.test('should render the emptyView if content array is empty (view instance)', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    tagName: 'del',
    content: _emberMetalCore2['default'].A(),

    emptyView: _emberViewsViewsView2['default'].create({
      tagName: 'kbd',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('OY SORRY GUVNAH NO NEWS TODAY EH')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('kbd:contains("OY SORRY GUVNAH")').length, 'displays empty view');
});

QUnit.test('should be able to override the tag name of itemViewClass even if tag is in default mapping', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    tagName: 'del',
    content: _emberMetalCore2['default'].A(['NEWS GUVNAH']),

    itemViewClass: _emberViewsViewsView2['default'].extend({
      tagName: 'kbd',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('kbd:contains("NEWS GUVNAH")').length, 'displays the item view with proper tag name');
});

QUnit.test('should allow custom item views by setting itemViewClass', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);
  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  content.forEach(function (item) {
    return equal(view.$(':contains("' + item + '")').length, 1);
  });
});

QUnit.test('should insert a new item in DOM when an item is added to the content array', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);

  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    content.insertAt(1, 'quux');
  });

  equal(trim(view.$(':nth-child(2)').text()), 'quux');
});

QUnit.test('should remove an item from DOM when an item is removed from the content array', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);

  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    return view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    return content.removeAt(1);
  });

  content.forEach(function (item, idx) {
    equal(view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text(), item);
  });
});

QUnit.test('it updates the view if an item is replaced', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);
  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    content.removeAt(1);
    content.insertAt(1, 'Kazuki');
  });

  content.forEach(function (item, idx) {
    equal(trim(view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text()), item, 'postcond - correct array update');
  });
});

QUnit.test('can add and replace in the same runloop', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);
  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    return view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    content.pushObject('Tom Dale');
    content.removeAt(0);
    content.insertAt(0, 'Kazuki');
  });

  content.forEach(function (item, idx) {
    equal(trim(view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text()), item, 'postcond - correct array update');
  });
});

QUnit.test('can add and replace the object before the add in the same runloop', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);
  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    return view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    content.pushObject('Tom Dale');
    content.removeAt(1);
    content.insertAt(1, 'Kazuki');
  });

  content.forEach(function (item, idx) {
    equal(trim(view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text()), item, 'postcond - correct array update');
  });
});

QUnit.test('can add and replace complicatedly', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);
  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    return view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    content.pushObject('Tom Dale');
    content.removeAt(1);
    content.insertAt(1, 'Kazuki');
    content.pushObject('Firestone');
    content.pushObject('McMunch');
  });

  content.forEach(function (item, idx) {
    equal(trim(view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text()), item, 'postcond - correct array update: ' + item.name + '!=' + view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text());
  });
});

QUnit.test('can add and replace complicatedly harder', function () {
  var content = _emberMetalCore2['default'].A(['foo', 'bar', 'baz']);
  view = _emberViewsViewsCollection_view2['default'].create({
    content: content,

    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  content.forEach(function (item) {
    equal(view.$(':contains("' + item + '")').length, 1, 'precond - generates pre-existing items');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    content.pushObject('Tom Dale');
    content.removeAt(1);
    content.insertAt(1, 'Kazuki');
    content.pushObject('Firestone');
    content.pushObject('McMunch');
    content.removeAt(2);
  });

  content.forEach(function (item, idx) {
    equal(trim(view.$((0, _emberRuntimeSystemString.fmt)(':nth-child(%@)', [String(idx + 1)])).text()), item, 'postcond - correct array update');
  });
});

QUnit.test('should allow changes to content object before layer is created', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    content: null
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', _emberMetalCore2['default'].A());
    (0, _emberMetalProperty_set.set)(view, 'content', _emberMetalCore2['default'].A([1, 2, 3]));
    (0, _emberMetalProperty_set.set)(view, 'content', _emberMetalCore2['default'].A([1, 2]));
    view.append();
  });

  ok(view.$().children().length);
});

QUnit.test('should fire life cycle events when elements are added and removed', function () {
  var view;
  var _didInsertElement = 0;
  var _willDestroyElement = 0;
  var _willDestroy = 0;
  var _destroy = 0;
  var content = _emberMetalCore2['default'].A([1, 2, 3]);
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsCollection_view2['default'].create({
      content: content,
      itemViewClass: _emberViewsViewsView2['default'].extend({
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}'),
        didInsertElement: function didInsertElement() {
          _didInsertElement++;
        },
        willDestroyElement: function willDestroyElement() {
          _willDestroyElement++;
        },
        willDestroy: function willDestroy() {
          _willDestroy++;
          this._super.apply(this, arguments);
        },
        destroy: function destroy() {
          _destroy++;
          this._super.apply(this, arguments);
        }
      })
    });
    view.appendTo('#qunit-fixture');
  });

  equal(_didInsertElement, 3);
  equal(_willDestroyElement, 0);
  equal(_willDestroy, 0);
  equal(_destroy, 0);
  equal(view.$().text(), '123');

  (0, _emberMetalRun_loop2['default'])(function () {
    content.pushObject(4);
    content.unshiftObject(0);
  });

  equal(_didInsertElement, 5);
  equal(_willDestroyElement, 0);
  equal(_willDestroy, 0);
  equal(_destroy, 0);
  // Remove whitespace added by IE 8
  equal(trim(view.$().text()), '01234');

  (0, _emberMetalRun_loop2['default'])(function () {
    content.popObject();
    content.shiftObject();
  });

  equal(_didInsertElement, 5);
  equal(_willDestroyElement, 2);
  equal(_willDestroy, 2);
  equal(_destroy, 2);
  // Remove whitspace added by IE 8
  equal(trim(view.$().text()), '123');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('content', _emberMetalCore2['default'].A([7, 8, 9]));
  });

  equal(_didInsertElement, 8);
  equal(_willDestroyElement, 5);
  equal(_willDestroy, 5);
  equal(_destroy, 5);
  // Remove whitespace added by IE 8
  equal(trim(view.$().text()), '789');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  equal(_didInsertElement, 8);
  equal(_willDestroyElement, 8);
  equal(_willDestroy, 8);
  equal(_destroy, 8);
});

QUnit.test('should allow changing content property to be null', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    content: _emberMetalCore2['default'].A([1, 2, 3]),

    emptyView: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('(empty)')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(view.$().children().length, 3, 'precond - creates three elements');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', null);
  });

  equal(trim(view.$().children().text()), '(empty)', 'should display empty view');
});

QUnit.test('should allow items to access to the CollectionView\'s current index in the content array', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    content: _emberMetalCore2['default'].A(['zero', 'one', 'two']),
    itemViewClass: _emberViewsViewsView2['default'].extend({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.contentIndex}}')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  deepEqual(view.$(':nth-child(1)').text(), '0');
  deepEqual(view.$(':nth-child(2)').text(), '1');
  deepEqual(view.$(':nth-child(3)').text(), '2');
});

QUnit.test('should allow declaration of itemViewClass as a string', function () {
  registry.register('view:simple-view', _emberViewsViewsView2['default'].extend());

  view = _emberViewsViewsCollection_view2['default'].create({
    container: registry.container(),
    content: _emberMetalCore2['default'].A([1, 2, 3]),
    itemViewClass: 'simple-view'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  equal(view.$('.ember-view').length, 3);
});

QUnit.test('should not render the emptyView if content is emptied and refilled in the same run loop', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    tagName: 'div',
    content: _emberMetalCore2['default'].A(['NEWS GUVNAH']),

    emptyView: _emberViewsViewsView2['default'].extend({
      tagName: 'kbd',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('OY SORRY GUVNAH NO NEWS TODAY EH')
    })
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(view.$().find('kbd:contains("OY SORRY GUVNAH")').length, 0);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('content').popObject();
    view.get('content').pushObject(['NEWS GUVNAH']);
  });
  equal(view.$('div').length, 1);
  equal(view.$().find('kbd:contains("OY SORRY GUVNAH")').length, 0);
});

QUnit.test('a array_proxy that backs an sorted array_controller that backs a collection view functions properly', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var array = _emberMetalCore2['default'].A([{ name: 'Other Katz' }]);
  var arrayProxy = _emberRuntimeSystemArray_proxy2['default'].create({ content: array });

  var sortedController = _emberRuntimeControllersArray_controller2['default'].create({
    content: arrayProxy,
    sortProperties: ['name']
  });

  var container = _emberViewsViewsCollection_view2['default'].create({
    content: sortedController
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    container.appendTo('#qunit-fixture');
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    arrayProxy.addObjects([{ name: 'Scumbag Demon' }, { name: 'Lord British' }]);
  });

  equal(container.get('content.length'), 3, 'ArrayController should have 3 entries');
  equal(container.get('content.content.length'), 3, 'RecordArray should have 3 entries');
  equal(container.get('childViews.length'), 3, 'CollectionView should have 3 entries');

  (0, _emberMetalRun_loop2['default'])(function () {
    container.destroy();
  });
});

QUnit.test('when a collection view is emptied, deeply nested views elements are not removed from the DOM and then destroyed again', function () {
  var gotDestroyed = [];

  var assertProperDestruction = _emberMetalMixin.Mixin.create({
    destroy: function destroy() {
      gotDestroyed.push(this.label);
      this._super.apply(this, arguments);
    }
  });

  var ChildView = _emberViewsViewsView2['default'].extend(assertProperDestruction, {
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#view view.assertDestruction}}<div class="inner_element"></div>{{/view}}'),
    label: 'parent',
    assertDestruction: _emberViewsViewsView2['default'].extend(assertProperDestruction, {
      label: 'child'
    })
  });

  var view = _emberViewsViewsCollection_view2['default'].create({
    content: _emberMetalCore2['default'].A([1]),
    itemViewClass: ChildView
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });
  equal((0, _emberViewsSystemJquery2['default'])('.inner_element').length, 1, 'precond - generates inner element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('content').clear();
  });
  equal((0, _emberViewsSystemJquery2['default'])('.inner_element').length, 0, 'elements removed');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  deepEqual(gotDestroyed, ['parent', 'child'], 'The child view was destroyed');
});

QUnit.test('should render the emptyView if content array is empty and emptyView is given as string', function () {
  registry.register('view:custom-empty', _emberViewsViewsView2['default'].extend({
    tagName: 'kbd',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('THIS IS AN EMPTY VIEW')
  }));

  view = _emberViewsViewsCollection_view2['default'].create({
    tagName: 'del',
    content: _emberMetalCore2['default'].A(),
    container: registry.container(),

    emptyView: 'custom-empty'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('kbd:contains("THIS IS AN EMPTY VIEW")').length, 'displays empty view');
});

QUnit.test('should render the emptyView if content array is empty and emptyView is given as global string [DEPRECATED]', function () {
  expectDeprecation(/Resolved the view "App.EmptyView" on the global context/);

  _emberMetalCore2['default'].lookup = {
    App: {
      EmptyView: _emberViewsViewsView2['default'].extend({
        tagName: 'kbd',
        template: (0, _emberTemplateCompilerSystemCompile2['default'])('THIS IS AN EMPTY VIEW')
      })
    }
  };

  view = _emberViewsViewsCollection_view2['default'].create({
    tagName: 'del',
    content: _emberMetalCore2['default'].A(),

    emptyView: 'App.EmptyView'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('kbd:contains("THIS IS AN EMPTY VIEW")').length, 'displays empty view');
});

QUnit.test('should lookup against the container if itemViewClass is given as a string', function () {
  var ItemView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
  });

  registry.register('view:item', ItemView);

  view = _emberViewsViewsCollection_view2['default'].create({
    container: registry.container(),
    content: _emberMetalCore2['default'].A([1, 2, 3, 4]),
    itemViewClass: 'item'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  equal(view.$('.ember-view').length, 4);
});

QUnit.test('should lookup only global path against the container if itemViewClass is given as a string', function () {
  var ItemView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{view.content}}')
  });

  registry.register('view:top', ItemView);

  view = _emberViewsViewsCollection_view2['default'].create({
    container: registry.container(),
    content: _emberMetalCore2['default'].A(['hi']),
    itemViewClass: 'top'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  equal(view.$().text(), 'hi');
});

QUnit.test('should lookup against the container and render the emptyView if emptyView is given as string and content array is empty ', function () {
  var EmptyView = _emberViewsViewsView2['default'].extend({
    tagName: 'kbd',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('THIS IS AN EMPTY VIEW')
  });

  registry.register('view:empty', EmptyView);

  view = _emberViewsViewsCollection_view2['default'].create({
    container: registry.container(),
    tagName: 'del',
    content: _emberMetalCore2['default'].A(),
    emptyView: 'empty'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  ok(view.$().find('kbd:contains("THIS IS AN EMPTY VIEW")').length, 'displays empty view');
});

QUnit.test('should lookup from only global path against the container if emptyView is given as string and content array is empty ', function () {
  var EmptyView = _emberViewsViewsView2['default'].extend({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('EMPTY')
  });

  registry.register('view:top', EmptyView);

  view = _emberViewsViewsCollection_view2['default'].create({
    container: registry.container(),
    content: _emberMetalCore2['default'].A(),
    emptyView: 'top'
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.append();
  });

  equal(view.$().text(), 'EMPTY');
});

QUnit.test('Collection with style attribute supports changing content', function () {
  view = _emberViewsViewsCollection_view2['default'].create({
    attributeBindings: ['style'],
    style: 'width: 100px;',
    content: _emberMetalCore2['default'].A(['foo', 'bar'])
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.appendTo('#qunit-fixture');
  });

  var style = (0, _emberViewsTestsTestHelpersGetElementStyle2['default'])(view.element);

  equal(style, 'WIDTH: 100PX;', 'width is applied to the element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.get('content').pushObject('baz');
  });
});