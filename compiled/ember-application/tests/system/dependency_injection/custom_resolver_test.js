'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberApplicationSystemResolver = require('ember-application/system/resolver');

var _emberApplicationSystemResolver2 = _interopRequireDefault(_emberApplicationSystemResolver);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var application;

QUnit.module('Ember.Application Dependency Injection – customResolver', {
  setup: function setup() {
    var fallbackTemplate = (0, _emberTemplateCompilerSystemCompile2['default'])('<h1>Fallback</h1>');

    var Resolver = _emberApplicationSystemResolver2['default'].extend({
      resolveTemplate: function resolveTemplate(resolvable) {
        var resolvedTemplate = this._super(resolvable);
        if (resolvedTemplate) {
          return resolvedTemplate;
        }
        if (resolvable.fullNameWithoutType === 'application') {
          return fallbackTemplate;
        } else {
          return;
        }
      }
    });

    application = (0, _emberMetalRun_loop2['default'])(function () {
      return _emberApplicationSystemApplication2['default'].create({
        Resolver: Resolver,
        rootElement: '#qunit-fixture'

      });
    });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(application, 'destroy');
  }
});

QUnit.test('a resolver can be supplied to application', function () {
  equal((0, _emberViewsSystemJquery2['default'])('h1', application.rootElement).text(), 'Fallback');
});