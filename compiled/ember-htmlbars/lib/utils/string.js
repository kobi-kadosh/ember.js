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

var _emberRuntimeSystemString = require('ember-runtime/system/string');

var _emberRuntimeSystemString2 = _interopRequireDefault(_emberRuntimeSystemString);

var _htmlbarsUtil = require('htmlbars-util');

/**
  Mark a string as safe for unescaped output with Handlebars. If you
  return HTML from a Handlebars helper, use this function to
  ensure Handlebars does not escape the HTML.

  ```javascript
  Ember.String.htmlSafe('<div>someString</div>')
  ```

  @method htmlSafe
  @for Ember.String
  @static
  @return {Handlebars.SafeString} a string that will not be html escaped by Handlebars
  @public
*/
function htmlSafe(str) {
  if (str === null || str === undefined) {
    return '';
  }

  if (typeof str !== 'string') {
    str = '' + str;
  }
  return new _htmlbarsUtil.SafeString(str);
}

_emberRuntimeSystemString2['default'].htmlSafe = htmlSafe;
if (_emberMetalCore2['default'].EXTEND_PROTOTYPES === true || _emberMetalCore2['default'].EXTEND_PROTOTYPES.String) {

  /**
    Mark a string as being safe for unescaped output with Handlebars.
      ```javascript
    '<div>someString</div>'.htmlSafe()
    ```
      See [Ember.String.htmlSafe](/api/classes/Ember.String.html#method_htmlSafe).
      @method htmlSafe
    @for String
    @return {Handlebars.SafeString} a string that will not be html escaped by Handlebars
    @public
  */
  String.prototype.htmlSafe = function () {
    return htmlSafe(this);
  };
}

exports.SafeString = _htmlbarsUtil.SafeString;
exports.htmlSafe = htmlSafe;
exports.escapeExpression = _htmlbarsUtil.escapeExpression;