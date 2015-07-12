/*globals EmberDev */
/*jshint newcap:false*/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.lookup

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalObserver = require('ember-metal/observer');

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

var _emberHtmlbarsUtilsString = require('ember-htmlbars/utils/string');

var _emberHtmlbarsMorphsAttrMorph = require('ember-htmlbars/morphs/attr-morph');

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var view;

var originalLookup = _emberMetalCore2['default'].lookup;
var TemplateTests, registry, container, lookup, warnings, originalWarn;

/*
  This module specifically tests integration with Handlebars and Ember-specific
  Handlebars extensions.

  If you add additional template support to View, you should create a new
  file in which to test.
*/
QUnit.module('ember-htmlbars: {{bind-attr}} [DEPRECATED]', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = {};
    lookup.TemplateTests = TemplateTests = _emberRuntimeSystemNamespace2['default'].create();
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());

    warnings = [];
    originalWarn = _emberMetalCore2['default'].warn;
    _emberMetalCore2['default'].warn = function (message, test) {
      if (!test) {
        warnings.push(message);
      }
    };
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    registry = container = view = null;

    _emberMetalCore2['default'].lookup = lookup = originalLookup;
    _emberMetalCore2['default'].warn = originalWarn;
    TemplateTests = null;
  }
});

QUnit.test('should be able to bind element attributes using {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr src=view.content.url alt=view.content.title}}>'),
      content: _emberRuntimeSystemObject2['default'].create({
        url: 'http://www.emberjs.com/assets/images/logo.png',
        title: 'The SproutCore Logo'
      })
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('src'), 'http://www.emberjs.com/assets/images/logo.png', 'sets src attribute');
  equal(view.$('img').attr('alt'), 'The SproutCore Logo', 'sets alt attribute');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content.title', 'El logo de Eember');
  });

  equal(view.$('img').attr('alt'), 'El logo de Eember', 'updates alt attribute when content\'s title attribute changes');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', _emberRuntimeSystemObject2['default'].create({
      url: 'http://www.thegooglez.com/theydonnothing',
      title: 'I CAN HAZ SEARCH'
    }));
  });

  equal(view.$('img').attr('alt'), 'I CAN HAZ SEARCH', 'updates alt attribute when content object changes');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', {
      url: 'http://www.emberjs.com/assets/images/logo.png',
      title: 'The SproutCore Logo'
    });
  });

  equal(view.$('img').attr('alt'), 'The SproutCore Logo', 'updates alt attribute when content object is a hash');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', _emberRuntimeSystemObject2['default'].extend({
      title: (0, _emberMetalComputed.computed)(function () {
        return 'Nanananana Ember!';
      })
    }).create({
      url: 'http://www.emberjs.com/assets/images/logo.png'
    }));
  });

  equal(view.$('img').attr('alt'), 'Nanananana Ember!', 'updates alt attribute when title property is computed');
});

QUnit.test('should be able to bind to view attributes with {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      value: 'Test',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src="test.jpg" {{bind-attr alt=view.value}}>')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('alt'), 'Test', 'renders initial value');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 'Updated');
  });

  equal(view.$('img').attr('alt'), 'Updated', 'updates value');
});

QUnit.test('should be able to bind to globals with {{bind-attr}}', function () {
  TemplateTests.set('value', 'Test');

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src="test.jpg" {{bind-attr alt=TemplateTests.value}}>')
    });
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Global lookup of TemplateTests from a Handlebars template is deprecated/);

  equal(view.$('img').attr('alt'), 'Test', 'renders initial value');
});

QUnit.test('should not allow XSS injection via {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src="test.jpg" {{bind-attr alt=view.content.value}}>'),
      content: {
        value: 'Trololol" onmouseover="alert(\'HAX!\');'
      }
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('onmouseover'), undefined);
  // If the whole string is here, then it means we got properly escaped
  equal(view.$('img').attr('alt'), 'Trololol" onmouseover="alert(\'HAX!\');');
});

