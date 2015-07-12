'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberRuntimeUtils = require('ember-runtime/utils');

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/**
@module ember
@submodule ember-extension-support
*/

/**
  The `ContainerDebugAdapter` helps the container and resolver interface
  with tools that debug Ember such as the
  [Ember Extension](https://github.com/tildeio/ember-extension)
  for Chrome and Firefox.

  This class can be extended by a custom resolver implementer
  to override some of the methods with library-specific code.

  The methods likely to be overridden are:

  * `canCatalogEntriesByType`
  * `catalogEntriesByType`

  The adapter will need to be registered
  in the application's container as `container-debug-adapter:main`

  Example:

  ```javascript
  Application.initializer({
    name: "containerDebugAdapter",

    initialize: function(container, application) {
      application.register('container-debug-adapter:main', require('app/container-debug-adapter'));
    }
  });
  ```

  @class ContainerDebugAdapter
  @namespace Ember
  @extends Ember.Object
  @since 1.5.0
  @public
*/
exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  /**
    The container of the application being debugged.
    This property will be injected
    on creation.
      @property container
    @default null
    @public
  */
  container: null,

  /**
    The resolver instance of the application
    being debugged. This property will be injected
    on creation.
      @property resolver
    @default null
    @public
  */
  resolver: null,

  /**
    Returns true if it is possible to catalog a list of available
    classes in the resolver for a given type.
      @method canCatalogEntriesByType
    @param {String} type The type. e.g. "model", "controller", "route"
    @return {boolean} whether a list is available for this type.
    @public
  */
  canCatalogEntriesByType: function canCatalogEntriesByType(type) {
    if (type === 'model' || type === 'template') {
      return false;
    }

    return true;
  },

  /**
    Returns the available classes a given type.
      @method catalogEntriesByType
    @param {String} type The type. e.g. "model", "controller", "route"
    @return {Array} An array of strings.
    @public
  */
  catalogEntriesByType: function catalogEntriesByType(type) {
    var namespaces = (0, _emberRuntimeSystemNative_array.A)(_emberRuntimeSystemNamespace2['default'].NAMESPACES);
    var types = (0, _emberRuntimeSystemNative_array.A)();
    var typeSuffixRegex = new RegExp((0, _emberRuntimeSystemString.classify)(type) + '$');

    namespaces.forEach(function (namespace) {
      if (namespace !== _emberMetalCore2['default']) {
        for (var key in namespace) {
          if (!namespace.hasOwnProperty(key)) {
            continue;
          }
          if (typeSuffixRegex.test(key)) {
            var klass = namespace[key];
            if ((0, _emberRuntimeUtils.typeOf)(klass) === 'class') {
              types.push((0, _emberRuntimeSystemString.dasherize)(key.replace(typeSuffixRegex, '')));
            }
          }
        }
      }
    });
    return types;
  }
});
module.exports = exports['default'];