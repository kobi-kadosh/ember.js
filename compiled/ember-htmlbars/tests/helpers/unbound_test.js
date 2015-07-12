/*jshint newcap:false*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberTemplateCompilerSystemCompile = require('ember-template-compiler/system/compile');

var _emberTemplateCompilerSystemCompile2 = _interopRequireDefault(_emberTemplateCompilerSystemCompile);

var _emberHtmlbarsHelpers = require('ember-htmlbars/helpers');

var _emberHtmlbarsHelpers2 = _interopRequireDefault(_emberHtmlbarsHelpers);

var _emberHtmlbarsCompatRegisterBoundHelper = require('ember-htmlbars/compat/register-bound-helper');

var _emberHtmlbarsCompatRegisterBoundHelper2 = _interopRequireDefault(_emberHtmlbarsCompatRegisterBoundHelper);

var _emberHtmlbarsCompatMakeBoundHelper = require('ember-htmlbars/compat/make-bound-helper');

var _emberHtmlbarsCompatMakeBoundHelper2 = _interopRequireDefault(_emberHtmlbarsCompatMakeBoundHelper);

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeTestsUtils = require('ember-runtime/tests/utils');

function expectDeprecationInHTMLBars() {}

var view, lookup, registry, container;
var originalLookup = _emberMetalCore2['default'].lookup;

QUnit.module('ember-htmlbars: {{#unbound}} helper', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound foo}} {{unbound bar}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'BORK',
        barBinding: 'foo'
      })
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('it should render the current value of a property on the context', function () {
  equal(view.$().text(), 'BORK BORK', 'should render the current value of a property');
});

QUnit.test('it should not re-render if the property changes', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context.foo', 'OOF');
  });
  equal(view.$().text(), 'BORK BORK', 'should not re-render if the property changes');
});

QUnit.test('it should re-render if the parent view rerenders', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context.foo', 'OOF');
    view.rerender();
  });
  equal(view.$().text(), 'OOF OOF', 'should re-render if the parent view rerenders');
});

QUnit.test('it should throw the helper missing error if multiple properties are provided', function () {
  expectAssertion(function () {
    (0, _emberRuntimeTestsUtils.runAppend)(_emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound foo bar}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'BORK',
        bar: 'foo'
      })
    }));
  }, /A helper named 'foo' could not be found/);
});

QUnit.test('should property escape unsafe hrefs', function () {
  /* jshint scripturl:true */

  expect(3);

  (0, _emberRuntimeTestsUtils.runDestroy)(view);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<ul>{{#each view.people as |person|}}<a href="{{unbound person.url}}">{{person.name}}</a>{{/each}}</ul>'),
    people: (0, _emberRuntimeSystemNative_array.A)([{
      name: 'Bob',
      url: 'javascript:bob-is-cool'
    }, {
      name: 'James',
      url: 'vbscript:james-is-cool'
    }, {
      name: 'Richard',
      url: 'javascript:richard-is-cool'
    }])
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  var links = view.$('a');
  for (var i = 0, l = links.length; i < l; i++) {
    var link = links[i];
    equal(link.protocol, 'unsafe:', 'properly escaped');
  }
});

QUnit.module('ember-htmlbars: {{#unbound}} helper with container present', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    view = _emberViewsViewsView2['default'].create({
      container: new _emberRuntimeSystemContainer.Registry().container,
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound foo}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'bleep'
      })
    });
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('it should render the current value of a property path on the context', function () {
  (0, _emberRuntimeTestsUtils.runAppend)(view);
  equal(view.$().text(), 'bleep', 'should render the current value of a property path');
});

QUnit.module('ember-htmlbars: {{#unbound}} subexpression', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('capitalize', function (value) {
      return value.toUpperCase();
    });

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{capitalize (unbound foo)}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'bork'
      })
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    delete _emberHtmlbarsHelpers2['default']['capitalize'];

    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('it should render the current value of a property on the context', function () {
  equal(view.$().text(), 'BORK', 'should render the current value of a property');
});

QUnit.test('it should not re-render if the property changes', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context.foo', 'oof');
  });
  equal(view.$().text(), 'BORK', 'should not re-render if the property changes');
});

