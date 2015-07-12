/**
@module ember
@submodule ember-application
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.TEMPLATES, Ember.assert

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberApplicationUtilsValidateType = require('ember-application/utils/validate-type');

var _emberApplicationUtilsValidateType2 = _interopRequireDefault(_emberApplicationUtilsValidateType);

var _emberMetalDictionary = require('ember-metal/dictionary');

var _emberMetalDictionary2 = _interopRequireDefault(_emberMetalDictionary);

var Resolver = _emberRuntimeSystemObject2['default'].extend({
  /*
    This will be set to the Application instance when it is
    created.
      @property namespace
  */
  namespace: null,
  normalize: null, // required
  resolve: null, // required
  parseName: null, // required
  lookupDescription: null, // required
  makeToString: null, // required
  resolveOther: null, // required
  _logLookup: null // required
});

exports.Resolver = Resolver;
/**
  The DefaultResolver defines the default lookup rules to resolve
  container lookups before consulting the container for registered
  items:

  * templates are looked up on `Ember.TEMPLATES`
  * other names are looked up on the application after converting
    the name. For example, `controller:post` looks up
    `App.PostController` by default.
  * there are some nuances (see examples below)

  ### How Resolving Works

  The container calls this object's `resolve` method with the
  `fullName` argument.

  It first parses the fullName into an object using `parseName`.

  Then it checks for the presence of a type-specific instance
  method of the form `resolve[Type]` and calls it if it exists.
  For example if it was resolving 'template:post', it would call
  the `resolveTemplate` method.

  Its last resort is to call the `resolveOther` method.

  The methods of this object are designed to be easy to override
  in a subclass. For example, you could enhance how a template
  is resolved like so:

  ```javascript
  App = Ember.Application.create({
    Resolver: Ember.DefaultResolver.extend({
      resolveTemplate: function(parsedName) {
        var resolvedTemplate = this._super(parsedName);
        if (resolvedTemplate) { return resolvedTemplate; }
        return Ember.TEMPLATES['not_found'];
      }
    })
  });
  ```

  Some examples of how names are resolved:

  ```
  'template:post'           //=> Ember.TEMPLATES['post']
  'template:posts/byline'   //=> Ember.TEMPLATES['posts/byline']
  'template:posts.byline'   //=> Ember.TEMPLATES['posts/byline']
  'template:blogPost'       //=> Ember.TEMPLATES['blogPost']
                            //   OR
                            //   Ember.TEMPLATES['blog_post']
  'controller:post'         //=> App.PostController
  'controller:posts.index'  //=> App.PostsIndexController
  'controller:blog/post'    //=> Blog.PostController
  'controller:basic'        //=> Ember.Controller
  'route:post'              //=> App.PostRoute
  'route:posts.index'       //=> App.PostsIndexRoute
  'route:blog/post'         //=> Blog.PostRoute
  'route:basic'             //=> Ember.Route
  'view:post'               //=> App.PostView
  'view:posts.index'        //=> App.PostsIndexView
  'view:blog/post'          //=> Blog.PostView
  'view:basic'              //=> Ember.View
  'foo:post'                //=> App.PostFoo
  'model:post'              //=> App.Post
  ```

  @class DefaultResolver
  @namespace Ember
  @extends Ember.Object
  @public
*/

