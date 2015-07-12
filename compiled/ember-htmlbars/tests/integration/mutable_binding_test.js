'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

//import jQuery from "ember-views/system/jquery";

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsViewsComponent = require('ember-views/views/component');

var _emberViewsViewsComponent2 = _interopRequireDefault(_emberViewsViewsComponent);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalComputed = require('ember-metal/computed');

var registry, container, view;

QUnit.module('component - mutable bindings', {
  setup: function setup() {
    registry = new _containerRegistry2['default']();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;
  }
});

QUnit.test('a simple mutable binding propagates properly [DEPRECATED]', function (assert) {
  // TODO: attrs
  // expectDeprecation();

  var bottom;

  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut setMe=value}}')
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    didInsertElement: function didInsertElement() {
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut value=view.val}}'),
    val: 12
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(bottom.get('setMe'), 12, 'precond - the data propagated');

  (0, _emberMetalRun_loop2['default'])(function () {
    return bottom.set('setMe', 13);
  });

  assert.strictEqual(bottom.get('setMe'), 13, 'precond - the set took effect');
  assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
});

QUnit.test('a simple mutable binding using `mut` propagates properly', function (assert) {
  var bottom;

  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut setMe=(mut attrs.value)}}')
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    didInsertElement: function didInsertElement() {
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut value=(mut view.val)}}'),
    val: 12
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(bottom.attrs.setMe.value, 12, 'precond - the data propagated');

  (0, _emberMetalRun_loop2['default'])(function () {
    return bottom.attrs.setMe.update(13);
  });

  assert.strictEqual(bottom.attrs.setMe.value, 13, 'precond - the set took effect');
  assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
});

QUnit.test('using a string value through middle tier does not trigger assertion', function (assert) {
  var bottom;

  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut stuff=attrs.value}}')
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p class="bottom">{{attrs.stuff}}</p>'),
    didInsertElement: function didInsertElement() {
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut value="foo"}}'),
    val: 12
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(bottom.attrs.stuff.value, 'foo', 'precond - the data propagated');
  assert.strictEqual(view.$('p.bottom').text(), 'foo');
});

QUnit.test('a simple mutable binding using `mut` inserts into the DOM', function (assert) {
  var bottom;

  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut setMe=(mut attrs.value)}}')
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p class="bottom">{{attrs.setMe}}</p>'),
    didInsertElement: function didInsertElement() {
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut value=(mut view.val)}}'),
    val: 12
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(view.$('p.bottom').text(), '12');
  assert.strictEqual(bottom.attrs.setMe.value, 12, 'precond - the data propagated');

  (0, _emberMetalRun_loop2['default'])(function () {
    return bottom.attrs.setMe.update(13);
  });

  assert.strictEqual(bottom.attrs.setMe.value, 13, 'precond - the set took effect');
  assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
});

QUnit.test('a simple mutable binding using `mut` can be converted into an immutable binding', function (assert) {
  var middle, bottom;

  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    // no longer mutable
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut setMe=(readonly attrs.value)}}'),

    didInsertElement: function didInsertElement() {
      middle = this;
    }
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p class="bottom">{{attrs.setMe}}</p>'),

    didInsertElement: function didInsertElement() {
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut value=(mut view.val)}}'),
    val: 12
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(view.$('p.bottom').text(), '12');

  (0, _emberMetalRun_loop2['default'])(function () {
    return middle.attrs.value.update(13);
  });

  assert.strictEqual(middle.attrs.value.value, 13, 'precond - the set took effect');
  assert.strictEqual(bottom.attrs.setMe, 13, 'the mutable binding has been converted to an immutable cell');
  assert.strictEqual(view.$('p.bottom').text(), '13');
  assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
});

QUnit.test('mutable bindings work inside of yielded content', function (assert) {
  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#bottom-mut}}{{attrs.model.name}}{{/bottom-mut}}')
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p class="bottom">{{yield}}</p>')
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut model=(mut view.model)}}'),
    model: { name: 'Matthew Beale' }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(view.$('p.bottom').text(), 'Matthew Beale');
});

QUnit.test('a simple mutable binding using `mut` is available in hooks', function (assert) {
  var bottom;
  var _willRender = [];
  var didInsert = [];

  registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
    layout: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut setMe=(mut attrs.value)}}')
  }));

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    willRender: function willRender() {
      _willRender.push(this.attrs.setMe.value);
    },
    didInsertElement: function didInsertElement() {
      didInsert.push(this.attrs.setMe.value);
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{middle-mut value=(mut view.val)}}'),
    val: 12
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.deepEqual(_willRender, [12], 'willReceive is [12]');
  assert.deepEqual(didInsert, [12], 'didInsert is [12]');

  assert.strictEqual(bottom.attrs.setMe.value, 12, 'precond - the data propagated');

  (0, _emberMetalRun_loop2['default'])(function () {
    return bottom.attrs.setMe.update(13);
  });

  assert.strictEqual(bottom.attrs.setMe.value, 13, 'precond - the set took effect');
  assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
});

