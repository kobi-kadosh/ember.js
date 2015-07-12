'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsSystemBootstrap = require('ember-htmlbars/system/bootstrap');

var _emberHtmlbarsSystemBootstrap2 = _interopRequireDefault(_emberHtmlbarsSystemBootstrap);

var trim = _emberViewsSystemJquery2['default'].trim;

var originalLookup = _emberMetalCore2['default'].lookup;
var lookup, App, view;

QUnit.module('ember-htmlbars: bootstrap', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
  },
  teardown: function teardown() {
    _emberMetalCore2['default'].TEMPLATES = {};
    _emberMetalCore2['default'].lookup = originalLookup;
    (0, _emberRuntimeTestsUtils.runDestroy)(App);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

function checkTemplate(templateName) {
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
  });
  var template = _emberMetalCore2['default'].TEMPLATES[templateName];
  ok(template, 'template is available on Ember.TEMPLATES');
  equal((0, _emberViewsSystemJquery2['default'])('#qunit-fixture script').length, 0, 'script removed');
  var view = _emberViewsViewsView2['default'].create({
    template: template,
    context: {
      firstName: 'Tobias',
      drug: 'teamocil'
    }
  });
  (0, _emberMetalRun_loop2['default'])(function () {
    view.createElement();
  });
  equal(trim(view.$().text()), 'Tobias takes teamocil', 'template works');
  (0, _emberRuntimeTestsUtils.runDestroy)(view);
}

QUnit.test('template with data-template-name should add a new template to Ember.TEMPLATES', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars" data-template-name="funkyTemplate">{{firstName}} takes {{drug}}</script>');

  checkTemplate('funkyTemplate');
});

QUnit.test('template with id instead of data-template-name should add a new template to Ember.TEMPLATES', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars" id="funkyTemplate" >{{firstName}} takes {{drug}}</script>');

  checkTemplate('funkyTemplate');
});

QUnit.test('template without data-template-name or id should default to application', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars">{{firstName}} takes {{drug}}</script>');

  checkTemplate('application');
});

if (typeof Handlebars === 'object') {
  QUnit.test('template with type text/x-raw-handlebars should be parsed', function () {
    (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-raw-handlebars" data-template-name="funkyTemplate">{{name}}</script>');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
    });

    ok(_emberMetalCore2['default'].TEMPLATES['funkyTemplate'], 'template with name funkyTemplate available');

    // This won't even work with Ember templates
    equal(trim(_emberMetalCore2['default'].TEMPLATES['funkyTemplate']({ name: 'Tobias' })), 'Tobias');
  });
}

QUnit.test('duplicated default application templates should throw exception', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars">first</script><script type="text/x-handlebars">second</script>');

  throws(function () {
    (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
  }, /Template named "[^"]+" already exists\./, 'duplicate templates should not be allowed');
});

QUnit.test('default application template and id application template present should throw exception', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars">first</script><script type="text/x-handlebars" id="application">second</script>');

  throws(function () {
    (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
  }, /Template named "[^"]+" already exists\./, 'duplicate templates should not be allowed');
});

QUnit.test('default application template and data-template-name application template present should throw exception', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars">first</script><script type="text/x-handlebars" data-template-name="application">second</script>');

  throws(function () {
    (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
  }, /Template named "[^"]+" already exists\./, 'duplicate templates should not be allowed');
});

QUnit.test('duplicated template id should throw exception', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars" id="funkyTemplate">first</script><script type="text/x-handlebars" id="funkyTemplate">second</script>');

  throws(function () {
    (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
  }, /Template named "[^"]+" already exists\./, 'duplicate templates should not be allowed');
});

QUnit.test('duplicated template data-template-name should throw exception', function () {
  (0, _emberViewsSystemJquery2['default'])('#qunit-fixture').html('<script type="text/x-handlebars" data-template-name="funkyTemplate">first</script><script type="text/x-handlebars" data-template-name="funkyTemplate">second</script>');

  throws(function () {
    (0, _emberHtmlbarsSystemBootstrap2['default'])((0, _emberViewsSystemJquery2['default'])('#qunit-fixture'));
  }, /Template named "[^"]+" already exists\./, 'duplicate templates should not be allowed');
});

if (_emberMetalCore2['default'].component) {
  QUnit.test('registerComponents initializer', function () {
    _emberMetalCore2['default'].TEMPLATES['components/x-apple'] = 'asdf';

    App = (0, _emberMetalRun_loop2['default'])(_emberMetalCore2['default'].Application, 'create');

    ok(_emberMetalCore2['default'].Handlebars.helpers['x-apple'], 'x-apple helper is present');
    ok(App.__container__.has('component:x-apple'), 'the container is aware of x-apple');
  });

  QUnit.test('registerComponents and generated components', function () {
    _emberMetalCore2['default'].TEMPLATES['components/x-apple'] = 'asdf';

    App = (0, _emberMetalRun_loop2['default'])(_emberMetalCore2['default'].Application, 'create');
    view = App.__container__.lookup('component:x-apple');
    equal(view.get('layoutName'), 'components/x-apple', 'has correct layout name');
  });

  QUnit.test('registerComponents and non-generated components', function () {
    _emberMetalCore2['default'].TEMPLATES['components/x-apple'] = 'asdf';

    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberMetalCore2['default'].Application.create();

      // currently Component code must be loaded before initializers
      // this is mostly due to how they are bootstrapped. We will hopefully
      // sort this out soon.
      App.XAppleComponent = _emberMetalCore2['default'].Component.extend({
        isCorrect: true
      });
    });

    view = App.__container__.lookup('component:x-apple');
    equal(view.get('layoutName'), 'components/x-apple', 'has correct layout name');
    ok(view.get('isCorrect'), 'ensure a non-generated component');
  });
}