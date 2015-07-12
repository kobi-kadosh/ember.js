'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalKeys = require('ember-metal/keys');

var _emberMetalKeys2 = _interopRequireDefault(_emberMetalKeys);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberRoutingViewsViewsOutlet = require('ember-routing-views/views/outlet');

var App, registry, container;
var originalHelpers;

function prepare() {
  _emberMetalCore2['default'].TEMPLATES['components/expand-it'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<p>hello {{yield}}</p>');
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('Hello world {{#expand-it}}world{{/expand-it}}');

  originalHelpers = _emberMetalCore2['default'].A((0, _emberMetalKeys2['default'])(_emberHtmlbarsHelpers2['default']));
}

function cleanup() {
  _emberMetalCore2['default'].run(function () {
    if (App) {
      App.destroy();
    }
    App = null;
    _emberMetalCore2['default'].TEMPLATES = {};

    cleanupHandlebarsHelpers();
  });
}

function cleanupHandlebarsHelpers() {
  var currentHelpers = _emberMetalCore2['default'].A((0, _emberMetalKeys2['default'])(_emberHtmlbarsHelpers2['default']));

  currentHelpers.forEach(function (name) {
    if (!originalHelpers.contains(name)) {
      delete _emberHtmlbarsHelpers2['default'][name];
    }
  });
}

QUnit.module('Application Lifecycle - Component Registration', {
  setup: prepare,
  teardown: cleanup
});

function boot(callback) {
  var startURL = arguments[1] === undefined ? '/' : arguments[1];

  _emberMetalCore2['default'].run(function () {
    App = _emberMetalCore2['default'].Application.create({
      name: 'App',
      rootElement: '#qunit-fixture'
    });

    App.deferReadiness();

    App.Router = _emberMetalCore2['default'].Router.extend({
      location: 'none'
    });

    registry = App.registry;
    container = App.__container__;

    if (callback) {
      callback();
    }
  });

  var router = container.lookup('router:main');

  _emberMetalCore2['default'].run(App, 'advanceReadiness');
  _emberMetalCore2['default'].run(function () {
    router.handleURL(startURL);
  });
}

QUnit.test('The helper becomes the body of the component', function () {
  boot();
  equal(_emberMetalCore2['default'].$('div.ember-view > div.ember-view', '#qunit-fixture').text(), 'hello world', 'The component is composed correctly');
});

QUnit.test('If a component is registered, it is used', function () {
  boot(function () {
    registry.register('component:expand-it', _emberMetalCore2['default'].Component.extend({
      classNames: 'testing123'
    }));
  });

  equal(_emberMetalCore2['default'].$('div.testing123', '#qunit-fixture').text(), 'hello world', 'The component is composed correctly');
});

QUnit.test('Late-registered components can be rendered with custom `template` property (DEPRECATED)', function () {

  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>there goes {{my-hero}}</div>');

  expectDeprecation(/Do not specify template on a Component/);

  boot(function () {
    registry.register('component:my-hero', _emberMetalCore2['default'].Component.extend({
      classNames: 'testing123',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('watch him as he GOES')
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'there goes watch him as he GOES', 'The component is composed correctly');
  ok(!_emberHtmlbarsHelpers2['default']['my-hero'], 'Component wasn\'t saved to global helpers hash');
});

QUnit.test('Late-registered components can be rendered with template registered on the container', function () {

  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>hello world {{sally-rutherford}}-{{#sally-rutherford}}!!!{{/sally-rutherford}}</div>');

  boot(function () {
    registry.register('template:components/sally-rutherford', (0, _emberTemplateCompilerSystemCompile2['default'])('funkytowny{{yield}}'));
    registry.register('component:sally-rutherford', _emberMetalCore2['default'].Component);
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'hello world funkytowny-funkytowny!!!', 'The component is composed correctly');
  ok(!_emberHtmlbarsHelpers2['default']['sally-rutherford'], 'Component wasn\'t saved to global helpers hash');
});

QUnit.test('Late-registered components can be rendered with ONLY the template registered on the container', function () {

  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>hello world {{borf-snorlax}}-{{#borf-snorlax}}!!!{{/borf-snorlax}}</div>');

  boot(function () {
    registry.register('template:components/borf-snorlax', (0, _emberTemplateCompilerSystemCompile2['default'])('goodfreakingTIMES{{yield}}'));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'hello world goodfreakingTIMES-goodfreakingTIMES!!!', 'The component is composed correctly');
  ok(!_emberHtmlbarsHelpers2['default']['borf-snorlax'], 'Component wasn\'t saved to global helpers hash');
});

QUnit.test('Component-like invocations are treated as bound paths if neither template nor component are registered on the container', function () {

  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{user-name}} hello {{api-key}} world</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'user-name': 'machty'
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'machty hello  world', 'The component is composed correctly');
});

QUnit.test('Assigning templateName to a component should setup the template as a layout (DEPRECATED)', function () {
  expect(2);

  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{#my-component}}{{text}}{{/my-component}}</div>');
  _emberMetalCore2['default'].TEMPLATES['foo-bar-baz'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{text}}-{{yield}}');

  expectDeprecation(/Do not specify templateName on a Component/);

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      text: 'inner',
      templateName: 'foo-bar-baz'
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'inner-outer', 'The component is composed correctly');
});

QUnit.test('Assigning templateName and layoutName should use the templates specified [DEPRECATED]', function () {
  expect(2);
  expectDeprecation(/Using deprecated `template` property on a Component/);

  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{my-component}}</div>');
  _emberMetalCore2['default'].TEMPLATES['foo'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{text}}');
  _emberMetalCore2['default'].TEMPLATES['bar'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{text}}-{{yield}}');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      text: 'inner',
      layoutName: 'bar',
      templateName: 'foo'
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'inner-outer', 'The component is composed correctly');
});

QUnit.test('Using name of component that does not exist', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{#no-good}} {{/no-good}}</div>');

  expectAssertion(function () {
    boot();
  }, /A helper named 'no-good' could not be found/);
});

QUnit.module('Application Lifecycle - Component Context', {
  setup: prepare,
  teardown: cleanup
});

QUnit.test('Components with a block should have the proper content when a template is provided', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{#my-component}}{{text}}{{/my-component}}</div>');
  _emberMetalCore2['default'].TEMPLATES['components/my-component'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{text}}-{{yield}}');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      text: 'inner'
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'inner-outer', 'The component is composed correctly');
});

QUnit.test('Components with a block should yield the proper content without a template provided', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{#my-component}}{{text}}{{/my-component}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      text: 'inner'
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'outer', 'The component is composed correctly');
});

QUnit.test('Components without a block should have the proper content when a template is provided', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{my-component}}</div>');
  _emberMetalCore2['default'].TEMPLATES['components/my-component'] = (0, _emberTemplateCompilerSystemCompile2['default'])('{{text}}');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      text: 'inner'
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'inner', 'The component is composed correctly');
});

QUnit.test('Components without a block should have the proper content', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{my-component}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      didInsertElement: function didInsertElement() {
        this.$().html('Some text inserted by jQuery');
      }
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'Some text inserted by jQuery', 'The component is composed correctly');
});