QUnit.test('a mutable binding with a backing computed property and attribute present in the root of the component is updated when the upstream property invalidates #11023', function (assert) {
  var bottom;

  registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
    thingy: null,

    didInsertElement: function didInsertElement() {
      bottom = this;
    }
  }));

  view = _emberViewsViewsView2['default'].extend({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{bottom-mut thingy=(mut view.val)}}'),
    baseValue: 12,
    val: (0, _emberMetalComputed.computed)('baseValue', function () {
      return this.get('baseValue');
    })
  }).create();

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  assert.strictEqual(bottom.attrs.thingy.value, 12, 'data propagated');

  (0, _emberMetalRun_loop2['default'])(function () {
    return view.set('baseValue', 13);
  });
  assert.strictEqual(bottom.attrs.thingy.value, 13, 'the set took effect');

  (0, _emberMetalRun_loop2['default'])(function () {
    return view.set('baseValue', 14);
  });
  assert.strictEqual(bottom.attrs.thingy.value, 14, 'the set took effect');
});

QUnit.test('automatic mutable bindings tolerate undefined non-stream inputs', function (assert) {
  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-inner model=attrs.nonexistent}}'));
  registry.register('template:components/x-inner', (0, _emberTemplateCompilerSystemCompile2['default'])('hello'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  assert.strictEqual(view.$().text(), 'hello');
});

QUnit.test('automatic mutable bindings tolerate constant non-stream inputs', function (assert) {
  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-inner model="foo"}}'));
  registry.register('template:components/x-inner', (0, _emberTemplateCompilerSystemCompile2['default'])('hello{{attrs.model}}'));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  assert.strictEqual(view.$().text(), 'hellofoo');
});

QUnit.test('automatic mutable bindings to undefined non-streams tolerate attempts to set them', function (assert) {
  var inner;

  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-inner model=attrs.nonexistent}}'));
  registry.register('component:x-inner', _emberViewsViewsComponent2['default'].extend({
    didInsertElement: function didInsertElement() {
      inner = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  (0, _emberMetalRun_loop2['default'])(function () {
    return inner.attrs.model.update(42);
  });
  assert.equal(inner.attrs.model.value, 42);
});

QUnit.test('automatic mutable bindings to constant non-streams tolerate attempts to set them', function (assert) {
  var inner;

  registry.register('template:components/x-outer', (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-inner model=attrs.x}}'));
  registry.register('component:x-inner', _emberViewsViewsComponent2['default'].extend({
    didInsertElement: function didInsertElement() {
      inner = this;
    }
  }));

  view = _emberViewsViewsView2['default'].create({
    container: container,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{x-outer x="foo"}}')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);
  (0, _emberMetalRun_loop2['default'])(function () {
    return inner.attrs.model.update(42);
  });
  assert.equal(inner.attrs.model.value, 42);
});

// jscs:disable validateIndentation
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-component-generation')) {

  QUnit.test('mutable bindings work as angle-bracket component attributes', function (assert) {
    var middle;

    registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
      // no longer mutable
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<bottom-mut setMe={{attrs.value}} />'),

      didInsertElement: function didInsertElement() {
        middle = this;
      }
    }));

    registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p class="bottom">{{attrs.setMe}}</p>')
    }));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<middle-mut value={{mut view.val}} />'),
      val: 12
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    assert.strictEqual(view.$('p.bottom').text(), '12');

    (0, _emberMetalRun_loop2['default'])(function () {
      return middle.attrs.value.update(13);
    });

    assert.strictEqual(middle.attrs.value.value, 13, 'precond - the set took effect');
    assert.strictEqual(view.$('p.bottom').text(), '13');
    assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
  });

  QUnit.test('a simple mutable binding using `mut` can be converted into an immutable binding with angle-bracket components', function (assert) {
    var middle, bottom;

    registry.register('component:middle-mut', _emberViewsViewsComponent2['default'].extend({
      // no longer mutable
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<bottom-mut setMe={{attrs.value}} />'),

      didInsertElement: function didInsertElement() {
        middle = this;
      }
    }));

    registry.register('component:bottom-mut', _emberViewsViewsComponent2['default'].extend({
      layout: (0, _emberTemplateCompilerSystemCompile2['default'])('<p class="bottom">{{attrs.setMe}}</p>'),

      didInsertElement: function didInsertElement() {
        bottom = this;
      }
    }));

    view = _emberViewsViewsView2['default'].create({
      container: container,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<middle-mut value={{mut view.val}} />'),
      val: 12
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    assert.strictEqual(view.$('p.bottom').text(), '12');

    (0, _emberMetalRun_loop2['default'])(function () {
      return middle.attrs.value.update(13);
    });

    assert.strictEqual(middle.attrs.value.value, 13, 'precond - the set took effect');
    assert.strictEqual(bottom.attrs.setMe, 13, 'the mutable binding has been converted to an immutable cell');
    assert.strictEqual(view.$('p.bottom').text(), '13');
    assert.strictEqual(view.get('val'), 13, 'the set propagated back up');
  });
}
// jscs:enable validateIndentation