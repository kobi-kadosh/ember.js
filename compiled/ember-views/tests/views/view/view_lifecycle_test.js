'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompiler = require('ember-template-compiler');

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var originalLookup = _emberMetalCore2['default'].lookup;
var lookup, view;

QUnit.module('views/view/view_lifecycle_test - pre-render', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
  },

  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
    }
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should create and append a DOM element after bindings have synced', function () {
  var ViewTest;

  lookup.ViewTest = ViewTest = {};

  (0, _emberMetalRun_loop2['default'])(function () {
    ViewTest.fakeController = _emberRuntimeSystemObject2['default'].create({
      fakeThing: 'controllerPropertyValue'
    });

    view = _emberViewsViewsView2['default'].create({
      fooBinding: 'ViewTest.fakeController.fakeThing',
      template: (0, _emberTemplateCompiler.compile)('{{view.foo}}')
    });

    ok(!view.get('element'), 'precond - does not have an element before appending');

    // the actual render happens in the `render` queue, which is after the `sync`
    // queue where the binding is synced.
    view.append();
  });

  equal(view.$().text(), 'controllerPropertyValue', 'renders and appends after bindings have synced');
});

QUnit.test('should throw an exception if trying to append a child before rendering has begun', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create();
  });

  throws(function () {
    view.appendChild(_emberViewsViewsView2['default'], {});
  }, null, 'throws an error when calling appendChild()');
});

QUnit.test('should not affect rendering if rerender is called before initial render happens', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Rerender me!')
    });

    view.rerender();
    view.append();
  });

  equal(view.$().text(), 'Rerender me!', 'renders correctly if rerender is called first');
});

QUnit.test('should not affect rendering if destroyElement is called before initial render happens', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Don\'t destroy me!')
    });

    view.destroyElement();
    view.append();
  });

  equal(view.$().text(), 'Don\'t destroy me!', 'renders correctly if destroyElement is called first');
});

QUnit.module('views/view/view_lifecycle_test - in render', {
  setup: function setup() {},

  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
    }
  }
});

QUnit.test('rerender of top level view during rendering should throw', function () {
  (0, _emberHtmlbarsHelpers.registerHelper)('throw', function () {
    view.rerender();
  });
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompiler.compile)('{{throw}}')
  });
  throws(function () {
    (0, _emberMetalRun_loop2['default'])(view, view.appendTo, '#qunit-fixture');
  }, /Something you did caused a view to re-render after it rendered but before it was inserted into the DOM./, 'expected error was not raised');
});

QUnit.test('rerender of non-top level view during rendering should throw', function () {
  var innerView = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompiler.compile)('{{throw}}')
  });
  (0, _emberHtmlbarsHelpers.registerHelper)('throw', function () {
    innerView.rerender();
  });
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompiler.compile)('{{view view.innerView}}'),
    innerView: innerView
  });
  throws(function () {
    (0, _emberMetalRun_loop2['default'])(view, view.appendTo, '#qunit-fixture');
  }, /Something you did caused a view to re-render after it rendered but before it was inserted into the DOM./, 'expected error was not raised');
});

QUnit.module('views/view/view_lifecycle_test - hasElement', {
  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
    }
  }
});

QUnit.test('createElement puts the view into the hasElement state', function () {
  var hasCalledInsertElement = false;
  view = _emberViewsViewsView2['default'].create({
    didInsertElement: function didInsertElement() {
      hasCalledInsertElement = true;
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(!hasCalledInsertElement, 'didInsertElement is not called');
  equal(view.element.tagName, 'DIV', 'content is rendered');
});

QUnit.test('trigger rerender on a view in the hasElement state doesn\'t change its state to inDOM', function () {
  var hasCalledInsertElement = false;
  view = _emberViewsViewsView2['default'].create({
    didInsertElement: function didInsertElement() {
      hasCalledInsertElement = true;
    }
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
    view.rerender();
  });

  ok(!hasCalledInsertElement, 'didInsertElement is not called');
  equal(view.element.tagName, 'DIV', 'content is rendered');
});

QUnit.module('views/view/view_lifecycle_test - in DOM', {
  teardown: function teardown() {
    if (view) {
      (0, _emberMetalRun_loop2['default'])(function () {
        view.destroy();
      });
    }
  }
});

QUnit.test('should throw an exception when calling appendChild when DOM element exists', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Wait for the kick')
    });

    view.append();
  });

  throws(function () {
    view.appendChild(_emberViewsViewsView2['default'], {
      template: (0, _emberTemplateCompiler.compile)('Ah ah ah! You didn\'t say the magic word!')
    });
  }, null, 'throws an exception when calling appendChild after element is created');
});

QUnit.test('should replace DOM representation if rerender() is called after element is created', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].extend({
      rerender: function rerender() {
        this._super.apply(this, arguments);
      }
    }).create({
      template: (0, _emberTemplateCompiler.compile)('Do not taunt happy fun {{unbound view.shape}}'),
      shape: 'sphere'
    });

    view.volatileProp = view.get('context.shape');
    view.append();
  });

  equal(view.$().text(), 'Do not taunt happy fun sphere', 'precond - creates DOM element');

  view.shape = 'ball';

  equal(view.$().text(), 'Do not taunt happy fun sphere', 'precond - keeps DOM element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal(view.$().text(), 'Do not taunt happy fun ball', 'rerenders DOM element when rerender() is called');
});

QUnit.test('should destroy DOM representation when destroyElement is called', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Don\'t fear the reaper')
    });

    view.append();
  });

  ok(view.get('element'), 'precond - generates a DOM element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroyElement();
  });

  ok(!view.get('element'), 'destroys view when destroyElement() is called');
});

QUnit.test('should destroy DOM representation when destroy is called', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('<div id=\'warning\'>Don\'t fear the reaper</div>')
    });

    view.append();
  });

  ok(view.get('element'), 'precond - generates a DOM element');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  ok((0, _emberViewsSystemJquery2['default'])('#warning').length === 0, 'destroys element when destroy() is called');
});

QUnit.test('should throw an exception if trying to append an element that is already in DOM', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Broseidon, King of the Brocean')
    });

    view.append();
  });

  ok(view.get('element'), 'precond - creates DOM element');

  throws(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.append();
    });
  }, null, 'raises an exception on second append');
});

QUnit.module('views/view/view_lifecycle_test - destroyed');

QUnit.test('should throw an exception when calling appendChild after view is destroyed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('Wait for the kick')
    });

    view.append();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  throws(function () {
    view.appendChild(_emberViewsViewsView2['default'], {
      template: (0, _emberTemplateCompiler.compile)('Ah ah ah! You didn\'t say the magic word!')
    });
  }, null, 'throws an exception when calling appendChild');
});

QUnit.test('should throw an exception when rerender is called after view is destroyed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('foo')
    });

    view.append();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  throws(function () {
    view.rerender();
  }, null, 'throws an exception when calling rerender');
});

QUnit.test('should throw an exception when destroyElement is called after view is destroyed', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('foo')
    });

    view.append();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });

  throws(function () {
    view.destroyElement();
  }, null, 'throws an exception when calling destroyElement');
});

QUnit.test('trigger rerender on a view in the inDOM state keeps its state as inDOM', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompiler.compile)('foo')
    });

    view.append();
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal(view.currentState, view._states.inDOM, 'the view is still in the inDOM state');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.destroy();
  });
});