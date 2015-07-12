'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberTestingAdaptersAdapter = require('ember-testing/adapters/adapter');

var _emberTestingAdaptersAdapter2 = _interopRequireDefault(_emberTestingAdaptersAdapter);

var _emberMetalUtils = require('ember-metal/utils');

/**
  This class implements the methods defined by Ember.Test.Adapter for the
  QUnit testing framework.

  @class QUnitAdapter
  @namespace Ember.Test
  @extends Ember.Test.Adapter
  @public
*/
exports['default'] = _emberTestingAdaptersAdapter2['default'].extend({
  asyncStart: function asyncStart() {
    QUnit.stop();
  },
  asyncEnd: function asyncEnd() {
    QUnit.start();
  },
  exception: function exception(error) {
    ok(false, (0, _emberMetalUtils.inspect)(error));
  }
});
module.exports = exports['default'];