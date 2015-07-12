'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

/**
  Helper class that allows you to register your library with Ember.

  Singleton created at `Ember.libraries`.

  @class Libraries
  @constructor
  @private
*/
function Libraries() {
  this._registry = [];
  this._coreLibIndex = 0;
}

Libraries.prototype = {
  constructor: Libraries,

  _getLibraryByName: function _getLibraryByName(name) {
    var libs = this._registry;
    var count = libs.length;

    for (var i = 0; i < count; i++) {
      if (libs[i].name === name) {
        return libs[i];
      }
    }
  },

  register: function register(name, version, isCoreLibrary) {
    var index = this._registry.length;

    if (!this._getLibraryByName(name)) {
      if (isCoreLibrary) {
        index = this._coreLibIndex++;
      }
      this._registry.splice(index, 0, { name: name, version: version });
    } else {
      _emberMetalCore2['default'].warn('Library "' + name + '" is already registered with Ember.');
    }
  },

  registerCoreLibrary: function registerCoreLibrary(name, version) {
    this.register(name, version, true);
  },

  deRegister: function deRegister(name) {
    var lib = this._getLibraryByName(name);
    var index;

    if (lib) {
      index = this._registry.indexOf(lib);
      this._registry.splice(index, 1);
    }
  },

  each: function each(callback) {
    _emberMetalCore2['default'].deprecate('Using Ember.libraries.each() is deprecated. Access to a list of registered libraries is currently a private API. If you are not knowingly accessing this method, your out-of-date Ember Inspector may be doing so.');
    this._registry.forEach(function (lib) {
      callback(lib.name, lib.version);
    });
  }
};

if ((0, _emberMetalFeatures2['default'])('ember-libraries-isregistered')) {
  Libraries.prototype.isRegistered = function (name) {
    return !!this._getLibraryByName(name);
  };
}

exports['default'] = Libraries;
module.exports = exports['default'];