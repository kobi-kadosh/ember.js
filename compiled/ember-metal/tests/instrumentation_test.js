'use strict';

var _emberMetalInstrumentation = require('ember-metal/instrumentation');

QUnit.module('Ember Instrumentation', {
  setup: function setup() {},
  teardown: function teardown() {
    (0, _emberMetalInstrumentation.reset)();
  }
});

QUnit.test('execute block even if no listeners', function () {
  var result = (0, _emberMetalInstrumentation.instrument)('render', {}, function () {
    return 'hello';
  });
  equal(result, 'hello', 'called block');
});

QUnit.test('subscribing to a simple path receives the listener', function () {
  expect(12);

  var sentPayload = {};
  var count = 0;

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      if (count === 0) {
        strictEqual(name, 'render');
      } else {
        strictEqual(name, 'render.handlebars');
      }

      ok(typeof timestamp === 'number');
      strictEqual(payload, sentPayload);
    },

    after: function after(name, timestamp, payload) {
      if (count === 0) {
        strictEqual(name, 'render');
      } else {
        strictEqual(name, 'render.handlebars');
      }

      ok(typeof timestamp === 'number');
      strictEqual(payload, sentPayload);

      count++;
    }
  });

  (0, _emberMetalInstrumentation.instrument)('render', sentPayload, function () {});

  (0, _emberMetalInstrumentation.instrument)('render.handlebars', sentPayload, function () {});
});

QUnit.test('returning a value from the before callback passes it to the after callback', function () {
  expect(2);

  var passthru1 = {};
  var passthru2 = {};

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      return passthru1;
    },
    after: function after(name, timestamp, payload, beforeValue) {
      strictEqual(beforeValue, passthru1);
    }
  });

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      return passthru2;
    },
    after: function after(name, timestamp, payload, beforeValue) {
      strictEqual(beforeValue, passthru2);
    }
  });

  (0, _emberMetalInstrumentation.instrument)('render', null, function () {});
});

QUnit.test('instrument with 2 args (name, callback) no payload', function () {
  expect(1);

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      deepEqual(payload, {});
    },
    after: function after() {}
  });

  (0, _emberMetalInstrumentation.instrument)('render', function () {});
});

QUnit.test('instrument with 3 args (name, callback, binding) no payload', function () {
  expect(2);

  var binding = {};
  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      deepEqual(payload, {});
    },
    after: function after() {}
  });

  (0, _emberMetalInstrumentation.instrument)('render', function () {
    deepEqual(this, binding);
  }, binding);
});

QUnit.test('instrument with 3 args (name, payload, callback) with payload', function () {
  expect(1);

  var expectedPayload = { hi: 1 };
  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      deepEqual(payload, expectedPayload);
    },
    after: function after() {}
  });

  (0, _emberMetalInstrumentation.instrument)('render', expectedPayload, function () {});
});

QUnit.test('instrument with 4 args (name, payload, callback, binding) with payload', function () {
  expect(2);

  var expectedPayload = { hi: 1 };
  var binding = {};
  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before(name, timestamp, payload) {
      deepEqual(payload, expectedPayload);
    },
    after: function after() {}
  });

  (0, _emberMetalInstrumentation.instrument)('render', expectedPayload, function () {
    deepEqual(this, binding);
  }, binding);
});

QUnit.test('raising an exception in the instrumentation attaches it to the payload', function () {
  expect(2);

  var error = new Error('Instrumentation');

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before() {},
    after: function after(name, timestamp, payload) {
      strictEqual(payload.exception, error);
    }
  });

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before() {},
    after: function after(name, timestamp, payload) {
      strictEqual(payload.exception, error);
    }
  });

  (0, _emberMetalInstrumentation.instrument)('render.handlebars', null, function () {
    throw error;
  });
});

QUnit.test('it is possible to add a new subscriber after the first instrument', function () {
  (0, _emberMetalInstrumentation.instrument)('render.handlebars', null, function () {});

  (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before() {
      ok(true, 'Before callback was called');
    },
    after: function after() {
      ok(true, 'After callback was called');
    }
  });

  (0, _emberMetalInstrumentation.instrument)('render.handlebars', null, function () {});
});

QUnit.test('it is possible to remove a subscriber', function () {
  expect(4);

  var count = 0;

  var subscriber = (0, _emberMetalInstrumentation.subscribe)('render', {
    before: function before() {
      equal(count, 0);
      ok(true, 'Before callback was called');
    },
    after: function after() {
      equal(count, 0);
      ok(true, 'After callback was called');
      count++;
    }
  });

  (0, _emberMetalInstrumentation.instrument)('render.handlebars', null, function () {});

  (0, _emberMetalInstrumentation.unsubscribe)(subscriber);

  (0, _emberMetalInstrumentation.instrument)('render.handlebars', null, function () {});
});