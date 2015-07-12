'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalObserver = require('ember-metal/observer');

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberExtensionSupportData_adapter = require('ember-extension-support/data_adapter');

var _emberExtensionSupportData_adapter2 = _interopRequireDefault(_emberExtensionSupportData_adapter);

var _emberApplicationSystemApplication = require('ember-application/system/application');

var _emberApplicationSystemApplication2 = _interopRequireDefault(_emberApplicationSystemApplication);

var _emberApplicationSystemResolver = require('ember-application/system/resolver');

var _emberApplicationSystemResolver2 = _interopRequireDefault(_emberApplicationSystemResolver);

var adapter, App;
var Model = _emberRuntimeSystemObject2['default'].extend();

var DataAdapter = _emberExtensionSupportData_adapter2['default'].extend({
  detect: function detect(klass) {
    return klass !== Model && Model.detect(klass);
  }
});

QUnit.module('Data Adapter', {
  setup: function setup() {
    (0, _emberMetalRun_loop2['default'])(function () {
      App = _emberApplicationSystemApplication2['default'].create();
      App.toString = function () {
        return 'App';
      };
      App.deferReadiness();
      App.registry.register('data-adapter:main', DataAdapter);
    });
  },
  teardown: function teardown() {
    (0, _emberMetalRun_loop2['default'])(function () {
      adapter.destroy();
      App.destroy();
    });
  }
});

QUnit.test('Model types added with DefaultResolver', function () {
  App.Post = Model.extend();

  adapter = App.__container__.lookup('data-adapter:main');
  adapter.reopen({
    getRecords: function getRecords() {
      return _emberMetalCore2['default'].A([1, 2, 3]);
    },
    columnsForType: function columnsForType() {
      return [{ name: 'title', desc: 'Title' }];
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  var modelTypesAdded = function modelTypesAdded(types) {

    equal(types.length, 1);
    var postType = types[0];
    equal(postType.name, 'post', 'Correctly sets the name');
    equal(postType.count, 3, 'Correctly sets the record count');
    strictEqual(postType.object, App.Post, 'Correctly sets the object');
    deepEqual(postType.columns, [{ name: 'title', desc: 'Title' }], 'Correctly sets the columns');
  };

  adapter.watchModelTypes(modelTypesAdded);
});

QUnit.test('getRecords gets a model name as second argument', function () {
  App.Post = Model.extend();

  adapter = App.__container__.lookup('data-adapter:main');
  adapter.reopen({
    getRecords: function getRecords(klass, name) {
      equal(name, 'post');
      return _emberMetalCore2['default'].A([]);
    }
  });

  adapter.watchModelTypes(function () {});
});

QUnit.test('Model types added with custom container-debug-adapter', function () {
  var PostClass = Model.extend();
  var StubContainerDebugAdapter = _emberApplicationSystemResolver2['default'].extend({
    canCatalogEntriesByType: function canCatalogEntriesByType(type) {
      return true;
    },
    catalogEntriesByType: function catalogEntriesByType(type) {
      return [PostClass];
    }
  });
  App.registry.register('container-debug-adapter:main', StubContainerDebugAdapter);

  adapter = App.__container__.lookup('data-adapter:main');
  adapter.reopen({
    getRecords: function getRecords() {
      return _emberMetalCore2['default'].A([1, 2, 3]);
    },
    columnsForType: function columnsForType() {
      return [{ name: 'title', desc: 'Title' }];
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  var modelTypesAdded = function modelTypesAdded(types) {

    equal(types.length, 1);
    var postType = types[0];

    equal(postType.name, PostClass.toString(), 'Correctly sets the name');
    equal(postType.count, 3, 'Correctly sets the record count');
    strictEqual(postType.object, PostClass, 'Correctly sets the object');
    deepEqual(postType.columns, [{ name: 'title', desc: 'Title' }], 'Correctly sets the columns');
  };

  adapter.watchModelTypes(modelTypesAdded);
});

QUnit.test('Model Types Updated', function () {
  App.Post = Model.extend();

  adapter = App.__container__.lookup('data-adapter:main');
  var records = _emberMetalCore2['default'].A([1, 2, 3]);
  adapter.reopen({
    getRecords: function getRecords() {
      return records;
    }
  });

  (0, _emberMetalRun_loop2['default'])(App, 'advanceReadiness');

  var modelTypesAdded = function modelTypesAdded() {
    (0, _emberMetalRun_loop2['default'])(function () {
      records.pushObject(4);
    });
  };

  var modelTypesUpdated = function modelTypesUpdated(types) {

    var postType = types[0];
    equal(postType.count, 4, 'Correctly updates the count');
  };

  adapter.watchModelTypes(modelTypesAdded, modelTypesUpdated);
});

QUnit.test('Records Added', function () {
  expect(8);
  var countAdded = 1;

  App.Post = Model.extend();

  var post = App.Post.create();
  var recordList = _emberMetalCore2['default'].A([post]);

  adapter = App.__container__.lookup('data-adapter:main');
  adapter.reopen({
    getRecords: function getRecords() {
      return recordList;
    },
    getRecordColor: function getRecordColor() {
      return 'blue';
    },
    getRecordColumnValues: function getRecordColumnValues() {
      return { title: 'Post ' + countAdded };
    },
    getRecordKeywords: function getRecordKeywords() {
      return ['Post ' + countAdded];
    }
  });

  var recordsAdded = function recordsAdded(records) {
    var record = records[0];
    equal(record.color, 'blue', 'Sets the color correctly');
    deepEqual(record.columnValues, { title: 'Post ' + countAdded }, 'Sets the column values correctly');
    deepEqual(record.searchKeywords, ['Post ' + countAdded], 'Sets search keywords correctly');
    strictEqual(record.object, post, 'Sets the object to the record instance');
  };

  adapter.watchRecords(App.Post, recordsAdded);
  countAdded++;
  post = App.Post.create();
  recordList.pushObject(post);
});

QUnit.test('Observes and releases a record correctly', function () {
  var updatesCalled = 0;
  App.Post = Model.extend();

  var post = App.Post.create({ title: 'Post' });
  var recordList = _emberMetalCore2['default'].A([post]);

  adapter = App.__container__.lookup('data-adapter:main');
  adapter.reopen({
    getRecords: function getRecords() {
      return recordList;
    },
    observeRecord: function observeRecord(record, recordUpdated) {
      var self = this;
      var callback = function callback() {
        recordUpdated(self.wrapRecord(record));
      };
      (0, _emberMetalObserver.addObserver)(record, 'title', callback);
      return function () {
        (0, _emberMetalObserver.removeObserver)(record, 'title', callback);
      };
    },
    getRecordColumnValues: function getRecordColumnValues(record) {
      return { title: (0, _emberMetalProperty_get.get)(record, 'title') };
    }
  });

  var recordsAdded = function recordsAdded() {
    (0, _emberMetalProperty_set.set)(post, 'title', 'Post Modified');
  };

  var recordsUpdated = function recordsUpdated(records) {
    updatesCalled++;
    equal(records[0].columnValues.title, 'Post Modified');
  };

  var release = adapter.watchRecords(App.Post, recordsAdded, recordsUpdated);
  release();
  (0, _emberMetalProperty_set.set)(post, 'title', 'New Title');
  equal(updatesCalled, 1, 'Release function removes observers');
});