exports['default'] = _emberRuntimeSystemObject2['default'].extend({
  /**
    This will be set to the Application instance when it is
    created.
      @property namespace
    @public
  */
  namespace: null,

  init: function init() {
    this._parseNameCache = (0, _emberMetalDictionary2['default'])(null);
  },
  normalize: function normalize(fullName) {
    var _fullName$split = fullName.split(':', 2);

    var _fullName$split2 = _slicedToArray(_fullName$split, 2);

    var type = _fullName$split2[0];
    var name = _fullName$split2[1];

    _emberMetalCore2['default'].assert('Tried to normalize a container name without a colon (:) in it.' + ' You probably tried to lookup a name that did not contain a type,' + ' a colon, and a name. A proper lookup name would be `view:post`.', fullName.split(':').length === 2);

    if (type !== 'template') {
      var result = name;

      if (result.indexOf('.') > -1) {
        result = result.replace(/\.(.)/g, function (m) {
          return m.charAt(1).toUpperCase();
        });
      }

      if (name.indexOf('_') > -1) {
        result = result.replace(/_(.)/g, function (m) {
          return m.charAt(1).toUpperCase();
        });
      }

      return type + ':' + result;
    } else {
      return fullName;
    }
  },

  /**
    This method is called via the container's resolver method.
    It parses the provided `fullName` and then looks up and
    returns the appropriate template or class.
      @method resolve
    @param {String} fullName the lookup string
    @return {Object} the resolved factory
    @public
  */
  resolve: function resolve(fullName) {
    var parsedName = this.parseName(fullName);
    var resolveMethodName = parsedName.resolveMethodName;
    var resolved;

    if (this[resolveMethodName]) {
      resolved = this[resolveMethodName](parsedName);
    }

    resolved = resolved || this.resolveOther(parsedName);

    if (parsedName.root && parsedName.root.LOG_RESOLVER) {
      this._logLookup(resolved, parsedName);
    }

    if (resolved) {
      (0, _emberApplicationUtilsValidateType2['default'])(resolved, parsedName);
    }

    return resolved;
  },

  /**
    Convert the string name of the form 'type:name' to
    a Javascript object with the parsed aspects of the name
    broken out.
      @protected
    @param {String} fullName the lookup string
    @method parseName
    @public
  */

  parseName: function parseName(fullName) {
    return this._parseNameCache[fullName] || (this._parseNameCache[fullName] = this._parseName(fullName));
  },

  _parseName: function _parseName(fullName) {
    var _fullName$split3 = fullName.split(':');

    var _fullName$split32 = _slicedToArray(_fullName$split3, 2);

    var type = _fullName$split32[0];
    var fullNameWithoutType = _fullName$split32[1];

    var name = fullNameWithoutType;
    var namespace = (0, _emberMetalProperty_get.get)(this, 'namespace');
    var root = namespace;

    if (type !== 'template' && name.indexOf('/') !== -1) {
      var parts = name.split('/');
      name = parts[parts.length - 1];
      var namespaceName = (0, _emberRuntimeSystemString.capitalize)(parts.slice(0, -1).join('.'));
      root = _emberRuntimeSystemNamespace2['default'].byName(namespaceName);

      _emberMetalCore2['default'].assert('You are looking for a ' + name + ' ' + type + ' in the ' + namespaceName + ' namespace, but the namespace could not be found', root);
    }

    var resolveMethodName = fullNameWithoutType === 'main' ? 'Main' : (0, _emberRuntimeSystemString.classify)(type);

    if (!(name && type)) {
      throw new TypeError('Invalid fullName: `' + fullName + '`, must be of the form `type:name` ');
    }

    return {
      fullName: fullName,
      type: type,
      fullNameWithoutType: fullNameWithoutType,
      name: name,
      root: root,
      resolveMethodName: 'resolve' + resolveMethodName
    };
  },

  /**
    Returns a human-readable description for a fullName. Used by the
    Application namespace in assertions to describe the
    precise name of the class that Ember is looking for, rather than
    container keys.
      @protected
    @param {String} fullName the lookup string
    @method lookupDescription
    @public
  */
  lookupDescription: function lookupDescription(fullName) {
    var parsedName = this.parseName(fullName);
    var description;

    if (parsedName.type === 'template') {
      return 'template at ' + parsedName.fullNameWithoutType.replace(/\./g, '/');
    }

    description = parsedName.root + '.' + (0, _emberRuntimeSystemString.classify)(parsedName.name).replace(/\./g, '');

    if (parsedName.type !== 'model') {
      description += (0, _emberRuntimeSystemString.classify)(parsedName.type);
    }

    return description;
  },

  makeToString: function makeToString(factory, fullName) {
    return factory.toString();
  },

  /**
    Given a parseName object (output from `parseName`), apply
    the conventions expected by `Ember.Router`
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method useRouterNaming
    @public
  */
  useRouterNaming: function useRouterNaming(parsedName) {
    parsedName.name = parsedName.name.replace(/\./g, '_');
    if (parsedName.name === 'basic') {
      parsedName.name = '';
    }
  },
  /**
    Look up the template in Ember.TEMPLATES
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveTemplate
    @public
  */
  resolveTemplate: function resolveTemplate(parsedName) {
    var templateName = parsedName.fullNameWithoutType.replace(/\./g, '/');

    if (_emberMetalCore2['default'].TEMPLATES[templateName]) {
      return _emberMetalCore2['default'].TEMPLATES[templateName];
    }

    templateName = (0, _emberRuntimeSystemString.decamelize)(templateName);
    if (_emberMetalCore2['default'].TEMPLATES[templateName]) {
      return _emberMetalCore2['default'].TEMPLATES[templateName];
    }
  },

  /**
    Lookup the view using `resolveOther`
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveView
    @public
  */
  resolveView: function resolveView(parsedName) {
    this.useRouterNaming(parsedName);
    return this.resolveOther(parsedName);
  },

  /**
    Lookup the controller using `resolveOther`
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveController
    @public
  */
  resolveController: function resolveController(parsedName) {
    this.useRouterNaming(parsedName);
    return this.resolveOther(parsedName);
  },
  /**
    Lookup the route using `resolveOther`
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveRoute
    @public
  */
  resolveRoute: function resolveRoute(parsedName) {
    this.useRouterNaming(parsedName);
    return this.resolveOther(parsedName);
  },

  /**
    Lookup the model on the Application namespace
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveModel
    @public
  */
  resolveModel: function resolveModel(parsedName) {
    var className = (0, _emberRuntimeSystemString.classify)(parsedName.name);
    var factory = (0, _emberMetalProperty_get.get)(parsedName.root, className);

    if (factory) {
      return factory;
    }
  },
  /**
    Look up the specified object (from parsedName) on the appropriate
    namespace (usually on the Application)
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveHelper
    @public
  */
  resolveHelper: function resolveHelper(parsedName) {
    return this.resolveOther(parsedName) || _emberHtmlbarsHelpers2['default'][parsedName.fullNameWithoutType];
  },
  /**
    Look up the specified object (from parsedName) on the appropriate
    namespace (usually on the Application)
      @protected
    @param {Object} parsedName a parseName object with the parsed
      fullName lookup string
    @method resolveOther
    @public
  */
  resolveOther: function resolveOther(parsedName) {
    var className = (0, _emberRuntimeSystemString.classify)(parsedName.name) + (0, _emberRuntimeSystemString.classify)(parsedName.type);
    var factory = (0, _emberMetalProperty_get.get)(parsedName.root, className);
    if (factory) {
      return factory;
    }
  },

  resolveMain: function resolveMain(parsedName) {
    var className = (0, _emberRuntimeSystemString.classify)(parsedName.type);
    return (0, _emberMetalProperty_get.get)(parsedName.root, className);
  },

  /**
   @method _logLookup
   @param {Boolean} found
   @param {Object} parsedName
   @private
  */
  _logLookup: function _logLookup(found, parsedName) {
    var symbol, padding;

    if (found) {
      symbol = '[✓]';
    } else {
      symbol = '[ ]';
    }

    if (parsedName.fullName.length > 60) {
      padding = '.';
    } else {
      padding = new Array(60 - parsedName.fullName.length).join('.');
    }

    _emberMetalLogger2['default'].info(symbol, parsedName.fullName, padding, this.lookupDescription(parsedName.fullName));
  },

  /**
   Used to iterate all items of a given type.
     @method knownForType
   @param {String} type the type to search for
   @private
   */
  knownForType: function knownForType(type) {
    var namespace = (0, _emberMetalProperty_get.get)(this, 'namespace');
    var suffix = (0, _emberRuntimeSystemString.classify)(type);
    var typeRegexp = new RegExp(suffix + '$');

    var known = (0, _emberMetalDictionary2['default'])(null);
    var knownKeys = Object.keys(namespace);
    for (var index = 0, _length = knownKeys.length; index < _length; index++) {
      var _name = knownKeys[index];

      if (typeRegexp.test(_name)) {
        var containerName = this.translateToContainerFullname(type, _name);

        known[containerName] = true;
      }
    }

    return known;
  },

  /**
   Converts provided name from the backing namespace into a container lookup name.
     Examples:
     App.FooBarHelper -> helper:foo-bar
   App.THelper -> helper:t
     @method translateToContainerFullname
   @param {String} type
   @param {String} name
   @private
   */

  translateToContainerFullname: function translateToContainerFullname(type, name) {
    var suffix = (0, _emberRuntimeSystemString.classify)(type);
    var namePrefix = name.slice(0, suffix.length * -1);
    var dasherizedName = (0, _emberRuntimeSystemString.dasherize)(namePrefix);

    return type + ':' + dasherizedName;
  }
});