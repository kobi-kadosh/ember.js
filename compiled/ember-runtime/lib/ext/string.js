/**
@module ember
@submodule ember-runtime
*/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.EXTEND_PROTOTYPES, Ember.assert

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var StringPrototype = String.prototype;

if (_emberMetalCore2['default'].EXTEND_PROTOTYPES === true || _emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {

  /**
    See [Ember.String.fmt](/api/classes/Ember.String.html#method_fmt).
      @method fmt
    @for String
    @private
  */
  StringPrototype.fmt = function () {
    return (0, _emberRuntimeSystemString.fmt)(this, arguments);
  };

  /**
    See [Ember.String.w](/api/classes/Ember.String.html#method_w).
      @method w
    @for String
    @private
  */
  StringPrototype.w = function () {
    return (0, _emberRuntimeSystemString.w)(this);
  };

  /**
    See [Ember.String.loc](/api/classes/Ember.String.html#method_loc).
      @method loc
    @for String
    @private
  */
  StringPrototype.loc = function () {
    return (0, _emberRuntimeSystemString.loc)(this, arguments);
  };

  /**
    See [Ember.String.camelize](/api/classes/Ember.String.html#method_camelize).
      @method camelize
    @for String
    @private
  */
  StringPrototype.camelize = function () {
    return (0, _emberRuntimeSystemString.camelize)(this);
  };

  /**
    See [Ember.String.decamelize](/api/classes/Ember.String.html#method_decamelize).
      @method decamelize
    @for String
    @private
  */
  StringPrototype.decamelize = function () {
    return (0, _emberRuntimeSystemString.decamelize)(this);
  };

  /**
    See [Ember.String.dasherize](/api/classes/Ember.String.html#method_dasherize).
      @method dasherize
    @for String
    @private
  */
  StringPrototype.dasherize = function () {
    return (0, _emberRuntimeSystemString.dasherize)(this);
  };

  /**
    See [Ember.String.underscore](/api/classes/Ember.String.html#method_underscore).
      @method underscore
    @for String
    @private
  */
  StringPrototype.underscore = function () {
    return (0, _emberRuntimeSystemString.underscore)(this);
  };

  /**
    See [Ember.String.classify](/api/classes/Ember.String.html#method_classify).
      @method classify
    @for String
    @private
  */
  StringPrototype.classify = function () {
    return (0, _emberRuntimeSystemString.classify)(this);
  };

  /**
    See [Ember.String.capitalize](/api/classes/Ember.String.html#method_capitalize).
      @method capitalize
    @for String
    @private
  */
  StringPrototype.capitalize = function () {
    return (0, _emberRuntimeSystemString.capitalize)(this);
  };
}