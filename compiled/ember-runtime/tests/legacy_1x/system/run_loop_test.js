'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalBinding = require('ember-metal/binding');

var _emberRuntimeMixinsObservable = require('ember-runtime/mixins/observable');

var _emberRuntimeMixinsObservable2 = _interopRequireDefault(_emberRuntimeMixinsObservable);

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * Updated the API usage for setting up and syncing Binding since these
    are not the APIs this file is testing.

  * Disabled a call to invokeOnce() around line 127 because it appeared to be
    broken anyway.  I don't think it ever even worked.
*/

var MyApp, binding1, binding2;

QUnit.module('System:run_loop() - chained binding', {
  setup: function setup() {
    MyApp = {};
    MyApp.first = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsObservable2['default']).create({
      output: 'MyApp.first'
    });

    MyApp.second = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsObservable2['default'], {
      inputDidChange: (0, _emberMetalMixin.observer)('input', function () {
        this.set('output', this.get('input'));
      })
    }).create({
      input: 'MyApp.second',
      output: 'MyApp.second'
    });

    MyApp.third = _emberRuntimeSystemObject2['default'].extend(_emberRuntimeMixinsObservable2['default']).create({
      input: 'MyApp.third'
    });
  }
});

QUnit.test('Should propagate bindings after the RunLoop completes (using Ember.RunLoop)', function () {
  (0, _emberMetalRun_loop2['default'])(function () {

    //Binding of output of MyApp.first object to input of MyApp.second object
    binding1 = _emberMetalBinding.Binding.from('first.output').to('second.input').connect(MyApp);

    //Binding of output of MyApp.second object to input of MyApp.third object
    binding2 = _emberMetalBinding.Binding.from('second.output').to('third.input').connect(MyApp);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    // Based on the above binding if you change the output of MyApp.first
    // object it should change the all the variable of
    //  MyApp.first,MyApp.second and MyApp.third object
    MyApp.first.set('output', 'change');

    //Changes the output of the MyApp.first object
    equal(MyApp.first.get('output'), 'change');

    //since binding has not taken into effect the value still remains as change.
    equal(MyApp.second.get('output'), 'MyApp.first');
  }); // allows bindings to trigger...

  //Value of the output variable changed to 'change'
  equal(MyApp.first.get('output'), 'change');

  //Since binding triggered after the end loop the value changed to 'change'.
  equal(MyApp.second.get('output'), 'change');
});

QUnit.test('Should propagate bindings after the RunLoop completes', function () {
  (0, _emberMetalRun_loop2['default'])(function () {
    //Binding of output of MyApp.first object to input of MyApp.second object
    binding1 = _emberMetalBinding.Binding.from('first.output').to('second.input').connect(MyApp);

    //Binding of output of MyApp.second object to input of MyApp.third object
    binding2 = _emberMetalBinding.Binding.from('second.output').to('third.input').connect(MyApp);
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    //Based on the above binding if you change the output of MyApp.first object it should
    //change the all the variable of MyApp.first,MyApp.second and MyApp.third object
    MyApp.first.set('output', 'change');

    //Changes the output of the MyApp.first object
    equal(MyApp.first.get('output'), 'change');

    //since binding has not taken into effect the value still remains as change.
    equal(MyApp.second.get('output'), 'MyApp.first');
  });

  //Value of the output variable changed to 'change'
  equal(MyApp.first.get('output'), 'change');

  //Since binding triggered after the end loop the value changed to 'change'.
  equal(MyApp.second.get('output'), 'change');
});