QUnit.test('should be able to bind use {{bind-attr}} more than once on an element', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr src=view.content.url}} {{bind-attr alt=view.content.title}}>'),
      content: _emberRuntimeSystemObject2['default'].create({
        url: 'http://www.emberjs.com/assets/images/logo.png',
        title: 'The SproutCore Logo'
      })
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('src'), 'http://www.emberjs.com/assets/images/logo.png', 'sets src attribute');
  equal(view.$('img').attr('alt'), 'The SproutCore Logo', 'sets alt attribute');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content.title', 'El logo de Eember');
  });

  equal(view.$('img').attr('alt'), 'El logo de Eember', 'updates alt attribute when content\'s title attribute changes');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', _emberRuntimeSystemObject2['default'].create({
      url: 'http://www.thegooglez.com/theydonnothing',
      title: 'I CAN HAZ SEARCH'
    }));
  });

  equal(view.$('img').attr('alt'), 'I CAN HAZ SEARCH', 'updates alt attribute when content object changes');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', {
      url: 'http://www.emberjs.com/assets/images/logo.png',
      title: 'The SproutCore Logo'
    });
  });

  equal(view.$('img').attr('alt'), 'The SproutCore Logo', 'updates alt attribute when content object is a hash');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content', _emberRuntimeSystemObject2['default'].extend({
      title: (0, _emberMetalComputed.computed)(function () {
        return 'Nanananana Ember!';
      })
    }).create({
      url: 'http://www.emberjs.com/assets/images/logo.png'
    }));
  });

  equal(view.$('img').attr('alt'), 'Nanananana Ember!', 'updates alt attribute when title property is computed');
});

QUnit.test('{{bindAttr}} can be used to bind attributes', function () {
  expect(2);

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      value: 'Test',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src="test.jpg" {{bindAttr alt=view.value}}>')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('alt'), 'Test', 'renders initial value');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 'Updated');
  });

  equal(view.$('img').attr('alt'), 'Updated', 'updates value');
});

QUnit.test('should be able to bind element attributes using {{bind-attr}} inside a block', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#with view.content as image}}<img {{bind-attr src=image.url alt=image.title}}>{{/with}}'),
      content: _emberRuntimeSystemObject2['default'].create({
        url: 'http://www.emberjs.com/assets/images/logo.png',
        title: 'The SproutCore Logo'
      })
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('src'), 'http://www.emberjs.com/assets/images/logo.png', 'sets src attribute');
  equal(view.$('img').attr('alt'), 'The SproutCore Logo', 'sets alt attribute');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'content.title', 'El logo de Eember');
  });

  equal(view.$('img').attr('alt'), 'El logo de Eember', 'updates alt attribute when content\'s title attribute changes');
});

QUnit.test('should be able to bind class attribute with {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr class="view.foo"}}>'),
      foo: 'bar'
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.element.firstChild.className, 'bar', 'renders class');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'foo', 'baz');
  });

  equal(view.element.firstChild.className, 'baz', 'updates rendered class');
});

QUnit.test('should be able to bind unquoted class attribute with {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr class=view.foo}}>'),
      foo: 'bar'
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('class'), 'bar', 'renders class');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'foo', 'baz');
  });

  equal(view.$('img').attr('class'), 'baz', 'updates class');
});

QUnit.test('should be able to bind class attribute via a truthy property with {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr class="view.isNumber:is-truthy"}}>'),
      isNumber: 5
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.element.firstChild.className, 'is-truthy', 'renders class');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'isNumber', 0);
  });

  ok(view.element.firstChild.className !== 'is-truthy', 'removes class');
});

QUnit.test('should be able to bind class to view attribute with {{bind-attr}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr class="view.foo"}}>'),
      foo: 'bar'
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('class'), 'bar', 'renders class');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'foo', 'baz');
  });

  equal(view.$('img').attr('class'), 'baz', 'updates class');
});

QUnit.test('should not allow XSS injection via {{bind-attr}} with class', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr class="view.foo"}}>'),
      foo: '" onmouseover="alert(\'I am in your classes hacking your app\');'
    });
  });

  try {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  } catch (e) {}

  equal(view.$('img').attr('onmouseover'), undefined);
});

QUnit.test('should be able to bind class attribute using ternary operator in {{bind-attr}}', function () {
  var content = _emberRuntimeSystemObject2['default'].create({
    isDisabled: true
  });

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr class="view.content.isDisabled:disabled:enabled"}} />'),
      content: content
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('img').hasClass('disabled'), 'disabled class is rendered');
  ok(!view.$('img').hasClass('enabled'), 'enabled class is not rendered');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(content, 'isDisabled', false);
  });

  ok(!view.$('img').hasClass('disabled'), 'disabled class is not rendered');
  ok(view.$('img').hasClass('enabled'), 'enabled class is rendered');
});