QUnit.test('it should re-render if the parent view rerenders', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context.foo', 'oof');
    view.rerender();
  });
  equal(view.$().text(), 'OOF', 'should re-render if the parent view rerenders');
});

QUnit.module('ember-htmlbars: {{#unbound}} subexpression - helper form', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('capitalize', function (value) {
      return value.toUpperCase();
    });

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('doublize', function (value) {
      return value + ' ' + value;
    });

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{capitalize (unbound doublize foo)}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'bork'
      })
    });

    (0, _emberRuntimeTestsUtils.runAppend)(view);
  },

  teardown: function teardown() {
    delete _emberHtmlbarsHelpers2['default']['capitalize'];
    delete _emberHtmlbarsHelpers2['default']['doublize'];

    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('it should render the current value of a property on the context', function () {
  equal(view.$().text(), 'BORK BORK', 'should render the current value of a property');
});

QUnit.test('it should not re-render if the property changes', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context.foo', 'oof');
  });
  equal(view.$().text(), 'BORK BORK', 'should not re-render if the property changes');
});

QUnit.test('it should re-render if the parent view rerenders', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    view.set('context.foo', 'oof');
    view.rerender();
  });
  equal(view.$().text(), 'OOF OOF', 'should re-render if the parent view rerenders');
});

QUnit.module('ember-htmlbars: {{#unbound boundHelper arg1 arg2... argN}} form: render unbound helper invocations', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
    expectDeprecationInHTMLBars();

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('surround', function (prefix, value, suffix) {
      return prefix + '-' + value + '-' + suffix;
    });

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('capitalize', function (value) {
      return value.toUpperCase();
    });

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('capitalizeName', function (value) {
      return (0, _emberMetalProperty_get.get)(value, 'firstName').toUpperCase();
    }, 'firstName');

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('fauxconcat', function (value) {
      return [].slice.call(arguments, 0, -1).join('');
    });

    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('concatNames', function (value) {
      return (0, _emberMetalProperty_get.get)(value, 'firstName') + (0, _emberMetalProperty_get.get)(value, 'lastName');
    }, 'firstName', 'lastName');
  },

  teardown: function teardown() {
    delete _emberHtmlbarsHelpers2['default']['surround'];
    delete _emberHtmlbarsHelpers2['default']['capitalize'];
    delete _emberHtmlbarsHelpers2['default']['capitalizeName'];
    delete _emberHtmlbarsHelpers2['default']['fauxconcat'];
    delete _emberHtmlbarsHelpers2['default']['concatNames'];

    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

QUnit.test('should be able to render an unbound helper invocation', function () {
  try {
    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('repeat', function (value, options) {
      var count = options.hash.count;
      var a = [];
      while (a.length < count) {
        a.push(value);
      }
      return a.join('');
    });

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound repeat foo count=bar}} {{repeat foo count=bar}} {{unbound repeat foo count=2}} {{repeat foo count=4}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'X',
        numRepeatsBinding: 'bar',
        bar: 5
      })
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'XXXXX XXXXX XX XXXX', 'first render is correct');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'context.bar', 1);
    });

    equal(view.$().text(), 'XXXXX X XX XXXX', 'only unbound bound options changed');
  } finally {
    delete _emberHtmlbarsHelpers2['default']['repeat'];
  }
});

QUnit.test('should be able to render an unbound helper invocation with deprecated fooBinding [DEPRECATED]', function () {
  try {
    (0, _emberHtmlbarsCompatRegisterBoundHelper2['default'])('repeat', function (value, options) {
      var count = options.hash.count;
      var a = [];
      while (a.length < count) {
        a.push(value);
      }
      return a.join('');
    });

    var template;
    expectDeprecation(function () {
      template = (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound repeat foo countBinding="bar"}} {{repeat foo countBinding="bar"}} {{unbound repeat foo count=2}} {{repeat foo count=4}}');
    }, /You're using legacy binding syntax/);

    view = _emberViewsViewsView2['default'].create({
      template: template,
      context: _emberRuntimeSystemObject2['default'].create({
        foo: 'X',
        numRepeatsBinding: 'bar',
        bar: 5
      })
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'XXXXX XXXXX XX XXXX', 'first render is correct');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'context.bar', 1);
    });

    equal(view.$().text(), 'XXXXX X XX XXXX', 'only unbound bound options changed');
  } finally {
    delete _emberHtmlbarsHelpers2['default']['repeat'];
  }
});

