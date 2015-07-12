'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('ember');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberHtmlbarsCompat = require('ember-htmlbars/compat');

var _emberHtmlbarsCompat2 = _interopRequireDefault(_emberHtmlbarsCompat);

var _emberHtmlbarsCompatHelper = require('ember-htmlbars/compat/helper');

var _emberHtmlbarsCompatHelper2 = _interopRequireDefault(_emberHtmlbarsCompatHelper);

var _emberHtmlbarsHelper = require('ember-htmlbars/helper');

var _emberHtmlbarsHelper2 = _interopRequireDefault(_emberHtmlbarsHelper);

var compile, helpers, makeBoundHelper;
compile = _emberHtmlbarsCompat2['default'].compile;
helpers = _emberHtmlbarsCompat2['default'].helpers;
makeBoundHelper = _emberHtmlbarsCompat2['default'].makeBoundHelper;
var makeViewHelper = _emberHtmlbarsCompat2['default'].makeViewHelper;

var App, registry, container;

function reverseHelper(value) {
  return arguments.length > 1 ? value.split('').reverse().join('') : '--';
}

QUnit.module('Application Lifecycle - Helper Registration', {
  teardown: function teardown() {
    _emberMetalCore2['default'].run(function () {
      if (App) {
        App.destroy();
      }

      App = null;
      _emberMetalCore2['default'].TEMPLATES = {};
    });
  }
});

var boot = function boot(callback) {
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
    router.handleURL('/');
  });
};

QUnit.test('Unbound dashed helpers registered on the container can be late-invoked', function () {
  _emberMetalCore2['default'].TEMPLATES.application = compile('<div id=\'wrapper\'>{{x-borf}} {{x-borf \'YES\'}}</div>');
  var helper = new _emberHtmlbarsCompatHelper2['default'](function (val) {
    return arguments.length > 1 ? val : 'BORF';
  });

  boot(function () {
    registry.register('helper:x-borf', helper);
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'BORF YES', 'The helper was invoked from the container');
  ok(!helpers['x-borf'], 'Container-registered helper doesn\'t wind up on global helpers hash');
});

// need to make `makeBoundHelper` for HTMLBars
QUnit.test('Bound helpers registered on the container can be late-invoked', function () {
  _emberMetalCore2['default'].TEMPLATES.application = compile('<div id=\'wrapper\'>{{x-reverse}} {{x-reverse foo}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      foo: 'alex'
    }));
    registry.register('helper:x-reverse', makeBoundHelper(reverseHelper));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), '-- xela', 'The bound helper was invoked from the container');
  ok(!helpers['x-reverse'], 'Container-registered helper doesn\'t wind up on global helpers hash');
});

QUnit.test('Bound `makeViewHelper` helpers registered on the container can be used', function () {
  _emberMetalCore2['default'].TEMPLATES.application = compile('<div id=\'wrapper\'>{{x-foo}} {{x-foo name=foo}}</div>');

  boot(function () {
    registry.register('controller:application', _emberMetalCore2['default'].Controller.extend({
      foo: 'alex'
    }));

    registry.register('helper:x-foo', makeViewHelper(_emberMetalCore2['default'].Component.extend({
      layout: compile('woot!!{{attrs.name}}')
    })));
  });

  equal(_emberMetalCore2['default'].$('#wrapper').text(), 'woot!! woot!!alex', 'The helper was invoked from the container');
});

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-dashless-helpers')) {
  QUnit.test('Undashed helpers registered on the container can be invoked', function () {
    _emberMetalCore2['default'].TEMPLATES.application = compile('<div id=\'wrapper\'>{{omg}}|{{yorp \'boo\'}}|{{yorp \'ya\'}}</div>');

    expectDeprecation(function () {
      boot(function () {
        registry.register('helper:omg', function (_ref) {
          var _ref2 = _slicedToArray(_ref, 1);

          var value = _ref2[0];

          return 'OMG';
        });

        registry.register('helper:yorp', makeBoundHelper(function (value) {
          return value;
        }));
      }, /Please use Ember.Helper.build to wrap helper functions./);
    });

    equal(_emberMetalCore2['default'].$('#wrapper').text(), 'OMG|boo|ya', 'The helper was invoked from the container');
  });
} else {
  QUnit.test('Undashed helpers registered on the container can not (presently) be invoked', function () {

    // Note: the reason we're not allowing undashed helpers is to avoid
    // a possible perf hit in hot code paths, i.e. _triageMustache.
    // We only presently perform container lookups if prop.indexOf('-') >= 0

    _emberMetalCore2['default'].TEMPLATES.application = compile('<div id=\'wrapper\'>{{omg}}|{{omg \'GRRR\'}}|{{yorp}}|{{yorp \'ahh\'}}</div>');

    expectAssertion(function () {
      boot(function () {
        registry.register('helper:omg', function () {
          return 'OMG';
        });
        registry.register('helper:yorp', makeBoundHelper(function () {
          return 'YORP';
        }));
      });
    }, /A helper named 'omg' could not be found/);
  });
}

QUnit.test('Helpers can receive injections', function () {
  _emberMetalCore2['default'].TEMPLATES.application = compile('<div id=\'wrapper\'>{{full-name}}</div>');

  var serviceCalled = false;
  boot(function () {
    registry.register('service:name-builder', _emberMetalCore2['default'].Service.extend({
      build: function build() {
        serviceCalled = true;
      }
    }));
    registry.register('helper:full-name', _emberHtmlbarsHelper2['default'].extend({
      nameBuilder: _emberMetalCore2['default'].inject.service('name-builder'),
      compute: function compute() {
        this.get('nameBuilder').build();
      }
    }));
  });

  ok(serviceCalled, 'service was injected, method called');
});