QUnit.test('should be able to add multiple classes using {{bind-attr class}}', function () {
  var content = _emberRuntimeSystemObject2['default'].create({
    isAwesomeSauce: true,
    isAlsoCool: true,
    isAmazing: true,
    isEnabled: true
  });

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{bind-attr class="view.content.isAwesomeSauce view.content.isAlsoCool view.content.isAmazing:amazing :is-super-duper view.content.isEnabled:enabled:disabled"}}></div>'),
      content: content
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(view.$('div').hasClass('is-awesome-sauce'), 'dasherizes first property and sets classname');
  ok(view.$('div').hasClass('is-also-cool'), 'dasherizes second property and sets classname');
  ok(view.$('div').hasClass('amazing'), 'uses alias for third property and sets classname');
  ok(view.$('div').hasClass('is-super-duper'), 'static class is present');
  ok(view.$('div').hasClass('enabled'), 'truthy class in ternary classname definition is rendered');
  ok(!view.$('div').hasClass('disabled'), 'falsy class in ternary classname definition is not rendered');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(content, 'isAwesomeSauce', false);
    (0, _emberMetalProperty_set.set)(content, 'isAmazing', false);
    (0, _emberMetalProperty_set.set)(content, 'isEnabled', false);
  });

  ok(!view.$('div').hasClass('is-awesome-sauce'), 'removes dasherized class when property is set to false');
  ok(!view.$('div').hasClass('amazing'), 'removes aliased class when property is set to false');
  ok(view.$('div').hasClass('is-super-duper'), 'static class is still present');
  ok(!view.$('div').hasClass('enabled'), 'truthy class in ternary classname definition is not rendered');
  ok(view.$('div').hasClass('disabled'), 'falsy class in ternary classname definition is rendered');
});

QUnit.test('should be able to bind classes to globals with {{bind-attr class}}', function () {
  TemplateTests.set('isOpen', true);

  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img src="test.jpg" {{bind-attr class="TemplateTests.isOpen"}}>')
    });
  });

  expectDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  }, /Global lookup of TemplateTests from a Handlebars template is deprecated/);

  ok(view.$('img').hasClass('is-open'), 'sets classname to the dasherized value of the global property');
});

QUnit.test('should be able to bind-attr to \'this\' in an {{#each}} block', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.images}}<img {{bind-attr src=this}}>{{/each}}'),
      images: (0, _emberRuntimeSystemNative_array.A)(['one.png', 'two.jpg', 'three.gif'])
    });
  });

  ignoreDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  var images = view.$('img');
  ok(/one\.png$/.test(images[0].src));
  ok(/two\.jpg$/.test(images[1].src));
  ok(/three\.gif$/.test(images[2].src));
});

QUnit.test('should be able to bind classes to \'this\' in an {{#each}} block with {{bind-attr class}}', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each view.items}}<li {{bind-attr class="this"}}>Item</li>{{/each}}'),
      items: (0, _emberRuntimeSystemNative_array.A)(['a', 'b', 'c'])
    });
  });

  ignoreDeprecation(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(view);
  });

  ok(view.$('li').eq(0).hasClass('a'), 'sets classname to the value of the first item');
  ok(view.$('li').eq(1).hasClass('b'), 'sets classname to the value of the second item');
  ok(view.$('li').eq(2).hasClass('c'), 'sets classname to the value of the third item');
});

QUnit.test('should be able to bind-attr to var in {{#each var in list}} block', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{#each image in view.images}}<img {{bind-attr src=image}}>{{/each}}'),
      images: (0, _emberRuntimeSystemNative_array.A)(['one.png', 'two.jpg', 'three.gif'])
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var images = view.$('img');
  ok(/one\.png$/.test(images[0].src));
  ok(/two\.jpg$/.test(images[1].src));
  ok(/three\.gif$/.test(images[2].src));

  (0, _emberMetalRun_loop2['default'])(function () {
    var imagesArray = view.get('images');
    imagesArray.removeAt(0);
  });

  images = view.$('img');
  ok(images.length === 2, '');
  ok(/two\.jpg$/.test(images[0].src));
  ok(/three\.gif$/.test(images[1].src));
});

QUnit.test('should teardown observers from bind-attr on rerender', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<span {{bind-attr class="view.foo" name=view.foo}}>wat</span>'),
      foo: 'bar'
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal((0, _emberMetalObserver.observersFor)(view, 'foo').length, 1);

  (0, _emberMetalRun_loop2['default'])(function () {
    view.rerender();
  });

  equal((0, _emberMetalObserver.observersFor)(view, 'foo').length, 1);
});