QUnit.test('should be able to render an bound helper invocation mixed with static values', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound surround prefix value "bar"}} {{surround prefix value "bar"}} {{unbound surround "bar" value suffix}} {{surround "bar" value suffix}}'),
    context: _emberRuntimeSystemObject2['default'].create({
      prefix: 'before',
      value: 'core',
      suffix: 'after'
    })
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'before-core-bar before-core-bar bar-core-after bar-core-after', 'first render is correct');
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context.prefix', 'beforeChanged');
    (0, _emberMetalProperty_set.set)(view, 'context.value', 'coreChanged');
    (0, _emberMetalProperty_set.set)(view, 'context.suffix', 'afterChanged');
  });
  equal(view.$().text(), 'before-core-bar beforeChanged-coreChanged-bar bar-core-after bar-coreChanged-afterChanged', 'only bound values change');
});

QUnit.test('should be able to render unbound forms of multi-arg helpers', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{fauxconcat foo bar bing}} {{unbound fauxconcat foo bar bing}}'),
    context: _emberRuntimeSystemObject2['default'].create({
      foo: 'a',
      bar: 'b',
      bing: 'c'
    })
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'abc abc', 'first render is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context.bar', 'X');
  });

  equal(view.$().text(), 'aXc abc', 'unbound helpers/properties stayed the same');
});

QUnit.test('should be able to render an unbound helper invocation for helpers with dependent keys', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{capitalizeName person}} {{unbound capitalizeName person}} {{concatNames person}} {{unbound concatNames person}}'),
    context: _emberRuntimeSystemObject2['default'].create({
      person: _emberRuntimeSystemObject2['default'].create({
        firstName: 'shooby',
        lastName: 'taylor'
      })
    })
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'SHOOBY SHOOBY shoobytaylor shoobytaylor', 'first render is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context.person.firstName', 'sally');
  });

  equal(view.$().text(), 'SALLY SHOOBY sallytaylor shoobytaylor', 'only bound values change');
});

QUnit.test('should be able to render an unbound helper invocation in #each helper', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(['{{#each people as |person|}}', '{{capitalize person.firstName}} {{unbound capitalize person.firstName}}', '{{/each}}'].join('')),
    context: {
      people: _emberMetalCore2['default'].A([{
        firstName: 'shooby',
        lastName: 'taylor'
      }, {
        firstName: 'cindy',
        lastName: 'taylor'
      }])
    }
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'SHOOBY SHOOBYCINDY CINDY', 'unbound rendered correctly');
});

QUnit.test('should be able to render an unbound helper invocation with bound hash options', function () {
  try {
    _emberMetalCore2['default'].Handlebars.registerBoundHelper('repeat', function (value) {
      return [].slice.call(arguments, 0, -1).join('');
    });

    view = _emberViewsViewsView2['default'].create({
      template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{capitalizeName person}} {{unbound capitalizeName person}} {{concatNames person}} {{unbound concatNames person}}'),
      context: _emberRuntimeSystemObject2['default'].create({
        person: _emberRuntimeSystemObject2['default'].create({
          firstName: 'shooby',
          lastName: 'taylor'
        })
      })
    });
    (0, _emberRuntimeTestsUtils.runAppend)(view);

    equal(view.$().text(), 'SHOOBY SHOOBY shoobytaylor shoobytaylor', 'first render is correct');

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberMetalProperty_set.set)(view, 'context.person.firstName', 'sally');
    });

    equal(view.$().text(), 'SALLY SHOOBY sallytaylor shoobytaylor', 'only bound values change');
  } finally {
    delete _emberMetalCore2['default'].Handlebars.registerBoundHelper['repeat'];
  }
});

