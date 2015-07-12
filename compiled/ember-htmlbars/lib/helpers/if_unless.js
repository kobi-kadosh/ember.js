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

// Ember.assert

var _emberViewsStreamsShould_display = require('ember-views/streams/should_display');

var _emberViewsStreamsShould_display2 = _interopRequireDefault(_emberViewsStreamsShould_display);

/**
  Use the `if` block helper to conditionally render a block depending on a
  property. If the property is "falsey", for example: `false`, `undefined
 `null`, `""`, `0` or an empty array, the block will not be rendered.

 ```handlebars
  {{! will not render if foo is falsey}}
  {{#if foo}}
    Welcome to the {{foo.bar}}
  {{/if}}
  ```

  You can also specify a template to show if the property is falsey by using
  the `else` helper.

  ```handlebars
  {{!Is it raining outside?}}
  {{#if isRaining}}
    Yes, grab an umbrella!
  {{else}}
    No, it's lovely outside!
  {{/if}}
  ```

  You are also able to combine `else` and `if` helpers to create more complex
  conditional logic.

  ```handlebars
  {{#if isMorning}}
    Good morning
  {{else if isAfternoon}}
    Good afternoon
  {{else}}
    Good night
  {{/if}}
  ```

  You can use `if` inline to conditionally render a single property or string.
  This helper acts like a ternary operator. If the first property is truthy,
  the second argument will be displayed, if not, the third argument will be
  displayed

  ```handlebars
  {{if useLongGreeting "Hello" "Hi"}} Dave
  ```

  Finally, you can use the `if` helper inside another helper as a subexpression.

  ```handlebars
  {{some-component height=(if isBig "100" "10")}}
  ```

  @method if
  @for Ember.Handlebars.helpers
  @public
*/
function ifHelper(params, hash, options) {
  return ifUnless(params, hash, options, (0, _emberViewsStreamsShould_display2['default'])(params[0]));
}

/**
  The `unless` helper is the inverse of the `if` helper. Its block will be
  rendered if the expression contains a falsey value.  All forms of the `if`
  helper can also be used with `unless`.

  @method unless
  @for Ember.Handlebars.helpers
  @public
*/
function unlessHelper(params, hash, options) {
  return ifUnless(params, hash, options, !(0, _emberViewsStreamsShould_display2['default'])(params[0]));
}

function ifUnless(params, hash, options, truthy) {
  _emberMetalCore2['default'].assert('The block form of the `if` and `unless` helpers expect exactly one ' + 'argument, e.g. `{{#if newMessages}} You have new messages. {{/if}}.`', !options.template['yield'] || params.length === 1);

  _emberMetalCore2['default'].assert('The inline form of the `if` and `unless` helpers expect two or ' + 'three arguments, e.g. `{{if trialExpired \'Expired\' expiryDate}}` ' + 'or `{{unless isFirstLogin \'Welcome back!\'}}`.', !!options.template['yield'] || params.length === 2 || params.length === 3);

  if (truthy) {
    if (options.template['yield']) {
      options.template['yield']();
    } else {
      return params[1];
    }
  } else {
    if (options.inverse['yield']) {
      options.inverse['yield']();
    } else {
      return params[2];
    }
  }
}

exports.ifHelper = ifHelper;
exports.unlessHelper = unlessHelper;