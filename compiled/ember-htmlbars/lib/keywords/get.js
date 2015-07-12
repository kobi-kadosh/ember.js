'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalStreamsStream = require('ember-metal/streams/stream');

var _emberMetalStreamsStream2 = _interopRequireDefault(_emberMetalStreamsStream);

var _emberMetalStreamsUtils = require('ember-metal/streams/utils');

var _emberMetalMerge = require('ember-metal/merge');

var _emberMetalMerge2 = _interopRequireDefault(_emberMetalMerge);

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-get-helper')) {

  var getKeyword = function getKeyword(morph, env, scope, params, hash, template, inverse, visitor) {
    var objParam = params[0];
    var pathParam = params[1];

    _emberMetalCore2['default'].assert('The first argument to {{get}} must be a stream', (0, _emberMetalStreamsUtils.isStream)(objParam));
    _emberMetalCore2['default'].assert('{{get}} requires at least two arguments', params.length > 1);

    var getStream = new GetStream(objParam, pathParam);

    if (morph === null) {
      return getStream;
    } else {
      env.hooks.inline(morph, env, scope, '-get', [getStream], hash, visitor);
    }

    return true;
  };

  var GetStream = function GetStream(obj, path) {
    this.init('(get ' + (0, _emberMetalStreamsUtils.labelFor)(obj) + ' ' + (0, _emberMetalStreamsUtils.labelFor)(path) + ')');

    this.objectParam = obj;
    this.pathParam = path;
    this.lastPathValue = undefined;
    this.valueDep = this.addMutableDependency();

    this.addDependency(path);

    // This next line is currently only required when the keyword
    // is executed in a subexpression. More investigation required
    // to remove the additional dependency
    this.addDependency(obj);
  };

  GetStream.prototype = Object.create(_emberMetalStreamsStream2['default'].prototype);

  (0, _emberMetalMerge2['default'])(GetStream.prototype, {
    updateValueDependency: function updateValueDependency() {
      var pathValue = (0, _emberMetalStreamsUtils.read)(this.pathParam);

      if (this.lastPathValue !== pathValue) {
        if (typeof pathValue === 'string') {
          this.valueDep.replace(this.objectParam.get(pathValue));
        } else {
          this.valueDep.replace();
        }

        this.lastPathValue = pathValue;
      }
    },

    compute: function compute() {
      this.updateValueDependency();
      return this.valueDep.getValue();
    },

    setValue: function setValue(value) {
      this.updateValueDependency();
      this.valueDep.setValue(value);
    }

  });
}

exports['default'] = getKeyword;
module.exports = exports['default'];