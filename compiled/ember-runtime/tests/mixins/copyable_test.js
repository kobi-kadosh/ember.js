'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeTestsSuitesCopyable = require('ember-runtime/tests/suites/copyable');

var _emberRuntimeTestsSuitesCopyable2 = _interopRequireDefault(_emberRuntimeTestsSuitesCopyable);

var _emberRuntimeMixinsCopyable = require('ember-runtime/mixins/copyable');

var _emberRuntimeMixinsCopyable2 = _interopRequireDefault(_emberRuntimeMixinsCopyable);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalProperty_get = require('ember-metal/property_get');

var CopyableObject = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsCopyable2['default'], {

  id: null,

  init: function init() {
    this._super.apply(this, arguments);
    (0, _emberMetalProperty_set.set)(this, 'id', (0, _emberMetalUtils.generateGuid)());
  },

  copy: function copy() {
    var ret = new CopyableObject();
    (0, _emberMetalProperty_set.set)(ret, 'id', (0, _emberMetalProperty_get.get)(this, 'id'));
    return ret;
  }
});

_emberRuntimeTestsSuitesCopyable2['default'].extend({

  name: 'Copyable Basic Test',

  newObject: function newObject() {
    return new CopyableObject();
  },

  isEqual: function isEqual(a, b) {
    if (!(a instanceof CopyableObject) || !(b instanceof CopyableObject)) {
      return false;
    }

    return (0, _emberMetalProperty_get.get)(a, 'id') === (0, _emberMetalProperty_get.get)(b, 'id');
  }
}).run();