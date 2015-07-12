/*globals Handlebars */

/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberViewsComponent_lookup = require('ember-views/component_lookup');

var _emberViewsComponent_lookup2 = _interopRequireDefault(_emberViewsComponent_lookup);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

/**
@module ember
@submodule ember-handlebars
*/

/**
  Find templates stored in the head tag as script tags and make them available
  to `Ember.CoreView` in the global `Ember.TEMPLATES` object. This will be run
  as as jQuery DOM-ready callback.

  Script tags with `text/x-handlebars` will be compiled
  with Ember's Handlebars and are suitable for use as a view's template.
  Those with type `text/x-raw-handlebars` will be compiled with regular
  Handlebars and are suitable for use in views' computed properties.

  @private
  @method bootstrap
  @for Ember.Handlebars
  @static
  @param ctx
*/
function bootstrap(ctx) {
  var selectors = 'script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';

  (0, _emberViewsSystemJquery2['default'])(selectors, ctx).each(function () {
    // Get a reference to the script tag
    var script = (0, _emberViewsSystemJquery2['default'])(this);

    // Get the name of the script, used by Ember.View's templateName property.
    // First look for data-template-name attribute, then fall back to its
    // id if no name is found.
    var templateName = script.attr('data-template-name') || script.attr('id') || 'application';
    var template, compile;

    if (script.attr('type') === 'text/x-raw-handlebars') {
      compile = _emberViewsSystemJquery2['default'].proxy(Handlebars.compile, Handlebars);
      template = compile(script.html());
    } else {
      template = (0, _emberTemplateCompilerSystemCompile2['default'])(script.html(), {
        moduleName: templateName
      });
    }

    // Check if template of same name already exists
    if (_emberMetalCore2['default'].TEMPLATES[templateName] !== undefined) {
      throw new _emberMetalError2['default']('Template named "' + templateName + '" already exists.');
    }

    // For templates which have a name, we save them and then remove them from the DOM
    _emberMetalCore2['default'].TEMPLATES[templateName] = template;

    // Remove script tag from DOM
    script.remove();
  });
}

function _bootstrap() {
  bootstrap((0, _emberViewsSystemJquery2['default'])(document));
}

function registerComponentLookup(app) {
  app.registry.register('component-lookup:main', _emberViewsComponent_lookup2['default']);
}

/*
  We tie this to application.load to ensure that we've at least
  attempted to bootstrap at the point that the application is loaded.

  We also tie this to document ready since we're guaranteed that all
  the inline templates are present at this point.

  There's no harm to running this twice, since we remove the templates
  from the DOM after processing.
*/

(0, _emberRuntimeSystemLazy_load.onLoad)('Ember.Application', function (Application) {
  Application.initializer({
    name: 'domTemplates',
    initialize: _emberMetalEnvironment2['default'].hasDOM ? _bootstrap : function () {}
  });

  Application.instanceInitializer({
    name: 'registerComponentLookup',
    initialize: registerComponentLookup
  });
});

exports['default'] = bootstrap;
module.exports = exports['default'];