// The test following this one is the non-deprecated version
QUnit.test('properties of a component without a template should not collide with internal structures [DEPRECATED]', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{my-component data=foo}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer',
      'foo': 'Some text inserted by jQuery'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      didInsertElement: function didInsertElement() {
        this.$().html(this.get('data'));
      }
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'Some text inserted by jQuery', 'The component is composed correctly');
});

QUnit.test('attrs property of a component without a template should not collide with internal structures', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{my-component attrs=foo}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      'text': 'outer',
      'foo': 'Some text inserted by jQuery'
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      didInsertElement: function didInsertElement() {
        // FIXME: I'm unsure if this is even the right way to access attrs
        this.$().html(this.get('attrs.attrs.value'));
      }
    }));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'Some text inserted by jQuery', 'The component is composed correctly');
});

QUnit.test('Components trigger actions in the parents context when called from within a block', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{#my-component}}<a href=\'#\' id=\'fizzbuzz\' {{action \'fizzbuzz\'}}>Fizzbuzz</a>{{/my-component}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      actions: {
        fizzbuzz: function fizzbuzz() {
          ok(true, 'action triggered on parent');
        }
      }
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend());
  });

  _emberMetalCore2['default'].run(function () {
    _emberMetalCore2['default'].$('#fizzbuzz', '#wrapper').click();
  });
});

QUnit.test('Components trigger actions in the components context when called from within its template', function () {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('<div id=\'wrapper\'>{{#my-component}}{{text}}{{/my-component}}</div>');
  _emberMetalCore2['default'].TEMPLATES['components/my-component'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<a href=\'#\' id=\'fizzbuzz\' {{action \'fizzbuzz\'}}>Fizzbuzz</a>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      actions: {
        fizzbuzz: function fizzbuzz() {
          ok(false, 'action triggered on the wrong context');
        }
      }
    }));

    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      actions: {
        fizzbuzz: function fizzbuzz() {
          ok(true, 'action triggered on component');
        }
      }
    }));
  });

  _emberMetalCore2['default'].$('#fizzbuzz', '#wrapper').click();
});

QUnit.test('Components receive the top-level view as their ownerView', function (assert) {
  _emberMetalCore2['default'].TEMPLATES.application = (0, _emberTemplateCompilerSystemCompile2['default'])('{{outlet}}');
  _emberMetalCore2['default'].TEMPLATES.index = (0, _emberTemplateCompilerSystemCompile2['default'])('{{my-component}}');
  _emberMetalCore2['default'].TEMPLATES['components/my-component'] = (0, _emberTemplateCompilerSystemCompile2['default'])('<div></div>');

  var component = undefined;

  boot(function () {
    registry.register('component:my-component', _emberMetalCore2['default'].Component.extend({
      init: function init() {
        this._super();
        component = this;
      }
    }));
  });

  // Theses tests are intended to catch a regression where the owner view was
  // not configured properly. Future refactors may break these tests, which
  // should not be considered a breaking change to public APIs.
  var ownerView = component.ownerView;
  assert.ok(ownerView, 'owner view was set');
  assert.ok(ownerView instanceof _emberRoutingViewsViewsOutlet.OutletView, 'owner view has no parent view');
  assert.notStrictEqual(component, ownerView, 'owner view is not itself');

  assert.ok(ownerView._outlets, 'owner view has an internal array of outlets');
});