QUnit.test('should be able to render bound form of a helper inside unbound form of same helper', function () {
  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])(['{{#unbound if foo}}', '{{#if bar}}true{{/if}}', '{{#unless bar}}false{{/unless}}', '{{/unbound}}', '{{#unbound unless notfoo}}', '{{#if bar}}true{{/if}}', '{{#unless bar}}false{{/unless}}', '{{/unbound}}'].join('')),
    context: _emberRuntimeSystemObject2['default'].create({
      foo: true,
      notfoo: false,
      bar: true
    })
  });
  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'truetrue', 'first render is correct');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context.bar', false);
  });

  equal(view.$().text(), 'falsefalse', 'bound if and unless inside unbound if/unless are updated');
});

QUnit.module('ember-htmlbars: {{#unbound}} helper -- Container Lookup', {
  setup: function setup() {
    _emberMetalCore2['default'].lookup = lookup = { Ember: _emberMetalCore2['default'] };
    registry = new _emberRuntimeSystemContainer.Registry();
    container = registry.container();
  },

  teardown: function teardown() {
    (0, _emberRuntimeTestsUtils.runDestroy)(view);
    (0, _emberRuntimeTestsUtils.runDestroy)(container);
    _emberMetalCore2['default'].lookup = originalLookup;
    registry = container = view = null;
  }
});

QUnit.test('should lookup helpers in the container', function () {
  expectDeprecationInHTMLBars();

  registry.register('helper:up-case', (0, _emberHtmlbarsCompatMakeBoundHelper2['default'])(function (value) {
    return value.toUpperCase();
  }));

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('{{unbound up-case displayText}}'),
    container: container,
    context: {
      displayText: 'such awesome'
    }
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'SUCH AWESOME', 'proper values were rendered');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'context.displayText', 'no changes');
  });

  equal(view.$().text(), 'SUCH AWESOME', 'only bound values change');
});

QUnit.test('should be able to output a property without binding', function () {
  var context = {
    content: _emberRuntimeSystemObject2['default'].create({
      anUnboundString: 'No spans here, son.'
    })
  };

  view = _emberViewsViewsView2['default'].create({
    context: context,
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<div id="first">{{unbound content.anUnboundString}}</div>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('#first').html(), 'No spans here, son.');
});

QUnit.test('should be able to use unbound helper in #each helper', function () {
  view = _emberViewsViewsView2['default'].create({
    items: (0, _emberRuntimeSystemNative_array.A)(['a', 'b', 'c', 1, 2, 3]),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<ul>{{#each view.items as |item|}}<li>{{unbound item}}</li>{{/each}}</ul>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'abc123');
  equal(view.$('li').children().length, 0, 'No markers');
});

QUnit.test('should be able to use unbound helper in #each helper (with objects)', function () {
  view = _emberViewsViewsView2['default'].create({
    items: (0, _emberRuntimeSystemNative_array.A)([{ wham: 'bam' }, { wham: 1 }]),
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<ul>{{#each view.items as |item|}}<li>{{unbound item.wham}}</li>{{/each}}</ul>')
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$().text(), 'bam1');
  equal(view.$('li').children().length, 0, 'No markers');
});

QUnit.test('should work properly with attributes', function () {
  expect(4);

  view = _emberViewsViewsView2['default'].create({
    template: (0, _emberTemplateCompilerSystemCompile2['default'])('<ul>{{#each view.people as |person|}}<li class="{{unbound person.cool}}">{{person.name}}</li>{{/each}}</ul>'),
    people: (0, _emberRuntimeSystemNative_array.A)([{
      name: 'Bob',
      cool: 'not-cool'
    }, {
      name: 'James',
      cool: 'is-cool'
    }, {
      name: 'Richard',
      cool: 'is-cool'
    }])
  });

  (0, _emberRuntimeTestsUtils.runAppend)(view);

  equal(view.$('li.not-cool').length, 1, 'correct number of not cool people');
  equal(view.$('li.is-cool').length, 2, 'correct number of cool people');

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberMetalProperty_set.set)(view, 'people.firstObject.cool', 'is-cool');
  });

  equal(view.$('li.not-cool').length, 1, 'correct number of not cool people');
  equal(view.$('li.is-cool').length, 2, 'correct number of cool people');
});

// leave this as an empty function until we are ready to use it
// to enforce deprecation notice for old Handlebars versions