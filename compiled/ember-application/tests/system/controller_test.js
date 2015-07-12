/*jshint newcap:false */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

require('ember-application/ext/controller');

var _emberRuntimeSystemContainer = require('ember-runtime/system/container');

var _emberRuntimeSystemNative_array = require('ember-runtime/system/native_array');

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberMetalComputed = require('ember-metal/computed');

QUnit.module('Controller dependencies');

QUnit.test('If a controller specifies a dependency, but does not have a container it should error', function () {
  var AController = _emberRuntimeControllersController2['default'].extend({
    needs: 'posts'
  });

  expectAssertion(function () {
    AController.create();
  }, /specifies `needs`, but does not have a container. Please ensure this controller was instantiated with a container./);
});

QUnit.test('If a controller specifies a dependency, it is accessible', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:post', _emberRuntimeControllersController2['default'].extend({
    needs: 'posts'
  }));

  registry.register('controller:posts', _emberRuntimeControllersController2['default'].extend());

  var postController = container.lookup('controller:post');
  var postsController = container.lookup('controller:posts');

  equal(postsController, postController.get('controllers.posts'), 'controller.posts must be auto synthesized');
});

QUnit.test('If a controller specifies an unavailable dependency, it raises', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:post', _emberRuntimeControllersController2['default'].extend({
    needs: ['comments']
  }));

  throws(function () {
    container.lookup('controller:post');
  }, /controller:comments/);

  registry.register('controller:blog', _emberRuntimeControllersController2['default'].extend({
    needs: ['posts', 'comments']
  }));

  throws(function () {
    container.lookup('controller:blog');
  }, /controller:posts, controller:comments/);
});

QUnit.test('Mixin sets up controllers if there is needs before calling super', function () {
  expectDeprecation(_emberRuntimeControllersArray_controller.arrayControllerDeprecation);
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:other', _emberRuntimeControllersArray_controller2['default'].extend({
    needs: 'posts',
    model: _emberMetalComputed.computed.alias('controllers.posts')
  }));

  registry.register('controller:another', _emberRuntimeControllersArray_controller2['default'].extend({
    needs: 'posts',
    modelBinding: 'controllers.posts'
  }));

  registry.register('controller:posts', _emberRuntimeControllersArray_controller2['default'].extend());

  container.lookup('controller:posts').set('model', (0, _emberRuntimeSystemNative_array.A)(['a', 'b', 'c']));

  deepEqual(['a', 'b', 'c'], container.lookup('controller:other').toArray());
  deepEqual(['a', 'b', 'c'], container.lookup('controller:another').toArray());
});

QUnit.test('raises if trying to get a controller that was not pre-defined in `needs`', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:foo', _emberRuntimeControllersController2['default'].extend());
  registry.register('controller:bar', _emberRuntimeControllersController2['default'].extend({
    needs: 'foo'
  }));

  var fooController = container.lookup('controller:foo');
  var barController = container.lookup('controller:bar');

  throws(function () {
    fooController.get('controllers.bar');
  }, /#needs does not include `bar`/, 'throws if controllers is accesed but needs not defined');

  equal(barController.get('controllers.foo'), fooController, 'correctly needed controllers should continue to work');

  throws(function () {
    barController.get('controllers.baz');
  }, /#needs does not include `baz`/, 'should throw if no such controller was needed');
});

QUnit.test('setting the value of a controller dependency should not be possible', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:post', _emberRuntimeControllersController2['default'].extend({
    needs: 'posts'
  }));

  registry.register('controller:posts', _emberRuntimeControllersController2['default'].extend());

  var postController = container.lookup('controller:post');
  container.lookup('controller:posts');

  throws(function () {
    postController.set('controllers.posts', 'epic-self-troll');
  }, /You cannot overwrite the value of `controllers.posts` of .+/, 'should raise when attempting to set the value of a controller dependency property');

  postController.set('controllers.posts.title', 'A Troll\'s Life');
  equal(postController.get('controllers.posts.title'), 'A Troll\'s Life', 'can set the value of controllers.posts.title');
});

QUnit.test('raises if a dependency with a period is requested', function () {
  var registry = new _emberRuntimeSystemContainer.Registry();
  var container = registry.container();

  registry.register('controller:big.bird', _emberRuntimeControllersController2['default'].extend());
  registry.register('controller:foo', _emberRuntimeControllersController2['default'].extend({
    needs: 'big.bird'
  }));

  expectAssertion(function () {
    container.lookup('controller:foo');
  }, /needs must not specify dependencies with periods in their names \(big\.bird\)/, 'throws if periods used');
});

QUnit.test('can unit test controllers with `needs` dependencies by stubbing their `controllers` properties', function () {
  expect(1);

  var BrotherController = _emberRuntimeControllersController2['default'].extend({
    needs: 'sister',
    foo: _emberMetalComputed.computed.alias('controllers.sister.foo')
  });

  var broController = BrotherController.create({
    controllers: {
      sister: { foo: 5 }
    }
  });

  equal(broController.get('foo'), 5, '`needs` dependencies can be stubbed');
});