QUnit.test('should keep class in the order it appears in', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<span {{bind-attr class=":foo :baz"}}></span>')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.element.firstChild.className, 'foo baz', 'classes are in expected order');
});

QUnit.test('should allow either quoted or unquoted values', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      value: 'Test',
      source: 'test.jpg',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr alt="view.value" src=view.source}}>')
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('img').attr('alt'), 'Test', 'renders initial value');
  equal(view.$('img').attr('src'), 'test.jpg', 'renders initial value');

  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('value', 'Updated');
    view.set('source', 'test2.jpg');
  });

  equal(view.$('img').attr('alt'), 'Updated', 'updates value');
  equal(view.$('img').attr('src'), 'test2.jpg', 'updates value');
});

QUnit.test('property before didInsertElement', function () {
  var matchingElement;
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      name: 'bob',
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{bind-attr alt=view.name}}></div>'),
      didInsertElement: function didInsertElement() {
        matchingElement = this.$('div[alt=bob]');
      }
    });
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(matchingElement.length, 1, 'element is in the DOM when didInsertElement');
});

QUnit.test('asserts for <div class=\'foo\' {{bind-attr class=\'bar\'}}></div>', function () {
  ignoreDeprecation(function () {
    expectAssertion(function () {
      (0, _emberTemplateCompilerSystemCompile2['default'])('<div class="foo" {{bind-attr class=view.foo}}></div>');
    }, /You cannot set `class` manually and via `{{bind-attr}}` helper on the same element/);
  });
});

QUnit.test('asserts for <div data-bar=\'foo\' {{bind-attr data-bar=\'blah\'}}></div>', function () {
  ignoreDeprecation(function () {
    expectAssertion(function () {
      (0, _emberTemplateCompilerSystemCompile2['default'])('<div data-bar="foo" {{bind-attr data-bar=view.blah}}></div>');
    }, /You cannot set `data-bar` manually and via `{{bind-attr}}` helper on the same element/);
  });
});

QUnit.test('src attribute bound to undefined is empty', function () {
  var template;
  ignoreDeprecation(function () {
    template = (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr src=view.undefinedValue}}>');
  });

  view = _emberViewsViewsView2['default'].create({
    template: template,
    undefinedValue: undefined
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  ok(!view.element.firstChild.hasAttribute('src'), 'src attribute is empty');
});

QUnit.test('src attribute bound to null is not present', function () {
  ignoreDeprecation(function () {
    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr src=view.nullValue}}>'),
      nullValue: null
    });
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.element.firstChild.getAttribute('src'), null, 'src attribute is empty');
});

QUnit.test('src attribute will be cleared when the value is set to null or undefined', function () {
  var template;
  ignoreDeprecation(function () {
    template = (0, _emberTemplateCompilerSystemCompile2['default'])('<img {{bind-attr src=view.value}}>');
  });

  view = _emberViewsViewsView2['default'].create({
    template: template,
    value: 'one'
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.element.firstChild.getAttribute('src'), 'one', 'src attribute is present');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'value', 'two');
  });

  equal(view.element.firstChild.getAttribute('src'), 'two', 'src attribute is present');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'value', null);
  });

  equal(view.element.firstChild.getAttribute('src'), '', 'src attribute is empty');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'value', 'three');
  });

  equal(view.element.firstChild.getAttribute('src'), 'three', 'src attribute is present');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'value', undefined);
  });

  equal(view.element.firstChild.getAttribute('src'), '', 'src attribute is empty');
});

if (!EmberDev.runningProdBuild) {

  QUnit.test('specifying `<div {{bind-attr style=userValue}}></div>` triggers a warning', function () {
    var template;
    ignoreDeprecation(function () {
      template = (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{bind-attr style=view.userValue}}></div>');
    });

    view = _emberViewsViewsView2['default'].create({
      template: template,
      userValue: '42'
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);

    deepEqual(warnings, [_emberHtmlbarsMorphsAttrMorph.styleWarning]);
  });
}

QUnit.test('specifying `<div {{bind-attr style=userValue}}></div>` works properly with a SafeString', function () {
  var template;
  ignoreDeprecation(function () {
    template = (0, _emberTemplateCompilerSystemCompile2['default'])('<div {{bind-attr style=view.userValue}}></div>');
  });

  view = _emberViewsViewsView2['default'].create({
    template: template,
    userValue: new _emberHtmlbarsUtilsString.SafeString('42')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  deepEqual(warnings, []);
});