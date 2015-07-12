'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsViewsContainer_view = require('ember-views/views/container_view');

var _emberViewsViewsContainer_view2 = _interopRequireDefault(_emberViewsViewsContainer_view);

var _emberViewsTestsTestHelpersEqualHtml = require('ember-views/tests/test-helpers/equal-html');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;

QUnit.module('Ember.View#createElement', {
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.destroy();
    });
  }
});

QUnit.test('returns the receiver', function () {
  var ret;

  view = _emberViewsViewsView2['default'].create();

  (0, _emberMetalRun_loop2['default'])(function () {
    ret = view.createElement();
  });

  equal(ret, view, 'returns receiver');
});

QUnit.test('should assert if `tagName` is an empty string and `classNameBindings` are specified', function () {
  expect(1);

  view = _emberViewsViewsView2['default'].create({
    tagName: '',
    foo: true,
    classNameBindings: ['foo:is-foo:is-bar']
  });

  expectAssertion(function () {
    (0, _emberMetalRun_loop2['default'])(function () {
      view.createElement();
    });
  }, /You cannot use `classNameBindings` on a tag-less component/);

  // Prevent further assertions
  view._renderNode = null;
});

QUnit.test('calls render and turns resultant string into element', function () {
  view = _emberViewsViewsView2['default'].create({
    tagName: 'span',
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('foo')
  });

  equal((0, _emberMetalProperty_get.get)(view, 'element'), null, 'precondition - has no element');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  var elem = (0, _emberMetalProperty_get.get)(view, 'element');
  ok(elem, 'has element now');
  equal(elem.innerHTML, 'foo', 'has innerHTML from context');
  equal(elem.tagName.toString().toLowerCase(), 'span', 'has tagName from view');
});

QUnit.test('renders the child view templates in the right context', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  view = _emberViewsViewsContainer_view2['default'].create({
    tagName: 'table',
    childViews: [_emberViewsViewsView2['default'].create({
      tagName: '',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<tr><td>snorfblax</td></tr>')
    })]
  });

  equal((0, _emberMetalProperty_get.get)(view, 'element'), null, 'precondition - has no element');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  var elem = (0, _emberMetalProperty_get.get)(view, 'element');
  ok(elem, 'has element now');
  equal(elem.tagName.toString().toLowerCase(), 'table', 'has tagName from view');
  (0, _emberViewsTestsTestHelpersEqualHtml.equalHTML)(elem.childNodes, '<tr><td>snorfblax</td></tr>', 'has innerHTML from context');
});

QUnit.test('does not wrap many tr children in tbody elements', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  view = _emberViewsViewsContainer_view2['default'].create({
    tagName: 'table',
    childViews: [_emberViewsViewsView2['default'].create({
      tagName: '',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<tr><td>snorfblax</td></tr>')
    }), _emberViewsViewsView2['default'].create({
      tagName: '',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<tr><td>snorfblax</td></tr>')
    })]
  });

  equal((0, _emberMetalProperty_get.get)(view, 'element'), null, 'precondition - has no element');
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  var elem = (0, _emberMetalProperty_get.get)(view, 'element');
  ok(elem, 'has element now');
  (0, _emberViewsTestsTestHelpersEqualHtml.equalHTML)(elem.childNodes, '<tr><td>snorfblax</td></tr><tr><td>snorfblax</td></tr>', 'has innerHTML from context');
  equal(elem.tagName.toString().toLowerCase(), 'table', 'has tagName from view');
});

QUnit.test('generated element include HTML from child views as well', function () {
  expectDeprecation('Setting `childViews` on a Container is deprecated.');

  view = _emberViewsViewsContainer_view2['default'].create({
    childViews: [_emberViewsViewsView2['default'].create({ elementId: 'foo' })]
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });

  ok(view.$('#foo').length, 'has element with child elementId');
});