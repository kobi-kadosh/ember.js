/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = withHelper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberHtmlbarsUtilsNormalizeSelf = require('ember-htmlbars/utils/normalize-self');

var _emberHtmlbarsUtilsNormalizeSelf2 = _interopRequireDefault(_emberHtmlbarsUtilsNormalizeSelf);

var _emberViewsStreamsShould_display = require('ember-views/streams/should_display');

var _emberViewsStreamsShould_display2 = _interopRequireDefault(_emberViewsStreamsShould_display);

/**
  Use the `{{with}}` helper when you want to alias a property to a new name. This is helpful
  for semantic clarity as it allows you to retain default scope or to reference a property from another
  `{{with}}` block.

  If the aliased property is "falsey", for example: `false`, `undefined` `null`, `""`, `0` or
  an empty array, the block will not be rendered.

  ```handlebars
  {{! Will only render if user.posts contains items}}
  {{#with user.posts as |blogPosts|}}
    <div class="notice">
      There are {{blogPosts.length}} blog posts written by {{user.name}}.
    </div>
    {{#each blogPosts as |post|}}
      <li>{{post.title}}</li>
    {{/each}}
  {{/with}}
  ```

  Without the `as` operator, it would be impossible to reference `user.name` in the example above.

  NOTE: The alias should not reuse a name from the bound property path.
  For example: `{{#with foo.bar as |foo|}}` is not supported because it attempts to alias using
  the first part of the property path, `foo`. Instead, use `{{#with foo.bar as |baz|}}`.

  @method with
  @for Ember.Handlebars.helpers
  @param {Object} options
  @return {String} HTML string
  @public
*/

function withHelper(params, hash, options) {
  if ((0, _emberViewsStreamsShould_display2['default'])(params[0])) {
    var preserveContext = false;

    if (options.template.arity !== 0) {
      preserveContext = true;
    }

    if (preserveContext) {
      this['yield']([params[0]]);
    } else {
      var _self = (0, _emberHtmlbarsUtilsNormalizeSelf2['default'])(params[0]);
      if (hash.controller) {
        _self = {
          hasBoundController: true,
          controller: hash.controller,
          self: _self
        };
      }

      this['yield']([], _self);
    }
  } else if (options.inverse && options.inverse['yield']) {
    options.inverse['yield']([]);
  }
}

module.exports = exports['default'];