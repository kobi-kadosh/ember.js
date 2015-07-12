/* jshint scripturl:true */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsUtilsString = require('ember-htmlbars/utils/string');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

var view;

QUnit.module('ember-htmlbars: sanitized attribute', {
  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
  }
});

// jscs:disable validateIndentation
// jscs:disable disallowTrailingWhitespace
if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-attribute-syntax')) {

  var badTags = [{ tag: 'a', attr: 'href',
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href={{url}}></a>'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href=\'{{url}}\'></a>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<a href=\'{{protocol}}{{path}}\'></a>') }, { tag: 'base', attr: 'href',
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<base href={{url}} />'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<base href=\'{{url}}\'/>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<base href=\'{{protocol}}{{path}}\'/>') }, { tag: 'embed', attr: 'src',
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<embed src={{url}} />'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<embed src=\'{{url}}\'/>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<embed src=\'{{protocol}}{{path}}\'/>') }, { tag: 'body', attr: 'background',
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<body background={{url}}></body>'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<body background=\'{{url}}\'></body>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<body background=\'{{protocol}}{{path}}\'></body>') }, { tag: 'link', attr: 'href',
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<link href={{url}}>'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<link href=\'{{url}}\'>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<link href=\'{{protocol}}{{path}}\'>') }, { tag: 'img', attr: 'src',
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src={{url}}>'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src=\'{{url}}\'>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src=\'{{protocol}}{{path}}\'>') }, { tag: 'iframe', attr: 'src',
    // Setting an iframe with a bad protocol results in the browser
    // being redirected. in IE8. Skip the iframe tests on that platform.
    skip: _emberMetalEnvironment2['default'].hasDOM && document.documentMode && document.documentMode <= 8,
    unquotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<iframe src={{url}}></iframe>'),
    quotedTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<iframe src=\'{{url}}\'></iframe>'),
    multipartTemplate: (0, _emberTemplateCompilerSystemCompile2['default'])('<iframe src=\'{{protocol}}{{path}}\'></iframe>') }];

  for (var i = 0, l = badTags.length; i < l; i++) {
    (function () {
      var subject = badTags[i];

      if (subject.skip) {
        return;
      }

      QUnit.test(subject.tag + ' ' + subject.attr + ' is sanitized when using blacklisted protocol', function () {
        view = _emberViewsViewsView2['default'].create({
          context: { url: 'javascript://example.com' },
          template: subject.unquotedTemplate
        });

        view.createElement();

        equal(view.element.firstChild.getAttribute(subject.attr), 'unsafe:javascript://example.com', 'attribute is output');
      });

      QUnit.test(subject.tag + ' ' + subject.attr + ' is sanitized when using quoted non-whitelisted protocol', function () {
        view = _emberViewsViewsView2['default'].create({
          context: { url: 'javascript://example.com' },
          template: subject.quotedTemplate
        });

        view.createElement();

        equal(view.element.firstChild.getAttribute(subject.attr), 'unsafe:javascript://example.com', 'attribute is output');
      });

      QUnit.test(subject.tag + ' ' + subject.attr + ' is not sanitized when using non-whitelisted protocol with a SafeString', function () {
        view = _emberViewsViewsView2['default'].create({
          context: { url: new _emberHtmlbarsUtilsString.SafeString('javascript://example.com') },
          template: subject.unquotedTemplate
        });

        try {
          view.createElement();

          equal(view.element.firstChild.getAttribute(subject.attr), 'javascript://example.com', 'attribute is output');
        } catch (e) {
          // IE does not allow javascript: to be set on img src
          ok(true, 'caught exception ' + e);
        }
      });

      QUnit.test(subject.tag + ' ' + subject.attr + ' is sanitized when using quoted+concat non-whitelisted protocol', function () {
        view = _emberViewsViewsView2['default'].create({
          context: { protocol: 'javascript:', path: '//example.com' },
          template: subject.multipartTemplate
        });
        view.createElement();

        equal(view.element.firstChild.getAttribute(subject.attr), 'unsafe:javascript://example.com', 'attribute is output');
      });
    })(); //jshint ignore:line
  }
}
// jscs:enable disallowTrailingWhitespace
// jscs:enable validateIndentation