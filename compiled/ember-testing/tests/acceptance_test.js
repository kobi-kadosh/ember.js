'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberTestingTest = require('ember-testing/test');

var _emberTestingTest2 = _interopRequireDefault(_emberTestingTest);

var _emberTestingAdaptersQunit = require('ember-testing/adapters/qunit');

var _emberTestingAdaptersQunit2 = _interopRequireDefault(_emberTestingAdaptersQunit);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

require('ember-testing/initializers');

// ensure the initializer is setup

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberRuntimeExtRsvp = require('ember-runtime/ext/rsvp');

var _emberRuntimeExtRsvp2 = _interopRequireDefault(_emberRuntimeExtRsvp);

//ES6TODO: we need {{link-to}}  and {{outlet}} to exist here

require('ember-routing');

//ES6TODO: fixme?

var App, find, click, fillIn, currentRoute, currentURL, visit, originalAdapter, andThen, indexHitCount;

QUnit.module('ember-testing Acceptance', {
  setup: function setup() {
    (0, _emberViewsSystemJquery2['default'])('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
    (0, _emberViewsSystemJquery2['default'])('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');
    (0, _emberMetalRun_loop2['default'])(function () {
      indexHitCount = 0;

      App = _emberApplicationSystemApplication2['default'].create({
        rootElement: '#ember-testing'
      });

      App.Router.map(function () {
        this.route('posts');
        this.route('comments');

        this.route('abort_transition');

        this.route('redirect');
      });

      App.IndexRoute = _emberRoutingSystemRoute2['default'].extend({
        model: function model() {
          indexHitCount += 1;
        }
      });

      App.PostsRoute = _emberRoutingSystemRoute2['default'].extend({
        renderTemplate: function renderTemplate() {
          currentRoute = 'posts';
          this._super.apply(this, arguments);
        }
      });

      App.PostsView = _emberViewsViewsView2['default'].extend({
        defaultTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<a class="dummy-link"></a><div id="comments-link">{{#link-to \'comments\'}}Comments{{/link-to}}</div>'),
        classNames: ['posts-view']
      });

      App.CommentsRoute = _emberRoutingSystemRoute2['default'].extend({
        renderTemplate: function renderTemplate() {
          currentRoute = 'comments';
          this._super.apply(this, arguments);
        }
      });

      App.CommentsView = _emberViewsViewsView2['default'].extend({
        defaultTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('{{input type="text"}}')
      });

      App.AbortTransitionRoute = _emberRoutingSystemRoute2['default'].extend({
        beforeModel: function beforeModel(transition) {
          transition.abort();
        }
      });

      App.RedirectRoute = _emberRoutingSystemRoute2['default'].extend({
        beforeModel: function beforeModel() {
          this.transitionTo('comments');
        }
      });

      App.setupForTesting();
    });

    _emberTestingTest2['default'].registerAsyncHelper('slowHelper', function () {
      return new _emberRuntimeExtRsvp2['default'].Promise(function (resolve) {
        setTimeout(resolve, 10);
      });
    });

    App.injectTestHelpers();

    find = window.find;
    click = window.click;
    fillIn = window.fillIn;
    visit = window.visit;
    andThen = window.andThen;
    currentURL = window.currentURL;

    originalAdapter = _emberTestingTest2['default'].adapter;
  },

  teardown: function teardown() {
    App.removeTestHelpers();
    _emberTestingTest2['default'].unregisterHelper('slowHelper');
    (0, _emberViewsSystemJquery2['default'])('#ember-testing-container, #ember-testing').remove();
    (0, _emberMetalRun_loop2['default'])(App, App.destroy);
    App = null;
    _emberTestingTest2['default'].adapter = originalAdapter;
    indexHitCount = 0;
  }
});

QUnit.test('helpers can be chained with then', function () {
  expect(6);

  currentRoute = 'index';

  visit('/posts').then(function () {
    equal(currentRoute, 'posts', 'Successfully visited posts route');
    equal(currentURL(), '/posts', 'posts URL is correct');
    return click('a:contains("Comments")');
  }).then(function () {
    equal(currentRoute, 'comments', 'visit chained with click');
    return fillIn('.ember-text-field', 'yeah');
  }).then(function () {
    equal((0, _emberViewsSystemJquery2['default'])('.ember-text-field').val(), 'yeah', 'chained with fillIn');
    return fillIn('.ember-text-field', '#ember-testing-container', 'context working');
  }).then(function () {
    equal((0, _emberViewsSystemJquery2['default'])('.ember-text-field').val(), 'context working', 'chained with fillIn');
    return click('.does-not-exist');
  }).then(null, function (e) {
    equal(e.message, 'Element .does-not-exist not found.', 'Non-existent click exception caught');
  });
});

// Keep this for backwards compatibility

QUnit.test('helpers can be chained to each other', function () {
  expect(7);

  currentRoute = 'index';

  visit('/posts').click('a:first', '#comments-link').fillIn('.ember-text-field', 'hello').then(function () {
    equal(currentRoute, 'comments', 'Successfully visited comments route');
    equal(currentURL(), '/comments', 'Comments URL is correct');
    equal((0, _emberViewsSystemJquery2['default'])('.ember-text-field').val(), 'hello', 'Fillin successfully works');
    find('.ember-text-field').one('keypress', function (e) {
      equal(e.keyCode, 13, 'keyevent chained with correct keyCode.');
      equal(e.which, 13, 'keyevent chained with correct which.');
    });
  }).keyEvent('.ember-text-field', 'keypress', 13).visit('/posts').then(function () {
    equal(currentRoute, 'posts', 'Thens can also be chained to helpers');
    equal(currentURL(), '/posts', 'URL is set correct on chained helpers');
  });
});

QUnit.test('helpers don\'t need to be chained', function () {
  expect(5);

  currentRoute = 'index';

  visit('/posts');

  click('a:first', '#comments-link');

  fillIn('.ember-text-field', 'hello');

  andThen(function () {
    equal(currentRoute, 'comments', 'Successfully visited comments route');
    equal(currentURL(), '/comments', 'Comments URL is correct');
    equal(find('.ember-text-field').val(), 'hello', 'Fillin successfully works');
  });

  visit('/posts');

  andThen(function () {
    equal(currentRoute, 'posts');
    equal(currentURL(), '/posts');
  });
});

QUnit.test('Nested async helpers', function () {
  expect(5);

  currentRoute = 'index';

  visit('/posts');

  andThen(function () {
    click('a:first', '#comments-link');

    fillIn('.ember-text-field', 'hello');
  });

  andThen(function () {
    equal(currentRoute, 'comments', 'Successfully visited comments route');
    equal(currentURL(), '/comments', 'Comments URL is correct');
    equal(find('.ember-text-field').val(), 'hello', 'Fillin successfully works');
  });

  visit('/posts');

  andThen(function () {
    equal(currentRoute, 'posts');
    equal(currentURL(), '/posts');
  });
});

QUnit.test('Multiple nested async helpers', function () {
  expect(3);

  visit('/posts');

  andThen(function () {
    click('a:first', '#comments-link');

    fillIn('.ember-text-field', 'hello');
    fillIn('.ember-text-field', 'goodbye');
  });

  andThen(function () {
    equal(find('.ember-text-field').val(), 'goodbye', 'Fillin successfully works');
    equal(currentRoute, 'comments', 'Successfully visited comments route');
    equal(currentURL(), '/comments', 'Comments URL is correct');
  });
});

QUnit.test('Helpers nested in thens', function () {
  expect(5);

  currentRoute = 'index';

  visit('/posts').then(function () {
    click('a:first', '#comments-link');
  });

  andThen(function () {
    fillIn('.ember-text-field', 'hello');
  });

  andThen(function () {
    equal(currentRoute, 'comments', 'Successfully visited comments route');
    equal(currentURL(), '/comments', 'Comments URL is correct');
    equal(find('.ember-text-field').val(), 'hello', 'Fillin successfully works');
  });

  visit('/posts');

  andThen(function () {
    equal(currentRoute, 'posts');
    equal(currentURL(), '/posts', 'Posts URL is correct');
  });
});

QUnit.test('Aborted transitions are not logged via Ember.Test.adapter#exception', function () {
  expect(0);

  _emberTestingTest2['default'].adapter = _emberTestingAdaptersQunit2['default'].create({
    exception: function exception(error) {
      ok(false, 'aborted transitions are not logged');
    }
  });

  visit('/abort_transition');
});

QUnit.test('Unhandled exceptions are logged via Ember.Test.adapter#exception', function () {
  expect(2);

  var asyncHandled;
  _emberTestingTest2['default'].adapter = _emberTestingAdaptersQunit2['default'].create({
    exception: function exception(error) {
      equal(error.message, 'Element .does-not-exist not found.', 'Exception successfully caught and passed to Ember.Test.adapter.exception');
      asyncHandled['catch'](function () {}); // handle the rejection so it doesn't leak later.
    }
  });

  visit('/posts');

  click('.invalid-element').then(null, function (error) {
    equal(error.message, 'Element .invalid-element not found.', 'Exception successfully handled in the rejection handler');
  });

  asyncHandled = click('.does-not-exist');
});

QUnit.test('Unhandled exceptions in `andThen` are logged via Ember.Test.adapter#exception', function () {
  expect(1);

  _emberTestingTest2['default'].adapter = _emberTestingAdaptersQunit2['default'].create({
    exception: function exception(error) {
      equal(error.message, 'Catch me', 'Exception successfully caught and passed to Ember.Test.adapter.exception');
    }
  });

  visit('/posts');

  andThen(function () {
    throw new Error('Catch me');
  });
});

QUnit.test('should not start routing on the root URL when visiting another', function () {
  expect(4);

  visit('/posts');

  andThen(function () {
    ok(find('#comments-link'), 'found comments-link');
    equal(currentRoute, 'posts', 'Successfully visited posts route');
    equal(currentURL(), '/posts', 'Posts URL is correct');
    equal(indexHitCount, 0, 'should not hit index route when visiting another route');
  });
});

QUnit.test('only enters the index route once when visiting /', function () {
  expect(1);

  visit('/');

  andThen(function () {
    equal(indexHitCount, 1, 'should hit index once when visiting /');
  });
});

QUnit.test('test must not finish while asyncHelpers are pending', function () {
  expect(2);

  var async = 0;
  var innerRan = false;

  _emberTestingTest2['default'].adapter = _emberTestingAdaptersQunit2['default'].extend({
    asyncStart: function asyncStart() {
      async++;
      this._super();
    },
    asyncEnd: function asyncEnd() {
      async--;
      this._super();
    }
  }).create();

  App.testHelpers.slowHelper();
  andThen(function () {
    innerRan = true;
  });

  equal(innerRan, false, 'should not have run yet');
  ok(async > 0, 'should have told the adapter to pause');

  if (async === 0) {
    // If we failed the test, prevent zalgo from escaping and breaking
    // our other tests.
    _emberTestingTest2['default'].adapter.asyncStart();
    _emberTestingTest2['default'].resolve().then(function () {
      _emberTestingTest2['default'].adapter.asyncEnd();
    });
  }
});

QUnit.test('visiting a URL and then visiting a second URL with a transition should yield the correct URL', function () {
  expect(2);

  visit('/posts');

  andThen(function () {
    equal(currentURL(), '/posts', 'First visited URL is correct');
  });

  visit('/redirect');

  andThen(function () {
    equal(currentURL(), '/comments', 'Redirected to Comments URL');
  });
});