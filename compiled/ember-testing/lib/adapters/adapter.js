'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

function K() {
  return this;
}

/**
 @module ember
 @submodule ember-testing
*/

/**
  The primary purpose of this class is to create hooks that can be implemented
  by an adapter for various test frameworks.

  @class Adapter
  @namespace Ember.Test
  @public
*/
var Adapter = _emberRuntimeSystemObject2['default'].extend({
  /**
    This callback will be called whenever an async operation is about to start.
      Override this to call your framework's methods that handle async
    operations.
      @public
    @method asyncStart
  */
  asyncStart: K,

  /**
    This callback will be called whenever an async operation has completed.
      @public
    @method asyncEnd
  */
  asyncEnd: K,

  /**
    Override this method with your testing framework's false assertion.
    This function is called whenever an exception occurs causing the testing
    promise to fail.
      QUnit example:
      ```javascript
      exception: function(error) {
        ok(false, error);
      };
    ```
      @public
    @method exception
    @param {String} error The exception to be raised.
  */
  exception: function exception(error) {
    throw error;
  }
});

exports['default'] = Adapter;
module.exports = exports['default'];