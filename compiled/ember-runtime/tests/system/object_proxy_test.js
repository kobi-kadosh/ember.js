'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalWatching = require('ember-metal/watching');

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberRuntimeSystemObject_proxy = require('ember-runtime/system/object_proxy');

var _emberRuntimeSystemObject_proxy2 = _interopRequireDefault(_emberRuntimeSystemObject_proxy);

QUnit.module('ObjectProxy');

(0, _emberMetalTestsProps_helper.testBoth)('should not proxy properties passed to create', function (get, set) {
  var Proxy = _emberRuntimeSystemObject_proxy2['default'].extend({
    cp: (0, _emberMetalComputed.computed)({
      get: function get(key) {
        return this._cp;
      },
      set: function set(key, value) {
        this._cp = value;
        return this._cp;
      }
    })
  });
  var proxy = Proxy.create({
    prop: 'Foo',
    cp: 'Bar'
  });

  equal(get(proxy, 'prop'), 'Foo', 'should not have tried to proxy set');
  equal(proxy._cp, 'Bar', 'should use CP setter');
});

(0, _emberMetalTestsProps_helper.testBoth)('should proxy properties to content', function (get, set) {
  var content = {
    firstName: 'Tom',
    lastName: 'Dale',
    unknownProperty: function unknownProperty(key) {
      return key + ' unknown';
    }
  };
  var proxy = _emberRuntimeSystemObject_proxy2['default'].create();

  equal(get(proxy, 'firstName'), undefined, 'get on proxy without content should return undefined');
  expectAssertion(function () {
    set(proxy, 'firstName', 'Foo');
  }, /Cannot delegate set\('firstName', Foo\) to the 'content'/i);

  set(proxy, 'content', content);

  equal(get(proxy, 'firstName'), 'Tom', 'get on proxy with content should forward to content');
  equal(get(proxy, 'lastName'), 'Dale', 'get on proxy with content should forward to content');
  equal(get(proxy, 'foo'), 'foo unknown', 'get on proxy with content should forward to content');

  set(proxy, 'lastName', 'Huda');

  equal(get(content, 'lastName'), 'Huda', 'content should have new value from set on proxy');
  equal(get(proxy, 'lastName'), 'Huda', 'proxy should have new value from set on proxy');

  set(proxy, 'content', { firstName: 'Yehuda', lastName: 'Katz' });

  equal(get(proxy, 'firstName'), 'Yehuda', 'proxy should reflect updated content');
  equal(get(proxy, 'lastName'), 'Katz', 'proxy should reflect updated content');
});

(0, _emberMetalTestsProps_helper.testBoth)('should work with watched properties', function (get, set) {
  var content1 = { firstName: 'Tom', lastName: 'Dale' };
  var content2 = { firstName: 'Yehuda', lastName: 'Katz' };
  var count = 0;
  var Proxy, proxy, last;

  Proxy = _emberRuntimeSystemObject_proxy2['default'].extend({
    fullName: (0, _emberMetalComputed.computed)(function () {
      var firstName = this.get('firstName');
      var lastName = this.get('lastName');

      if (firstName && lastName) {
        return firstName + ' ' + lastName;
      }
      return firstName || lastName;
    }).property('firstName', 'lastName')
  });

  proxy = Proxy.create();

  (0, _emberMetalObserver.addObserver)(proxy, 'fullName', function () {
    last = get(proxy, 'fullName');
    count++;
  });

  // proxy without content returns undefined
  equal(get(proxy, 'fullName'), undefined);

  // setting content causes all watched properties to change
  set(proxy, 'content', content1);
  // both dependent keys changed
  equal(count, 2);
  equal(last, 'Tom Dale');

  // setting property in content causes proxy property to change
  set(content1, 'lastName', 'Huda');
  equal(count, 3);
  equal(last, 'Tom Huda');

  // replacing content causes all watched properties to change
  set(proxy, 'content', content2);
  // both dependent keys changed
  equal(count, 5);
  equal(last, 'Yehuda Katz');
  // content1 is no longer watched
  ok(!(0, _emberMetalWatching.isWatching)(content1, 'firstName'), 'not watching firstName');
  ok(!(0, _emberMetalWatching.isWatching)(content1, 'lastName'), 'not watching lastName');

  // setting property in new content
  set(content2, 'firstName', 'Tomhuda');
  equal(last, 'Tomhuda Katz');
  equal(count, 6);

  // setting property in proxy syncs with new content
  set(proxy, 'lastName', 'Katzdale');
  equal(count, 7);
  equal(last, 'Tomhuda Katzdale');
  equal(get(content2, 'firstName'), 'Tomhuda');
  equal(get(content2, 'lastName'), 'Katzdale');
});

QUnit.test('set and get should work with paths', function () {
  var content = { foo: { bar: 'baz' } };
  var proxy = _emberRuntimeSystemObject_proxy2['default'].create({ content: content });
  var count = 0;

  proxy.set('foo.bar', 'hello');
  equal(proxy.get('foo.bar'), 'hello');
  equal(proxy.get('content.foo.bar'), 'hello');

  proxy.addObserver('foo.bar', function () {
    count++;
  });

  proxy.set('foo.bar', 'bye');

  equal(count, 1);
  equal(proxy.get('foo.bar'), 'bye');
  equal(proxy.get('content.foo.bar'), 'bye');
});

(0, _emberMetalTestsProps_helper.testBoth)('should transition between watched and unwatched strategies', function (get, set) {
  var content = { foo: 'foo' };
  var proxy = _emberRuntimeSystemObject_proxy2['default'].create({ content: content });
  var count = 0;

  function observer() {
    count++;
  }

  equal(get(proxy, 'foo'), 'foo');

  set(content, 'foo', 'bar');

  equal(get(proxy, 'foo'), 'bar');

  set(proxy, 'foo', 'foo');

  equal(get(content, 'foo'), 'foo');
  equal(get(proxy, 'foo'), 'foo');

  (0, _emberMetalObserver.addObserver)(proxy, 'foo', observer);

  equal(count, 0);
  equal(get(proxy, 'foo'), 'foo');

  set(content, 'foo', 'bar');

  equal(count, 1);
  equal(get(proxy, 'foo'), 'bar');

  set(proxy, 'foo', 'foo');

  equal(count, 2);
  equal(get(content, 'foo'), 'foo');
  equal(get(proxy, 'foo'), 'foo');

  (0, _emberMetalObserver.removeObserver)(proxy, 'foo', observer);

  set(content, 'foo', 'bar');

  equal(get(proxy, 'foo'), 'bar');

  set(proxy, 'foo', 'foo');

  equal(get(content, 'foo'), 'foo');
  equal(get(proxy, 'foo'), 'foo');
});

(0, _emberMetalTestsProps_helper.testBoth)('setting `undefined` to a proxied content property should override its existing value', function (get, set) {
  var proxyObject = _emberRuntimeSystemObject_proxy2['default'].create({
    content: {
      prop: 'emberjs'
    }
  });
  set(proxyObject, 'prop', undefined);
  equal(get(proxyObject, 'prop'), undefined, 'sets the `undefined` value to the proxied content');
});